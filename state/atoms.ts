import { atom } from 'recoil';
import { AddressData, WeatherData } from '@/types';

export const weatherState = atom<WeatherData>({
  key: 'weatherState',
  default: undefined,
});

export const addressState = atom<AddressData>({
  key: 'addressState',
  default: undefined,
});
