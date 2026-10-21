"use client";

import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import RegisterForm from "@/app/components/forms/RegisterForm";
import LoginForm from "@/app/components/forms/LoginForm";
import React from "react";

export default function Account({params}: PageProps<'/account/[viewId]'>) {

  const [isLoginForm, setIsLoginForm] = useState(false);
  const { viewId } = React.use(params);

  useEffect(() => {
    if (viewId === "2") {
      setIsLoginForm(true);
    }
  }, [viewId]);

  const toggleFormType = () => {
    setIsLoginForm(prev => !prev);
  }

  return (
    <main className={styles.main}>
      <section id="form" className={styles.form}>
        {isLoginForm ? <LoginForm /> : <RegisterForm />}

        <h3 id="switchForm"
          className={styles.switchForm}
          onClick={toggleFormType}>
          {
            isLoginForm
            ?
            "Register new user"
            :
            "Login with existing user"
          }
        </h3>
      </section>
    </main>
  );
}
