import type { PortfolioEntry, PortfolioEntryWithPnL } from './types';

const STORAGE_KEY = 'crypto-tracker-portfolio';

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

/**
 * Read all portfolio entries from localStorage.
 * Falls back to an empty array on any error (unavailable, corrupt JSON, etc.).
 */
export function getPortfolioEntries(): PortfolioEntry[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PortfolioEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Persist an array of portfolio entries to localStorage.
 * Silently swallows errors (e.g. storage quota exceeded).
 */
export function savePortfolioEntries(entries: PortfolioEntry[]): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage unavailable or quota exceeded — ignore
  }
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

/**
 * Add a new portfolio entry (generates a UUID client-side).
 * Returns the updated array after saving to localStorage.
 */
export function addPortfolioEntry(
  entry: Omit<PortfolioEntry, 'id'>
): PortfolioEntry[] {
  const newEntry: PortfolioEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };
  const current = getPortfolioEntries();
  const updated = [...current, newEntry];
  savePortfolioEntries(updated);
  return updated;
}

/**
 * Remove the entry with the given id.
 * Returns the updated array after saving to localStorage.
 */
export function removePortfolioEntry(id: string): PortfolioEntry[] {
  const current = getPortfolioEntries();
  const updated = current.filter((entry) => entry.id !== id);
  savePortfolioEntries(updated);
  return updated;
}

// ---------------------------------------------------------------------------
// Calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculate P&L for a single portfolio entry given the current price.
 *
 * currentValue  = amount × currentPrice
 * pnlUsd        = currentValue − (amount × buyPrice)
 * pnlPercent    = ((currentPrice − buyPrice) / buyPrice) × 100
 */
export function calculatePnL(
  entry: PortfolioEntry,
  currentPrice: number
): PortfolioEntryWithPnL {
  const currentValue = entry.amount * currentPrice;
  const pnlUsd = currentValue - entry.amount * entry.buyPrice;
  const pnlPercent =
    ((currentPrice - entry.buyPrice) / entry.buyPrice) * 100;

  return {
    ...entry,
    currentPrice,
    currentValue,
    pnlUsd,
    pnlPercent,
  };
}

/**
 * Calculate the total portfolio value as the sum of all currentValue fields.
 */
export function calculateTotalValue(
  entries: PortfolioEntryWithPnL[]
): number {
  return entries.reduce((sum, entry) => sum + entry.currentValue, 0);
}
