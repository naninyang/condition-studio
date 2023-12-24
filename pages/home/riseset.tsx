import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { SunrisesetProgressBarProps, StyleProps } from '@/types';
import { addressState, weatherState } from '@/state/atoms';
import useFetchData from '@/hooks/useFetchData';
import { getAddressFromDB } from '@/utils/indexedDB';
import colors from '@/components/Colors';
import styles from '@/styles/Home.module.sass';
import MoonName from '@/components/Moon';
import Footer from '@/components/Footer';

const Icon = styled.i<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

export default function Riseset() {
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

  function formatTime(timeString: string) {
    const todayDateString = new Date().toDateString();
    const time = new Date(`${todayDateString} ${timeString}`);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(time);
  }

  const [seoulTime, setSeoulTime] = useState<string>('');
  useEffect(() => {
    const now = new Date();
    const seoulTimeFormatted = new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(now);
    setSeoulTime(seoulTimeFormatted);
  }, []);

  const [sunTimeVisible, setSunTimeVisible] = useState<boolean>(false);
  useEffect(() => {
    if (!weatherData) return;
    const todayDateString = new Date().toDateString();
    const now = new Date();

    const sunrise = weatherData && new Date(`${todayDateString} ${weatherData.forecast.forecastday[0].astro.sunrise}`);
    const sunset = weatherData && new Date(`${todayDateString} ${weatherData.forecast.forecastday[0].astro.sunset}`);

    const originTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(now);

    const originDate = new Date(`${todayDateString} ${originTime}`);
    const isBetween = originDate >= sunrise && originDate <= sunset;

    setSunTimeVisible(isBetween);
  }, [weatherData]);

  const SunrisesetProgressBar: React.FC<SunrisesetProgressBarProps> = ({ sunriseTime, sunsetTime }) => {
    const todayDateString = new Date().toDateString();
    const sunriseString = new Date(`${todayDateString} ${sunriseTime}`);
    const sunsetString = new Date(`${todayDateString} ${sunsetTime}`);
    const now = new Date();

    const totalDuration = sunsetString.getTime() - sunriseString.getTime();
    const currentTimePosition = now.getTime() - sunriseString.getTime();

    const ratio = Math.min(Math.max(currentTimePosition / totalDuration, 0), 1);

    return (
      <div className={styles.progress}>
        <div
          className={styles.bar}
          style={{
            width: `${ratio * 100}%`,
            backgroundColor: '#FF4E50',
          }}
        >
          <i className="icon" style={{ color: '#FF4E50' }} aria-hidden>
            /
          </i>
          <span style={{ color: '#FF4E50' }}>{seoulTime}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {addressData && (
        <section className={styles.riseset}>
          {weatherData && weatherData.forecast.forecastday[0] && (
            <div className={styles.contain}>
              <div className={`${styles.sun} ${styles.module}`}>
                <h2>일출, 일몰</h2>
                <div className={styles.list}>
                  <dl>
                    <div>
                      <dt>일출</dt>
                      <dd style={{ color: '#FF4E50' }}>
                        {formatTime(weatherData.forecast.forecastday[0].astro.sunrise)}
                      </dd>
                    </div>
                    <div className={styles.now}>
                      <dt>현재시각</dt>
                      <dd>
                        {sunTimeVisible ? (
                          <SunrisesetProgressBar
                            sunriseTime={weatherData.forecast.forecastday[0].astro.sunrise}
                            sunsetTime={weatherData.forecast.forecastday[0].astro.sunset}
                          />
                        ) : (
                          <div className={styles.progress}>
                            <span>{seoulTime}</span>
                          </div>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>일몰</dt>
                      <dd style={{ color: '#FF4E50' }}>
                        {formatTime(weatherData.forecast.forecastday[0].astro.sunset)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className={`${styles.moon} ${styles.module}`}>
                <h2>달.달. 무슨 달 ♪ {MoonName(weatherData.forecast.forecastday[0].astro.moon_phase)}</h2>
                <div className={styles.list}>
                  {weatherData.forecast.forecastday[0].astro.moon_illumination >= 25 && (
                    <Icon className="icon" colorItems={'#000080'} aria-hidden>
                      {weatherData.forecast.forecastday[0].astro.moon_illumination >= 25 &&
                        weatherData.forecast.forecastday[0].astro.moon_illumination < 49 &&
                        `'`}
                      {weatherData.forecast.forecastday[0].astro.moon_illumination >= 50 &&
                        weatherData.forecast.forecastday[0].astro.moon_illumination < 74 &&
                        ')'}
                      {weatherData.forecast.forecastday[0].astro.moon_illumination >= 75 &&
                        weatherData.forecast.forecastday[0].astro.moon_illumination <= 100 &&
                        '*'}
                    </Icon>
                  )}
                  <dl>
                    {MoonName(weatherData.forecast.forecastday[0].astro.moon_phase) === '부채꼴달' && (
                      <div>
                        <dt>달의 위상</dt>
                        <dd style={{ color: '#000080' }}>상현망간의 달</dd>
                      </div>
                    )}
                    {MoonName(weatherData.forecast.forecastday[0].astro.moon_phase) === '열매달' && (
                      <div>
                        <dt>달의 위상</dt>
                        <dd style={{ color: '#000080' }}>상현망간의 달</dd>
                      </div>
                    )}
                    <div>
                      <dt>달의 면적</dt>
                      <dd style={{ color: '#000080' }}>
                        {weatherData.forecast.forecastday[0].astro.moon_illumination} %
                      </dd>
                    </div>
                    <div>
                      <dt>월몰 시간</dt>
                      <dd style={{ color: '#000080' }}>
                        {formatTime(weatherData.forecast.forecastday[0].astro.moonset)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </section>
      )}
    </>
  );
}
