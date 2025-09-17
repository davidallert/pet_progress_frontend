"use client";

import styles from "./page.module.css";
import { useEffect, useState, useContext } from "react";
import PopupContext from '@/app/context/popup/context';

export default function Timeline() {
  const { setPopup } = useContext(PopupContext);
  const [loading, setLoading] = useState(false);

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={styles.main}>IMAGINE A SPINNER ICON</main>;

  useEffect(() => {
    const timelineBar = document.getElementById("timelineBar");
    if (timelineBar) {
      timelineBar.style.height = `${window.innerHeight}px`;
    }
  }, []);

  return (
    // Do this instead: https://stephane-monnot.github.io/react-vertical-timeline/#/
    // Easier than having to deal with spaces between lines etc.
    <main className={styles.main}>
      <section className={styles.timelineWrapper} aria-label="Timeline section">
        <div id="timelineBar" className={styles.timelineBar}></div>

        <section className={styles.timelineStart}>
          <h1>Timeline</h1>
          <section aria-label="First timeline event">
            <h2>Lily's birthday</h2>
            <h3>2023-12-24</h3>
          </section>
        </section>

        <section className={`${styles.left} ${styles.event}`} aria-label="Timeline event">
          <h3>Learned sit</h3>
          <p>2024-03-10</p>
        </section>

        <section className={`${styles.right} ${styles.event}`} aria-label="Timeline event">
          <h3>Learned stay</h3>
          <p>2024-03-22</p>
        </section>
      </section>
    </main>
  );
}