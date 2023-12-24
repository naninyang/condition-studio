import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GeocodeResponse } from '@/types';
import { saveAddressToDB } from '@/utils/indexedDB';
import { icons } from '@/icons';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Settings.module.sass';

const BackwardIcon = styled.i({
  background: `url(${icons.ux.left}) no-repeat 50% 50%/contain`,
});

export default function Version() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('loaded');
    setLoaded(storedPage);
  }, []);

  const handleBackward = () => {
    router.back();
  };
  return (
    <div className={styles.settings}>
      <header>
        {loaded ? (
          <button type="button" onClick={handleBackward}>
            <BackwardIcon />
            <span>환경설정으로 돌아가기</span>
          </button>
        ) : (
          <Anchor href="/settings">
            <BackwardIcon />
            <span>환경설정으로 돌아가기</span>
          </Anchor>
        )}
        <h1>버전정보</h1>
      </header>
      <div className={styles.contain}>
        <div className={styles.info}>
          <dl>
            <div>
              <dt>UX Designer</dt>
              <dd>Chloe Ariko</dd>
            </div>
            <div>
              <dt>Frontend Developer</dt>
              <dd>Chloe Ariko</dd>
            </div>
          </dl>
          <ul>
            <li>
              <Anchor href="https://github.com/naninyang/condition-studio">Github repository</Anchor>
            </li>
            <li>
              <Anchor href="https://dev1stud.io">DEV1L.studio</Anchor>
            </li>
          </ul>
          <p>
            <strong>‘Condition Studio v.0.1.0 βeta’</strong>
          </p>
          <p>
            Copyright &copy; <strong>Condition Studio</strong>, <span>all rights reserved.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
