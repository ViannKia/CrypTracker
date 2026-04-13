// Feature: crypto-tracker, Property 6: Kalkulasi P&L akurat untuk semua nilai input
// Feature: crypto-tracker, Property 7: Total portofolio adalah jumlah semua currentValue
// Feature: crypto-tracker, Property 8: Portfolio entry localStorage round-trip
// Feature: crypto-tracker, Property 9: Delete entry menghapus tepat satu entri

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  calculatePnL,
  calculateTotalValue,
  getPortfolioEntries,
  savePortfolioEntries,
  removePortfolioEntry,
} from '../portfolio';
import type { PortfolioEntry, PortfolioEntryWithPnL } from '../types';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// Use fc.double for arbitrary positive numbers (avoids 32-bit float constraint)
const positiveAmountArb = fc.double({ min: 0.001, max: 1_000_000, noNaN: true });

const portfolioEntryArb = fc.record<PortfolioEntry>({
  id: fc.uuid(),
  coinId: fc.string({ minLength: 1, maxLength: 20 }),
  coinName: fc.string({ minLength: 1, maxLength: 50 }),
  coinSymbol: fc.string({ minLength: 1, maxLength: 10 }),
  amount: positiveAmountArb,
  buyPrice: positiveAmountArb,
});

const portfolioEntryWithPnLArb = fc.record<PortfolioEntryWithPnL>({
  id: fc.uuid(),
  coinId: fc.string({ minLength: 1, maxLength: 20 }),
  coinName: fc.string({ minLength: 1, maxLength: 50 }),
  coinSymbol: fc.string({ minLength: 1, maxLength: 10 }),
  amount: positiveAmountArb,
  buyPrice: positiveAmountArb,
  currentPrice: positiveAmountArb,
  currentValue: fc.double({ min: 0, max: 1e12, noNaN: true }),
  pnlUsd: fc.double({ min: -1e12, max: 1e12, noNaN: true }),
  pnlPercent: fc.double({ min: -100, max: 1e6, noNaN: true }),
});

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
}

// ---------------------------------------------------------------------------
// Property 6: Kalkulasi P&L akurat untuk semua nilai input
// Validates: Requirements 5.5
// ---------------------------------------------------------------------------

describe('Property 6: calculatePnL accuracy', () => {
  it('currentValue = amount × currentPrice', () => {
    fc.assert(
      fc.property(
        portfolioEntryArb,
        fc.double({ min: 0.001, max: 1_000_000, noNaN: true }),
        (entry, currentPrice) => {
          const result = calculatePnL(entry, currentPrice);
          const expected = entry.amount * currentPrice;
          expect(result.currentValue).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('pnlUsd = currentValue − (amount × buyPrice)', () => {
    fc.assert(
      fc.property(
        portfolioEntryArb,
        fc.double({ min: 0.001, max: 1_000_000, noNaN: true }),
        (entry, currentPrice) => {
          const result = calculatePnL(entry, currentPrice);
          const expected = result.currentValue - entry.amount * entry.buyPrice;
          expect(result.pnlUsd).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('pnlPercent = ((currentPrice − buyPrice) / buyPrice) × 100', () => {
    fc.assert(
      fc.property(
        portfolioEntryArb,
        fc.double({ min: 0.001, max: 1_000_000, noNaN: true }),
        (entry, currentPrice) => {
          const result = calculatePnL(entry, currentPrice);
          const expected =
            ((currentPrice - entry.buyPrice) / entry.buyPrice) * 100;
          expect(result.pnlPercent).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Total portofolio adalah jumlah semua currentValue
// Validates: Requirements 5.6
// ---------------------------------------------------------------------------

describe('Property 7: calculateTotalValue = sum of currentValue', () => {
  it('total equals sum of all currentValue entries', () => {
    fc.assert(
      fc.property(
        fc.array(portfolioEntryWithPnLArb, { minLength: 0, maxLength: 20 }),
        (entries) => {
          const total = calculateTotalValue(entries);
          const expected = entries.reduce((s, e) => s + e.currentValue, 0);
          expect(total).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('total of empty array is 0', () => {
    expect(calculateTotalValue([])).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Property 8: Portfolio entry localStorage round-trip
// Validates: Requirements 5.2, 5.3
// ---------------------------------------------------------------------------

describe('Property 8: localStorage round-trip', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('save then read returns identical array', () => {
    fc.assert(
      fc.property(
        fc.array(portfolioEntryArb, { minLength: 0, maxLength: 10 }),
        (entries) => {
          savePortfolioEntries(entries);
          const loaded = getPortfolioEntries();
          expect(loaded).toEqual(entries);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: Delete entry menghapus tepat satu entri
// Validates: Requirements 5.7
// ---------------------------------------------------------------------------

describe('Property 9: removePortfolioEntry removes exactly one entry', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('length decreases by 1 and target id is absent', () => {
    fc.assert(
      fc.property(
        fc.array(portfolioEntryArb, { minLength: 1, maxLength: 10 }),
        (entries) => {
          // Pick a random entry to delete
          const targetIndex = Math.floor(Math.random() * entries.length);
          const targetId = entries[targetIndex].id;

          savePortfolioEntries(entries);
          const updated = removePortfolioEntry(targetId);

          // Length decreases by exactly 1
          expect(updated.length).toBe(entries.length - 1);

          // Target id is no longer present
          expect(updated.find((e) => e.id === targetId)).toBeUndefined();

          // All other entries are still present
          const remainingIds = updated.map((e) => e.id);
          for (const entry of entries) {
            if (entry.id !== targetId) {
              expect(remainingIds).toContain(entry.id);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
