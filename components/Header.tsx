import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { addressState } from '@/state/atoms';
import { getAddressFromDB } from '@/utils/indexedDB';
import { icons } from '@/icons';
import Anchor from './Anchor';
import styles from '@/styles/Home.module.sass';

const RefreshIcon = styled.i({
  background: `url(${icons.ux.refresh}) no-repeat 50% 50%/contain`,
});

const SettingsIcon = styled.i({
  background: `url(${icons.ux.settings}) no-repeat 50% 50%/contain`,
});

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

  return (
    <header>
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
        <Anchor href="/settings">
          <span>환경설정</span>
          <SettingsIcon />
        </Anchor>
      </div>
    </header>
  );
}
