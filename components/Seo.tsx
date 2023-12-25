import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  pageTitle?: string;
  pageDescription?: string;
  pageImgWidth?: number;
  pageImgHeight?: number;
  pageOgType?: string;
}

const Seo = ({ pageTitle, pageDescription, pageImgWidth, pageImgHeight, pageOgType }: Props) => {
  const router = useRouter();
  const pagePath = router.asPath;
  const timestamp = Date.now();
  const domain = 'https://condition.dev1stud.io';
  const title = pageTitle;
  const defaultTitle = '컨디션 스튜디오';
  const finTitle = `${title} - ${defaultTitle}` || defaultTitle;
  const defaultDescription = '날씨의 모든 것';
  const description = pageDescription || defaultDescription;
  const url = `${domain}${pagePath}`;
  const imgUrl = `${domain}og-image.png?ts=${timestamp}`;
  const imgWidth = pageImgWidth || 1280;
  const imgHeight = pageImgHeight || 630;
  const ogType = pageOgType || 'website';

  return (
    <Head>
      <title>{finTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finTitle} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <link rel="canonical" href={url} />
      <link rel="alternate" href={url} hrefLang="ko-KR" />
    </Head>
  );
};

export default Seo;
