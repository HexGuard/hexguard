---
id: feature-dotnet-secrets
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Secrets
---

# HexGuard.Secrets

## Summary

Secret rotation engine — detect expiring secrets/certificates, auto-rotate, notify on failure. Production secret hygiene.

## Proposed Public API

```csharp
public interface ISecretRotationService
{
    Task<IReadOnlyList<SecretStatus>> CheckExpiryAsync(CancellationToken ct);
    Task<RotationResult> RotateAsync(string secretName, CancellationToken ct);
    Task<RotationResult> RotateExpiringAsync(CancellationToken ct);
}

public sealed record SecretStatus { string Name; DateTime? ExpiresAt; bool IsExpiring; int DaysUntilExpiry; }

builder.Services.AddSecretRotation(options => {
    options.RotationInterval = TimeSpan.FromDays(7);
    options.WarningThreshold = TimeSpan.FromDays(14);
    options.Secrets = ["jwt-signing-key", "tls-certificate"];
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Secrets/`.
2. Implement rotation engine, expiry checking, notification.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
