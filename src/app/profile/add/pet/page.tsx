"use client";

import styles from "../../page.module.css";
import formStyles from '@/app/components/forms/form.module.css'

import axios from '@/libraries/axios';
import { AxiosError } from 'axios';

import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'

import PopupContext from '@/app/context/popup/context';

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "@/app/components/ui/Select/Select";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'
import Species from "@/types/species";
import speciesIcons from '@/libraries/species-icons'

export default function Pet() {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState('shield-dog');

  const [form, setForm] = useState({
    userId: '',
    name: '',
    image: null as File | null,
    speciesId: '',
    breed: '',
    birthday: ''
  });

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const [userResponse, speciesResponse] = await Promise.all([
          axios.get('/user/data', { withCredentials: true }),
          axios.get('/species'),
        ]);

        setForm(prevForm => ({...prevForm, userId: userResponse.data.user.id}));
        setSpecies(speciesResponse.data);

        setLoading(false);
      }
      catch (e) {
        if (e instanceof(AxiosError)) {
          setPopup({messages: [e.response?.data?.message + "."], type: 'error'})
        }
        router.push('/');
      }
    }
    getInitialData();
  }, []);

  const addPet = async (formData: FormData) => {
    try {
      setLoadingAdd(true);

      const response = await axios.post('/add/pet', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      console.log('Response: ', response);

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

      const formData = new FormData();
      formData.append('userId', form.userId);
      formData.append('name', form.name);
      if (form.image) formData.append('image', form.image);
      formData.append('speciesId', form.speciesId);
      formData.append('breed', form.breed);
      formData.append('birthday', form.birthday);

      await addPet(formData);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      setForm({...form, [e.target.name]: e.target.files?.[0] || null});
    } else {
    setForm({...form, [e.target.name]: e.target.value});
    }
  };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({...form, speciesId: e.target.value});

    const iconKey = e.target.selectedOptions[0].dataset.icon;

    if (iconKey) setSelectedSpecies(iconKey);
  };

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    <main className={styles.main} style={{padding: "min(50px, 5%)"}}>
        <form className={formStyles.form} onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset className={formStyles.formFieldset}>
          <legend className={formStyles.formLegend}>Add New Pet</legend>
          <label className={formStyles.formLabel} htmlFor="name">Name*</label>
            <Input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="image">Image*</label>
            <Input
              id="image"
              type="file"
              name="image"
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="speciesId">Species*
            <FontAwesomeIcon icon={speciesIcons[selectedSpecies]}></FontAwesomeIcon>
          </label>
            <Select
              firstOptionText="Select a species"
              id="speciesId"
              name="speciesId"
              onChange={handleSpeciesChange}
              options={species}
            />
          <label className={formStyles.formLabel} htmlFor="breed">Breed</label>
            <Input
              id="breed"
              type="text"
              name="breed"
              placeholder="Golden Retriever"
              value={form.breed}
              onChange={handleChange}
            />
          <label className={formStyles.formLabel} htmlFor="birthday">Birthday</label>
            <Input
              id="birthday"
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
            />
          <Button type="submit" loading={loadingAdd}>
            Add Pet
          </Button>
      </fieldset>
      </form>
    </main>
  );
}