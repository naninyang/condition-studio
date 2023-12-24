import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { icons } from '@/icons';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Settings.module.sass';

const BackwardIcon = styled.i({
  background: `url(${icons.ux.left}) no-repeat 50% 50%/contain`,
});

export default function Settings() {
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
    <main className={styles.settings}>
      <header>
        {loaded ? (
          <button type="button" onClick={handleBackward}>
            <BackwardIcon />
            <span>서비스 화면으로 돌아가기</span>
          </button>
        ) : (
          <Anchor href="/">
            <BackwardIcon />
            <span>서비스 화면으로 돌아가기</span>
          </Anchor>
        )}
        <h1>환경설정</h1>
      </header>
      <ol>
        <li>
          <Anchor href="/settings/location">위치설정</Anchor>
        </li>
        <li>
          <Anchor href="/settings/open-sources">오픈소스</Anchor>
        </li>
        <li>
          <Anchor href="/settings/version">버전정보</Anchor>
        </li>
      </ol>
    </main>
  );
}
