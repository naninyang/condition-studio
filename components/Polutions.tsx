import {
  IconAirLv1,
  IconAirLv2,
  IconAirLv3,
  IconAirLv4,
  IconAirLv5,
  IconAirLv6,
  IconAirLv7,
  IconAirLv8,
} from './icons';

export function getPm10Status(pm10: number): { text: string; color: string; icon: string } {
  if (pm10 <= 15) {
    return { text: '청정', color: '#4073B5', icon: `${IconAirLv1}` };
  } else if (pm10 <= 30) {
    return { text: '좋음', color: '#4D97CF', icon: `${IconAirLv2}` };
  } else if (pm10 <= 40) {
    return { text: '보통', color: '#50AABF', icon: `${IconAirLv3}` };
  } else if (pm10 <= 50) {
    return { text: '나쁘지 않음', color: '#4E8E4B', icon: `${IconAirLv4}` };
  } else if (pm10 <= 75) {
    return { text: '나쁨', color: '#E8923D', icon: `${IconAirLv5}` };
  } else if (pm10 <= 100) {
    return { text: '상당히 나쁨', color: '#D65835', icon: `${IconAirLv6}` };
  } else if (pm10 <= 150) {
    return { text: '실외활동 자제요망', color: '#C43E38', icon: `${IconAirLv7}` };
  } else {
    return { text: '외출시 사망확률 높음', color: '#C43E38', icon: `${IconAirLv8}` };
  }
}

export function getPm25Status(pm2_5: number): { text: string; color: string; icon: string } {
  if (pm2_5 <= 8) {
    return { text: '청정', color: '#4073B5', icon: `${IconAirLv1}` };
  } else if (pm2_5 <= 15) {
    return { text: '좋음', color: '#4D97CF', icon: `${IconAirLv2}` };
  } else if (pm2_5 <= 20) {
    return { text: '보통', color: '#50AABF', icon: `${IconAirLv3}` };
  } else if (pm2_5 <= 25) {
    return { text: '나쁘지 않음', color: '#4E8E4B', icon: `${IconAirLv4}` };
  } else if (pm2_5 <= 37) {
    return { text: '나쁨', color: '#E8923D', icon: `${IconAirLv5}` };
  } else if (pm2_5 <= 50) {
    return { text: '상당히 나쁨', color: '#D65835', icon: `${IconAirLv6}` };
  } else if (pm2_5 <= 75) {
    return { text: '실외활동 자제요망', color: '#C43E38', icon: `${IconAirLv7}` };
  } else {
    return { text: '외출시 사망확률 높음', color: '#C43E38', icon: `${IconAirLv8}` };
  }
}
