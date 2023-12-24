import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { StyleProps } from '@/types';
import Anchor from './Anchor';
import { useRecoilValue } from 'recoil';
import { weatherState } from '@/state/atoms';
import { hex } from '@/styles/designSystem';
import styles from '@/styles/Home.module.sass';

const Container = styled.footer<StyleProps>(({ isDay }) => ({
  backgroundColor: isDay === 1 ? `rgba(255,255,255,.7)` : `rgba(0,0,0,.7)`,
  '& .footer': {
    '& p': {
      color: isDay === 1 ? hex.black : hex.white,
    },
    '& a': {
      color: isDay === 1 ? hex.dark : hex.light,
      '&:hover, &:focus': {
        color: isDay === 1 ? hex.black : hex.white,
        '&::after': {
          backgroundColor: isDay === 1 ? hex.black : hex.white,
        },
      },
    },
    '& dl': {
      '& div': {
        color: isDay === 1 ? hex.dark : hex.light,
      },
    },
  },
}));

export default function Footer() {
  useFetchData('서울 중구 을지로 12');
  const weatherData = useRecoilValue(weatherState);

  return (
    <>
      {weatherData && (
        <Container isDay={weatherData.current.is_day}>
          <div className={`${styles.footer} footer`}>
            <p>
              Copyright &copy; Condition Studio, <span>all rights reserved.</span>
            </p>
            <ul>
              <li>
                <Anchor href="https://github.com/naninyang/condition-studio">Github repository</Anchor>
              </li>
              <li>
                <Anchor href="https://dev1stud.io">DEV1L.studio</Anchor>
              </li>
            </ul>
            <dl>
              <div>
                <dt>UX Designer</dt>
                <dd>Chloe Ariko</dd>
              </div>
              <div>
                <dt>Frontend Developer</dt>
                <dd>Chloe Ariko</dd>
              </div>
            </dl>
          </div>
        </Container>
      )}
    </>
  );
}
