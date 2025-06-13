"use client";
  import { AxiosError } from 'axios';
  import axios from '../../../libraries/axios';
  import React, { FormEvent, useEffect, useState, useRef } from 'react';
  import styles from '../styles/form.module.css';

export default function RegisterForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  // "Hacky" solution to get rid of the styled autocomplete text.
  // These values in combination with setForm will force the fields to become empty.
  const [form, setForm] = useState({
    name: ' ',
    email: ' ',
    password: '************************************************************************************************'
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await register();
  }

  // Focus the first input field automatically.
  useEffect(() => {
      nameRef.current?.focus();
      setForm({name: '', email: '', password: ''});
  }, []);

  const register = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/register', form);
      console.log('Success:', response.data);
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Register new user form.
   */
  return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.formFieldset}>
          <legend className={styles.formLegend}>Register new user</legend>
          {/* Name. */}
          <label className={styles.formLabel} htmlFor="name">Name</label>
          <input
            ref={nameRef}
            className={styles.formInput}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            // placeholder='Name'
          />
          {/* Email. */}
          <label
            className={styles.formLabel}
            htmlFor="email">Email
          </label>
          <input
            className={styles.formInput}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            // placeholder='Email'
          />
          {/* Password. */}
          <label
            className={styles.formLabel}
            htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            // placeholder='Password'
          />
          {/* Submit. */}
          <input
            className={`${styles.formInput} ${styles.formSubmit}`}
            type="submit"
            value="Register"
          />
        </fieldset>
      </form>
  )
}