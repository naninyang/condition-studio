import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import { icons } from '@/icons';
import Anchor from '@/components/Anchor';
import { rem } from '@/styles/designSystem';

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

export default function SettingsMenu() {
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
    <>
      <header>
        {!isDesktop && (
          <>
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
          </>
        )}
        {router.pathname === '/settings' && (
          <>
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
          </>
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
    </>
  );
}
