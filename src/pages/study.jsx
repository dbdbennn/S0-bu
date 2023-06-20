import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, listCollections } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, getUser } from 'firebase/auth';
import io from 'socket.io-client';
import styles from '../styles/study.module.css';
import Timer from '../../src/Timer';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import logo from '../../public/images/logo.png';
import firebase from '../../firebase';
import { format } from 'date-fns';

function Study() {
  const router = useRouter();
  const db = getFirestore(firebase);
  const auth = getAuth(firebase);
  const currentDate = format(new Date(), 'yyyyMMdd');
  const { roomID } = router.query;
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [uid, setUID] = useState('');
  const [users, setUsers] = useState([]);

  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
  const fetchUserCharacters = async () => {
    try {
      const db = getFirestore(firebase);
      const studyroomRef = doc(db, 'studyroom', roomID);
      const studyroomDoc = await getDoc(studyroomRef);

      if (studyroomDoc.exists()) {
        const { uids } = studyroomDoc.data();
        console.log('uids:', uids);
        const users = [];

        for (const uid of uids) {
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const { characterId, nickname } = userData;
            users.push({ uid, characterId, nickname });
          }
        }
        //for end
        

        // Perform additional tasks with the users array
        console.log('Users:', users);
        setUsers(users);

        const intervalId = setInterval(fetchUserCharacters, 5000);
          return () => {
            clearInterval(intervalId);
          };
      } else {
        const intervalId = setInterval(fetchUserCharacters, 5000);
        return () => {
          clearInterval(intervalId);
          console.log('Study room document does not exist');
        };
      }
    } catch (error) {
      console.error('컬렉션 가져오기 중 오류가 발생했습니다:', error);
    }
  };
  

  fetchUserCharacters();
}, [db, roomID]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log('로그인 상태: 로그인됨' + user.uid);
        console.log('roomID : ' + router.query.roomID);
        console.log(roomID);

        const { uid, displayName } = user;
        setUID(uid);

        async function fetchStudyTimeFromFirebase() {
          try {
            const uid = user.uid;
            const userDocRef = doc(collection(db, 'times'), uid);
            const dateDocRef = doc(collection(userDocRef, 'dates'), currentDate);
            const docSnapshot = await getDoc(dateDocRef);

            if (docSnapshot.exists()) {
              const { hours, minutes, seconds } = docSnapshot.data();
              setStudyTime({ hours, minutes, seconds });
            }
          } catch (error) {
            console.error('시간 가져오기 중 오류가 발생했습니다:', error);
          }
        }

        fetchStudyTimeFromFirebase();
      } else {
        console.log('로그인 상태: 로그인되지 않음');
        router.push('/startpage');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, currentDate, db, router, router.query.roomID]);

  useEffect(() => {
    const socket = io.connect('http://localhost:4000');

    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log('로그인 상태: 로그인됨' + user.uid);

        const { uid } = user;
        setUID(uid);

        socket.emit('userConnected', { uid, roomID });
      } else {
        setLoggedIn(false);
        console.log('로그인 상태: 로그인되지 않음');
      }
    });

    socket.on('userUID', (userUID) => {
      setUID(userUID);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, roomID]);

  

  return (
    <div className={styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/community">
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
        <div className={styles.box}>
        {users.map((user) => (
          <div key={user.uid} className={styles.usersDiv}>
            
            <div className={styles.nickName}>{user.nickname}</div> {/* 수정 */}
            <img
              src={`/images/${user.characterId}_desk_h.png`}
              className={styles.desk_img}
              alt={`Character ${user.characterId} at the desk`}
            />
          </div>
        ))}
        </div>

        <div className={styles.timer}>
          <div className={styles.timer_title}>
            <img className={styles.timer_img} src="/images/timer.png" />
            <h1>Timer</h1>
          </div>
          <Timer studyTime={studyTime} setStudyTime={setStudyTime} />
        </div>
      </div>
    </div>
  );
}

export default Study;