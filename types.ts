export interface GeocodeResponse {
  result: {
    resultdata: Array<{
      sido_nm: string;
      sgg_nm: string;
      road_nm: string;
      road_nm_main_no: string;
      adm_nm: string;
      y: string;
      x: string;
    }>;
  };
  error?: string;
}

export interface AddressData {
  sido_nm: string;
  sgg_nm: string;
  road_nm: string;
  road_nm_main_no: string;
  adm_nm: string;
  y: string;
  x: string;
}

export interface WeatherData {
  current: {
    last_updated: string;
    temp_c: number;
    feelslike_c: number;
    is_day: number;
    wind_kph: number;
    gust_kph: number;
    precip_mm: number;
    humidity: number;
    wind_dir: string;
    air_quality: {
      pm2_5: number;
      pm10: number;
    };
    condition: {
      code: number;
      icon: string;
      text: string;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: number;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        is_day: number;
        gust_kph: number;
        wind_dir: string;
        precip_mm: number;
        humidity: number;
        feelslike_c: number;
        dewpoint_c: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        vis_km: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      }>;
    }>;
  };
}

interface VariationColors {
  day: string;
  night: string;
}

export interface VariationMap {
  [code: number]: VariationColors;
}

export interface ConditionsMap {
  [key: string]: string;
}

export interface WeatherProgressBarProps {
  minTemp: number;
  maxTemp: number;
  colorItems?: string;
}

export interface SunrisesetProgressBarProps {
  sunriseTime: string;
  sunsetTime: string;
}

export interface WeatherState {
  data: WeatherData | undefined;
  isDataLoaded: boolean;
}

export type StyleProps = {
  gradientItems?: string;
  colorItems?: string;
  getStatus?: string;
  isDay?: number;
};
