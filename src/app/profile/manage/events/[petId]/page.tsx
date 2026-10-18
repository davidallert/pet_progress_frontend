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
  const { user, pets, setPets, userLoading, userError } = useUserData({eventLimit: 100});
  const { eventCategories, eventCategoriesLoading, eventCategoriesError } = useEventCategories();
  const { petId } = React.use(params);

  const loading = userLoading || eventCategoriesLoading;
  const errors = [userError, eventCategoriesError];

  useEffect(() => {
    if (loading || errors.length === 0) return;

    setPopup({ messages: getErrorMessages(errors), type: 'error'});

    const anyErrors = errors.some((e) => e != null)
    if (anyErrors) router.replace("/account");
  }, [loading, userError, eventCategoriesError]);

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.mainInit} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  const pet: Pet = pets.filter((pet) => pet.id === Number(petId))[0];

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, petId:number) => {
    e.preventDefault();
    if (user && user.id && petId) {
      router.push(`/profile/add/event/${user.id}/${petId}`);
    } else {
      setPopup({messages: ['Something went wrong.'], type: 'error'})
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

      console.log(response);

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
    if (!form) return;

    const formData = new FormData(form);

    const payload = {
      id: Number(formData.get('id')),
    };

    form.remove();

    removeEvent(payload);
  };

  const removeEvent = async (payload: {id: number}) => {
    try {
      const response = await axios.post('/event/remove', payload, {
        headers: {'Content-Type': 'application/json'},
      });
      setPopup({messages: [response.data.message], type: 'success'});
      console.log(response);
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        let errorMessage: any = 'Something went wrong.';

        if (typeof(error.response?.data?.error) === "string") {
          errorMessage = [error.response?.data?.error];
        } else if (typeof(error.response?.data?.error)  === "object") {
          errorMessage = Object.values(error.response?.data?.error);
        }

        setPopup({messages: errorMessage, type: 'error'});
      } else {
        console.error('Unexpected error:', error);
        setPopup({messages: ['Something went wrong.'], type: 'error'});
      }
    } finally {
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const PET_INDEX = 0
    
    const newIconKey = e.target.selectedOptions[0].dataset.icon;

    if (!newIconKey) return;

    setPets(prev => {
      const updatedPets = structuredClone(prev);
      updatedPets[PET_INDEX].events[index].category.icon = newIconKey;

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
                    id={`id-${event.id}`}
                    type="hidden"
                    name="id"
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