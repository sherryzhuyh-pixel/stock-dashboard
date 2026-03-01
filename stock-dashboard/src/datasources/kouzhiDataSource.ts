import { DataSource, DataQuery, DataResponse } from '../data/datasource';

export class KouzhiDataSource implements DataSource {
  name = 'kouzhi';
  async fetch(query: DataQuery): Promise<DataResponse<any>> {
    // TODO: implement real fetch with caching later
    return { data: { ok: true, query }, timestamp: Date.now() };
  }
}
