import { expect, test, type Page } from '@playwright/test';

const user = { id: 7, name: 'David', email: 'david@example.test' };
const species = [{ id: 1, name: 'Dog', icon: 'dog' }];
const categories = [{ id: 3, name: 'Vaccination', icon: 'syringe' }];
const pet = {
  id: 5,
  userId: 7,
  name: 'Lily',
  imagePath: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
  birthday: '2020-01-02',
  speciesId: 1,
  species: { name: 'Dog', icon: 'dog' },
  breed: 'Aussie',
  events: [{
    id: 9,
    petId: 5,
    title: 'First walk',
    description: 'At the park',
    imagePath: null,
    categoryId: 3,
    date: '2026-01-10',
    category: { name: 'Vaccination', icon: 'syringe' },
  }],
};

async function mockLoggedInApi(page: Page) {
  await page.route('**/api/user', route => route.fulfill({ json: user }));
  await page.route('**/api/user/data**', route => route.fulfill({ json: { user: { ...user, pets: [pet] } } }));
  await page.route('**/api/species', route => route.fulfill({ json: species }));
  await page.route('**/api/event/categories', route => route.fulfill({ json: categories }));
}

async function mockLoggedOutApi(page: Page) {
  await page.route('**/api/user', route => route.fulfill({ status: 401, json: { message: 'Unauthenticated.' } }));
}

test('home page presents the product and routes to account registration', async ({ page }) => {
  await mockLoggedOutApi(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'SIGN UP TODAY' })).toBeVisible();
  await page.getByRole('button', { name: /CREATE YOUR ACCOUNT/i }).click();
  await expect(page).toHaveURL(/\/account\/1$/);
  await expect(page.getByRole('group', { name: 'Register new user' })).toBeVisible();
});

test('account page switches between registration and login forms', async ({ page }) => {
  await mockLoggedOutApi(page);
  await page.goto('/account/1');

  await expect(page.locator('input[name=name]')).toBeVisible();
  await page.getByText('Login with existing user', { exact: true }).click();
  await expect(page.locator('input[name=email]')).toBeVisible();
  await expect(page.locator('input[name=password]')).toBeVisible();
  await expect(page.locator('input[name=name]')).toHaveCount(0);
});

test('login submits credentials and navigates to the profile after success', async ({ page }) => {
  await mockLoggedOutApi(page);
  let authenticated = false;
  await page.route('**/api/sanctum/csrf-cookie', route => route.fulfill({ status: 204, body: '' }));
  await page.route('**/api/login', async route => {
    authenticated = true;
    await route.fulfill({ status: 201, json: { message: 'Login successful!' } });
  });
  await page.route('**/api/user', route => authenticated
    ? route.fulfill({ json: user })
    : route.fulfill({ status: 401, json: { message: 'Unauthenticated.' } }));
  await page.route('**/api/user/data**', route => route.fulfill({ json: { user: { ...user, pets: [pet] } } }));
  await page.route('**/api/species', route => route.fulfill({ json: species }));

  await page.goto('/account/2');
  await page.locator('input[name=email]').fill(user.email);
  await page.locator('input[name=password]').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText('Lily', { exact: true }).first()).toBeVisible();
});

test('profile displays owned pets and saves edited pet data', async ({ page }) => {
  await mockLoggedInApi(page);
  let submitted: unknown;
  await page.route('**/api/upsert/pet', async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ json: { message: 'Pets were updated.' } });
  });

  await page.goto('/profile');
  await expect(page.getByText('Lily', { exact: true }).first()).toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('Lily Updated');
  await page.getByRole('button', { name: /Save Changes/i }).click();

  await expect.poll(() => submitted).toBeTruthy();
  expect(submitted).toMatchObject({ pets: [expect.objectContaining({ id: 5, name: 'Lily Updated' })] });
});

test('profile uploads a replacement pet image as multipart form data', async ({ page }) => {
  await mockLoggedInApi(page);
  let uploadContentType = '';
  let uploadBody = '';
  await page.route('**/api/update/pet/image', async route => {
    uploadContentType = route.request().headers()['content-type'] ?? '';
    uploadBody = route.request().postData() ?? '';
    await route.fulfill({ json: { message: 'Image was updated.', imageUrl: 'https://example.test/lily-updated.jpg' } });
  });

  await page.goto('/profile');
  await page.locator('input[type=file]').setInputFiles({
    name: 'lily.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake image'),
  });

  await expect.poll(() => uploadContentType).toMatch(/^multipart\/form-data; boundary=/i);
  expect(uploadBody).toContain('name="id"');
  expect(uploadBody).toContain('name="image"');
  await expect(page.getByRole('img', { name: 'Lily' })).toHaveAttribute('src', 'https://example.test/lily-updated.jpg');
});

