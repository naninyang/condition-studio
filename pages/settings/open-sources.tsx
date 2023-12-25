import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import fs from 'fs';
import path from 'path';
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

function OpenSources({ licenses }: { licenses: string[] }) {
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
      <Seo pageTitle="오픈소스" />
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
          <h1>오픈소스</h1>
        </header>
        <div className={styles.contain}>
          <div className={styles.documents}>
            {licenses.map((license, index) => (
              <section key={index}>
                <pre>
                  <code>{license}</code>
                </pre>
                <hr />
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const markdownDir = path.join(process.cwd(), 'pages/licenses');
  const filenames = fs.readdirSync(markdownDir);
  const licenses = filenames.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  });

  return {
    props: {
      licenses,
    },
  };
}

export default OpenSources;
