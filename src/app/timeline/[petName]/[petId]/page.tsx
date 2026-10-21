"use client";

import styles from './page.module.css'
import axios from "@/libraries/axios"
import { usePet } from "@/hooks/usePet"
import React, { useEffect, useContext } from "react";
import PopupContext from "@/app/context/popup/context";
import getErrorMessages from "@/utils/getErrorMessages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter } from '@fortawesome/free-solid-svg-icons';
import TimelineSection from '@/app/components/ui/TimelineSection';
import { useRouter } from 'next/navigation';

export default function Timeline({params}: PageProps<'/timeline/[petName]/[petId]'>) {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();

  const { petId } = React.use(params);
  const { pet, petLoading, petError } = usePet(Number(petId));

  useEffect(() => {
    if (petLoading || [petError].length === 0) return;

    setPopup({ messages: getErrorMessages([petError]), type: 'error'});
  }, [petError]);

  // return (
  //   <main className={styles.main}>
  //     <h4 style={{textAlign: "center"}}>Petfolio is currently under development - features may be missing or incomplete.</h4>
  //   </main>
  // )

  const handleImgClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // router.push(e.currentTarget.src);
    window.open(e.currentTarget.src, "_blank", "noopener,noreferrer");
  }

  if (petLoading || petError) {
    return (
      <main className={styles.loading}>
        <FontAwesomeIcon icon={faOtter} spinPulse size="3x"/>
      </main>
    );
  }

  return (
      <main className={styles.main}>
        <section>
          <h1 className={styles.h1}>
            {pet?.name}'s Timeline
          </h1>
          </section>
        <section className={styles.grid}>
        {pet?.events.map((event, index, events) => (
          <React.Fragment key={event.id}>
            <div className={styles.timelineCol}>
              <TimelineSection
                iconKey={event.category.icon}
                first={index === 0}
                last={index === events.length - 1}
              />
            </div>
            <div className={styles.contentCol}>
              <div className={styles.contentContainer}>
                <div className={styles.textContainer}>
                <div>
                  <h2>{event.title}</h2>
                  <p>{event.description ?? ''}</p>
                </div>
                <div>
                  <p>{event.category.name ?? ''} {event.date && `| ${event.date}`}</p>
                </div>
              </div>
              <div className={event.imagePath && styles.imgContainer}>
                {event.imagePath && <img className={styles.eventImg} src={event.imagePath} onClick={handleImgClick}></img>}
              </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        </section>
      </main>
  );
}