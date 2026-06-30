---
id: feature-angular-mock-api
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-mock-api'
---

# @hexguard/angular-mock-api

## Summary

Headless declarative API mocking — HTTP interceptor-based mock server with route matching, response generation, latency simulation, and scenario management. For development and testing without a backend.

## Pain Point

Frontend development blocked by backend availability. Teams either hardcode mock data in components, run a separate mock server (json-server, MSW), or build custom interceptors. None of these provide scenario management ("return error state", "return empty list", "simulate slow network") or integrate cleanly with Angular's DI.

## Goals

- HTTP interceptor-based mock engine (intercepts real `HttpClient` calls)
- Declarative route definitions with path pattern matching
- Response templates with faker data generation
- Scenario management (switch between happy path, error, empty, loading)
- Latency simulation per endpoint
- Passthrough for unmatched routes
- Scenario persistence in localStorage for dev sessions

## Non-Goals

- No replacement for MSW or json-server
- No GraphQL mocking
- No recording/replay of real API traffic

## Proposed Public API

```typescript
// Define mocks
export function provideMockApi(config: MockApiConfig): Provider[];

export interface MockApiConfig {
  scenarios: Record<string, MockScenario>;
  defaultScenario?: string;
  globalDelay?: number; // ms
  passthrough?: (string | RegExp)[]; // routes to pass through
}

export interface MockScenario {
  routes: MockRoute[];
  name?: string;
}

export interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string | RegExp;
  response: MockResponse | ((params: MockRequestParams) => MockResponse);
  delay?: number | [number, number]; // fixed or random range
  status?: number;
}

export interface MockResponse {
  body?: unknown;
  headers?: Record<string, string>;
  status?: number;
}

// Scenario switching at runtime
export function injectMockApi(): {
  readonly currentScenario: Signal<string>;
  readonly scenarios: Signal<string[]>;
  setScenario(name: string): void;
  reset(): void;
  readonly callLog: Signal<MockCallLogEntry[]>;
  clearCallLog(): void;
};

// Usage
provideMockApi({
  scenarios: {
    happy: {
      routes: [
        { method: 'GET', url: '/api/products', response: { body: generateProducts(20) }, delay: 200 },
        { method: 'GET', url: '/api/products/:id', response: (p) => ({ body: findProduct(p.params.id) }) },
        { method: 'POST', url: '/api/products', response: { status: 201, body: { id: 'new' } } }
      ]
    },
    error: {
      routes: [
        { method: 'GET', url: '/api/products', response: { status: 500, body: { error: 'Server error' } } },
        { method: 'GET', url: '/api/products/:id', response: { status: 404 } }
      ]
    },
    empty: {
      routes: [
        { method: 'GET', url: '/api/products', response: { body: [] } }
      ]
    }
  }
});
```

## Implementation Plan
1. Scaffold `angular/packages/angular-mock-api/`.
2. Implement HTTP interceptor, route matching, response generation, scenario engine.
3. Add latency simulation, call log, scenario persistence.
4. Add tests. Register in workspace.
