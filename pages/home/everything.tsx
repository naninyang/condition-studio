import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { StyleProps } from '@/types';
import { addressState, weatherState } from '@/state/atoms';
import useFetchData from '@/hooks/useFetchData';
import conditions from '@/components/Conditions';
import colors from '@/components/Colors';
import WindDirection from '@/components/Wind';
import Header from '@/components/Header';
import styles from '@/styles/Home.module.sass';

const Icon = styled.i<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

const Unit = styled.em<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

export default function Everything() {
  useFetchData('서울 중구 을지로 12');
  const addressData = useRecoilValue(addressState);
  const weatherData = useRecoilValue(weatherState);

  const originalIconUrl = weatherData?.current.condition.icon;
  const iconCode = originalIconUrl ? originalIconUrl.split('/').pop()?.split('.')[0] : undefined;

  const getColors = (code: number, isDay: number): string => {
    const color = colors[code] || colors[1000];
    return isDay ? color.day : color.night;
  };
  const colorItems = weatherData && getColors(weatherData.current.condition.code, weatherData.current.is_day);

  const getIcon = (isDay: number, iconCode: number): string => {
    return conditions[`${isDay}_${iconCode}`];
  };

  function formatTime(timeString: string) {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      hour12: true,
    }).format(date);
  }

  function formatWeekday(weekdayString: string) {
    const date = new Date(weekdayString);
    return new Intl.DateTimeFormat('ko-KR', {
      weekday: 'short',
    }).format(date);
  }

  function formatDay(dayString: string) {
    const date = new Date(dayString);
    return new Intl.DateTimeFormat('ko-KR', {
      day: 'numeric',
    }).format(date);
  }

  const getCurrentTime = () => {
    return new Date();
  };

  return (
    <>
      {addressData && (
        <section className={styles.everything}>
          <Header />
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
                <div className={styles['primary-list']}>
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
