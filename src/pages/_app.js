import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>STUDY-0</title>
        <link rel="icon" href="/images/headIcon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;