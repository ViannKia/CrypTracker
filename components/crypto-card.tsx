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
  const changeIcon = isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  const changeSign = isPositive ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">{coin.name}</p>
                <p className="text-xs text-muted-foreground uppercase">
                  {coin.symbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">
                ${coin.current_price?.toLocaleString()}
              </p>
              <p className={`text-xs font-medium ${changeColor} flex items-center gap-0.5 justify-end`}>
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