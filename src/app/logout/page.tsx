"use client";

import axios from '../libraries/axios';
import { AxiosError } from 'axios';
import { useEffect, useContext } from "react";
import { useRouter } from 'next/navigation'
import PopupContext from '@/app/context/popup/context';

export default function Logout() {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter()

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
        router.push('/');
      }
    }
    logout()
  }, [])
}