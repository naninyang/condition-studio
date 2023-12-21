import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AddressData, GeocodeResponse, StyleProps, WeatherData } from '@/types';
import gradients from '@/components/Gradiants';
import styles from '@/styles/Home.module.sass';
import conditions from '@/components/Conditions';
import { getPm10Status, getPm25Status } from '@/components/Polutions';
import colors from '@/components/Colors';

const Background = styled.div<StyleProps>(({ gradientItems }) => ({
  background: `radial-gradient(farthest-side at 100% 100%,${gradientItems})`,
}));

const Icon = styled.i<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

const AirIcon = styled.i<StyleProps>(({ getStatus }) => ({
  backgroundImage: `url(${getStatus})`,
}));

const Unit = styled.em<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

export default function Home() {
  const [seoulDate, setSeoulDate] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const initialAddress = '서울 중구 을지로 12';

  useEffect(() => {
    const now = new Date();
    const seoulDateFormatted = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  useEffect(() => {
    async function fetchData() {
      try {
        const geocodeResponse = await fetch(`/api/geocode?address=${initialAddress}`);
        const geocodeData: GeocodeResponse = await geocodeResponse.json();
        if (geocodeData.result.resultdata.length > 0) {
          const { y: latitude, x: longitude } = geocodeData.result.resultdata[0];
          setAddressData({ ...geocodeData.result.resultdata[0] });

          const weatherResponse = await fetch(`/api/weather?q=${latitude},${longitude}`);
          const weatherData = await weatherResponse.json();
          setWeatherData(weatherData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const originalIconUrl = weatherData?.current.condition.icon;
  const iconCode = originalIconUrl ? originalIconUrl.split('/').pop()?.split('.')[0] : undefined;

  const getGradient = (code: number, isDay: number): string => {
    const gradient = gradients[code] || gradients[1000];
    return isDay ? gradient.day : gradient.night;
  };
  const gradientItems = weatherData && getGradient(weatherData.current.condition.code, weatherData.current.is_day);

  const getColors = (code: number, isDay: number): string => {
    const color = colors[code] || colors[1000];
    return isDay ? color.day : color.night;
  };
  const colorItems = weatherData && getColors(weatherData.current.condition.code, weatherData.current.is_day);

  const getIcon = (isDay: number, iconCode: number): string => {
    return conditions[`${isDay}_${iconCode}`];
  };

  return (
    <main className={styles.main}>
      {gradientItems ? (
        <Background className={styles.background} gradientItems={gradientItems} />
      ) : (
        <p className={styles.loading}>
          <span>로딩 중</span>
          <i />
        </p>
      )}
      {addressData && (
        <section>
          <header>
            <p>
              <span>
                {seoulDate} {seoulTime}
              </span>{' '}
              {addressData.sido_nm} {addressData.sgg_nm} {addressData.adm_nm}
            </p>
          </header>
          {weatherData && (
            <dl>
              <div>
                <dt>날씨 컨디션</dt>
                <dd>
                  <div>
                    {iconCode && colorItems && (
                      <Icon className="icon" colorItems={colorItems} aria-hidden>
                        {getIcon(weatherData.current.is_day, parseInt(iconCode))}
                      </Icon>
                    )}
                    <span>
                      <strong>{weatherData.current.condition.text}</strong>
                      {colorItems && <Unit colorItems={colorItems}>{weatherData.current.temp_c} °C</Unit>}
                    </span>
                  </div>
                </dd>
              </div>
              {weatherData.current.precip_mm !== 0 && (
                <div>
                  <dt>강수량</dt>
                  <dd>
                    <div>
                      <i className="icon" aria-hidden>
                        `
                      </i>
                      <span>
                        <strong>강수량</strong>
                        <em>{weatherData.current.precip_mm} mm</em>
                      </span>
                    </div>
                  </dd>
                </div>
              )}
              <div>
                <dt>습도</dt>
                <dd>
                  <div>
                    <i className="icon" aria-hidden>
                      -
                    </i>
                    <span>
                      <strong>습도</strong>
                      <em>{weatherData.current.humidity} %</em>
                    </span>
                  </div>
                </dd>
              </div>
              <div>
                <dt>(초)미세먼지</dt>
                <dd>
                  <div>
                    <AirIcon getStatus={getPm10Status(weatherData.current.air_quality.pm10).icon} />
                    <span>
                      <strong>미세먼지 {getPm10Status(weatherData.current.air_quality.pm10).text}</strong>
                      {colorItems && (
                        <Unit colorItems={getPm10Status(weatherData.current.air_quality.pm10).color}>
                          {weatherData.current.air_quality.pm10} ㎍/㎥
                        </Unit>
                      )}
                    </span>
                  </div>
                  <div>
                    <AirIcon getStatus={getPm25Status(weatherData.current.air_quality.pm2_5).icon} />
                    <span>
                      <strong>초미세먼지 {getPm25Status(weatherData.current.air_quality.pm2_5).text}</strong>
                      {colorItems && (
                        <Unit colorItems={getPm25Status(weatherData.current.air_quality.pm2_5).color}>
                          {weatherData.current.air_quality.pm2_5} ㎍/㎥
                        </Unit>
                      )}
                    </span>
                  </div>
                </dd>
              </div>
              {iconCode && (
                <div className={styles['background-condition']}>
                  <i className="icon" aria-hidden>
                    {getIcon(weatherData.current.is_day, parseInt(iconCode))}
                  </i>
                </div>
              )}
            </dl>
          )}
        </section>
      )}
    </main>
  );
}
