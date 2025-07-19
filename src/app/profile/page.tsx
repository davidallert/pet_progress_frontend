"use client";

import styles from "../page.module.css";
import axios from '../libraries/axios';
import { useEffect, useState } from "react";

export default function Profile() {

  // Check if the user is logged in.
  // Get info for logged in user.

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/api/user', { withCredentials: true })
        console.log('response', response);
        setUser(response.data.email)
      }
      catch (error) {
        console.error(error);
      }
    }
    getUser()
  }, [])


  return (
    <main className={styles.main}>
      <h1>Track your pet's progress!</h1>
      {user ? user : ''}
    </main>
  );
}