import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { addressState, weatherState } from '@/state/atoms';
import { GeocodeResponse } from '@/types';

const useFetchData = (initialAddress: string) => {
  const setWeatherData = useSetRecoilState(weatherState);
  const setAddressData = useSetRecoilState(addressState);

  useEffect(() => {
    async function fetchData() {
      try {
        const geocodeResponse = await fetch(`/api/geocode?address=${initialAddress}`);
        const geocodeData: GeocodeResponse = await geocodeResponse.json();
        if (geocodeData.result.resultdata.length > 0) {
          const { y: latitude, x: longitude } = geocodeData.result.resultdata[0];
          setAddressData({ ...geocodeData.result.resultdata[0] });

          const weatherResponse = await fetch(`/api/weather?q=${latitude},${longitude}&days=14`);
          const weatherData = await weatherResponse.json();
          setWeatherData(weatherData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [setWeatherData, setAddressData, initialAddress]);
};

export default useFetchData;
