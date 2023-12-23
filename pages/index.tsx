import React from 'react';
import Summary from './home/summary';
import styles from '@/styles/Home.module.sass';
import Forecast from './home/forecast';
import Everything from './home/everything';

export default function Home() {
  return (
    <main className={styles.main}>
      <Summary />
      <Forecast />
      <Everything />
    </main>
  );
}
