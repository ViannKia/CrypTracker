export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank?: number;
  total_volume?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  fully_diluted_valuation?: number;
  ath?: number;
  ath_date?: string;
  atl?: number;
  atl_date?: string;
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
