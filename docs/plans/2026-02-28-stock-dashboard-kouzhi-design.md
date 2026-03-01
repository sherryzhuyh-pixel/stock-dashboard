---
name: kouzhi-design
description: Design for Kouzhi data integration into stock-dashboard
version: 1.0.0
author: OpenCode
---

# Kouzhi Data Integration Design

## 1) Overview
- Build a pluggable DataSource abstraction to enable Kouzhi as a first-class data provider.
- Provide robust networking with retry, caching, and observability.
- Ensure secure handling of credentials and minimize frontend exposure of secrets.

## 2) Goals
- Enable Kouzhi data retrieval via a unified DataSource API consumed by UI and business logic.
- Support easy addition of future data sources with minimal changes to consumer code.
- Achieve acceptable latency, reliability, and clear error semantics for data access.

## 3) API Contracts
- Core types (TypeScript) – to be implemented in src/data:
- DataQuery: { source: string; params?: Record<string, any> }
- DataResponse<T>: { success: true; data: T } | { success: false; error: string; code?: string }
- DataSource<T>: { name: string; fetchData(query: DataQuery): Promise<DataResponse<T>>; dispose?(): void }
- DataSourceRegistry: registry with register/get pattern to instantiate data sources by name.
- KouzhiDataSource implements DataSource<T> and uses baseUrl/token/config for REST calls.

```ts
// Example skeleton
export interface DataQuery { source: string; params?: Record<string, any> }
export type DataResponse<T> = { success: true; data: T } | { success: false; error: string; code?: string }
export interface DataSource<T> { name: string; fetchData(query: DataQuery): Promise<DataResponse<T>>; dispose?: () => void }

export class KouzhiDataSource<T> implements DataSource<T> {
  name = 'kouzhi';
  constructor(private baseUrl: string, private token?: string) {}
  async fetchData(query: DataQuery): Promise<DataResponse<T>> {
    // Implementation will call Kouzhi API; error mapping to DataResponse<T>
    return { success: false, error: 'Not implemented' } as DataResponse<T>;
  }
}
```

## 4) Data Model
- DataSource returns a generic DataResponse<T>, allowing reuse across different data shapes.
- UI hooks (e.g., useDataSource) will map DataResponse<T> to { data, loading, error } state for rendering.
- Define a minimal shape for Kouzhi data (e.g., StockData, MarketOverview) and extend as needed.

## 5) DataSource Registry & Consumption
- Implement a Registry that can instantiate data sources by name (e.g., 'kouzhi').
- UI components use a shared hook/useDataSource to fetch data via the registry.
- Provide a config layer to switch data source by environment/config without touching UI components.

## 6) Kouzhi Integration Details
- API contract (assumed): REST POST /data with body { query: DataQuery } or plain /data with JSON payload.
- Authentication via Bearer token or API key supplied in headers.
- Response mapped to DataResponse<T>, with explicit error codes for retry decisions.
- Timeouts and retry policy configurable (e.g., 3 retries with exponential backoff).

## 7) Caching, Reliability, and Timeout Policy
- In-memory L1 cache with TTL (e.g., 60s) per data source to reduce load.
- Retry strategy with exponential backoff: maxRetries=3, baseDelay=200ms, maxDelay=2000ms.
- Circuit breaker to prevent cascading failures after consecutive errors (opens after N failures).
- Graceful degradation: if Kouzhi unavailable, fall back to cached data or a lightweight default view.

## 8) Observability & Telemetry
- Metrics per data source: requests_total, success_total, error_total, latency_seconds, cache_hits, retry_attempts.
- Structured logs with correlation IDs to trace a request through registry -> data source.
- Optional: expose a health check endpoint or readiness probe for the data layer.

## 9) Security & Secrets
- Credentials stored in environment/config, not in frontend code.
- DataSource instances constructed with secure config at runtime.
- Ensure tokens are not logged or exposed in error messages.

## 10) Testing Strategy
- Unit tests for DataQuery/DataResponse types and KouzhiDataSource behavior (success, HTTP error, timeout).
- Mock Kouzhi API for integration tests covering retry, timeout, and error mapping.
- End-to-end tests to validate the data flow from data source to UI component in a controlled environment.

## 11) Migration Plan
- Phase 1: Introduce data-source abstraction and KouzhiDataSource skeleton; wire into registry and useDataSource hook.
- Phase 2: Add real Kouzhi API client, retry/cache, and observability.
- Phase 3: Replace hard-coded data fetches with new data source in a subset of UI pages, measure impact.

## 12) Documentation & Deliverables
- docs/plans/2026-02-28-stock-dashboard-kouzhi-design.md (this file)
- docs/plans/2026-02-28-stock-dashboard-kouzhi-implementation.md (implementation plan after approval)
- AGENTS.md updated to reflect Kouzhi integration guidelines (optional)

## 13) Acceptance Criteria
- DataSourceRegistry can instantiate KouzhiDataSource with runtime config.
- UI can request Kouzhi data via useDataSource and render without hard dependencies on Kouzhi API details.
- Retry, cache, and circuit breaker behavior verified by tests.
- Security constraints adhered to (no secret leakage in logs or UI).

## 14) Risks & Mitigations
- Kouzhi API changes could break adapters; mitigated by abstraction and contract tests.
- Caching might serve stale data; mitigated by TTL and refresh strategies.
- Sensitive data in logs; mitigated by redaction and structured logging.

## 15) Appendices
- A: Type definitions (shared across data sources)
- B: Sample useDataSource hook signature and expected return shape
- C: Monitoring dashboards outline (Prometheus/Grafana) if applicable

End of Kouzhi Design Draft
