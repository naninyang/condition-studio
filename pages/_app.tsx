import { AppProps } from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import 'styles/globals.sass';

const fontNoto = Noto_Sans_KR({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['cyrillic'],
});

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
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
