import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import { isSafari } from 'react-device-detect';
import styled from '@emotion/styled';
import { icons } from '@/icons';
import Anchor from '@/components/Anchor';
import { rem } from '@/styles/designSystem';

const BackwardIcon = styled.i({
  background: `url(${icons.ux.left}) no-repeat 50% 50%/contain`,
});

const SafariIcon = styled.i({
  background: `url(${icons.downloads.safari}) no-repeat 50% 50%/contain`,
});

const PwaIcon = styled.i({
  background: `url(${icons.downloads.pwa}) no-repeat 50% 50%/contain`,
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

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [deviceSafari, setDeviceSafari] = useState<string>();

  const onInstallPWA = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    if (isSafari) {
      setDeviceSafari('isSafari');
    }
  }, []);

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
      {deviceSafari === 'isSafari' ? (
        <div data-device="safari">
          <Anchor href="/safari">
            <span>Safari 앱 내려받기</span>
            <SafariIcon />
          </Anchor>
        </div>
      ) : (
        <div data-device="chrome">
          <button type="button" onClick={onInstallPWA}>
            <span>앱 내려받기</span>
            <PwaIcon />
          </button>
        </div>
      )}
    </>
  );
}
