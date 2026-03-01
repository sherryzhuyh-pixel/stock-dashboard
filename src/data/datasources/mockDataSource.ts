import { DataSource, DataQuery, DataResponse } from "../datasource";

type Item = { id: number; value: string };

export class MockDataSource<T> implements DataSource<T> {
  name = "mock";
  private data: any;
  constructor(initial?: T) {
    this.data = initial ?? ({} as any);
  }
  async fetchData(_query: DataQuery): Promise<DataResponse<T>> {
    // Always return the mocked data after a tiny delay
    await new Promise(r => setTimeout(r, 20));
    return { success: true, data: this.data };
  }
  dispose?(): void {}
}
