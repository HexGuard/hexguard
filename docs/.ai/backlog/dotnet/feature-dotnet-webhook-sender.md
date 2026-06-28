---
id: feature-dotnet-webhook-sender
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.WebhookSender'
---

# HexGuard.WebhookSender

## Summary

Outbound webhook delivery engine for .NET — endpoint management, event dispatch, delivery with retry, and delivery history. Backend for integration platforms and developer webhooks. Complements `HexGuard.WebhookReceiver`.

## Goals

- Webhook endpoint registration with event type subscriptions
- Event dispatch to subscribed endpoints
- Automatic retry with exponential backoff
- Delivery history with request/response logging
- Delivery metrics (success rate, latency)
- Webhook secret signing (HMAC-SHA256)
- Endpoint health monitoring (consecutive failures → auto-disable)
- Manual retry for failed deliveries
- Test event sending

## Non-Goals

- No webhook payload transformation
- No inbound webhook receiving (separate package)
- No UI rendering

## Proposed Public API

```csharp
public interface IWebhookSenderService
{
    // Endpoints
    Task<WebhookEndpoint> RegisterEndpointAsync(RegisterEndpointRequest request, CancellationToken ct = default);
    Task<WebhookEndpoint?> GetEndpointAsync(string endpointId, CancellationToken ct = default);
    Task<IReadOnlyList<WebhookEndpoint>> GetEndpointsAsync(CancellationToken ct = default);
    Task<WebhookEndpoint> UpdateEndpointAsync(string endpointId, UpdateEndpointRequest request, CancellationToken ct = default);
    Task DeleteEndpointAsync(string endpointId, CancellationToken ct = default);
    Task<string> RotateSecretAsync(string endpointId, CancellationToken ct = default);
    // Dispatch
    Task<WebhookDelivery> DispatchAsync(string eventType, object payload, CancellationToken ct = default);
    Task<WebhookDelivery> SendTestEventAsync(string endpointId, string eventType, CancellationToken ct = default);
    // Deliveries
    Task<IReadOnlyList<WebhookDelivery>> GetDeliveriesAsync(DeliveryQuery query, CancellationToken ct = default);
    Task<WebhookDelivery?> GetDeliveryAsync(string deliveryId, CancellationToken ct = default);
    Task<WebhookDelivery> RetryAsync(string deliveryId, CancellationToken ct = default);
    Task<IReadOnlyList<WebhookDelivery>> RetryAllFailedAsync(string endpointId, CancellationToken ct = default);
    // Health
    Task ProcessFailedEndpointsAsync(CancellationToken ct = default);
    // Metrics
    Task<WebhookMetrics> GetMetricsAsync(CancellationToken ct = default);
}

public sealed record RegisterEndpointRequest(
    string Url,
    string? Description = null,
    IReadOnlyList<string>? EventTypes = null,
    string? Secret = null
);

public enum DeliveryStatus { Pending, Success, Failed, Retrying }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.WebhookSender/` with `.csproj`.
2. Implement endpoint registration, dispatch, retry with backoff, delivery history.
3. Add HMAC signing, health monitoring, metrics.
4. Add xunit tests. Register in `HexGuard.slnx`.
