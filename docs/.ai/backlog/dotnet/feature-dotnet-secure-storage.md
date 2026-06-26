---
id: feature-dotnet-secure-storage
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.SecureStorage
---

# HexGuard.SecureStorage

## Summary

Local secure storage for sensitive configuration values — encrypt/decrypt, hash/verify, and securely store connection strings, API keys, and secrets using ASP.NET Core's `IDataProtectionProvider`. Every production app handles secrets somewhere; this provides a consistent `ISecureStorage` interface for on-prem/hybrid environments where cloud secret managers (Azure Key Vault, AWS Secrets Manager) are not available.

**Competition check:** Cloud secret managers (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) are external services with network dependencies. `HexGuard.SecureStorage` provides a local, file-based or registry-based encrypted storage using ASP.NET Core's built-in data protection layer — no external service needed.

## Why Wide Adoption

Every production API needs to store secrets somewhere: database connection strings, third-party API keys, encryption certificates. Environment variables leak in CI logs. Configuration files are plain text. This package provides a simple `GetSecretAsync<T>()` / `SetSecretAsync()` interface backed by the OS-level data protection mechanism.

## Goals

1. Provide `ISecureStorage` interface with `GetSecretAsync`, `SetSecretAsync`, `HasSecretAsync`, `RemoveSecretAsync`.
2. Use ASP.NET Core's `IDataProtectionProvider` for encryption at rest.
3. Support file-based and registry-based (Windows) storage backends.
4. Support typed secret retrieval — `GetSecretAsync<T>(key)` with `System.Text.Json` deserialization.
5. Support secret rotation via version metadata.

## Non-Goals

- No cloud secret manager integration (consumer uses Azure Key Vault etc. directly for cloud).
- No secret sharing between servers (this is local-only).
- No audit logging of secret access.

## Proposed Public API

```csharp
// ── Interface ─────────────────────────────────────────────

public interface ISecureStorage
{
    Task<T?> GetSecretAsync<T>(string key, CancellationToken ct = default);
    Task<string?> GetSecretAsync(string key, CancellationToken ct = default);
    Task SetSecretAsync<T>(string key, T value, CancellationToken ct = default);
    Task SetSecretAsync(string key, string value, CancellationToken ct = default);
    Task<bool> HasSecretAsync(string key, CancellationToken ct = default);
    Task RemoveSecretAsync(string key, CancellationToken ct = default);
}

// ── Options ───────────────────────────────────────────────

public sealed class SecureStorageOptions
{
    public SecureStorageBackend Backend { get; set; } = SecureStorageBackend.File;
    public string StoragePath { get; set; } = "/etc/secrets";  // File backend path
    public string? KeyRingPrefix { get; set; } = "HexGuard";
}

public enum SecureStorageBackend { File, Registry }

// ── Registration ──────────────────────────────────────────

public static class SecureStorageExtensions
{
    public static IServiceCollection AddSecureStorage(
        this IServiceCollection services,
        Action<SecureStorageOptions>? configure = null);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddSecureStorage(options => {
    options.Backend = SecureStorageBackend.File;
    options.StoragePath = "/etc/myapp/secrets";
});

// In a service
public class DatabaseService
{
    private readonly ISecureStorage _storage;

    public DatabaseService(ISecureStorage storage)
    {
        _storage = storage;
    }

    public async Task<string> GetConnectionStringAsync()
    {
        return await _storage.GetSecretAsync("db:connection-string")
            ?? throw new InvalidOperationException("Connection string not configured");
    }
}

// CLI tool to set secrets:
// var storage = app.Services.GetRequiredService<ISecureStorage>();
// await storage.SetSecretAsync("db:connection-string", "Server=...");
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.SecureStorage/` with standard `.csproj`.
2. Implement `ISecureStorage` interface.
3. Implement `FileSecureStorage` — encrypts values to JSON files using `IDataProtector`.
4. Implement `RegistrySecureStorage` (Windows) — stores encrypted values in registry.
5. Implement `AddSecureStorage()` extension.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.SecureStorage`.
