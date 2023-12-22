import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { StyleProps } from '@/types';
import useFetchData from '@/hooks/useFetchData';
import gradients from '@/components/Gradiants';
import conditions from '@/components/Conditions';
import { getPm10Status, getPm25Status } from '@/components/Polutions';
import colors from '@/components/Colors';
import styles from '@/styles/Home.module.sass';
import { useRecoilValue } from 'recoil';
import { addressState, weatherState } from '@/state/atoms';

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
  const weatherData = useRecoilValue(weatherState);

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
              <div>
                <dt>최고/최저 기온</dt>
                <dd>
                  <div>
                    <i className="icon" aria-hidden>
                      @
                    </i>
                    <span>
                      <strong>기온</strong>
                      <em>
                        {weatherData.forecast.forecastday[0].day.maxtemp_c} °C /{' '}
                        {weatherData.forecast.forecastday[0].day.mintemp_c} °C
                      </em>
                    </span>
                  </div>
                </dd>
              </div>
              {weatherData.current.precip_mm !== 0 && (
                <div>
                  <dt>강수량/비올확률</dt>
                  <dd>
                    <div>
                      <i className="icon" aria-hidden>
                        `
                      </i>
                      <span>
                        <strong>강수량 (비올 확률)</strong>
                        <em>
                          {weatherData.current.precip_mm} mm (
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_rain} %)
                        </em>
                      </span>
                    </div>
                  </dd>
                </div>
              )}
              {weatherData.forecast.forecastday[0].day.totalsnow_cm !== 0 && (
                <div>
                  <dt>적설량/눈내릴확률</dt>
                  <dd>
                    <div>
                      <i className="icon" aria-hidden>
                        .
                      </i>
                      <span>
                        <strong>적설량 (눈 내릴 확률)</strong>
                        <em>
                          {weatherData.forecast.forecastday[0].day.totalsnow_cm} cm (
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_snow} %)
                        </em>
                      </span>
                    </div>
                  </dd>
                </div>
              )}
              {weatherData.forecast.forecastday[0].day.daily_will_it_rain !== 0 &&
                weatherData.forecast.forecastday[0].day.daily_will_it_snow !== 0 && (
                  <div>
                    <dt>비와 눈이 내린다</dt>
                    <dd>
                      <div>
                        <i className="icon" aria-hidden>
                          &#123;
                        </i>
                        <span>
                          <em>비도 오고 눈도 와요.</em>
                        </span>
                      </div>
                    </dd>
                  </div>
                )}
              {(weatherData.forecast.forecastday[0].day.daily_will_it_rain !== 0 ||
                weatherData.forecast.forecastday[0].day.daily_will_it_snow !== 0) && (
                <div>
                  <dt>비 또는 비가 내린다</dt>
                  <dd>
                    <div>
                      <i className="icon" aria-hidden>
                        &#123;
                      </i>
                      <span>
                        <em>
                          {weatherData.forecast.forecastday[0].day.daily_will_it_rain !== 0 && '비가 주륵주륵'}
                          {weatherData.forecast.forecastday[0].day.daily_will_it_snow !== 0 && '눈이 펑펑'}
                        </em>
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
              <div>
                <dt>가시거리</dt>
                <dd>
                  <div>
                    <i className="icon" aria-hidden>
                      $
                    </i>
                    <span>
                      <strong>가시거리</strong>
                      <em>{weatherData.forecast.forecastday[0].day.avgvis_km} Km</em>
                    </span>
                  </div>
                </dd>
              </div>
            </dl>
          )}
        </section>
      )}
    </main>
  );
}
