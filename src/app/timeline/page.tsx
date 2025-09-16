"use client";

import styles from "./page.module.css";
import { useState, useContext } from "react";
import PopupContext from '@/app/context/popup/context';

export default function Timeline() {
  const { setPopup } = useContext(PopupContext);
  const [loading, setLoading] = useState(false);

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={styles.main}>IMAGINE A SPINNER ICON</main>;

  return (
    <main className={styles.main}>
      <h1>Timeline</h1>
      <section className={styles.timeline} aria-label="Timeline">
        {/* <h2>Lily's birthday</h2> */}
        {/* <h3>2023-12-24</h3> TODO: Make sure this doesn't cause issues with the size of styles.left */}

        <div className={styles.vertical}></div>
        <div className={styles.left}></div>

        <div className={styles.vertical}></div>
        <div className={styles.right}></div>

        <div className={styles.vertical}></div>
      </section>
    </main>
  );
}