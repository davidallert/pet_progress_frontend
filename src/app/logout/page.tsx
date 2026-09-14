"use client";

import axios from '../libraries/axios';
import { isAxiosError } from 'axios';
import { useEffect, useContext, useState } from "react";
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';
import styles from "./page.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter } from '@fortawesome/free-solid-svg-icons';

export default function Logout() {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.post('/api/logout');

        console.log(response);

        setPopup({messages: ["You are now logged out."], type: 'success', isVisible: true})
      }
      catch (e) {
        if (isAxiosError(e)) {
          if (e.response?.status !== 419) {
            setPopup({messages: [e.response?.data?.message + "."], type: 'error', isVisible: true})
          }
        }
      }
      finally {
        setLoading(false);
        router.replace('/'); // Replace doesn't add /logout to the browser's history (unlike push).
      }
    }
    logout()
  }, []);

  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

}