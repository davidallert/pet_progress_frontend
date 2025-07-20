import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">Sign in / up</Link>|
      <Link href="/profile">My Pets</Link>|
      <Link href="/timeline">Timeline</Link>
    </header>
  )
}