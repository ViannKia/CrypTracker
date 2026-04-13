// Feature: crypto-tracker, Property 5: Filter search mengembalikan subset yang benar

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterCoins } from '../coingecko';
import type { CoinMarket } from '../types';

// ---------------------------------------------------------------------------
// Arbitrary untuk CoinMarket
// ---------------------------------------------------------------------------

const coinMarketArb = fc.record<CoinMarket>({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  symbol: fc.string({ minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  image: fc.webUrl(),
  current_price: fc.double({ min: 0.001, max: 1_000_000, noNaN: true }),
  price_change_percentage_24h: fc.double({ min: -100, max: 1000, noNaN: true }),
  market_cap: fc.double({ min: 0, max: 1e12, noNaN: true }),
  sparkline_in_7d: fc.record({
    price: fc.array(fc.double({ min: 0, noNaN: true }), { minLength: 0, maxLength: 168 }),
  }),
});

// ---------------------------------------------------------------------------
// Property 5: Filter search mengembalikan subset yang benar
// Validates: Requirements 3.2, 3.4
// ---------------------------------------------------------------------------

describe('Property 5: filterCoins returns correct subset', () => {
  it('empty query returns all coins', () => {
    fc.assert(
      fc.property(
        fc.array(coinMarketArb, { minLength: 0, maxLength: 20 }),
        (coins) => {
          expect(filterCoins(coins, '')).toEqual(coins);
          expect(filterCoins(coins, '   ')).toEqual(coins);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('result is a subset of input', () => {
    fc.assert(
      fc.property(
        fc.array(coinMarketArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 10 }),
        (coins, query) => {
          const result = filterCoins(coins, query);
          for (const coin of result) {
            expect(coins).toContainEqual(coin);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every result matches query in name or symbol (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(coinMarketArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (coins, query) => {
          const lower = query.trim().toLowerCase();
          if (!lower) return; // skip empty after trim
          const result = filterCoins(coins, query);
          for (const coin of result) {
            const matches =
              coin.name.toLowerCase().includes(lower) ||
              coin.symbol.toLowerCase().includes(lower);
            expect(matches).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no coin that matches query is excluded from result', () => {
    fc.assert(
      fc.property(
        fc.array(coinMarketArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (coins, query) => {
          const lower = query.trim().toLowerCase();
          if (!lower) return;
          const result = filterCoins(coins, query);
          const resultIds = new Set(result.map((c) => c.id));
          for (const coin of coins) {
            const shouldMatch =
              coin.name.toLowerCase().includes(lower) ||
              coin.symbol.toLowerCase().includes(lower);
            if (shouldMatch) {
              // Coin should be in result (note: ids may not be unique in generated data,
              // so we check by object reference)
              expect(result).toContainEqual(coin);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
