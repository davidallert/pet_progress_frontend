"use client";

  import React, { FormEvent, useEffect, useState, useRef } from 'react';
  import styles from './RegisterForm.module.css';

export default function RegisterForm() {

  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: ' ',
    email: ' ',
    password: '__________________________________________________________________________________________________________________________________________'});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await register();
  }

  // Focus the first input field automatically.
  useEffect(() => {
      nameRef.current?.focus();
      setForm({name: '', email: '', password: ''});
  }, [])

  const register = async () => {
      console.log(form);

      const url = 'http://localhost:8000/api/register';
      const requestBody = {
        data: form,
      }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.text();
      console.log(json);

    } catch(error: any) {
      console.error(error.message);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Register new user form.
   */
  return (
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <fieldset className={styles.formFieldset}>
          <legend className={styles.formLegend}>Register</legend>
          {/* Name. */}
          <label className={styles.formLabel} htmlFor="name">Name</label>
          <input
            ref={nameRef}
            className={styles.formInput}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder='Name'
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
            placeholder='Email'
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
            placeholder='Password'
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