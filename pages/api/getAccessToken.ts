import type { NextApiRequest, NextApiResponse } from 'next';

let accessToken: string | null = null;

async function fetchAccessToken() {
  try {
    const response = await fetch(
      `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${process.env.CUSTOMER_KEY}&consumer_secret=${process.env.CUSTOMER_SECRET}`,
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    accessToken = data.result.accessToken;

    setTimeout(getAccessToken, 4 * 60 * 60 * 1000);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    accessToken = null;
    setTimeout(getAccessToken, 4 * 60 * 60 * 1000);
  }
}
export default async function getAccessToken(req: NextApiRequest, res: NextApiResponse) {
  if (!accessToken) {
    await fetchAccessToken();
  }
  res.status(200).json({ accessToken });
}
