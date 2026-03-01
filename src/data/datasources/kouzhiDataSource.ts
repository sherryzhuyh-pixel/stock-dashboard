import { DataSource, DataQuery, DataResponse } from "../datasource";
import { DataUnavailableError, TimeoutError, AuthError, DataFormatError } from "../../errors/DataError";
import { KouzhiMetrics } from "../../metrics/kouzhiMetrics";

export class KouzhiDataSource<T> implements DataSource<T> {
  name = "kouzhi";
  private cache = new Map<string, { data: T; expiry: number }>();
  private cacheTTLMs: number;

  constructor(
    private baseUrl: string,
    private token?: string,
    private timeoutMs: number = 8000,
    private maxRetries: number = 3,
    cacheTTLMs: number = 60000
  ) {
    const ttl = typeof cacheTTLMs === 'number' && cacheTTLMs > 0 ? cacheTTLMs : 60000;
    this.cacheTTLMs = ttl;
  }

  async fetchData(query: DataQuery): Promise<DataResponse<T>> {
    const key = JSON.stringify(query);
    const now = Date.now();
    // increment request metric
    try { KouzhiMetrics?.incRequests?.(); } catch { /* no-op in case metrics not wired yet */ }
    const cached = this.cache.get(key);
        if (cached && cached.expiry > now) {
          KouzhiMetrics.incCacheHit();
          return { success: true, data: cached.data };
        }

    const url = `${this.baseUrl}/data`;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    let attempt = 0;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const start = Date.now();
    while (true) {
      attempt++;
      try {
        // Canonical request payload: { source, params }
        const bodyPayload: any = { source: query.source, ...(query.params ?? {}) };
        const resp = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(bodyPayload),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (resp && resp.ok) {
          KouzhiMetrics.incSuccess();
          const data = (await resp.json()) as T;
          this.cache.set(key, { data, expiry: now + this.cacheTTLMs });
          const latency = Date.now() - start;
          KouzhiMetrics.recordLatency(latency);
          return { success: true, data };
        } else if (resp && (resp.status === 401 || resp.status === 403)) {
          return { success: false, error: "Authentication failed", code: "AUTH" };
        } else if (resp && (resp.status >= 500 || resp.status === 429)) {
          // retryable server errors
          KouzhiMetrics.incRetry();
        } else {
          const text = resp ? await resp.text() : undefined;
          return { success: false, error: text || `HTTP`, code: "HTTP" };
        }
      } catch (e) {
        const err = e as Error;
        if (err.name === "AbortError") {
          KouzhiMetrics.incFailure();
          return { success: false, error: "Request timed out", code: "TIMEOUT" };
        }
        // network error -> retry
        KouzhiMetrics.incRetry();
      }

      if (attempt >= this.maxRetries) {
        KouzhiMetrics.incFailure();
        return { success: false, error: "Max retry attempts reached", code: "RETRY_EXHAUSTED" };
      }
      // exponential backoff
      const delay = Math.min(200 * Math.pow(2, attempt - 1), 2000);
      await new Promise(res => setTimeout(res, delay));
      // re-run loop
    }
  }
}
