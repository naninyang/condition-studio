import React, { useEffect } from 'react';
import Seo from '@/components/Seo';
import Summary from './home/summary';
import Forecast from './home/forecast';
import Everything from './home/everything';
import Riseset from './home/riseset';
import Update from './home/update';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  useEffect(() => {
    localStorage.removeItem('loaded');
    localStorage.setItem('loaded', 'true');
  }, []);

  return (
    <main className={styles.main}>
      <Seo pageTitle="날씨의 모든 것" />
      <Summary />
      <Forecast />
      <Everything />
      <Riseset />
      <Update />
    </main>
  );
}
