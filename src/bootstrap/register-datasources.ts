import { DataSourceRegistry } from "../data/datasourceRegistry";
import { KouzhiDataSource } from "../data/datasources/kouzhiDataSource";
import { MockDataSource } from "../data/datasources/mockDataSource";
import { StockMarketDataSource } from "../data/datasources/stockMarketDataSource";

// Registers default data sources from environment configuration.
export function registerDefaultDataSources(): void {
  const env: any = (import.meta as any)?.env || process?.env || {};
  const baseUrl = env.VITE_KOUZHI_BASE_URL ?? env.KOUZHI_BASE_URL ?? "";
  const token = env.VITE_KOUZHI_TOKEN ?? env.KOUZHI_TOKEN ?? "";
  const timeoutMs = Number(env.VITE_KOUZHI_TIMEOUT_MS ?? env.KOUZHI_TIMEOUT_MS ?? 8000);
  const maxRetries = Number(env.VITE_KOUZHI_MAX_RETRIES ?? env.KOUZHI_MAX_RETRIES ?? 3);

  if (!baseUrl) {
    // Kouzhi not configured; skip registration to avoid runtime errors
    return;
  }
  const ttl = Number(env.KOUZHI_CACHE_TTL_MS ?? env.VITE_KOUZHI_CACHE_TTL_MS ?? 60000);
  DataSourceRegistry.register<any>("kouzhi", (_config?: any) => new KouzhiDataSource<any>(baseUrl, token, timeoutMs, maxRetries, ttl));

  // Optional mock data source for local testing/dev
  const mockEnabled = (typeof env !== 'undefined' && (env.MOCK_ENABLE || process.env.MOCK_ENABLE)) || false;
  if (mockEnabled) {
    DataSourceRegistry.register<any>("mock", (_c?: any) => new MockDataSource<any>({ sample: true }));
  }

  // Optional real data source skeleton for stock market data (for phase C demonstration)
  if (baseUrl) {
    DataSourceRegistry.register<any>("stock-market", (_c?: any) => new StockMarketDataSource<any>(baseUrl, token));
  }
}
