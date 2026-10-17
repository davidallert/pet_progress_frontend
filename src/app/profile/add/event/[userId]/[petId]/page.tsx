"use client";

import styles from "@/app/profile/page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import axios from '@/libraries/axios';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'
import { useEventCategories } from "@/hooks/useEventCategories";
import eventCategoryIcons from "@/libraries/event-category-icons";
import getErrorMessages from "@/utils/getErrorMessages";
import Select from "@/app/components/ui/Select";

export default function Event({params}: PageProps<'/profile/add/event/[userId]/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();

  const { eventCategories, eventCategoriesLoading, eventCategoriesError } = useEventCategories();
  const [selectedEventCategory, setSelectedEventCategory] = useState('camera-retro')
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Error handling.
  useEffect(() => {
    if (eventCategoriesLoading || [eventCategoriesError].length === 0) return;

    setPopup({ messages: getErrorMessages([eventCategoriesError]), type: 'error'});

    const anyErrors = [eventCategoriesError].some((e) => e != null)
    if (anyErrors) router.replace("/profile");
  }, [eventCategoriesLoading, eventCategoriesError]);

  const { userId, petId } = React.use(params);

  const [form, setForm] = useState({
    user_id: userId,
    pet_id: petId,
    title: '',
    description: '',
    image: null as File | null,
    category_id: '',
    date: ''
  });

  const addEvent = async (formData: FormData) => {
    try {
      setLoadingAdd(true);
      const response = await axios.post('/event/add', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      router.push('/profile');
    } catch (e) {
      setPopup({ messages: getErrorMessages([e]), type: 'error'});
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
      formData.append('category_id', form.category_id);
      formData.append('date', form.date);

      // console.log('FormData image:', formData.get('image'));
      // console.log('FormData entries:', Array.from(formData.entries()));

     await addEvent(formData);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      setForm({...form, [e.target.name]: e.target.files?.[0] || null});
    } else {
    setForm({...form, [e.target.name]: e.target.value});
    }
  };

  const handleEventCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({...form, category_id: e.target.value});

    const iconKey = e.target.selectedOptions[0].dataset.icon;

    if (iconKey) setSelectedEventCategory(iconKey);
  };

  // Return an empty page, just displaying the header and footer.
  if (eventCategoriesLoading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    <main className={styles.main} style={{padding: "min(50px, 5%)"}}>
        <form className={formStyles.form} onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset className={formStyles.formFieldset}>
          <legend className={formStyles.formLegend}>Add New Event</legend>
          <label className={formStyles.formLabel} htmlFor="title">Title*</label>
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
              type="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="image">Image</label>
            <Input
              id="image"
              type="file"
              name="image"
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="category_id">
            Category
            <FontAwesomeIcon icon={eventCategoryIcons[selectedEventCategory]}/>
          </label>
            <Select
              name="category_id"
              id="category_id"
              firstOptionText="Select a category"
              options={eventCategories}
              onChange={handleEventCategoryChange}
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