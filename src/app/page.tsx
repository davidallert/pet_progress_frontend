"use client";

import Image from "next/image";
import styles from "./page.module.css";
import React, { FormEvent, useEffect, useState } from 'react';
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";

export default function Home() {

  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleFormType = () => {
    setIsLoginForm(prev => !prev);
  }

  return (
    <main className={styles.main}>
      {/* <h1>Track your pet's progress!</h1> */}
      {isLoginForm ? <LoginForm /> : <RegisterForm />}
      <h3 className={styles.switchForm} onClick={toggleFormType}>{isLoginForm ? "Register new user" : "Login with existing user"}</h3>
    </main>
  );
}
