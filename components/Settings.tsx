import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import { isIOS } from 'react-device-detect';
import styled from '@emotion/styled';
import Anchor from '@/components/Anchor';
import { rem } from '@/styles/designSystem';
import { IconDownloadPWA, IconDownloadSafari, IconUxLeft } from './icons';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
};

const BackwardIcon = styled.i({
  background: `url(${IconUxLeft.src}) no-repeat 50% 50%/contain`,
});

const SafariIcon = styled.i({
  background: `url(${IconDownloadSafari.src}) no-repeat 50% 50%/contain`,
});

const PwaIcon = styled.i({
  background: `url(${IconDownloadPWA.src}) no-repeat 50% 50%/contain`,
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
  const [isiOS, setIsiOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const isDesktop = useDesktop();

  useEffect(() => {
    const storedPage = localStorage.getItem('loaded');
    setLoaded(storedPage);
  }, []);

  const handleBackward = () => {
    router.back();
  };

  const onInstallPWA = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as BeforeInstallPromptEvent;

      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const isIPadOS = () => {
    return navigator.userAgent.includes('Macintosh') && 'ontouchend' in document;
  };
  useEffect(() => {
    setIsiOS(isIOS || isIPadOS);
  }, []);

  return (
    <>
      <header>
        {!isDesktop &&
          (loaded ? (
            <button type="button" onClick={handleBackward}>
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </button>
          ) : (
            <Anchor href="/">
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </Anchor>
          ))}
        {router.pathname === '/settings' &&
          (loaded ? (
            <button type="button" onClick={handleBackward}>
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </button>
          ) : (
            <Anchor href="/">
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </Anchor>
          ))}
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
      {isiOS ? (
        <div data-device="safari">
          <Anchor href="/settings/safari">
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
