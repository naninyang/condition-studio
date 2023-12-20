import { AppProps } from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import '@/styles/globals.sass';

const fontNoto = Noto_Sans_KR({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['cyrillic'],
});

const weatherIcons = localFont({ src: '../fonts/dripicons-weather.woff' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
      <Component {...pageProps} />
    </>
  );
}
