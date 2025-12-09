import type { Handler, HandlerEvent } from '@netlify/functions';

const STATSIG_API_URL = 'https://statsigapi.net/console/v1';
const API_VERSION = '20240601';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.STATSIG_CONSOLE_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'STATSIG_CONSOLE_KEY not configured' }),
    };
  }

  const response = await fetch(`${STATSIG_API_URL}/experiments`, {
    headers: {
      'STATSIG-API-KEY': apiKey,
      'STATSIG-API-VERSION': API_VERSION,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      statusCode: response.status,
      headers: corsHeaders,
      body: JSON.stringify({ error: `Statsig API error: ${errorText}` }),
    };
  }

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(data.data ?? []),
  };
};
