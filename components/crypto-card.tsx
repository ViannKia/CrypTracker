import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MiniChart } from '@/components/mini-chart';
import type { CoinMarket } from '@/lib/types';

interface CryptoCardProps {
  coin: CoinMarket;
}

export function CryptoCard({ coin }: CryptoCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeSign = isPositive ? '+' : '';

  const sparklinePrices = coin.sparkline_in_7d?.price ?? [];
  const sparklineIsPositive =
    sparklinePrices.length >= 2
      ? sparklinePrices[sparklinePrices.length - 1] >= sparklinePrices[0]
      : isPositive;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Image
            src={coin.image}
            alt={coin.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-sm leading-tight">{coin.name}</p>
            <p className="text-xs text-muted-foreground uppercase">
              {coin.symbol}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold">
          ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {changeSign}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </p>
        {sparklinePrices.length > 0 && (
          <div className="mt-2">
            <MiniChart prices={sparklinePrices} isPositive={sparklineIsPositive} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