test('add-pet form loads species and submits the selected image and fields', async ({ page }) => {
  await mockLoggedInApi(page);
  let submitted = false;
  await page.route('**/api/add/pet', async route => {
    submitted = true;
    await route.fulfill({ status: 201, json: { message: 'Pet was added.' } });
  });

  await page.goto('/profile/add/pet');
  await expect(page.getByRole('group', { name: 'Add New Pet' })).toBeVisible();
  await page.getByLabel('Name*').fill('Milo');
  await page.getByLabel('Species*').selectOption('1');
  await page.getByLabel('Breed').fill('Spaniel');
  await page.locator('input[type=file][name=image]').setInputFiles({
    name: 'milo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake image'),
  });
  await page.getByRole('button', { name: 'Add Pet' }).click();

  await expect(page).toHaveURL(/\/profile$/);
  expect(submitted).toBe(true);
});

test('add-event form loads categories, submits an event, and navigates to event management', async ({ page }) => {
  await mockLoggedInApi(page);
  let submitted = false;
  let uploadContentType = '';
  await page.route('**/api/event/add', async route => {
    submitted = true;
    uploadContentType = route.request().headers()['content-type'] ?? '';
    await route.fulfill({ status: 201, json: { message: 'Event was added.' } });
  });

  await page.goto('/profile/add/event/7/5');
  await expect(page.getByRole('group', { name: 'Add New Event' })).toBeVisible();
  await page.locator('input[name=title]').fill('Birthday');
  await page.locator('select[name=categoryId]').selectOption('3');
  await page.locator('input[name=date]').fill('2026-10-23');
  await page.locator('input[type=file][name=image]').setInputFiles({
    name: 'birthday.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake image'),
  });
  await page.getByRole('button', { name: 'Add Event' }).click();
  await expect(page).toHaveURL(/\/profile\/manage\/events\/5$/);
  expect(submitted).toBe(true);
  expect(uploadContentType).toMatch(/^multipart\/form-data; boundary=/i);
});

test('timeline loads and renders a pet event', async ({ page }) => {
  await mockLoggedInApi(page);
  await page.route('**/api/pet?id=5', route => route.fulfill({ json: pet }));

  await page.goto('/timeline/lily/5');
  await expect(page.getByRole('heading', { name: "Lily's Timeline" })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'First walk' })).toBeVisible();
  await expect(page.getByText('At the park')).toBeVisible();
});




test('event management saves edits and routes to the add-event form', async ({ page }) => {
  await mockLoggedInApi(page);
  let submitted = false;
  await page.route('**/api/event/upsert', async route => {
    submitted = true;
    await route.fulfill({ json: { message: 'Event saved.' } });
  });

  await page.goto('/profile/manage/events/5');
  await expect(page.getByRole('heading', { name: "Lily's Events" })).toBeVisible();
  await page.locator('#title-9').fill('Updated walk');
  await page.getByRole('row').nth(1).getByRole('button').nth(1).click();
  await expect.poll(() => submitted).toBe(true);

  await page.getByRole('button', { name: /Add Event/i }).click();
  await expect(page).toHaveURL(/\/profile\/add\/event\/7\/5$/);
});

test('logout calls the API and returns the visitor to the home page', async ({ page }) => {
  await mockLoggedInApi(page);
  await page.route('**/api/logout', route => route.fulfill({ json: { message: 'Logged out.' } }));

  await page.goto('/logout');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: /CREATE YOUR ACCOUNT/i })).toBeVisible();
});

test('registration creates the account, signs in, and opens the profile', async ({ page }) => {
  await mockLoggedOutApi(page);
  let registered = false;
  await page.route('**/api/sanctum/csrf-cookie', route => route.fulfill({ status: 204, body: '' }));
  await page.route('**/api/register', async route => {
    registered = true;
    await route.fulfill({ status: 201, json: { message: 'User registered successfully' } });
  });
  await page.route('**/api/login', route => route.fulfill({ status: 201, json: { message: 'Login successful!' } }));
  await page.route('**/api/user/data**', route => route.fulfill({ json: { user: { ...user, pets: [pet] } } }));
  await page.route('**/api/species', route => route.fulfill({ json: species }));

  await page.goto('/account/1');
  await page.locator('input[name=name]').fill(user.name);
  await page.locator('input[name=email]').fill(user.email);
  await page.locator('input[name=password]').fill('password123');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/profile$/);
  expect(registered).toBe(true);
  await expect(page.getByText('Lily', { exact: true }).first()).toBeVisible();
});
