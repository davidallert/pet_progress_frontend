import styles from './Dialog.module.css';
import Dimmer from '../../layout/Dimmer';
import Button from '../Button';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface DialogProps {
    title: string,
    text: string,
    visible: boolean,
    callback: Function
}

export default function Dialog({title, text, visible, callback}: DialogProps) {
    const handleDialogResponse = (confirmed: boolean) => {
        callback(confirmed);
    }

    return (
        <div className={visible ? styles.visible : styles.hidden}>
            <div onClick={() => handleDialogResponse(false)}>
                <Dimmer />
            </div>

            <div className={styles.dialog}>
                <FontAwesomeIcon className={styles.icon} icon={faXmark} size="2x" onClick={() => handleDialogResponse(false)}/>

                <div className={styles.titleGrp}>
                    <h2 className={styles.h2}>{title}</h2>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.textGrp}>
                    <p>{text}</p>
                </div>

                <div className={styles.btnGrp}>
                    <Button type="submit" onClick={() => handleDialogResponse(true)}>Yes</Button>
                    <Button type="submit" onClick={() => handleDialogResponse(false)}>No</Button>
                </div>
            </div>
        </div>
    )
}