"use client";

import styles from "@/app/profile/page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'
import { useUserData } from '@/app/hooks/useUserData';
import type Pet from '@/types/pet';

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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {pet.events.map((event) => (
            <tr key={event.id}>
              <td>
                <Input
                  value={event.title}
                />
              </td>
              <td>
                <Input
                  value={event.description}
                  type="textarea"
                />
              </td>
              <td>
                <Input
                  value={event.imagePath}
                />
              </td>
              <td>
                <Input
                  value={event.type}
                />
              </td>
              <td>
                <Input
                  value={event.date}
                />
              </td>                                                        
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}