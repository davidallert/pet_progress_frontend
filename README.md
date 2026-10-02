# 🐾 Petfolio — Frontend

Petfolio is a web app for keeping track of your pets' lives. Create an account, add your pets, and log the moments that matter: vaccinations, new tricks learned, trips taken, and more. Each pet builds up its own history over time.

This repository contains the **frontend**. The API lives in a separate repository (see [Related Repositories](#related-repositories)).

**[Live demo →](https://www.petfolio.se/)**

<!--
Add a screenshot or GIF here once you have one, for example:
![Petfolio screenshot](./docs/screenshot.png)
-->

## Features

- **User accounts:** sign up and log in to keep your data private
- **Pet profiles:** add and manage multiple pets
- **Events per pet:** record vaccinations, tricks, trips and other milestones
- **Type-safe codebase:** built with TypeScript
- **Deployed on Vercel** with analytics and performance monitoring

## Tech Stack

| Area                 | Technology                                                                     |
| -------------------- | ------------------------------------------------------------------------------ |
| Framework            | [Next.js 16](https://nextjs.org/) (dev server runs on Turbopack)                |
| UI library           | [React 19](https://react.dev/)                                                  |
| Language             | [TypeScript 5](https://www.typescriptlang.org/)                                 |
| HTTP client          | [Axios](https://axios-http.com/)                                                |
| Icons                | [Font Awesome](https://fontawesome.com/) via `@fortawesome/react-fontawesome` |
| Hosting & monitoring | [Vercel](https://vercel.com/), Vercel Analytics, Vercel Speed Insights          |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or later
- npm (included with Node.js)
- The Petfolio backend running locally or deployed (see [Related Repositories](#related-repositories))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/davidallert/pet_progress_frontend.git
   cd pet_progress_frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment variables**

   Create a `.env.local` file in the project root and point it at your backend:

   ```env
   # Base URL of the Petfolio API
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   <!-- TODO: replace the variable name and default URL with the ones the app actually uses. -->
4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically as you edit files.

## Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`   | Start the development server with Turbopack     |
| `npm run build` | Create an optimized production build            |
| `npm run start` | Serve the production build (run`build` first) |

## Deployment

The app is deployed on [Vercel](https://vercel.com/). To deploy your own copy:

1. Import the repository into Vercel.
2. Add the same environment variables as in your `.env.local` under **Project Settings → Environment Variables**.
3. Deploy. Vercel detects Next.js and configures the build automatically.

## Roadmap

- [ ] Timeline view that visualizes each pet's events chronologically
- [ ] Social features (sharing pets and milestones with friends)
- [ ] Live chattign with friends

## Related Repositories

- **Petfolio Backend:** [https://github.com/davidallert/pet_progress_backend](https://github.com/davidallert/pet_progress_backend)

## Author

**David Allert**: [@davidallert](https://github.com/davidallert)
