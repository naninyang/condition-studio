import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { weatherState } from '@/state/atoms';
import { getAddressFromDB } from '@/utils/indexedDB';
import { StyleProps } from '@/types';
import gradients from '@/components/Gradiants';
import conditions from '@/components/Conditions';

const Background = styled.div<StyleProps>(({ gradientItems }) => ({
  background: `radial-gradient(farthest-side at 100% 100%,${gradientItems})`,
}));

export default function Backgrounds() {
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

  const getGradient = (code: number, isDay: number): string => {
    const gradient = gradients[code] || gradients[1000];
    return isDay ? gradient.day : gradient.night;
  };
  const gradientItems = weatherData && getGradient(weatherData.current.condition.code, weatherData.current.is_day);

  const getIcon = (isDay: number, iconCode: number): string => {
    return conditions[`${isDay}_${iconCode}`];
  };

  return (
    <>
      {gradientItems ? (
        <Background className="background" gradientItems={gradientItems} />
      ) : (
        <p className="loading">
          <span>로딩 중</span>
          <i />
        </p>
      )}
      {iconCode && (
        <div className="background-condition">
          <i className="icon" aria-hidden>
            {getIcon(weatherData.current.is_day, parseInt(iconCode))}
          </i>
        </div>
      )}
    </>
  );
}
