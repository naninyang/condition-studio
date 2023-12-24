import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { StyleProps } from '@/types';
import { addressState, weatherState } from '@/state/atoms';
import useFetchData from '@/hooks/useFetchData';
import { getAddressFromDB } from '@/utils/indexedDB';
import colors from '@/components/Colors';
import WindDirection from '@/components/Wind';
import styles from '@/styles/Home.module.sass';

const Icon = styled.i<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

const Unit = styled.em<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

export default function Everything() {
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

  const getColors = (code: number, isDay: number): string => {
    const color = colors[code] || colors[1000];
    return isDay ? color.day : color.night;
  };
  const colorItems = weatherData && getColors(weatherData.current.condition.code, weatherData.current.is_day);

  return (
    <>
      {addressData && (
        <section className={styles.everything}>
          {weatherData && (
            <div className={styles.contain}>
              <div className={`${styles.primary} ${styles.module}`}>
                <h2>바람 정보</h2>
                <div className={styles.list}>
                  <Icon className="icon" colorItems={colorItems} aria-hidden>
                    |
                  </Icon>
                  <dl>
                    {weatherData.current && (
                      <>
                        <div>
                          <dt>풍향</dt>
                          <dd style={{ color: colorItems }}>{WindDirection(weatherData.current.wind_dir)}</dd>
                        </div>
                        <div>
                          <dt>바람</dt>
                          <dd style={{ color: colorItems }}>{(weatherData.current.wind_kph / 3.6).toFixed(1)} m/s</dd>
                        </div>
                        <div>
                          <dt>돌풍</dt>
                          <dd style={{ color: colorItems }}>{(weatherData.current.gust_kph / 3.6).toFixed(1)} m/s</dd>
                        </div>
                      </>
                    )}
                    {weatherData.forecast.forecastday[0] && (
                      <div>
                        <dt>최고 풍속</dt>
                        <dd style={{ color: colorItems }}>
                          {(weatherData.forecast.forecastday[0].day.maxwind_kph / 3.6).toFixed(1)} m/s
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              <div className={`${styles.primary} ${styles.module}`}>
                <h2>습도 정보</h2>
                <div className={styles.list}>
                  <Icon className="icon" colorItems={colorItems} aria-hidden>
                    -
                  </Icon>
                  <dl>
                    {weatherData.current && (
                      <>
                        <div>
                          <dt>습도</dt>
                          <dd style={{ color: colorItems }}>{weatherData.current.humidity} %</dd>
                        </div>
                      </>
                    )}
                    {weatherData.forecast.forecastday[0] && (
                      <div>
                        <dt>평균 습도</dt>
                        <dd style={{ color: colorItems }}>{weatherData.forecast.forecastday[0].day.avghumidity} %</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              {weatherData.forecast.forecastday[0] && (
                <div className={`${styles.secondary} ${styles.module}`}>
                  <h2>눈, 비 정보</h2>
                  <div className={styles.list}>
                    <Icon className="icon" colorItems={colorItems} aria-hidden>
                      .
                    </Icon>
                    <dl>
                      <div>
                        <dt>눈 올 확률</dt>
                        <dd style={{ color: colorItems }}>
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_snow} %
                        </dd>
                      </div>
                      <div>
                        <dt>적설량</dt>
                        <dd style={{ color: colorItems }}>{weatherData.forecast.forecastday[0].day.totalsnow_cm} cm</dd>
                      </div>
                    </dl>
                  </div>
                  <div className={styles.list}>
                    <Icon className="icon" colorItems={colorItems} aria-hidden>
                      `
                    </Icon>
                    <dl>
                      <div>
                        <dt>비 올 확률</dt>
                        <dd style={{ color: colorItems }}>
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_rain} %
                        </dd>
                      </div>
                      <div>
                        <dt>강수/강우량</dt>
                        <dd style={{ color: colorItems }}>
                          {weatherData.forecast.forecastday[0].day.totalprecip_mm} mm
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
