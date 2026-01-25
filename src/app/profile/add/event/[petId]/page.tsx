"use client";

import styles from "@/app/profile/page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import axios from '@/app/libraries/axios';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'

export default function Event({params}: PageProps<'/profile/add/event/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const { petId } = React.use(params);
  const [form, setForm] = useState({
    user_id: '',
    pet_id: '',
    title: '',
    description: '',
    image: null as File | null,
    type: '',
    date: ''
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/api/user/data', { withCredentials: true });
        setForm({...form, user_id: response.data.user.id, pet_id: petId});
        setLoading(false);
      }
      catch (e) {
        if (e instanceof(AxiosError)) {
          setPopup({messages: [e.response?.data?.message + "."], type: 'error', isVisible: true})
        }
        router.push('/');
      }
    }
    getUser();
  }, []);

  const addEvent = async (formData: FormData) => {
    try {
      setLoadingAdd(true);
      const response = await axios.post('/api/add/event', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log(response);
      router.push('/profile')
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
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
      setLoadingAdd(false);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(form);

      const formData = new FormData();
      formData.append('pet_id', form.pet_id);
      formData.append('title', form.title);
      formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);
      formData.append('type', form.type);
      formData.append('date', form.date);

      console.log('FormData image:', formData.get('image'));
      console.log('FormData entries:', Array.from(formData.entries()));

     await addEvent(formData);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      setForm({...form, [e.target.name]: e.target.files?.[0] || null});
    } else {
    setForm({...form, [e.target.name]: e.target.value});
    }
  };

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    <main className={styles.main}>
        <form className={formStyles.form} onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset className={formStyles.formFieldset}>
          <legend className={formStyles.formLegend}>Add New Event</legend>
          <label className={formStyles.formLabel} htmlFor="title">Title</label>
            <Input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="description">Description</label>
            <Input
              id="description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="image">Image</label>
            <Input
              id="image"
              type="file"
              name="image"
              // value={form.image}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="type">Type</label>
            <Input
              id="type"
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="date">Date</label>
            <Input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          <Button type="submit" loading={loadingAdd}>
            Add Event
          </Button>
      </fieldset>
      </form>
    </main>
  );
}