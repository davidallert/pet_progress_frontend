"use client";

import styles from "./page.module.css";
import formStyles from '../components/forms/form.module.css'
import axios from '../libraries/axios';
import { AxiosError } from 'axios';
import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import PopupContext from '@/app/context/popup/context';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter, faXmark, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { getUserData } from '../hooks/getUserData';

export default function Profile() {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { user, pets, setPets } = getUserData(router, setLoading, setPopup);

  const savePets = async () => {
    try {
      setLoadingSave(true);
      const data = {pets: pets};
      const response = await axios.post('/api/upsert/pet', data);
      setPopup({messages: [response?.data?.message], type: 'success', isVisible: true});
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

        setPopup({messages: [errorMessage], type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
      setLoadingSave(false);
    }
  }

  const removePet = async (id:Number) => {
    try {
      const response = await axios.post('/api/remove/pet', {id: id});
      console.log(pets);
      setPopup({messages: [response?.data?.message], type: 'success', isVisible: true});
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
        setPopup({messages: [errorMessage], type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.getAttribute('data-index'));
    const { name, value } = e.target;

    setPets(prev => {
      const updatedPets = [...prev];
      updatedPets[index] = { ...updatedPets[index], [name] : value } // Use brackets around e.g. "name" when inserting a variable dynamically.
      return updatedPets;
    })
  };

  const handleSave = () => {
    savePets();
  }

  const handleAdd = () => {
    router.push('/profile/add/pet');
  }

  const handleRemovePet = (e:React.MouseEvent<HTMLButtonElement>, id:Number) => {
    e.preventDefault();
    const div = document.getElementById(String(id))
    div?.remove()
    removePet(id);
  }

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, id:Number) => {
    e.preventDefault();
    router.push(`/profile/add/event/${id}`);
  }

  const routeToTimeline = (e:React.MouseEvent<HTMLButtonElement>, name:String, id:Number) => {
    e.preventDefault();

    name = name.toLowerCase();
    router.push(`/timeline/${name}/${id}`);
  }

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    <main className={styles.main}>
      <h1>Welcome {user?.name}!</h1>
      <h2>My Pets</h2>
      <section className={styles.cards}>
        {pets.map((pet, index) => (
          <div id={String(pet.id)} className={styles.card} key={pet.id}>
            <form key={index}>
            <div className={styles.iconGroup}>
              <Button icon={true} onClick={(e) => handleAddEvent(e, pet.id)}>
                <FontAwesomeIcon icon={faPlus}/>
              </Button>
              <Button icon={true} onClick={(e) => handleRemovePet(e, pet.id)}>
                <FontAwesomeIcon icon={faXmark}/>
              </Button>
            </div>
            <label className={formStyles.formLabel} htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                name="name"
                value={pet.name}
                onChange={handleChange}
                data-index={index}
              />
            <label className={formStyles.formLabel} htmlFor="species">Species</label>
              <Input
                id="species"
                type="text"
                name="species"
                value={pet.species}
                onChange={handleChange}
                data-index={index}
              />
            <label className={formStyles.formLabel} htmlFor="breed">Breed</label>
              <Input
                id="breed"
                type="text"
                name="breed"
                value={pet.breed}
                onChange={handleChange}
                data-index={index}
              />
            <label className={formStyles.formLabel} htmlFor="birthday">Birthday</label>
              <Input
                id="birthday"
                type="date"
                name="birthday"
                value={pet.birthday}
                onChange={handleChange}
                data-index={index}
              />
              <div className={styles.arrow}>
              <Button icon={true} onClick={(e) => routeToTimeline(e, pet.name, pet.id)}>
                <FontAwesomeIcon icon={faArrowRight}/>
              </Button>
              </div>
            </form>
          </div>
        ))}
      </section>
      <section className={styles.buttonGroup}>
        {pets.length > 0 &&
          <Button type="submit" onClick={handleSave} loading={loadingSave}>
            Save
          </Button>
        }
        <Button type="submit" onClick={handleAdd}>
          Add
        </Button>
      </section>
    </main>
  );
}