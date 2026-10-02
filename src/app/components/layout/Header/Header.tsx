import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header id="header" className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo-circle-bg.png"></img>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/">Sign in / up</Link>|
        <Link href="/profile">My Pets</Link>|
        <Link href="/logout">Log out</Link>
      </div>
    </header>
  )
}