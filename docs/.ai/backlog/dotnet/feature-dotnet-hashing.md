---
id: feature-dotnet-hashing
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Hashing'
---

# HexGuard.Hashing

## Summary

Secure hashing utilities for .NET — password hashing, data integrity hashes, HMAC, and constant-time comparison. Batteries-included cryptographic best practices.

## Goals

- Password hashing (Argon2id with configurable parameters)
- Password verification with automatic rehash detection
- Data integrity hashing (SHA-256, SHA-512)
- HMAC generation and verification
- Constant-time string/byte comparison
- Hash format versioning for seamless algorithm upgrades
- `IOptions`-based configuration

## Non-Goals

- No encryption (hashing only)
- No key management or secret storage
- No JWT/digital signature creation

## Proposed Public API

```csharp
public interface IPasswordHasher
{
    string Hash(string password);
    PasswordVerificationResult Verify(string password, string hash);
}

public enum PasswordVerificationResult { Success, Failed, SuccessNeedsRehash }

public interface IDataHasher
{
    byte[] ComputeHash(byte[] data, HashAlgorithm algorithm = HashAlgorithm.SHA256);
    string ComputeHash(string data, HashAlgorithm algorithm = HashAlgorithm.SHA256);
    string ComputeHmac(string data, byte[] key, HashAlgorithm algorithm = HashAlgorithm.SHA256);
    bool VerifyHmac(string data, string hmac, byte[] key, HashAlgorithm algorithm = HashAlgorithm.SHA256);
}

public static class ConstantTimeComparison
{
    public static bool Equals(string a, string b);
    public static bool Equals(byte[] a, byte[] b);
}

// Registration
public static IServiceCollection AddHexGuardHashing(this IServiceCollection services,
    Action<HashingOptions>? configure = null);
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Hashing/` with `.csproj` and `Konscious.Security.Cryptography.Argon2` dependency.
2. Implement password hashing, data hashing, HMAC, constant-time comparison.
3. Add xunit tests for all algorithms.
4. Register in `HexGuard.slnx`.
