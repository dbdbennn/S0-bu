import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import logo from '../../public/images/logo.png';
import styles from '../styles/community.module.css';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import firebase from '../../firebase';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import io from 'socket.io-client';

function Community() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [roomID, setRoomID] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const socket = io.connect('http://localhost:4000');

    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log('로그인 상태: 로그인됨' + user.uid);

        // 사용자 정보 가져오기
        const { displayName, email, uid } = user;
        setDisplayName(displayName);
        setEmail(email);

        // 사용자 정보를 서버로 전송
        socket.emit('userConnected', { displayName, email });
      } else {
        setLoggedIn(false);
        console.log('로그인 상태: 로그인되지 않음');
      }
    });

    // 서버로부터 전달된 이메일 정보를 받아와서 상태 업데이트
    socket.on('userEmail', (userEmail) => {
      setUserEmail(userEmail);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // ...

  useEffect(() => {
    console.log('User email in Community:', userEmail);
  }, [userEmail]);


  const openModal = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitle('');
    setContent('');
    setRoomID('');
    setShowModal(false);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setTitle(inputValue);
    }
  };

  const handleContentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 200) {
      setContent(inputValue);
    }
  };

  const wordCount = content.length;

  const handleRoomIDChange = (e) => {
    const inputValue = e.target.value;
    // Restrict input to English characters only
    const englishRegex = /^[a-zA-Z0-9]*$/;
    if (englishRegex.test(inputValue) && inputValue.length <= 20) {
      setRoomID(inputValue);
    }
  };

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

      <div className={styles['post-container']}>
        <div className={styles.newPostContainer}>
          <div className={styles.newPost}>
            <button className={styles.newPostBtn} onClick={openModal}>
              POST
            </button>
          </div>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>React 스터디 하실 분 ~</h1>
          <p className={styles['post-writer']}>Hyewon Yang</p>
          <p className={styles['post-date']}>2023 / 03 / 31</p>
          <p className={styles['post-content']}>
            저랑 같이 react 공부해요 ㅎㅎ 저는 미림 마이스터고 출신이고 같이
            공부해서 취뽀해염
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={handleTitleChange}
            />
            <textarea
              className={styles.textarea}
              placeholder="내용"
              value={content}
              onChange={handleContentChange}
            ></textarea>
            <span className={styles.counter}>({wordCount}/200)</span>
            <br></br>
            <input
              type="text"
              placeholder="스터디룸 ID"
              value={roomID}
              onChange={handleRoomIDChange}
            />
            <div className={styles.buttonContainer}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Community;
