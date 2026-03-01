export interface DataQuery { source: string; params?: Record<string, any> }
export type DataResponse<T> = { success: true; data: T } | { success: false; error: string; code?: string }
export interface DataSource<T> { name: string; fetchData(query: DataQuery): Promise<DataResponse<T>>; dispose?: () => void }
