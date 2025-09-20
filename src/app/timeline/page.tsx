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
    const resizeTimeline = () =>{
      const timelineBar = document.getElementById("timelineBar");
      const footer = document.getElementById("footer");
      const header = document.getElementById("header");
      let h = 0
      if (header && footer) {
        h = footer?.clientHeight + header?.clientHeight
      }
      if (timelineBar) {
        timelineBar.style.height = `${document.documentElement.scrollHeight - h}px`;
      }
    };

    resizeTimeline()

   window.addEventListener("resize", resizeTimeline); // Run on resize

    return () => {
    window.removeEventListener("resize", resizeTimeline); // Cleanup
  };
  }, []);

useEffect(() => {
  const centerIcons = () => {
    const icons = document.getElementsByClassName(styles.icon);
    const ww = window.innerWidth;
    for (const icon of icons) {
      const parent = icon.closest(`.${styles.event}`);
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const parentCenterY = parentRect.top + (parentRect.height / 2);
        const iw = icon.clientWidth;

        (icon as HTMLElement).style.left = `${ww / 2 - iw / 2}px`;
        (icon as HTMLElement).style.top = `${parentCenterY}px`;
      }
    }
  };

  centerIcons();

  window.addEventListener("resize", centerIcons);
  window.addEventListener("scroll", centerIcons);

  return () => {
    window.removeEventListener("resize", centerIcons);
    window.removeEventListener("scroll", centerIcons);
  };
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
          <div className={styles.icon}><i className="fa-solid fa-paw"></i></div>
          <h3>Learned sit</h3>
          <h4>2024-03-10</h4>
          <p>Lorem ipsum dolor sit amet.</p>
        </section>

        <section className={`${styles.right} ${styles.event}`} aria-label="Timeline event">
          <div className={styles.icon}><i className="fa-solid fa-dog"></i></div>
          <h3>Learned stay</h3>
          <h4>2024-03-22</h4>
          <p>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</p>
        </section>

        <section className={`${styles.left} ${styles.event}`} aria-label="Timeline event">
          <div className={styles.icon}><i className="fa-solid fa-bone"></i></div>
          <h3>Learned stay</h3>
          <h4>2024-03-22</h4>
          <p></p>
        </section>
      </section>
    </main>
  );
}