"use client";

import styles from "@/app/profile/page.module.css";
import formStyles from '@/app/components/forms/form.module.css'
import axios from '@/app/libraries/axios';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'
import { useUserData } from '@/app/hooks/useUserData';

export default function Manage({params}: PageProps<'/profile/manage/events/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const { petId } = React.use(params);
  const { user, pets, setPets } = useUserData(router, setLoading, setPopup, {});

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    <main className={styles.main}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{petId}</td>
            </tr>
          </tbody>
        </table>
    </main>
  );
}