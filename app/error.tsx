'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <h2 className="text-xl font-semibold">Gagal memuat data</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || 'Terjadi kesalahan saat mengambil data dari CoinGecko API.'}
      </p>
      <Button onClick={unstable_retry}>Coba lagi</Button>
    </div>
  );
}
