import { useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import axios from '../libraries/axios';
import { AxiosError } from 'axios';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { PopupInput } from '@/app/context/popup/interface';

export const useUserData = (
    router: AppRouterInstance,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setPopup: (popup: PopupInput) => void
) => {
  interface User {
    id: number,
    name: string,
    email: string,
    email_verified_at: null,
    created_at: null,
    updated_at: null
  }

  interface Pet {
    id: number,
    userId: number,
    name: string,
    imagePath: string,
    birthday: string,
    species: string,
    breed: string,
    events: Array<{
      date: string,
      id: number,
      petId: number,
      title: string,
      description: string,
      imagePath: string
      type: string,
    }>
  }

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Array<Pet>>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/api/user/data');
        console.log(response)
        setUser(response.data.user);
        setPets(response.data.user.pets);
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
  }, []);

  return { user, pets, setPets };
}
