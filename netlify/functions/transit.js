// Serverless proxy — keeps the OBA API key server-side
// Client calls: /api/transit?endpoint=stops-for-location&lat=...&lon=...
// This function appends the secret key and forwards to OneBusAway

const BASE_URL = 'https://api.pugetsound.onebusaway.org/api/where';

exports.handler = async (event) => {
  const apiKey = process.env.OBA_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured on server' }),
    };
  }

  const { endpoint, ...rest } = event.queryStringParameters || {};

  if (!endpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required "endpoint" parameter' }),
    };
  }

  // Build the upstream URL
  const upstream = new URL(`${BASE_URL}/${endpoint}.json`);
  upstream.searchParams.set('key', apiKey);
  for (const [k, v] of Object.entries(rest)) {
    upstream.searchParams.set(k, v);
  }

  try {
    const response = await fetch(upstream.toString());
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `Upstream error: ${err.message}` }),
    };
  }
};
