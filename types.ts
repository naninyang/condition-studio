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
}

export interface GradientColors {
  day: string;
  night: string;
}

export interface GradientMap {
  [code: number]: GradientColors;
}

export interface ConditionsMap {
  [key: string]: string;
}
