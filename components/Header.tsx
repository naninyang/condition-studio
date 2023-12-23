import React, { useState, useEffect } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { useRecoilValue } from 'recoil';
import { addressState } from '@/state/atoms';

export default function Header() {
  const [seoulDate, setSeoulDate] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');

  useFetchData('서울 중구 을지로 12');

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

  const addressData = useRecoilValue(addressState);

  return (
    <header>
      <h1>컨디션 스튜디오</h1>
      <p>
        <span>
          {seoulDate} {seoulTime}
        </span>{' '}
        {addressData.sido_nm} {addressData.sgg_nm} {addressData.adm_nm}
      </p>
    </header>
  );
}
