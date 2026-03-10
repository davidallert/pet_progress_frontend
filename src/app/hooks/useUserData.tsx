import { useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import axios from '../libraries/axios';
import { AxiosError } from 'axios';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { PopupState } from '@/app/context/popup/interface';

export const useUserData = (
    router: AppRouterInstance,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setPopup: Dispatch<SetStateAction<PopupState>>
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
  }

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Array<Pet>>([]);

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
  }, []);

  return { user, pets, setPets };
}
