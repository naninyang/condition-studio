import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { addressAtom, weatherAtom } from '@/state/atoms';
import { getAddressFromDB } from '@/utils/indexedDB';
import { StyleProps } from '@/types';
import Anchor from './Anchor';
import colors from './Colors';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/Home.module.sass';
import { IconUxRefresh, IconUxSettings } from './icons';

const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const Container = styled.header<StyleProps>(({ colorItems }) => ({
  backgroundColor: colorItems ? `rgba(${hexToRgb(colorItems)},.2)` : undefined,
}));

const RefreshIcon = styled.i({
  background: `url(${IconUxRefresh.src}) no-repeat 50% 50%/contain`,
});

const SettingsIcon = styled.i({
  background: `url(${IconUxSettings.src}) no-repeat 50% 50%/contain`,
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

  const addressData = useAtomValue(addressAtom);
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

  const weatherData = useAtomValue(weatherAtom);
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
          <Anchor href="/settings/location">
            <span>환경설정</span>
            <SettingsIcon />
          </Anchor>
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
