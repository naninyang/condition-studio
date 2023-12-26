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
import Image from 'next/image';

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
            <h2>📱 아이폰</h2>
            <section>
              <p>
                모바일 사파리 하단의 공유 버튼을 터치 합니다. <span>홈 화면에 추가 버튼을 터치 합니다.</span> 추가
                버튼을 터치 합니다.
              </p>
              <div className={styles.images}>
                <Image src="/iphone1.webp" width="400" height="867" alt="" />
                <Image src="/iphone2.webp" width="400" height="867" alt="" />
                <Image src="/iphone3.webp" width="400" height="867" alt="" />
              </div>
              <p>
                추가 버튼을 버치하면 자동으로 바탕화면으로 빠져 나옵니다.{' '}
                <span>여기에서 컨디션스튜디오 아이콘을 터치하면 됩니다.</span>
              </p>
              <div className={styles.images}>
                <Image src="/iphone4.webp" width="400" height="867" alt="" />
                <Image src="/iphone5.webp" width="400" height="867" alt="" />
              </div>
            </section>
            <h2>💻 아이패드</h2>
            <section>
              <p>
                모바일 사파리 상단 우측의 공유 버튼을 터치 합니다. <span>홈 화면에 추가 버튼을 터치 합니다.</span> 추가
                버튼을 터치 합니다.
              </p>
              <div className={`${styles.images} ${styles.vertical}`}>
                <Image src="/ipad1.webp" width="1337" height="929" alt="" />
                <Image src="/ipad2.webp" width="1337" height="929" alt="" />
                <Image src="/ipad3.webp" width="1337" height="929" alt="" />
              </div>
              <p>
                추가 버튼을 터치하면 자동으로 바탕화면으로 빠져 나옵니다.{' '}
                <span>여기에서 컨디션스튜디오 아이콘을 터치하면 됩니다.</span>
              </p>
              <div className={`${styles.images} ${styles.vertical}`}>
                <Image src="/ipad4.webp" width="1337" height="929" alt="" />
                <Image src="/ipad5.webp" width="1337" height="929" alt="" />
              </div>
            </section>
            <h2>🖥️ macOS</h2>
            <section>
              <p>
                macOS의 사파리 메뉴에서 Dock에 추가를 클릭합니다.{' '}
                <span>Dock에 추가 창에서 추가 버튼을 클릭합니다.</span>
              </p>
              <div className={`${styles.images} ${styles.vertical}`}>
                <Image src="/macos1.webp" width="1337" height="752" alt="" />
                <Image src="/macos2.webp" width="1337" height="752" alt="" />
              </div>
              <p>
                추가 버튼을 클릭하면 자동으로 Dock에 아이콘이 추가됩니다.{' '}
                <span>Dock에 있는 컨디션스튜디오 아이콘을 클릭하면 됩니다.</span>
              </p>
              <div className={`${styles.images} ${styles.vertical}`}>
                <Image src="/macos3.webp" width="1337" height="100" alt="" />
                <Image src="/macos4.webp" width="1337" height="899" alt="" />
              </div>
            </section>
            <p>
              <strong>Enjoy! 😎</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
