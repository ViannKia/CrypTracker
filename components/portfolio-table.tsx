'use client';

import { removePortfolioEntry } from '@/lib/portfolio';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import type { PortfolioEntryWithPnL } from '@/lib/types';

interface PortfolioTableProps {
  entries: PortfolioEntryWithPnL[];
  onDelete: (id: string) => void;
}

export function PortfolioTable({ entries, onDelete }: PortfolioTableProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Belum ada entri portofolio. Tambahkan koin di atas.
      </p>
    );
  }

  const handleDelete = (id: string) => {
    removePortfolioEntry(id);
    onDelete(id);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Koin</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="text-right">Harga Beli</TableHead>
            <TableHead className="text-right">Harga Saat Ini</TableHead>
            <TableHead className="text-right">Nilai Saat Ini</TableHead>
            <TableHead className="text-right">P&L (USD)</TableHead>
            <TableHead className="text-right">P&L (%)</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isPnLPositive = entry.pnlUsd >= 0;
            const pnlColor = isPnLPositive ? 'text-green-500' : 'text-red-500';
            const pnlSign = isPnLPositive ? '+' : '';

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{entry.coinName}</p>
                    <p className="text-xs text-muted-foreground uppercase">{entry.coinSymbol}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{entry.amount}</TableCell>
                <TableCell className="text-right">
                  ${entry.buyPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  ${entry.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  ${entry.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right font-medium ${pnlColor}`}>
                  {pnlSign}${Math.abs(entry.pnlUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right font-medium ${pnlColor}`}>
                  {pnlSign}{entry.pnlPercent.toFixed(2)}%
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus ${entry.coinName}`}
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
