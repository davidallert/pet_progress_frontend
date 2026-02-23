"use client";

import styles from "./page.module.css";
import React, { useEffect, useState, useContext } from "react";
import PopupContext from '@/app/context/popup/context';
import axios from '@/app/libraries/axios';
import { AxiosError } from 'axios';
// import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter } from '@fortawesome/free-solid-svg-icons';

  interface Events {
    id: number,
    petId: number,
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
  const [stable, setStable] = useState(false);

  // const router = useRouter();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get('/api/event/get', { params: { id: petId }, withCredentials: true });
        setLoading(false);
        setEvents(response.data);
        // console.log(response.data)
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

    // Observe main for height changes.
    const main = document.getElementById("main");
    let prevHeight = main?.clientHeight;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (prevHeight !== entry.target.clientHeight) {
          prevHeight = entry.contentRect.height;
          setStable(true);
          resizeTimeline();
          centerIcons();
        }
      }
    });
    if (main) resizeObserver.observe(main);

    // console.log(resizeObserver);

    // Run on resize and scroll
    // window.addEventListener("resize", resizeTimeline);
    // window.addEventListener("resize", centerIcons);
    window.addEventListener("scroll", centerIcons);
    window.addEventListener("scroll", resizeTimeline);

    return () => {
    //   window.removeEventListener("resize", resizeTimeline);
    //   window.removeEventListener("resize", centerIcons);
      window.removeEventListener("scroll", centerIcons);
      window.addEventListener("scroll", resizeTimeline);
    };

  }, [events]);

  useEffect(() => {
    const removeTransitionDuration = () => {
      const timelineBar = document.getElementById("timelineBar");
      const icons = document.querySelectorAll('[data-icon]');
      if (timelineBar) timelineBar.style.transitionDuration = "0s";
      for (const icon of icons) {
        if (icon) (icon as HTMLElement).style.transitionDuration = "0s"
      }
    }

    removeTransitionDuration();
  }, [stable])

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  return (
    // Inspo: https://stephane-monnot.github.io/react-vertical-timeline/#/
    <main id="main" className={`${styles.main} ${styles.bg}`}>
      <section className={styles.timelineWrapper} aria-label="Timeline section">
        <div id="timelineBar" className={`${stable ? styles.timelineBar : styles.hidden}`}></div>
        {/* <div className={styles.timelineStart}>
          <h1>Timeline</h1>
          <div aria-label="First timeline event">
            <h2>{petName.charAt(0).toUpperCase() + petName.slice(1)}'s birthday</h2>
            <h3>2023-12-24</h3>
          </div>
        </div> */}
        <div className={`${styles.timelineStart}`}>
            <h1 className={`${styles.timelineStartText} ${styles.timelineStartTextLeft}`}>{petName.charAt(0).toUpperCase() + petName.slice(1)} 🐶</h1>
            <svg className={styles.timelineStartIconLeft} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
              <path d="M320 0v240a160 160 0 1 0-320 0v240h160V240a160 160 0 1 0 320 0V0H320Z" fill="#808"></path>
            </svg>
          <h1 className={`${styles.timelineStartText} ${styles.timelineStartTextRight}`}>2023-12-24 🥳</h1>
          <svg className={styles.timelineStartIconRight} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
            <path d="M240 0a240 240 0 1 0 0 480 240 240 0 0 0 0-480Zm0 360a120 120 0 1 1 0-240 120 120 0 0 1 0 240Z" fill="#808"></path>
          </svg>
        </div>
        {events.map((event, index) =>
        <div className={`${index % 2 === 0 ? styles.left : styles.right} ${styles.event}`} aria-label="Timeline event" key={event.id}>
          <div data-icon className={`${stable ? styles.icon : styles.hidden}`}><i className="fa-solid fa-paw"></i></div>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <h4 className={styles.date}>{event.date}</h4>
          <p className={styles.eventText}>{event.description}</p>
          <img src={event.imagePath}></img>
        </div>
        )}
      </section>
    </main>
  );
}