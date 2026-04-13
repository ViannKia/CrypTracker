import { Suspense } from 'react';
import { fetchTopCoins } from '@/lib/coingecko';
import { CryptoCardGrid } from '@/components/crypto-card-grid';
import { SkeletonCard } from '@/components/skeleton-card';

async function CoinList() {
  const coins = await fetchTopCoins();
  return <CryptoCardGrid coins={coins} />;
}

function CoinListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Top 20 Cryptocurrencies</h1>
      <Suspense fallback={<CoinListSkeleton />}>
        <CoinList />
      </Suspense>
    </div>
  );
}
