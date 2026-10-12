"use client";

import styles from "./page.module.css";
import Link from 'next/link';
import { faSignal, faComments, faSyringe, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./components/ui/Button";
import { useRouter } from 'next/navigation'
import type { MouseEvent } from "react";

export default function Home() {
const router = useRouter()

const routeToAccount = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  router.replace("/account");
};

  return (
    <main className={styles.main}>
      <Link href="/account">
        <section className={styles.heroContainer}>
          <img className={styles.heroImg} src="/hero.png"></img>
          <svg className={styles.wave} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="1" d="M0,224L34.3,218.7C68.6,213,137,203,206,208C274.3,213,343,235,411,224C480,213,549,171,617,160C685.7,149,754,171,823,197.3C891.4,224,960,256,1029,250.7C1097.1,245,1166,203,1234,186.7C1302.9,171,1371,181,1406,186.7L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg>
        </section>
       </Link>
      <h1 className={styles.h1}>JOIN THE FAMILY</h1>
      <section className={styles.cards}>
        <div className={`${styles.card} ${styles.card1}`}>
          <div className={styles.cardContent}>
             <FontAwesomeIcon icon={faSignal} size="3x"/>
            <h2>Save Moments</h2>
            <p>Keep milestones worth remembering.</p>
          </div>
          <svg className={styles.cardBg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#8C7AFF" d="M67.4,-36.7C80.8,-15.6,80.7,15.5,67.2,35.1C53.8,54.8,26.9,63,2.5,61.6C-21.9,60.1,-43.7,49,-51.9,32.4C-60.1,15.8,-54.6,-6.3,-43.7,-25.9C-32.8,-45.5,-16.4,-62.6,5.3,-65.7C27,-68.7,53.9,-57.7,67.4,-36.7Z" transform="translate(100 100)" />
          </svg>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon className={styles.icon} icon={faSignal} size="10x"/>
            <div className={styles.iconBlur}></div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.card2}`}>
          <div className={styles.cardContent}>
            <FontAwesomeIcon icon={faComments} size="3x"/>
            <h2>Meet Friends</h2>
            <p>Share stories and advice with others.</p>
          </div>
          <svg className={styles.cardBg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#8C7AFF" d="M49,-37.6C62.2,-22.5,70.7,-2.2,67.3,16.3C63.8,34.8,48.4,51.6,28,63.4C7.7,75.2,-17.6,82.1,-36.1,73.7C-54.6,65.2,-66.3,41.5,-68.5,19.2C-70.8,-3.2,-63.7,-24.1,-50.7,-39.1C-37.7,-54.1,-18.8,-63.1,-0.5,-62.7C17.9,-62.3,35.8,-52.6,49,-37.6Z" transform="translate(100 100)" />
          </svg>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon className={styles.icon} icon={faComments} size="10x"/>
            <div className={styles.iconBlur}></div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.card3}`}>
          <div className={styles.cardContent}>
            <FontAwesomeIcon icon={faSyringe} size="3x"/>
            <h2>Keep Track</h2>
            <p>Save appointments and important dates.</p>
          </div>
          <svg className={styles.cardBg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#8C7AFF" d="M46.6,-42C55.1,-26.4,53.3,-7.3,47.6,8.2C41.9,23.7,32.4,35.6,17.9,45.9C3.4,56.2,-16,64.9,-34.9,60.5C-53.8,56,-72.2,38.3,-78.1,16.6C-84.1,-5.1,-77.6,-30.9,-62.5,-48C-47.4,-65.1,-23.7,-73.5,-2.4,-71.6C19,-69.8,38,-57.6,46.6,-42Z" transform="translate(100 100)" />
          </svg>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon className={styles.icon} icon={faSyringe} size="10x"/>
            <div className={styles.iconBlur}></div>
          </div>
        </div>
      </section>
      <div className={styles.btnContainer}>
        <Button type="submit" onClick={(e) => routeToAccount(e)}>CREATE YOUR ACCOUNT <FontAwesomeIcon icon={faArrowRight}/></Button>
      </div>
    </main>
  );
}
