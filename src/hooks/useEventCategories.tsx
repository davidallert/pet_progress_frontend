import { useEffect, useState } from "react";
import axios from '@/libraries/axios';
import type EventCategory from '@/types/event-category';

export const useEventCategories = () => {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [eventCategoriesLoading, setEventCategoriesLoading] = useState(true);
  const [eventCategoriesError, setEventCategoriesError] = useState<unknown | null>(null);

  useEffect(() => {
    const getEventCategories = async () => {
      try {
        const response = await axios.get('/event/categories');

        setEventCategories(response.data);
      }
      catch (e) {
        setEventCategoriesError(e);
      }
      finally {
        setEventCategoriesLoading(false);
      }
    }
    getEventCategories()
  }, []);

  return { eventCategories, eventCategoriesLoading, eventCategoriesError };
}