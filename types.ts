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
    temp_c: number;
    feelslike_c: number;
    is_day: number;
    wind_kph: number;
    precip_mm: number;
    humidity: number;
    pm2_5: number;
    pm10: number;
    text: string;
    icon: string;
    code: number;
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

export type StyleProps = {
  gradientItems?: string;
  colorItems?: string;
  getStatus?: string;
};
