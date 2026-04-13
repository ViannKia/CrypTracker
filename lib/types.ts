export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface PortfolioEntry {
  id: string;           // UUID, generated client-side
  coinId: string;       // CoinGecko coin ID (e.g., "bitcoin")
  coinName: string;
  coinSymbol: string;
  amount: number;       // Jumlah kepemilikan
  buyPrice: number;     // Harga beli per unit dalam USD
}

export interface PortfolioEntryWithPnL extends PortfolioEntry {
  currentPrice: number;
  currentValue: number;
  pnlUsd: number;
  pnlPercent: number;
}
