export interface StockData {
  ts_code: string;
  name: string;
  close: number;
  pct_chg: number;
  change: number;
  vol: number;
  amount: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  pct_chg: number;
}

export interface SectorFlow {
  name: string;
  amount: number;
}

export interface DashboardData {
  marketIndices: MarketIndex[];
  stocks: StockData[];
  sectorFlows: SectorFlow[];
  upCount: number;
  downCount: number;
  totalAmount: number;
  lastUpdateTime: string;
}
