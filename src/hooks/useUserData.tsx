import { useEffect, useState } from "react";
import axios from '../libraries/axios';
import type User from '@/types/user';
import type Pet from '@/types/pet';

interface UseUserDataOptions {
  petId?: number,
  eventLimit?: number,
}

export const useUserData = (
    options: UseUserDataOptions
) => {

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Array<Pet>>([]);
  const [userError, setUserError] = useState<unknown | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/user/data', {
          params: options
        });

        setUser(response.data.user);
        setPets(response.data.user.pets);
      }
      catch (e) {
        setUserError(e);
      }
      finally {
        setUserLoading(false);
      }
    }
    getUser()
  }, []);

  return { user, pets, setPets, userLoading, userError };
}
