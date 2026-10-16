import { useEffect, useState } from "react";
import axios from '@/libraries/axios';
import type Species from '@/types/species';

export const useSpecies = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [speciesError, setSpeciesError] = useState<unknown | null>(null);
  const [speciesLoading, setSpeciesLoading] = useState(true);

  useEffect(() => {
    const getSpecies = async () => {
      try {
        const response = await axios.get('/species');

        setSpecies(response.data);
      }
      catch (e) {
        setSpeciesError(e);
      }
      finally {
        setSpeciesLoading(false);
      }
    }
    getSpecies()
  }, []);

  return { species, speciesLoading, speciesError };
}
