"use client";

import styles from "./page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useUserData } from '@/hooks/useUserData';
import type Pet from '@/types/pet';
import TableInput from "@/app/components/ui/TableInput/TableInput";

export default function Manage({params}: PageProps<'/profile/manage/events/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { petId } = React.use(params);
  const { user, pets, setPets } = useUserData(router, setLoading, setPopup, {eventLimit: 100});

  console.log('pets', pets);
  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  const pet: Pet = pets.filter((pet) => pet.id === Number(petId))[0];

  console.log('pet', pet)

  return (
    <main className={styles.main}>
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
                <form className={styles.form}>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id="title"
                      type="text"
                      name="title"
                      defaultValue={event.title}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id="description"
                      name="description"
                      type="text"
                      defaultValue={event.description}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id="image"
                      name="image"
                      type="file"
                      defaultValue="" // ?
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id="type"
                      name="type"
                      type="text"
                      defaultValue={event.type}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <TableInput
                      id="type"
                      name="type"
                      type="date"
                      defaultValue={event.date}
                    />
                  </div>
                  <div className={styles.td} role="cell">
                    <Button
                      icon={true}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                      icon={true}
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