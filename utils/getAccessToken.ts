let accessToken: string | null = null;
const customerKey = process.env.CUSTOMER_KEY;
const customerSecret = process.env.CUSTOMER_SECRET;

async function fetchAccessToken() {
  try {
    const response = await fetch(
      `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${customerKey}&consumer_secret=${customerSecret}`,
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    accessToken = data.result.accessToken;

    setTimeout(fetchAccessToken, 4 * 60 * 60 * 1000);
  } catch (error) {
    console.error('Error fetching access token:', error);
    accessToken = null;

    setTimeout(fetchAccessToken, 4 * 60 * 60 * 1000);
  }
}

fetchAccessToken();

export async function getAccessToken() {
  if (!accessToken) {
    await fetchAccessToken();
  }
  return accessToken;
}
