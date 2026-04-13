'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getPortfolioEntries,
  calculatePnL,
  calculateTotalValue,
} from '@/lib/portfolio';
import type { PortfolioEntry, PortfolioEntryWithPnL } from '@/lib/types';
import { PortfolioTable } from '@/components/portfolio-table';
import { AddEntryForm } from '@/components/add-entry-form';

export default function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntryWithPnL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);

  const loadPortfolio = useCallback(async () => {
    // Check localStorage availability
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
    } catch {
      setStorageAvailable(false);
      setIsLoading(false);
      return;
    }

    const stored: PortfolioEntry[] = getPortfolioEntries();

    if (stored.length === 0) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    // Fetch current prices
    try {
      const coinIds = [...new Set(stored.map((e) => e.coinId))].join(',');
      const res = await fetch(`/api/prices?ids=${coinIds}`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      const prices: Record<string, number> = await res.json();

      const withPnL = stored.map((entry) =>
        calculatePnL(entry, prices[entry.coinId] ?? entry.buyPrice)
      );
      setEntries(withPnL);
      setPriceError(null);
    } catch (err) {
      setPriceError('Gagal mengambil harga terkini. Menampilkan data tanpa P&L terkini.');
      // Still show entries with buyPrice as currentPrice
      const withPnL = stored.map((entry) => calculatePnL(entry, entry.buyPrice));
      setEntries(withPnL);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const handleAdd = () => loadPortfolio();

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  if (!storageAvailable) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Fitur ini memerlukan LocalStorage. Aktifkan LocalStorage di browser Anda untuk menggunakan Portfolio Simulator.
      </div>
    );
  }

  const totalValue = calculateTotalValue(entries);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Portfolio Simulator</h1>

      {/* Total value summary */}
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
        <p className="text-3xl font-bold">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {priceError && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">{priceError}</p>
      )}

      <AddEntryForm onAdd={handleAdd} />

      {isLoading ? (
        <p className="text-muted-foreground">Memuat portofolio...</p>
      ) : (
        <PortfolioTable entries={entries} onDelete={handleDelete} />
      )}
    </div>
  );
}
