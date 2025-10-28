// NOT CURRENTLY IN USE.

"use client";

import React, { FormEvent, useEffect, useState, useRef, useContext } from 'react';
import styles from 'BtnSpinner.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrog } from '@fortawesome/free-solid-svg-icons'

interface BtnSpinnerProps {
  className: string;
}

export default function BtnSpinner({ className }: BtnSpinnerProps) {
  return (
    <div className={className} inert>
      <FontAwesomeIcon icon={faFrog} bounce/>
    </div>
  );
}