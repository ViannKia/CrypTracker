'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CryptoCard } from '@/components/crypto-card';
import { filterCoins } from '@/lib/coingecko';
import type { CoinMarket } from '@/lib/types';

interface CryptoCardGridProps {
  coins: CoinMarket[];
}

export function CryptoCardGrid({ coins }: CryptoCardGridProps) {
  const [query, setQuery] = useState('');
  const filtered = filterCoins(coins, query);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or symbol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search cryptocurrencies"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Tidak ada hasil untuk pencarian ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((coin) => (
            <CryptoCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}
