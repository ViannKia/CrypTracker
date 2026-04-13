import { NextRequest } from 'next/server';
import { fetchCoinPrices } from '@/lib/coingecko';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get('ids');

  if (!ids) {
    return Response.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  const coinIds = ids.split(',').filter(Boolean);

  if (coinIds.length === 0) {
    return Response.json({});
  }

  try {
    const prices = await fetchCoinPrices(coinIds);
    return Response.json(prices);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch prices';
    return Response.json({ error: message }, { status: 502 });
  }
}
