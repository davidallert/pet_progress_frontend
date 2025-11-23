"use client";
import { AxiosError } from 'axios';
import axios from '../../../libraries/axios';
import React, { FormEvent, useState, useRef, useContext } from 'react';
import styles from '../form.module.css'
import PopupContext from '@/app/context/popup/context';
import { useRouter } from 'next/navigation'
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export default function RegisterForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const { setPopup } = useContext(PopupContext);
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await register();
  }

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
          <Input
            autoFocus
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
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
            // placeholder='Email'
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
            // placeholder='Password'
          />
          {/* Submit. */}
          <Button type="submit" loading={loading}>
            Register
          </Button>
        </fieldset>
      </form>
  )
}