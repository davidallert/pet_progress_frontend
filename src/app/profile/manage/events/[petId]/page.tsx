"use client";

import styles from "./page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import axios from '@/libraries/axios';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter, faCloudArrowUp, faXmark, faFeatherPointed } from '@fortawesome/free-solid-svg-icons'
import { useUserData } from '@/hooks/useUserData';
import type Pet from '@/types/pet';
import TableInput from "@/app/components/ui/TableInput/TableInput";

export default function Manage({params}: PageProps<'/profile/manage/events/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { petId } = React.use(params);
  const { user, pets, setPets } = useUserData(router, setLoading, setPopup, {eventLimit: 100});

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  const pet: Pet = pets.filter((pet) => pet.id === Number(petId))[0];
  console.log(pet);

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, id:number) => {
    e.preventDefault();
    router.push(`/profile/add/event/${id}`);
  }

  const handleUpsert = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);

    const payload = {
      id: Number(formData.get('id')),
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      type: String(formData.get('type') ?? ''),
      date: String(formData.get('date') ?? ''),
    };

    console.log('upsert', payload);
  };

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
      const response = await axios.post('/api/event/remove', payload, {
        headers: {'Content-Type': 'multipart/form-data'},
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
        <div className={styles.table} role="table">
          <div className={styles.thead} role="rowgroup">
            <div className={styles.tr} role="row">
              <div className={styles.th} role="columnheader">
                Title
              </div>
              <div className={styles.th} role="columnheader">
                Description
              </div>
              <div className={styles.th} role="columnheader">
                Image
              </div>
              <div className={styles.th} role="columnheader">
                Type
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
            {pet.events.map((event) => (
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
                    <TableInput
                      id={`type-${event.id}`}
                      name="type"
                      type="text"
                      defaultValue={event.type}
                    />
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

                  <div className={styles.td} role="cell">
                    <Button
                      type="submit"
                      icon={true}
                      onClick={handleUpsert}
                    >
                      <FontAwesomeIcon icon={faCloudArrowUp} />
                    </Button>
                    <Button
                      type="submit"
                      icon={true}
                      onClick={handleRemove}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </Button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
    </main>
  );
}