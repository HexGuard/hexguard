---
id: feature-dotnet-webhook-receiver
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.WebhookReceiver
---

# HexGuard.WebhookReceiver

## Summary

Webhook signature verification and delivery acknowledgment for ASP.NET Core Minimal APIs — verifies HMAC/RSA signatures, detects replay attacks via timestamp windows, and returns standardized responses. Every SaaS API receives webhooks from Stripe, GitHub, Slack, SendGrid, or similar services; each has its own signature scheme, and every backend developer re-implements verification logic.

**Competition check:** No standalone webhook receiver middleware exists for ASP.NET Core. Consumer apps either use provider-specific SDKs (Stripe SDK has built-in verification) or write custom verification per provider.

## Why Wide Adoption

Any app that integrates with third-party services receives webhooks: payment events (Stripe), code events (GitHub), messaging (Slack), email events (SendGrid), CRM events (HubSpot). Each provider signs webhooks differently (HMAC-SHA256, RSA, etc.). A configurable, provider-agnostic verification middleware eliminates repeated implementation effort.

## Goals

1. Provide `MapWebhookReceiver()` — maps an endpoint that verifies webhook signatures and routes the verified payload to a handler.
2. Support HMAC-based signature verification (SHA256, SHA1).
3. Support RSA-based signature verification.
4. Support configurable signature header name, secret/key resolution, and timestamp tolerance.
5. Provide replay attack protection via timestamp window validation.
6. Return standardized ProblemDetails on verification failure.
7. Provider-specific presets for Stripe, GitHub, and Slack.

## Non-Goals

- No webhook delivery/retry system (consumer's own infrastructure or SaaS provider handles delivery).
- No webhook event deserialization beyond raw body (consumer decides the payload type).

## Decisions

1. **Minimal API-focused**: Uses `MapPost()` with endpoint filters for verification.
2. **Configurable per-webhook**: Each webhook route has its own configuration (different providers have different signature schemes).
3. **Provider presets**: Built-in presets for common providers (Stripe, GitHub, Slack) that configure header name, algorithm, and tolerance automatically.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record WebhookReceiverConfig
{
    public required string Secret { get; init; }
    public string SignatureHeader { get; init; } = "X-Hub-Signature-256";
    public HashAlgorithm Algorithm { get; init; } = HashAlgorithm.HMACSHA256;
    public TimeSpan TimestampTolerance { get; init; } = TimeSpan.FromMinutes(5);
    public bool RequireTimestamp { get; init; } = true;
}

public static class WebhookPresets
{
    public static WebhookReceiverConfig Stripe(string secret) => new()
    {
        Secret = secret,
        SignatureHeader = "Stripe-Signature",
        Algorithm = HashAlgorithm.HMACSHA256,
        TimestampTolerance = TimeSpan.FromMinutes(5)
    };

    public static WebhookReceiverConfig GitHub(string secret) => new()
    {
        Secret = secret,
        SignatureHeader = "X-Hub-Signature-256",
        Algorithm = HashAlgorithm.HMACSHA256,
        TimestampTolerance = TimeSpan.FromMinutes(5)
    };

    public static WebhookReceiverConfig Slack(string secret) => new()
    {
        Secret = secret,
        SignatureHeader = "X-Slack-Signature",
        Algorithm = HashAlgorithm.HMACSHA256,
        TimestampTolerance = TimeSpan.FromMinutes(5)
    };
}

// ── Extension ─────────────────────────────────────────────

public static class WebhookReceiverExtensions
{
    public static RouteHandlerBuilder MapWebhookReceiver<T>(
        this IEndpointRouteBuilder app,
        string pattern,
        WebhookReceiverConfig config,
        Func<T, HttpContext, Task> handler);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
app.MapWebhookReceiver<StripeEvent>(
    "/webhooks/stripe",
    WebhookPresets.Stripe(env("STRIPE_WEBHOOK_SECRET")),
    async (stripeEvent, ctx) =>
    {
        // Handle verified event
        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded":
                await paymentService.HandleSuccess(stripeEvent);
                break;
        }
    });

app.MapWebhookReceiver<GitHubEvent>(
    "/webhooks/github",
    WebhookPresets.GitHub(env("GITHUB_WEBHOOK_SECRET")),
    async (githubEvent, ctx) =>
    {
        // Handle verified push/pull_request event
    });
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.WebhookReceiver/` with standard `.csproj`.
2. Implement signature verification (HMAC, RSA, raw body reading).
3. Implement timestamp parsing and replay-window validation.
4. Implement provider presets (Stripe, GitHub, Slack).
5. Implement `MapWebhookReceiver<T>()` extension.
6. Implement `WebhookVerificationFilter` (IEndpointFilter).
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.WebhookReceiver`.
