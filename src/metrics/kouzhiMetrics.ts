export type MetricsPoint = {
  name: string;
  value: number;
};

type KouzhiMetricsState = {
  requests: number;
  successes: number;
  failures: number;
  retries: number;
  cacheHits: number;
  latencyMsTotal: number;
  latencyMsCount: number;
};

const state: KouzhiMetricsState = {
  requests: 0,
  successes: 0,
  failures: 0,
  retries: 0,
  cacheHits: 0,
  latencyMsTotal: 0,
  latencyMsCount: 0,
};

export const KouzhiMetrics = {
  incRequests() { state.requests += 1; },
  incSuccess() { state.successes += 1; },
  incFailure() { state.failures += 1; },
  incRetry() { state.retries += 1; },
  incCacheHit() { state.cacheHits += 1; },
  recordLatency(ms: number) {
    state.latencyMsTotal += ms;
    state.latencyMsCount += 1;
  },
  snapshot(): { [k: string]: number } {
    const avgLatency = state.latencyMsCount ? state.latencyMsTotal / state.latencyMsCount : 0;
    return {
      requests: state.requests,
      successes: state.successes,
      failures: state.failures,
      retries: state.retries,
      cacheHits: state.cacheHits,
      averageLatencyMs: Math.round(avgLatency),
    };
  },
  // lightweight export for external tooling
  exportSnapshot(): string {
    return JSON.stringify(this.snapshot());
  }
};
