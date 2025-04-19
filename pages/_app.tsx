import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Provider } from 'jotai';
import { GA_TRACKING_ID, pageview } from '@/utils/gtag';
import Backgrounds from '@/components/Backgrounds';
import '@/styles/globals.sass';

const fontNoto = Noto_Sans_KR({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['cyrillic'],
});

const weatherIcons = localFont({ src: './fonts/dripicons-weather.woff' });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/sw.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    // @ts-expect-error 타입 시스템 충돌 무시 (React 19 + Jotai 2.1.x 문제)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    <Provider>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
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
    </Provider>
  );
}
