export default function MoonName(moonPhase: string): string {
  const moonPhaseMap: { [key: string]: string } = {
    'New Moon': '신월',
    'Waxing Crescent': '초승달',
    'First Quarter': '상현달',
    'Waxing Gibbous': '부채꼴달',
    'Full Moon': '보름달',
    'Waning Gibbous': '열매달',
    'Last Quarter': '하현달',
    'Waning Crescent': '그믐달',
  };

  return moonPhaseMap[moonPhase] || moonPhase;
}
