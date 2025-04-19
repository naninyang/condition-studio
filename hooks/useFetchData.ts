import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { addressAtom, weatherAtom } from '@/state/atoms';
import { GeocodeResponse } from '@/types';

const useFetchData = (initialAddress: string) => {
  const setWeatherData = useSetAtom(weatherAtom);
  const setAddressData = useSetAtom(addressAtom);

  useEffect(() => {
    async function fetchData() {
      try {
        if (initialAddress !== '') {
          const geocodeResponse = await fetch(`/api/geocode?address=${initialAddress}`);
          const geocodeData: GeocodeResponse = await geocodeResponse.json();
          if (geocodeData.result.resultdata.length > 0) {
            const { y: latitude, x: longitude } = geocodeData.result.resultdata[0];
            setAddressData({ ...geocodeData.result.resultdata[0] });

            const weatherResponse = await fetch(`/api/weather?q=${latitude},${longitude}&days=14`);
            const weatherData = await weatherResponse.json();
            setWeatherData(weatherData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [initialAddress, setWeatherData, setAddressData]);
};

export default useFetchData;
