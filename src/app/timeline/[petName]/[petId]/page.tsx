"use client";

import styles from "./page.module.css";
import React, { useEffect, useState, useContext } from "react";
import PopupContext from '@/app/context/popup/context';
import axios from '@/app/libraries/axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter } from '@fortawesome/free-solid-svg-icons';

  interface Events {
    id: number,
    pet_id: number,
    title: string,
    description: string,
    imagePath: string,
    type: string,
    date: string,
  }

export default function Timeline({params}: PageProps<'/timeline/[petName]/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Array<Events>>([]);
  const { petName, petId } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get('/api/event/get', { params: { id: petId }, withCredentials: true });
        setEvents(response.data);
        setLoading(false);
      }
      catch (e) {
        if (e instanceof(AxiosError)) {
          setPopup({messages: [e.response?.data?.message + "."], type: 'error', isVisible: true})
        }
      }
    }
    getEvents()
  }, [])

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

    // Run on initial load
    resizeTimeline();
    centerIcons();

    // Run on resize and scroll
    window.addEventListener("resize", resizeTimeline);
    window.addEventListener("resize", centerIcons);
    window.addEventListener("scroll", centerIcons);

    return () => {
      window.removeEventListener("resize", resizeTimeline);
      window.removeEventListener("resize", centerIcons);
      window.removeEventListener("scroll", centerIcons);
    };
  }, [events]);

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    // Inspo: https://stephane-monnot.github.io/react-vertical-timeline/#/
    <main className={styles.main}>
      <section className={styles.timelineWrapper} aria-label="Timeline section">
        <div id="timelineBar" className={styles.timelineBar}></div>

        <div className={styles.timelineStart}>
          <h1>Timeline</h1>
          <div aria-label="First timeline event">
            <h2>{petName.charAt(0).toUpperCase() + petName.slice(1)}'s birthday</h2>
            <h3>2023-12-24</h3>
          </div>
        </div>
        {events.map((event, index) => 
        <div className={`${index % 2 === 0 ? styles.left : styles.right} ${styles.event}`} aria-label="Timeline event" key={event.id}>
          <div className={styles.icon}><i className="fa-solid fa-paw"></i></div>
          <h3>{event.title}</h3>
          <h4 className={styles.date}>{event.date}</h4>
          <p>{event.description}</p>
          <img src={event.imagePath}></img>
        </div>
        )}

        {/* <div className={`${styles.right} ${styles.event}`} aria-label="Timeline event">
          <div className={styles.icon}><i className="fa-solid fa-dog"></i></div>
          <h3>Learned stay</h3>
          <h4 className={styles.date}>2024-03-22</h4>
          <p>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</p>
        </div> */}
      </section>
    </main>
  );
}