"use client";

import Image from "next/image";
import styles from "./page.module.css";
import React, { FormEvent, useEffect, useState } from 'react';
import RegisterForm from "./components/auth/RegisterForm";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <h1>Track your pet's progress!</h1> */}
      <RegisterForm />
    </main>
  );
}
