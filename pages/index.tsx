import React, { useState, useEffect } from 'react';
import { AddressData, GeocodeResponse, GradientMap, WeatherData } from '@/types';
import gradients from '@/components/Gradiants';
import styles from '@/styles/Home.module.sass';
import conditions from '@/components/Conditions';
import { getPm10Status, getPm25Status } from '@/components/Polutions';

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
      second: 'numeric',
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
          setWeatherData({
            temp_c: weatherData.current.temp_c,
            feelslike_c: weatherData.current.feelslike_c,
            is_day: weatherData.current.is_day,
            wind_kph: weatherData.current.wind_kph,
            precip_mm: weatherData.current.precip_mm,
            humidity: weatherData.current.humidity,
            pm2_5: weatherData.current.air_quality.pm2_5,
            pm10: weatherData.current.air_quality.pm10,
            text: weatherData.current.condition.text,
            icon: weatherData.current.condition.icon,
            code: weatherData.current.condition.code,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const originalIconUrl = weatherData?.icon;
  const iconCode = originalIconUrl ? originalIconUrl.split('/').pop()?.split('.')[0] : undefined;

  const getGradient = (code: number, isDay: number): string => {
    const gradient = gradients[code] || gradients[1000];
    return isDay ? gradient.day : gradient.night;
  };

  const gradientItems = weatherData && getGradient(weatherData.code, weatherData.is_day);
  const getResult = (isDay: number, iconCode: number): string => {
    return conditions[`${isDay}_${iconCode}`];
  };

  return (
    <main className={styles.main}>
      <div className={styles.background} style={{ background: `linear-gradient(-135deg, ${gradientItems})` }} />
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
                    <i
                      className="icon"
                      style={{ background: `linear-gradient(-135deg, ${gradientItems})` }}
                      aria-hidden
                    >
                      {iconCode && getResult(weatherData.is_day, parseInt(iconCode))}
                    </i>
                    <span>
                      <strong>{weatherData.text}</strong>
                      <em style={{ background: `linear-gradient(-135deg, ${gradientItems})` }}>
                        {weatherData.temp_c} °C
                      </em>
                    </span>
                  </div>
                </dd>
              </div>
              <div>
                <dt>(초)미세먼지</dt>
                <dd>
                  <div>
                    <span>
                      <strong style={{ color: getPm10Status(weatherData.pm10).color }}>
                        미세먼지 {getPm10Status(weatherData.pm10).text}
                      </strong>
                      <em
                        style={{
                          background: `linear-gradient(-135deg, ${gradientItems})`,
                        }}
                      >
                        {weatherData.pm10} ㎍/㎥
                      </em>
                    </span>
                  </div>
                  <div>
                    <span>
                      <strong style={{ color: getPm25Status(weatherData.pm2_5).color }}>
                        초미세먼지 {getPm25Status(weatherData.pm2_5).text}
                      </strong>
                      <em
                        style={{
                          background: `linear-gradient(-135deg, ${gradientItems})`,
                        }}
                      >
                        {weatherData.pm2_5} ㎍/㎥
                      </em>
                    </span>
                  </div>
                </dd>
              </div>
              <div className={styles['background-condition']}>
                <i className="icon" aria-hidden>
                  {iconCode && getResult(weatherData.is_day, parseInt(iconCode))}
                </i>
              </div>
            </dl>
          )}
        </section>
      )}
    </main>
  );
}
