'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getPortfolioEntries,
  calculatePnL,
  calculateTotalValue,
  removePortfolioEntry,
} from '@/lib/portfolio';
import type { PortfolioEntry, PortfolioEntryWithPnL } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntryWithPnL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadPortfolio = useCallback(async () => {
    const stored = getPortfolioEntries();
    if (stored.length === 0) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    try {
      const coinIds = [...new Set(stored.map((e) => e.coinId))].join(',');
      const res = await fetch(`/api/prices?ids=${coinIds}`);
      const prices = await res.json();

      const withPnL = stored.map((entry) =>
        calculatePnL(entry, prices[entry.coinId] ?? entry.buyPrice)
      );
      setEntries(withPnL);
    } catch (err) {
      const withPnL = stored.map((entry) => calculatePnL(entry, entry.buyPrice));
      setEntries(withPnL);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // Cek pending coin dari modal
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingCoin');
    if (pending) {
      const coin = JSON.parse(pending);
      setCoinId(coin.coinId);
      setCoinName(coin.coinName);
      setCoinSymbol(coin.coinSymbol);
      setBuyPrice(coin.buyPrice.toString());
      setShowForm(true);
      sessionStorage.removeItem('pendingCoin');
      toast.info(`Tambahkan ${coin.coinName} ke portfolio`, {
        duration: 3000,
      });
    }
  }, []);

  const searchCoin = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCoin = (coin: any) => {
    setCoinId(coin.id);
    setCoinName(coin.name);
    setCoinSymbol(coin.symbol.toUpperCase());
    setSearchResults([]);
  };

  const addToPortfolio = () => {
    if (!coinId || !amount || !buyPrice) {
      toast.warning('Isi semua field');
      return;
    }

    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(buyPrice);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah tidak valid');
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Harga beli tidak valid');
      return;
    }

    const existing = getPortfolioEntries();
    const exists = existing.some((e) => e.coinId === coinId);

    if (exists) {
      toast.error(`${coinName} sudah ada di portfolio!`);
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      coinId,
      coinName,
      coinSymbol,
      amount: numAmount,
      buyPrice: numPrice,
    };

    const updated = [...existing, newEntry];
    localStorage.setItem('crypto-tracker-portfolio', JSON.stringify(updated));
    loadPortfolio();

    // Reset form
    setCoinId('');
    setCoinName('');
    setCoinSymbol('');
    setAmount('');
    setBuyPrice('');
    setShowForm(false);
    
    toast.success(`${coinName} berhasil ditambahkan!`);
  };

  const deleteEntry = (id: string, coinName: string) => {
    toast.custom((t) => (
      <div className="bg-background border rounded-lg shadow-lg p-4 flex gap-3 items-center">
        <span>Hapus {coinName} dari portfolio?</span>
        <Button size="sm" variant="outline" onClick={() => {
          removePortfolioEntry(id);
          loadPortfolio();
          toast.dismiss(t);
          toast.success(`${coinName} berhasil dihapus`);
        }}>
          Ya
        </Button>
        <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
          Batal
        </Button>
      </div>
    ));
  };

  const totalValue = calculateTotalValue(entries);

  if (isLoading) {
    return <div className="text-center py-12">Memuat portofolio...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Portfolio Simulator</h1>
        <p className="text-muted-foreground text-sm">Simulasi kepemilikan aset crypto</p>
      </div>

      {/* Total Value Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <p className="text-4xl font-bold">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      {/* Add Button / Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Asset
        </Button>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium">Search Crypto</label>
              <Input
                placeholder="Cari crypto (Bitcoin, Ethereum, dll)"
                onChange={(e) => searchCoin(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="mt-1 border rounded-md max-h-40 overflow-y-auto">
                  {searchResults.map((coin) => (
                    <div
                      key={coin.id}
                      className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                      onClick={() => selectCoin(coin)}
                    >
                      <Image src={coin.image} alt={coin.name} width={20} height={20} />
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Coin Name</label>
                <Input value={coinName} readOnly placeholder="Pilih coin" />
              </div>
              <div>
                <label className="text-sm font-medium">Symbol</label>
                <Input value={coinSymbol} readOnly placeholder="Symbol" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="any"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Buy Price (USD)</label>
                <Input
                  type="number"
                  placeholder="70000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  step="any"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addToPortfolio} className="flex-1">Save</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Table */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Belum ada aset. Klik "Add New Asset" untuk memulai.
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="border-b">
                  <th className="text-center p-3">Asset</th>
                  <th className="text-center p-3">Amount</th>
                  <th className="text-center p-3">Buy Price</th>
                  <th className="text-center p-3">Current</th>
                  <th className="text-center p-3">P&L</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isProfit = entry.pnlUsd >= 0;
                  return (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="text-center p-3">
                        <div>
                          <p className="font-medium">{entry.coinName}</p>
                          <p className="text-xs text-muted-foreground">{entry.coinSymbol}</p>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        {entry.amount} {entry.coinSymbol}
                      </td>
                      <td className="text-center p-3">${entry.buyPrice.toLocaleString()}</td>
                      <td className="text-center p-3">${entry.currentPrice.toLocaleString()}</td>
                      <td className={`text-center p-3 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                        {isProfit ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
                        ${Math.abs(entry.pnlUsd).toLocaleString()} ({isProfit ? '+' : ''}{entry.pnlPercent.toFixed(2)}%)
                      </td>
                      <td className="text-center p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id, entry.coinName)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}