"use client";

import styles from "./page.module.css";
import { useState } from 'react';
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";

export default function Home() {

  const [isLoginForm, setIsLoginForm] = useState(false);

  const toggleFormType = () => {
    setIsLoginForm(prev => !prev);
  }

  const scroll = () => {
    const form = document.getElementById("form");
    console.log(form)
    if (form) form.scrollIntoView({behavior: "smooth"});
    
  }

  return (
    <main className={styles.main}>
      <section className={styles.heroContainer}>
        <img className={styles.heroImg} src="/hero.png" onClick={scroll}></img>
      </section>
      {/* <section className={styles.cards}>
        <div className={styles.card}>
          <h2>USP 1</h2>
          <p>Text</p>
        </div>
        <div className={styles.card}>
          <h2>USP 2</h2>
          <p>Text</p>
        </div>
        <div className={styles.card}>
          <h2>USP 3</h2>
          <p>Text</p>
        </div>
      </section> */}
      <section id="form" className={styles.form}>
        {isLoginForm ? <LoginForm /> : <RegisterForm />}
        <h3 id="switchForm" className={styles.switchForm} onClick={toggleFormType}>{isLoginForm ? "Register new user" : "Login with existing user"}</h3>
      </section>
    </main>
  );
}
