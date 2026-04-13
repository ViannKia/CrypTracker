'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { CoinMarket } from '@/lib/types';

interface CryptoCardProps {
  coin: CoinMarket;
}

export function CryptoCard({ coin }: CryptoCardProps) {
  const priceChange = coin.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositive ? <ArrowUp className="h-3 w-3 shrink-0" /> : <ArrowDown className="h-3 w-3 shrink-0" />;
  const changeSign = isPositive ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            {/* Kiri: Logo + Nama */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Image
                src={coin.image}
                alt={coin.name}
                width={28}
                height={28}
                className="rounded-full sm:w-8 sm:h-8 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs sm:text-sm truncate">{coin.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase truncate">
                  {coin.symbol}
                </p>
              </div>
            </div>

            {/* Kanan: Harga + Perubahan */}
            <div className="text-right shrink-0">
              <p className="font-bold text-xs sm:text-sm whitespace-nowrap">
                ${coin.current_price?.toLocaleString()}
              </p>
              <p className={`text-[10px] sm:text-xs font-medium ${changeColor} flex items-center gap-0.5 justify-end whitespace-nowrap`}>
                {changeIcon}
                {changeSign}{priceChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}