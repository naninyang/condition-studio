import React from 'react';
import Summary from './home/summary';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  return (
    <main className={styles.main}>
      <Summary />
    </main>
  );
}
