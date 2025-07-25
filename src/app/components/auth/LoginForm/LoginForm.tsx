"use client";
import { AxiosError } from 'axios';
import axios from '../../../libraries/axios';
import React, { FormEvent, useEffect, useState, useRef, useContext } from 'react';
import styles from '../../../styles/form/form.module.css'
import PopupContext from '@/app/context/popup/context';
import { useRouter } from 'next/navigation'
import Input from '../../Input';

export default function LoginForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  const { setPopup } = useContext(PopupContext);

  // "Hacky" solution to get rid of the styled autocomplete text.
  // These values in combination with setForm will force the fields to become empty.
  const [form, setForm] = useState({
    email: ' ',
    password: '************************************************************************************************'
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await login();
  }

  // Focus the first input field automatically.
  useEffect(() => {
      nameRef.current?.focus();
      setForm({email: '', password: ''});
  }, []);

  const login = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', form);
      console.log('Success:', response.data.message);
      setPopup({messages: [response.data.message], type: 'success', isVisible: true});
      router.push('/profile');
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        let errorMessage: any = 'Something went wrong.';

        // Deal with the response from the server.
        if (typeof(error.response?.data?.error) === "string") {
          errorMessage = [error.response?.data?.error];
        } else if (typeof(error.response?.data?.error)  === "object") {
          errorMessage = Object.values(error.response?.data?.error);
        }
        setPopup({messages: errorMessage, type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
        setPopup({
          messages: ['Something went wrong.'],
          type: 'error',
          isVisible: true,
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Login form.
   */
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.formFieldset}>
          <legend className={styles.formLegend}>Login with existing user</legend>
          {/* Email. */}
          <label
            className={styles.formLabel}
            htmlFor="email">Email
          </label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {/* Password. */}
          <label
            className={styles.formLabel}
            htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          {/* Submit. */}
          <input
            className={`${styles.formInput} ${styles.formSubmit}`}
            type="submit"
            value="Login"
          />
        </fieldset>
      </form>
      </>
  )
}