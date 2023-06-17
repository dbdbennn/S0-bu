import React from "react";
import styles from '../styles/startpage.module.css'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from '../../firebase'

function StartPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("로그인 상태: 로그인됨" + user.uid);
        router.push('/community');
      }
    })
  });

  return (
    <>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/images/logo.png" />
      </div>
      <div className={styles.core}>
        <div className={styles.img1}>
          <img className={styles.img} src="/images/girl_shorthair.png" alt="g1" />
          <img className={styles.img} src="/images/boy_brownhair.png" alt="b1" />
        </div>
        <div className={styles.btns}>
          <button className={styles.btnSignIn}
            onClick={() => { router.push(`/signin`) }}>
            sign in
          </button>
          <button className={styles.btnSignUp}
            onClick={() => { router.push(`/signup`) }}>
            sign up
          </button>
        </div>
        <div className={styles.img2}>
          <img className={styles.img} src="/images/girl_longhair.png" alt="b2" />
          <img className={styles.img} src="/images/boy_blackhair.png" alt="g2" />
        </div>
      </div>
    </>
  );
}

export default StartPage;
