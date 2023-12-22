import { AddressData, WeatherData } from '@/types';
import { atom } from 'recoil';

export const weatherState = atom<WeatherData>({
  key: 'weatherState',
  default: undefined,
});

export const addressState = atom<AddressData>({
  key: 'addressState',
  default: undefined,
});
