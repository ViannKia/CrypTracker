'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CryptoCard } from '@/components/crypto-card';
import { CoinDetailModal } from '@/components/coin-detail-modal';
import { filterCoins } from '@/lib/coingecko';
import type { CoinMarket } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface CryptoCardGridProps {
  coins: CoinMarket[];
}

export function CryptoCardGrid({ coins }: CryptoCardGridProps) {
  const [query, setQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = filterCoins(coins, query);

  const handleCardClick = (coin: CoinMarket) => {
    setSelectedCoin(coin);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Search bar with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or symbol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search cryptocurrencies"
        />
      </motion.div>

      {/* Results with stagger animation */}
      {filtered.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground py-12"
        >
          Tidak ada hasil untuk pencarian ini.
        </motion.p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filtered.map((coin) => (
            <motion.div
              key={coin.id}
              variants={itemVariants}
              onClick={() => handleCardClick(coin)}
              className="cursor-pointer"
            >
              <CryptoCard coin={coin} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <CoinDetailModal
        coin={selectedCoin}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToPortfolio={(coin) => {
          // Simpan data coin ke sessionStorage
          sessionStorage.setItem('pendingCoin', JSON.stringify({
            coinId: coin.id,
            coinName: coin.name,
            coinSymbol: coin.symbol.toUpperCase(),
            buyPrice: coin.current_price
          }));

          // Redirect ke halaman portfolio
          window.location.href = '/portfolio';
          setModalOpen(false);
        }}
      />
    </div>
  );
}