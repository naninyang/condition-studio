import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { StyleProps, WeatherProgressBarProps } from '@/types';
import { addressState, weatherState } from '@/state/atoms';
import useFetchData from '@/hooks/useFetchData';
import { getAddressFromDB } from '@/utils/indexedDB';
import conditions from '@/components/Conditions';
import colors from '@/components/Colors';
import styles from '@/styles/Home.module.sass';

export default function Update() {
  const addressData = useRecoilValue(addressState);
  const weatherData = useRecoilValue(weatherState);
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

  function formatDay(dayString: string) {
    const date = new Date(dayString);
    return new Intl.DateTimeFormat('ko-KR', {
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      hour12: true,
    }).format(date);
  }

  return (
    <section className={styles.update}>
      {addressData && weatherData && (
        <div className={styles.contain}>
          <div className={styles.module}>
            <h2>날씨 및 (초)미세먼지 정보 업데이트 시간</h2>
            <p>API 상태에 따라서 실제정보와 조금 다를 수 있습니다.</p>
            <div className={styles.list}>
              <dl>
                <div>
                  <dt>모든 날씨 및 (초)미세먼지</dt>
                  <dd>{formatDay(weatherData.current.last_updated)}</dd>
                </div>
                <div>
                  <dt>GPS 위치 데이터 제공</dt>
                  <dd>통계청 - SGIS</dd>
                </div>
                <div>
                  <dt>날씨 및 (초)미세먼지 데이터 제공</dt>
                  <dd>Weather API - weatherapi.com</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
