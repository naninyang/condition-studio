import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, days } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ message: 'Bad request, q parameter is missing or invalid.' });
    return;
  }

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=${days}&aqi=yes&alerts=no&lang=ko`;

  try {
    const weatherResponse = await fetch(url);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      throw new Error('Weather API error');
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
