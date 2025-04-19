import { atom } from 'jotai';
import { AddressData, WeatherData } from '@/types';

export const weatherAtom = atom<WeatherData | undefined>(undefined);
export const addressAtom = atom<AddressData | undefined>(undefined);
