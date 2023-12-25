import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { addressState, weatherState } from '@/state/atoms';
import { getAddressFromDB } from '@/utils/indexedDB';
import { icons } from '@/icons';
import { StyleProps } from '@/types';
import Anchor from './Anchor';
import colors from './Colors';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/Home.module.sass';

const hexToRgb = (hex: string) => {
  let cleanHex = hex.replace('#', '');
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const Container = styled.header<StyleProps>(({ colorItems }) => ({
  backgroundColor: colorItems ? `rgba(${hexToRgb(colorItems)},.7)` : undefined,
}));

const RefreshIcon = styled.i({
  background: `url(${icons.ux.refresh}) no-repeat 50% 50%/contain`,
});

const SettingsIcon = styled.i({
  background: `url(${icons.ux.settings}) no-repeat 50% 50%/contain`,
});

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: `(min-width: ${rem(992)} )` });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export default function Header() {
  const [seoulDate, setSeoulDate] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');

  const addressData = useRecoilValue(addressState);
  const [initialAddress, setInitialAddress] = useState<string>('');

  useEffect(() => {
    const fetchAddress = async () => {
      const addressFromDB = await getAddressFromDB('address');
      const newAddress = addressFromDB ? addressFromDB : '서울 중구 을지로 12';
      setInitialAddress(newAddress);
    };

    fetchAddress();
  }, []);
  useFetchData(initialAddress);

  const weatherData = useRecoilValue(weatherState);
  const getColors = (code: number, isDay: number): string => {
    const color = colors[code] || colors[1000];
    return isDay ? color.day : color.night;
  };
  const colorItems = weatherData && getColors(weatherData.current.condition.code, weatherData.current.is_day);

  useEffect(() => {
    const now = new Date();
    const seoulDateFormatted = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      timeZone: 'Asia/Seoul',
    }).format(now);
    const seoulTimeFormatted = new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(now);

    setSeoulDate(seoulDateFormatted);
    setSeoulTime(seoulTimeFormatted);
  }, []);

  const handleRefresh = async () => {
    window.location.reload();
  };

  const isDesktop = useDesktop();

  return (
    <Container colorItems={colorItems}>
      <h1>컨디션 스튜디오</h1>
      <p>
        <span>
          {seoulDate} {seoulTime}
        </span>{' '}
        {addressData && (
          <>
            {addressData.sido_nm} {addressData.sgg_nm !== 'null' && addressData.sgg_nm}{' '}
            {addressData.adm_nm !== 'null' && addressData.adm_nm}
          </>
        )}
      </p>
      <div className={styles.buttons}>
        <button type="button" onClick={handleRefresh}>
          <span>새로고침</span>
          <RefreshIcon />
        </button>
        {isDesktop ? (
          <button type="button">
            <span>환경설정</span>
            <SettingsIcon />
          </button>
        ) : (
          <Anchor href="/settings">
            <span>환경설정</span>
            <SettingsIcon />
          </Anchor>
        )}
      </div>
    </Container>
  );
}
