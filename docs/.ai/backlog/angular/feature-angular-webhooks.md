---
id: feature-angular-webhooks
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-webhooks'
---

# @hexguard/angular-webhooks

## Summary

Headless webhook management state — endpoint configuration, delivery history, retry state, and event type subscription. For integration dashboards and developer platform settings.

## Goals

- Webhook endpoint CRUD with URL, secret, event type subscriptions
- Delivery history with status (success, failed, pending)
- Delivery detail with request/response inspection
- Manual retry for failed deliveries
- Event type catalog with descriptions
- Webhook testing (send test payload)
- Delivery metrics (success rate, latency)
- Secret rotation state

## Non-Goals

- No webhook delivery engine (server-side only)
- No webhook payload transformation
- No rendered webhook UI

## Proposed Public API

```typescript
export function injectWebhooks(config: {
  endpoint: string;
}): {
  readonly endpoints: Signal<WebhookEndpoint[]>;
  readonly selectedEndpoint: Signal<WebhookEndpoint | null>;
  readonly deliveries: Signal<WebhookDelivery[]>;
  readonly selectedDelivery: Signal<WebhookDelivery | null>;
  readonly eventTypes: Signal<EventType[]>;
  readonly metrics: Signal<WebhookMetrics>;
  readonly isLoading/submitting: Signal<boolean>;
  // Endpoint CRUD
  create(endpoint: NewWebhookEndpoint): Promise<WebhookEndpoint>;
  update(id: string, changes: Partial<WebhookEndpoint>): Promise<void>;
  delete(id: string): Promise<void>;
  rotateSecret(id: string): Promise<string>; // returns new secret
  // Deliveries
  selectEndpoint(id: string | null): void;
  selectDelivery(deliveryId: string | null): void;
  loadMoreDeliveries(): Promise<void>;
  retry(deliveryId: string): Promise<void>;
  retryAllFailed(endpointId: string): Promise<void>;
  // Testing
  sendTestEvent(endpointId: string, eventType: string): Promise<WebhookDelivery>;
  // Filters
  readonly filters: Signal<WebhookFilters>;
  setFilters(f: Partial<WebhookFilters>): void;
};

export interface WebhookEndpoint {
  id: string; url: string; description?: string; eventTypes: string[];
  isActive: boolean; secret?: string; createdAt: Date; lastDeliveryAt?: Date;
  deliveryStats: { total: number; successful: number; failed: number; pending: number };
}

export interface WebhookDelivery {
  id: string; endpointId: string; eventType: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  requestUrl: string; requestHeaders: Record<string, string>; requestBody: string;
  responseStatus?: number; responseHeaders?: Record<string, string>; responseBody?: string;
  attemptCount: number; maxAttempts: number;
  createdAt: Date; completedAt?: Date; nextRetryAt?: Date;
  error?: string;
}

export interface EventType { name: string; description: string; schema?: Record<string, unknown>; }
export interface WebhookFilters { endpointId?: string; eventType?: string; status?: string; dateFrom?: Date; dateTo?: Date; }
export interface WebhookMetrics { totalEndpoints: number; activeEndpoints: number; deliveries24h: number; successRate: number; avgLatencyMs: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-webhooks/`.
2. Implement endpoint CRUD, delivery history, retry, test events, metrics with signals.
3. Add secret rotation and filtering.
4. Add tests. Register in workspace.
