"use client";

import axios from '../libraries/axios';
import { AxiosError } from 'axios';
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
        const response = await axios.post('/api/logout', { withCredentials: true });
        console.log(response);
        setPopup({messages: ["You are now logged out."], type: 'success', isVisible: true})
      }
      catch (e) {
        if (e instanceof(AxiosError)) {
          if (e.response?.status !== 419) {
            setPopup({messages: [e.response?.data?.message + "."], type: 'error', isVisible: true})
          }
        }
        setLoading(false);
        router.push('/');
      }
    }
    logout()
  }, []);

  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

}