import firebase from '../../firebase';
import styels from '../styles/study.module.css';
import React, { useState } from 'react';
import Timer from '../../src/Timer';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import logo from '../../public/images/logo.png';

function study() {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className={styels.App}>
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

      <div className={styels.studyContainer}>
        <div className={styels.timer}>
          <h1>Timer</h1>
            {showTimer && <Timer />}
          <button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</button>
        </div>
      </div>
    </div>
  );
}

export default study;
