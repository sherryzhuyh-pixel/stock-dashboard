import { DataQuery, DataResponse } from "../data/datasource"; export type DataFetcher = (q: DataQuery)=> Promise<DataResponse<any>>; 
export function useDataSource(fetcher?: DataFetcher) { // placeholder hook
  return { fetch: fetcher ?? (async (q)=>({data: null})) };
}
