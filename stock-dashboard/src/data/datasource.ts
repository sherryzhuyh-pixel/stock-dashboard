export type DataQuery = { source: string; params?: Record<string, any> };
export type DataResponse<T = any> = { data: T; timestamp?: number };

export interface DataSource {
  name: string;
  fetch(query: DataQuery): Promise<DataResponse<any>>;
}
