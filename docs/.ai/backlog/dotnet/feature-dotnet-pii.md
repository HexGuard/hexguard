---
id: feature-dotnet-pii
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Pii'
---

# HexGuard.Pii

## Summary

PII detection and masking for .NET — detect personally identifiable information in strings and objects, apply masking rules, and classify data sensitivity. For logging sanitization, API response masking, and compliance scanning.

## Goals

- PII detection patterns (email, phone, SSN, credit card, IP, passport, etc.)
- Configurable masking rules (full mask, partial mask, redact, hash)
- Object scanning and masking via reflection
- Integration with logging (auto-mask PII in log output)
- Integration with JSON serialization (mask before response)
- Custom PII pattern registration
- Sensitivity classification (PII, SPI, PHI, none)
- Performance-optimized for high-throughput scenarios

## Non-Goals

- No data classification scanning of databases
- No PII discovery in unstructured text (ML-based)
- No encryption of PII

## Proposed Public API

```csharp
public interface IPiiDetector
{
    IReadOnlyList<PiiMatch> Detect(string text);
    bool ContainsPii(string text);
    SensitivityClass Classify(string text);
}

public interface IPiiMasker
{
    string Mask(string text, PiiMaskingRule? rule = null);
    T Mask<T>(T obj) where T : class;
    string MaskPii(string text, PiiType type);
}

public enum PiiType
{
    Email, Phone, Ssn, CreditCard, IpAddress, Passport, DriversLicense,
    BankAccount, DateOfBirth, Address, FullName, NationalId
}

public enum SensitivityClass { None, Pii, Spi, Phi }

public sealed record PiiMatch(
    PiiType Type,
    int StartIndex,
    int Length,
    string Value
);

public enum PiiMaskingRule
{
    FullMask,      // ***
    PartialMask,   // jo***@example.com
    Redact,        // [REDACTED]
    Hash,          // SHA-256 hex
}

// Registration
public static IServiceCollection AddHexGuardPii(this IServiceCollection services,
    Action<PiiOptions>? configure = null);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Pii/` with `.csproj`.
2. Implement PII detection, masking, logging/JSON integration.
3. Add custom pattern support and sensitivity classification.
4. Add xunit tests for all PII types and masking rules.
5. Register in `HexGuard.slnx`.
