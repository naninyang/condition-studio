export default function WindDirection(windDir: string): string {
  const directionMap: { [key: string]: string } = {
    N: '북풍',
    NNE: '북북동풍',
    NE: '동북동풍',
    ENE: '동동북풍',
    E: '동풍',
    ESE: '동동남풍',
    SE: '동남동풍',
    SSE: '남남동풍',
    S: '남풍',
    SSW: '남남서풍',
    SW: '서남서풍',
    WSW: '서서남풍',
    W: '서풍',
    WNW: '서서북풍',
    NW: '서북서풍',
    NNW: '북북서풍',
  };

  return directionMap[windDir] || windDir;
}
