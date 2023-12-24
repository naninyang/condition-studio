import React, { useEffect } from 'react';
import Summary from './home/summary';
import Forecast from './home/forecast';
import Everything from './home/everything';
import Riseset from './home/riseset';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  useEffect(() => {
    localStorage.removeItem('loaded');
    localStorage.setItem('loaded', 'true');
  }, []);

  return (
    <main className={styles.main}>
      <Summary />
      <Forecast />
      <Everything />
      <Riseset />
    </main>
  );
}
