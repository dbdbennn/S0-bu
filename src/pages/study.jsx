import firebase from '../../firebase';
import styles from '../styles/study.module.css';
import React, { useState, useEffect } from 'react';
import Timer from '../../src/Timer';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import logo from '../../public/images/logo.png';

function Study() {
  const [showTimer, setShowTimer] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const docRef = firebase.firestore().collection('posts').doc('1111');
        const doc = await docRef.get();
        if (doc.exists) {
          const data = doc.data();
          setRoomId(data.roomId);
        } else {
          console.log('Document not found');
        }
      } catch (error) {
        console.log('Error fetching roomId:', error);
      }
    };

    fetchRoomId();
  }, []);

  return (
    <div className={styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/">
            <Image className={navStyles['logo-img']} src={logo} alt="Logo" />
          </a>
          <ul className={navStyles['nav-list']}>
            <li className={navStyles.community}>
              <a href="community">Community</a>
            </li>
            <li className={navStyles.mypage}>
              <a href="mypage">My Page</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className={styles.studyContainer}>
        <div className={styles.timer}>
          <h1>Timer</h1>
          {showTimer && <Timer />}
          <button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</button>
        </div>
      </div>

      <div className={styles.box}>
        {roomId && (
          <img
            src={`/study/${roomId}`}
            className={styles.desk_img}
            alt="Girl with long hair at the desk"
          />
        )}
      </div>
    </div>
  );
}

export default Study;
