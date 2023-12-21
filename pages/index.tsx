import React, { useState, useEffect } from 'react';
import { AddressData, GeocodeResponse, WeatherData } from '@/types';
import gradients from '@/components/Gradiants';
import styles from '@/styles/Home.module.sass';
import conditions from '@/components/Conditions';
import { getPm10Status, getPm25Status } from '@/components/Polutions';
import colors from '@/components/Colors';

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
  const gradientItems = weatherData && getGradient(weatherData.current.code, weatherData.current.is_day);

  const getColors = (code: number, isDay: number): string => {
    const color = colors[code] || colors[1000];
    return isDay ? color.day : color.night;
  };
  const colorItems = weatherData && getColors(weatherData.current.code, weatherData.current.is_day);

  const getIcon = (isDay: number, iconCode: number): string => {
    return conditions[`${isDay}_${iconCode}`];
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.background}
        style={{ background: `radial-gradient(farthest-side at 100% 100%,${gradientItems})` }}
      />
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
                    {iconCode && (
                      <i className="icon" style={{ color: `${colorItems}` }} aria-hidden>
                        {getIcon(weatherData.current.is_day, parseInt(iconCode))}
                      </i>
                    )}
                    <span>
                      <strong>{weatherData.current.condition.text}</strong>
                      <em style={{ color: `${colorItems})` }}>{weatherData.current.temp_c} °C</em>
                    </span>
                  </div>
                </dd>
              </div>
              <div>
                <dt>(초)미세먼지</dt>
                <dd>
                  <div>
                    <i
                      style={{ backgroundImage: `url(${getPm10Status(weatherData.current.air_quality.pm10).icon})` }}
                    />
                    <span>
                      <strong>미세먼지 {getPm10Status(weatherData.current.air_quality.pm10).text}</strong>
                      <em
                        style={{
                          color: getPm10Status(weatherData.current.air_quality.pm10).color,
                        }}
                      >
                        {weatherData.current.air_quality.pm10} ㎍/㎥
                      </em>
                    </span>
                  </div>
                  <div>
                    <i
                      style={{ backgroundImage: `url(${getPm10Status(weatherData.current.air_quality.pm2_5).icon})` }}
                    />
                    <span>
                      <strong>초미세먼지 {getPm25Status(weatherData.current.air_quality.pm2_5).text}</strong>
                      <em
                        style={{
                          color: getPm25Status(weatherData.current.air_quality.pm2_5).color,
                        }}
                      >
                        {weatherData.current.air_quality.pm2_5} ㎍/㎥
                      </em>
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
