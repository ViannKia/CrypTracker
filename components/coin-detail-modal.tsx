'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { MiniChart } from '@/components/mini-chart';
import type { CoinMarket } from '@/lib/types';

interface CoinDetailModalProps {
  coin: CoinMarket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToPortfolio?: (coin: CoinMarket) => void;
}

export function CoinDetailModal({ 
  coin, 
  open, 
  onOpenChange, 
  onAddToPortfolio 
}: CoinDetailModalProps) {
  if (!coin) return null;

  const isPositive = coin.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositive ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />;
  const changeSign = isPositive ? '+' : '';

  const sparklinePrices = coin.sparkline_in_7d?.price ?? [];

  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatSupply = (num: number | undefined) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Header */}
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <DialogTitle className="text-xl">
                    {coin.name}{' '}
                    <span className="text-muted-foreground uppercase text-sm">
                      {coin.symbol}
                    </span>
                  </DialogTitle>
                </div>
              </DialogHeader>

              {/* Harga + Perubahan */}
              <div className="text-center">
                <p className="text-3xl font-bold">
                  ${coin.current_price?.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${changeColor}`}>
                  {changeIcon} {changeSign}
                  {coin.price_change_percentage_24h?.toFixed(2)}% (24 jam)
                </p>
              </div>

              {/* Chart 7 Hari */}
              {sparklinePrices.length > 0 && (
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Harga 7 Hari Terakhir</p>
                  <MiniChart prices={sparklinePrices} isPositive={isPositive} />
                </div>
              )}

              {/* Market Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
                <div>
                  <p className="text-muted-foreground text-xs">Market Cap</p>
                  <p className="font-medium text-sm">{formatNumber(coin.market_cap)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Volume 24j</p>
                  <p className="font-medium text-sm">{formatNumber(coin.total_volume)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Circulating Supply</p>
                  <p className="font-medium text-sm">{formatSupply(coin.circulating_supply)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">All Time High</p>
                  <p className="font-medium text-sm">{formatNumber(coin.ath)}</p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => onAddToPortfolio?.(coin)}
                >
                  + Add to Portfolio
                </Button>
              </div>

              {/* Link ke CoinGecko */}
              <a
                href={`https://www.coingecko.com/en/coins/${coin.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-muted-foreground hover:underline flex items-center justify-center gap-1"
              >
                View on CoinGecko <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}