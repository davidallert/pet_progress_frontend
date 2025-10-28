"use client";
import { AxiosError } from 'axios';
import axios from '../../../libraries/axios';
import React, { FormEvent, useEffect, useState, useRef, useContext } from 'react';
import styles from '../../../styles/form/form.module.css'
import PopupContext from '@/app/context/popup/context';
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrog } from '@fortawesome/free-solid-svg-icons'

export default function RegisterForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const { setPopup } = useContext(PopupContext);
  const router = useRouter()
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/register', form);
      console.log('Success:', response.data);
      setPopup({messages: [response.data.message], type: 'success', isVisible: true});
      router.push('/profile');
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        setPopup({messages: Object.values(error.response?.data.error), type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        setPopup({messages: ['An unexpected error occurred.'], type: 'error', isVisible: true});
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
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
          <button
            className={`${styles.formInput} ${styles.formSubmit}`}
            type="submit"
            disabled={loading}
            inert={loading}
          >
            {loading ? <FontAwesomeIcon icon={faFrog} bounce/> : "Register"}
          </button>
        </fieldset>
      </form>
  )
}