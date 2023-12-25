import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { RecoilRoot } from 'recoil';
import '@/styles/globals.sass';
import Backgrounds from '@/components/Backgrounds';

const fontNoto = Noto_Sans_KR({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['cyrillic'],
});

const weatherIcons = localFont({ src: '../fonts/dripicons-weather.woff' });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);
  return (
    <RecoilRoot>
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          textarea,
          select,
          legend {
            font-family:
              ${fontNoto.style.fontFamily},
              -apple-system,
              BlinkMacSystemFont,
              system-ui,
              'Apple SD Gothic Neo',
              'Nanum Gothic',
              'Malgun Gothic',
              sans-serif;
          }
          .icon {
            font-family: ${weatherIcons.style.fontFamily};
          }
        `}
      </style>
      <Backgrounds />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
