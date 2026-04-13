'use client';

import { useState } from 'react';
import { addPortfolioEntry } from '@/lib/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddEntryFormProps {
  onAdd: () => void;
}

export function AddEntryForm({ onAdd }: AddEntryFormProps) {
  const [form, setForm] = useState({
    coinId: '',
    coinName: '',
    coinSymbol: '',
    amount: '',
    buyPrice: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(form.amount);
    const buyPrice = parseFloat(form.buyPrice);

    if (!form.coinId || !form.coinName || !form.coinSymbol) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError('Jumlah harus berupa angka positif.');
      return;
    }
    if (isNaN(buyPrice) || buyPrice <= 0) {
      setError('Harga beli harus berupa angka positif.');
      return;
    }

    addPortfolioEntry({
      coinId: form.coinId.toLowerCase().trim(),
      coinName: form.coinName.trim(),
      coinSymbol: form.coinSymbol.toUpperCase().trim(),
      amount,
      buyPrice,
    });

    setForm({ coinId: '', coinName: '', coinSymbol: '', amount: '', buyPrice: '' });
    onAdd();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tambah Entri Portofolio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            name="coinId"
            placeholder="Coin ID (e.g. bitcoin)"
            value={form.coinId}
            onChange={handleChange}
            required
          />
          <Input
            name="coinName"
            placeholder="Nama (e.g. Bitcoin)"
            value={form.coinName}
            onChange={handleChange}
            required
          />
          <Input
            name="coinSymbol"
            placeholder="Simbol (e.g. BTC)"
            value={form.coinSymbol}
            onChange={handleChange}
            required
          />
          <Input
            name="amount"
            type="number"
            step="any"
            min="0"
            placeholder="Jumlah (e.g. 0.5)"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <Input
            name="buyPrice"
            type="number"
            step="any"
            min="0"
            placeholder="Harga beli USD (e.g. 45000)"
            value={form.buyPrice}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="sm:col-span-2 lg:col-span-1">
            Tambah
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
