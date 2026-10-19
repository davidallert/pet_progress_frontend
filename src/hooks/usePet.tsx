import { useEffect, useState } from "react";
import axios from '@/libraries/axios';
import type Pet from '@/types/pet';

export const usePet = (id: number) => {
  const [pet, setPet] = useState<Pet>();
  const [petLoading, setPetLoading] = useState(true);
  const [petError, setPetError] = useState<unknown | null>(null);

  useEffect(() => {
    const getPet = async (id: number) => {
      try {
        const response = await axios.get(`/pet?id=${id}`);

        setPet(response.data);
      }
      catch (e) {
        setPetError(e);
      }
      finally {
        setPetLoading(false);
      }
    }
    getPet(id)
  }, []);

  return { pet, petLoading, petError };
}