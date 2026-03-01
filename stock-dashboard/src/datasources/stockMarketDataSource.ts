import { DataSource, DataQuery, DataResponse } from '../data/datasource';
export class StockMarketDataSource implements DataSource {
  name = 'stock-market';
  async fetch(query: DataQuery): Promise<DataResponse<any>> {
    return { data: { market: 'demo', query }, timestamp: Date.now() };
  }
}
