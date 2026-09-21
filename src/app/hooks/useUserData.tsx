import { useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import axios from '../libraries/axios';
import { isAxiosError } from 'axios';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { PopupInput } from '@/app/context/popup/interface';
import type User from '@/types/user';
import type Pet from '@/types/pet';

interface UseUserDataOptions {
  // petLimit?: number,
  eventLimit?: number,
}

export const useUserData = (
    router: AppRouterInstance,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setPopup: (popup: PopupInput) => void,
    options: UseUserDataOptions
) => {

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Array<Pet>>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/api/user/data', {
          params: options
        });

        setUser(response.data.user);
        setPets(response.data.user.pets);
      }
      catch (e) {
        if (isAxiosError(e)) {
          setPopup({messages: [e.response?.data?.message + "."], type: 'error'});
          router.replace('/');
        }
      }
      finally {
        setLoading(false);
      }
    }
    getUser()
  }, []);

  return { user, pets, setPets };
}
