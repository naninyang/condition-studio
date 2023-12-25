import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import { icons } from '@/icons';
import Seo from '@/components/Seo';
import Anchor from '@/components/Anchor';
import SettingsMenu from '@/components/Settings';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/Settings.module.sass';

const BackwardIcon = styled.i({
  background: `url(${icons.ux.left}) no-repeat 50% 50%/contain`,
});

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: `(min-width: ${rem(992)} )` });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

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

  const isDesktop = useDesktop();

  return (
    <main className={styles.settings}>
      <Seo pageTitle="사파리에서 앱 내려받기" />
      {isDesktop && (
        <>
          <nav>
            <SettingsMenu />
          </nav>
          <hr />
        </>
      )}
      <div className={styles.content}>
        <header>
          {isDesktop ? (
            <Anchor href="/">
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </Anchor>
          ) : (
            <>
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
            </>
          )}
          <h1>사파리에서 앱 내려받기</h1>
        </header>
        <div className={styles.contain}>
          <div className={styles.safari}>
            <p>모바일 사파리 하단의 공유 버튼을 tap 합니다.</p>
            <p>홈 화면에 추가 버튼을 tap 합니다.</p>
            <p>추가 버튼을 tap 합니다.</p>
            <p>
              추가 버튼을 tap 하면 자동으로 바탕화면으로 빠져 나옵니다.{' '}
              <span>여기에서 웨버 아이콘을 tap 하면 됩니다.</span>
            </p>
            <p>
              <strong>Enjoy! 😎</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
