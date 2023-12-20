export function getPm10Status(pm10: number): { text: string; color: string } {
  if (pm10 <= 30) {
    return { text: '쾌적', color: 'blue' };
  } else if (pm10 <= 50) {
    return { text: '보통', color: 'green' };
  } else if (pm10 <= 100) {
    return { text: '나쁨', color: 'orange' };
  } else {
    return { text: '최악', color: 'red' };
  }
}

export function getPm25Status(pm2_5: number): { text: string; color: string } {
  if (pm2_5 <= 15) {
    return { text: '쾌적', color: 'blue' };
  } else if (pm2_5 <= 25) {
    return { text: '보통', color: 'green' };
  } else if (pm2_5 <= 50) {
    return { text: '나쁨', color: 'orange' };
  } else {
    return { text: '최악', color: 'red' };
  }
}
