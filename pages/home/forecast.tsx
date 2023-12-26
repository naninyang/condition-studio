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

const Icon = styled.i<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

const Unit = styled.em<StyleProps>(({ colorItems }) => ({
  color: `${colorItems}`,
}));

export default function Forecast() {
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

  const WeatherProgressBar: React.FC<WeatherProgressBarProps> = ({ minTemp, maxTemp, colorItems }) => {
    const totalMinTemp = Math.min(...weatherData.forecast.forecastday.map((day) => day.day.mintemp_c));
    const totalMaxTemp = Math.max(...weatherData.forecast.forecastday.map((day) => day.day.maxtemp_c));

    const minPercentage = ((minTemp - totalMinTemp) / (totalMaxTemp - totalMinTemp)) * 100;
    const maxPercentage = ((maxTemp - totalMinTemp) / (totalMaxTemp - totalMinTemp)) * 100;

    return (
      <div className={styles.progress}>
        <div
          className={styles.bar}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
            backgroundColor: `${colorItems}`,
          }}
        />
      </div>
    );
  };

  return (
    <section className={styles.forecast}>
      {addressData && weatherData && (
        <div className={styles.contain}>
          <div className={`${styles.hour} ${styles.module}`}>
            <h2>시간대별 날씨예보</h2>
            <div className={styles.list}>
              <dl>
                {weatherData.forecast.forecastday.map((dayItem, dayIndex) => (
                  <React.Fragment key={`day${dayIndex}`}>
                    {dayItem.hour
                      .filter((hourItem) => new Date(hourItem.time) >= getCurrentTime())
                      .map((hourItem, hourIndex) => (
                        <div key={hourIndex}>
                          <dt>
                            <span>{formatTime(hourItem.time)}</span>
                          </dt>
                          <dd>
                            <div className={styles.temp}>
                              {iconCode && colorItems && (
                                <Icon className="icon" colorItems={colorItems} aria-hidden>
                                  {getIcon(hourItem.is_day, parseInt(iconCode))}
                                </Icon>
                              )}
                              <span>
                                <strong>{hourItem.condition.text}</strong>
                                {colorItems && <Unit colorItems={colorItems}>{hourItem.temp_c} °C</Unit>}
                              </span>
                            </div>
                            <div className={styles.misc}>
                              <ul>
                                <li aria-label="체감온도">{hourItem.feelslike_c} °C</li>
                                <li aria-label="풍향 및 풍속">
                                  {hourItem.wind_dir} {(hourItem.gust_kph / 3.6).toFixed(1)} m/s
                                </li>
                                <li aria-label="습도">{hourItem.humidity} %</li>
                              </ul>
                            </div>
                          </dd>
                        </div>
                      ))}
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </div>
          <div className={`${styles.day} ${styles.module}`}>
            <h2>{weatherData.forecast.forecastday.length}일간의 일기예보</h2>
            <div className={styles.list}>
              <dl>
                {weatherData.forecast.forecastday.map((item, index) => (
                  <div key={index}>
                    <dt>
                      <span>
                        <strong>{formatDay(item.date)}</strong> <em>{formatWeekday(item.date)}</em>
                      </span>
                    </dt>
                    <dd>
                      <div className={styles.temp}>
                        {iconCode && colorItems && (
                          <>
                            <Icon className="icon" colorItems={colorItems} aria-hidden>
                              {getIcon(1, parseInt(iconCode))}
                            </Icon>
                            <em>{item.day.condition.text}</em>
                          </>
                        )}
                        <span aria-label="최저기온">
                          {colorItems && <Unit colorItems={colorItems}>{item.day.mintemp_c} °C</Unit>}
                        </span>
                        <WeatherProgressBar
                          minTemp={item.day.mintemp_c}
                          maxTemp={item.day.maxtemp_c}
                          colorItems={colorItems}
                        />
                        <span aria-label="최고기온">
                          {colorItems && <Unit colorItems={colorItems}>{item.day.maxtemp_c} °C</Unit>}
                        </span>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
