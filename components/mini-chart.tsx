'use client';

import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MiniChartProps {
  prices: number[];
  isPositive: boolean;
}

export function MiniChart({ prices, isPositive }: MiniChartProps) {
  if (!prices || prices.length === 0) {
    return <div className="h-12 w-full bg-muted animate-pulse rounded" />;
  }

  const formatDate = (index: number) => {
    const now = new Date();
    const hoursAgo = prices.length - 1 - index;
    const date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      const date = formatDate(label);
      return (
        <div className="bg-white dark:bg-gray-800 border rounded-md px-2 py-1 text-xs shadow-md">
          <p className="font-medium">{date}</p>
          <p className="text-muted-foreground">${price?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const data = prices.map((price, idx) => ({
    index: idx,
    price: price,
  }));

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <YAxis domain={['dataMin', 'dataMax']} hide={true} />
        <Tooltip
          content={<CustomTooltip />}
          defaultIndex={-1}  
          offset={10}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={isPositive ? "#22c55e" : "#ef4444"}
          strokeWidth={2}
          dot={false}
          activeDot={false} 
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}