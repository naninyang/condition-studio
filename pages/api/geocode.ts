import type { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from '@/utils/getAccessToken';

export default async function geocode(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    res.status(400).json({ error: 'Address is required' });
    return;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    res.status(500).json({ error: 'Failed to retrieve access token' });
    return;
  }

  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `https://sgisapi.kostat.go.kr/OpenAPI3/addr/geocodewgs84.json?accessToken=${accessToken}&address=${encodedAddress}`,
  );
  const data = await response.json();

  res.status(200).json(data);
}
