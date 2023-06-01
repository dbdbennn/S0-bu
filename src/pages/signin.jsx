import React, { useState, useEffect, useRef } from 'react';
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import firebaseApp from '../../firebase';
import styles from '../styles/signin.module.css';

function Signin() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [windowWidth, setWindowWidth] = useState();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const placeholders = windowWidth <= 768 ? ['이메일', '비밀번호'] : ['', ''];

  const handleSignIn = () => {
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Handle successful sign-in
        const user = userCredential.user;
        alert('로그인 성공!');
        console.log('Successfully signed in:', user);
      })
      .catch((error) => {
        // Handle sign-in error
        console.error('Sign-in error:', error);
        const errorCode = error.code;
        let errorMessage = '';

        switch (errorCode) {
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = '유효하지 않은 이메일 형식입니다.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
            break;
          default:
            errorMessage = '로그인에 실패했습니다.';
            break;
        }

        alert(errorMessage);
      });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>sign in</div>
        <div className={styles.flex}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>이메일</label>
            <input
              className={styles.input}
              ref={inputRef}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[0]}
            />
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.label}>비밀번호</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[1]}
            />
          </div>
        </div>
        <button className={styles.register} onClick={handleSignIn}>
          next
        </button>
      </div>
    </>
  );
}

export default Signin;
