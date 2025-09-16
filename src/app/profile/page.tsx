"use client";

import styles from "./page.module.css";
import formStyles from '../styles/form/form.module.css'
import axios from '../libraries/axios';
import { AxiosError } from 'axios';
import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Input from "../components/Input";

export default function Profile() {
  interface User {
    id: number,
    name: string,
    email: string,
    email_verified_at: null,
    created_at: null,
    updated_at: null
  }

  interface Pets {
    id: number,
    user_id: number,
    name: string,
    birthday: string,
    species: string,
    breed: string,
  }

  const [user, setUser] = useState<User | null>(null);
  const { setPopup } = useContext(PopupContext);
  const [pets, setPets] = useState<Array<Pets>>([]);
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/api/user/data', { withCredentials: true });
        setUser(response.data.user);
        setPets(response.data.pets);
        setLoading(false);
      }
      catch (e) {
        if (e instanceof(AxiosError)) {
          setPopup({messages: [e.response?.data?.message + "."], type: 'error', isVisible: true})
        }
        router.push('/');
      }
    }
    getUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.getAttribute('data-index'));
    const { name, value } = e.target;

    setPets(prev => {
      const updatedPets = [...prev];
      updatedPets[index] = { ...updatedPets[index], [name] : value } // Need to use brackets around name when inserting a variable dynamically.
      return updatedPets;
    })
  };

  const handleClick = () => {
    console.log(pets);
  }

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={styles.main}>IMAGINE A SPINNER ICON</main>;

  return (
    <main className={styles.main}>
      <h1>Welcome {user?.name}!</h1>
      <h2>My Pets</h2>
      <section className={styles.cards}>
        {pets.map((pet, index) => (
          <div className={styles.card} key={pet.id}>
            <form key={index}>
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
                type="text"
                name="birthday"
                value={pet.birthday}
                onChange={handleChange}
                data-index={index}
              />
            </form>
          </div>
        ))}
      </section>
      <button
        className={`${formStyles.formSubmit} ${formStyles.formInput} ${styles.btn}`}
        onClick={handleClick}>
        Save
      </button>
    </main>
  );
}