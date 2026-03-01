import { useEffect, useState, useCallback } from "react";
import { DataQuery } from "../data/datasource";
import { DataSourceRegistry } from "../data/datasourceRegistry";

type UseDataSourceResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setQuery: (q: DataQuery) => void;
  query: DataQuery | undefined;
};

export function useDataSource<T>(name: string, config?: any, initialQuery?: DataQuery): UseDataSourceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<DataQuery | undefined>(initialQuery);

  const load = useCallback(async (q?: DataQuery) => {
    setLoading(true);
    setError(null);
    try {
      const ds = DataSourceRegistry.get<T>(name, config ?? {});
      const resp = await ds.fetchData(q ?? query ?? { source: name });
      if (resp.success) {
        setData(resp.data as unknown as T);
      } else {
        setError(resp.error);
      }
    } catch (e) {
      setError((e as Error)?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [name, query]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => load();

  return { data, loading, error, refresh, setQuery, query };
}
