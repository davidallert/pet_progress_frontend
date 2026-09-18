"use client";

import { useContext } from 'react';
import PopupContext from '@/app/context/popup/context';
import styles from './Popup.module.css';

export default function Popup() {
  const { popup } = useContext(PopupContext);

  return (
    <>
      <div className={styles.container}>
        {popup.messages.map((msg, index) => (
          <div key={index} className={`
            ${styles[popup.type]}
            ${styles.popup}
            ${popup.isVisible ? styles.popupVisible : styles.popupHidden}
          `}>
            <p>{msg}<br /></p>
          </div>
        ))}
      </div>
  </>
  )
}

