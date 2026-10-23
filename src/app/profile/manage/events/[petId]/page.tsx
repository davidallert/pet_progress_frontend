"use client";

import styles from "./page.module.css";

import axios from '@/libraries/axios';
import { AxiosError } from 'axios';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'

import type Pet from '@/types/pet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter, faCloudArrowUp, faXmark, faFeatherPointed } from '@fortawesome/free-solid-svg-icons'
import eventCategoryIcons from '@/libraries/event-category-icons'

import PopupContext from '@/app/context/popup/context';
import Button from "@/app/components/ui/Button";
import TableInput from "@/app/components/ui/TableInput/TableInput";
import TableSelect from "@/app/components/ui/TableSelect";
import getErrorMessages from "@/utils/getErrorMessages";

import { useEventCategories } from "@/hooks/useEventCategories";
import { useUserData } from '@/hooks/useUserData';

export default function Manage({params}: PageProps<'/profile/manage/events/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const { eventCategories, eventCategoriesLoading, eventCategoriesError } = useEventCategories();
  const { petId } = React.use(params);
  const { user, pets, setPets, userLoading, userError } = useUserData({petId: Number(petId)});

  const loading = userLoading || eventCategoriesLoading;
  const errors = [userError, eventCategoriesError];

  useEffect(() => {
    if (loading || errors.length === 0) return;

    setPopup({ messages: getErrorMessages([errors]), type: 'error'});

    const anyErrors = errors.some((e) => e != null)
    if (anyErrors) router.replace("/account/2");
  }, [userError, eventCategoriesError]);

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.mainInit} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  const pet: Pet = pets[0];

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, petId:number) => {
    e.preventDefault();
    if (user && user.id && petId) {
      router.push(`/profile/add/event/${user.id}/${petId}`);
    } else {
      setPopup({messages: ['Something went wrong.'], type: 'error'});
    }
  }

  const handleUpsert = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);

    upsertEvent(formData);
  };

  const upsertEvent = async (formData: FormData) => {
    try {
      const response = await axios.post('/event/upsert', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      setPopup({messages: [response.data.message], type: 'success'});
    } catch (e) {

      if (e instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', e.response?.data);
        console.error('Error status:', e.response?.status);
        console.error('Error message:', e.message);

        let errorMessage: any = 'Something went wrong.';

        if (typeof(e.response?.data?.error) === "string") {
          errorMessage = [e.response?.data?.error];
        } else if (typeof(e.response?.data?.error)  === "object") {
          errorMessage = Object.values(e.response?.data?.error);
        }

        setPopup({messages: errorMessage, type: 'error'});

      } else {
        console.error('Unexpected error:', e);

        setPopup({messages: ['Something went wrong.'], type: 'error'});
      }
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const form = e.currentTarget.form;
    console.log(form)
    if (!form) return;

    const formData = new FormData(form);

    const payload = {
      petId: Number(formData.get('petId')),
      eventId: Number(formData.get('eventId')),
    };

    form.remove();

    removeEvent(payload);
  };

  const removeEvent = async (payload: {petId: number, eventId: number}) => {
    try {
      const response = await axios.post('/event/remove', payload, {
        headers: {'Content-Type': 'application/json'},
      });

      setPopup({messages: [response.data.message], type: 'success'});
    } catch (e) {
      setPopup({messages: getErrorMessages([e]), type: 'error'});
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const iconKey = e.target.selectedOptions[0].dataset.icon;
    const iconName = e.target.selectedOptions[0].textContent;

    if (!iconKey || !iconName) return;

    setPets(prev => {
      const updatedPets = structuredClone(prev);
      const pet = updatedPets[0].events[index];

      if (!pet.category) {
        pet.category = {icon: '', name: iconName};
      }

      pet.category.icon = iconKey;

      return updatedPets;
    })
  }

  return (
    <main className={styles.main}>
      <section className={styles.mainHeader}>
        <h1>{`${pet.name}'s Events`}</h1>
        <div className={styles.eventBtnContainer}>
          <div className={styles.eventBtn}>
            <Button type="submit" onClick={(e) => handleAddEvent(e, pet.id)}>
              Add Event
              <FontAwesomeIcon icon={faFeatherPointed}/>
            </Button>
          </div>
        </div>
        </section>
        <section className={styles.tableContainer}>
        <div className={styles.table} role="table">
          <div className={styles.thead} role="rowgroup">
            <div className={styles.tr} role="row">
              <div className={styles.th} role="columnheader">
                Title*
              </div>
              <div className={styles.th} role="columnheader">
                Description
              </div>
              <div className={styles.th} role="columnheader">
                Image
              </div>
              <div className={styles.th} role="columnheader">
                Category
              </div>
              <div className={styles.th} role="columnheader">
                Date
              </div>
              <div className={styles.th} role="columnheader">
                {/* Last th - empty */}
              </div>
            </div>
          </div>
          <div className={styles.tbody} role="rowgroup">
            {pet.events.map((event, index) => (
              <div className={styles.tr} key={event.id} role="row">
                <form className={styles.form} encType="multipart/form-data">
                  <div className={styles.td} role="cell">
                    <TableInput
                      id={`title-${event.id}`}
                      type="text"
                      name="title"
                      defaultValue={event.title}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id={`description-${event.id}`}
                      name="description"
                      type="textarea"
                      defaultValue={event.description}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id={`image-${event.id}`}
                      name="image"
                      type="file"
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <div className={styles.selectContainer}>
                      <FontAwesomeIcon id={`iconId-${event.id}`} className={styles.selectIcon} icon={eventCategoryIcons[event.category?.icon ?? 'paw']}></FontAwesomeIcon>
                      <TableSelect
                        id={`categoryId-${event.id}`}
                        name="categoryId"
                        defaultValue={event.categoryId}
                        firstOptionText="Select a category"
                        options={eventCategories}
                        onChange={(e) => handleIconChange(e, index)}
                      />
                    </div>
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id={`date-${event.id}`}
                      name="date"
                      type="date"
                      defaultValue={event.date}
                    />
                  </div>

                  <TableInput
                    id={`eventId-${event.id}`}
                    type="hidden"
                    name="eventId"
                    defaultValue={String(event.id)}
                  />
                  <TableInput
                    id={`petId-${pet.id}`}
                    type="hidden"
                    name="petId"
                    defaultValue={String(pet.id)}
                  />

                  <div className={`${styles.td} ${styles.btnCell}`} role="cell">
                    <Button
                      type="submit"
                      icon={true}
                      onClick={handleUpsert}
                      tooltip="Save Event"
                    >
                      <FontAwesomeIcon icon={faCloudArrowUp} />
                    </Button>
                    <Button
                      type="submit"
                      icon={true}
                      onClick={handleRemove}
                      tooltip="Delete Event"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </Button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
        </section>
    </main>
  );
}