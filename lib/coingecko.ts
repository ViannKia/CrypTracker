import { cacheLife } from 'next/cache';
import type { CoinMarket } from './types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch top 20 coins by market cap with sparkline data.
 * Cached with 'use cache' + cacheLife('minutes') (~60s revalidation).
 */
export async function fetchTopCoins(): Promise<CoinMarket[]> {
  'use cache';
  cacheLife('minutes');

  const url =
    `${BASE_URL}/coins/markets` +
    `?vs_currency=usd` +
    `&order=market_cap_desc` +
    `&per_page=20` +
    `&page=1` +
    `&sparkline=true` +
    `&price_change_percentage=24h`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<CoinMarket[]>;
}

/**
 * Fetch current USD prices for a list of coin IDs.
 * Returns a map of coinId -> price in USD.
 */
export async function fetchCoinPrices(
  coinIds: string[]
): Promise<Record<string, number>> {
  if (coinIds.length === 0) return {};

  const ids = coinIds.join(',');
  const url = `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Record<string, { usd: number }>;

  // Flatten: { bitcoin: { usd: 50000 } } -> { bitcoin: 50000 }
  const result: Record<string, number> = {};
  for (const [coinId, priceObj] of Object.entries(data)) {
    result[coinId] = priceObj.usd;
  }
  return result;
}

/**
 * Filter coins by name or symbol (case-insensitive).
 * If query is empty, returns all coins.
 */
export function filterCoins(coins: CoinMarket[], query: string): CoinMarket[] {
  const trimmed = query.trim();
  if (!trimmed) return coins;

  const lower = trimmed.toLowerCase();
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(lower) ||
      coin.symbol.toLowerCase().includes(lower)
  );
}
