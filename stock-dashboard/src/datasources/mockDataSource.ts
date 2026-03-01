import { DataSource, DataQuery, DataResponse } from '../data/datasource';
export class MockDataSource implements DataSource {
  name = 'mock';
  async fetch(query: DataQuery): Promise<DataResponse<any>> {
    return { data: { mock: true, query }, timestamp: Date.now() };
  }
}
