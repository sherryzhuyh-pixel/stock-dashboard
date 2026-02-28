import { DashboardData, StockData, MarketIndex, SectorFlow } from '@/types/stock';

interface RawCozeData {
  market_indices?: Array<{ name: string; value: number; pct_chg: number }>;
  stocks?: Array<{
    ts_code: string;
    name: string;
    close: number;
    pct_chg: number;
    change: number;
    vol: number;
    amount: number;
  }>;
  sector_flows?: Array<{ name: string; amount: number }>;
  up_count?: number;
  down_count?: number;
  total_amount?: number;
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[,%亿万元]/g, '')) || 0;
}

function parseVolume(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿';
    if (value >= 10000) return (value / 10000).toFixed(2) + '万';
    return value.toString();
  }
  return value;
}

function parseAmount(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿';
    if (value >= 10000) return (value / 10000).toFixed(2) + '万';
    return value.toString();
  }
  return value;
}

export function processCozeData(rawText: string): DashboardData {
  try {
    const cleaned = rawText.replace(/```(?:json)?\n?/g, '').trim();
    const data: RawCozeData = JSON.parse(cleaned);

    const stocks: StockData[] = (data.stocks || []).map(s => ({
      ts_code: s.ts_code,
      name: s.name,
      close: parseNumber(s.close),
      pct_chg: parseNumber(s.pct_chg),
      change: parseNumber(s.change),
      vol: parseNumber(s.vol),
      amount: parseNumber(s.amount),
    }));

    const marketIndices: MarketIndex[] = (data.market_indices || []).map(m => ({
      name: m.name,
      value: parseNumber(m.value),
      pct_chg: parseNumber(m.pct_chg),
    }));

    const sectorFlows: SectorFlow[] = (data.sector_flows || []).map(s => ({
      name: s.name,
      amount: parseNumber(s.amount),
    }));

    return {
      marketIndices,
      stocks,
      sectorFlows,
      upCount: data.up_count || 0,
      downCount: data.down_count || 0,
      totalAmount: data.total_amount || 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
    };
  } catch (error) {
    console.error('Failed to parse Coze data:', error);
    return {
      marketIndices: [],
      stocks: [],
      sectorFlows: [],
      upCount: 0,
      downCount: 0,
      totalAmount: 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
    };
  }
}

export { parseVolume, parseAmount };
