import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>STUDY-0</title>
        <link rel="icon" href="/images/headlogo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;