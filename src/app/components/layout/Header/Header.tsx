"use client";

import styles from './Header.module.css';
import Link from 'next/link';
import { useContext } from 'react';
import AuthContext from '@/app/context/auth/context';

export default function Header() {
  const { user, isLoading } = useContext(AuthContext);

  return (
    <header id="header" className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <div className={styles.logoGrp}>
            <img src="/logo-circle-bg.png"></img>
            <span className={styles.logoTxt}>petfolio.</span>
          </div>
        </Link>
      </div>
      {isLoading ? (
        <div className={styles.links}>
          <Link href="/">Home</Link>|
          <Link href="/account">Sign in / up</Link>
        </div>
      ) : user ? (
        <div className={styles.links}>
          <Link href="/">Home</Link>|
          <Link href="/profile">My Pets</Link>|
          <Link href="/logout">Log out</Link>
        </div>
      ) : (
        <div className={styles.links}>
          <Link href="/">Home</Link>|
          <Link href="/account">Sign in / up</Link>
        </div>
      )}

    </header>
  )
}