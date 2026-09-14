"use client";
import { isAxiosError } from 'axios';
import axios from '../../../libraries/axios';
import React, { FormEvent, useState, useContext } from 'react';
import styles from '../form.module.css';
import PopupContext from '@/app/context/popup/context';
import { useRouter } from 'next/navigation'
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const { setPopup } = useContext(PopupContext);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await login();
  }

  const login = async () => {
    try {
      setLoading(true);
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', form);
      console.log('Success:', response.data.message);
      setPopup({messages: [response.data.message], type: 'success'});
      router.push('/profile');
    } catch (e) {
      if (isAxiosError(e)) { // Handle Axios errors.
        console.error('Error response:', e.response?.data);
        console.error('Error status:', e.response?.status);
        console.error('Error message:', e.message);
        let errorMessage: any = 'Something went wrong.';

        // Deal with the response from the server.
        if (typeof(e.response?.data?.error) === "string") {
          errorMessage = [e.response?.data?.error];
        } else if (typeof(e.response?.data?.error)  === "object") {
          errorMessage = Object.values(e.response?.data?.error);
        }

        setPopup({messages: errorMessage, type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', e);
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
      setLoading(false);
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
            autoFocus
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
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </fieldset>
      </form>
      </>
  )
}