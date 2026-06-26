---
id: feature-dotnet-data-masking
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.DataMasking
---

# HexGuard.DataMasking

## Summary

Sensitive data masking utility for .NET — mask/redact emails, phone numbers, SSNs, credit cards, passwords, and custom patterns in strings, JSON responses, and log output. Production APIs must avoid leaking PII in logs and error responses; this provides consistent masking across the application.

**Competition check:** No standalone .NET data masking library exists. Apps either write custom regex replacements or use logging enrichers specific to a single sink.

## Why Wide Adoption

Data privacy regulations (GDPR, CCPA, HIPAA, PCI-DSS) require that sensitive data is not exposed in logs, error responses, or monitoring tools. Email addresses, phone numbers, SSNs, and credit card numbers must be masked. Every production API needs this.

## Goals

1. Provide `DataMasker` static utility with built-in maskers for common types.
2. Provide middleware that auto-masks configured response fields.
3. Support regex-based and field-path-based masking.
4. Support custom masker registration.
5. Work on both strings and JSON serialization output.

## Proposed Public API

```csharp
// ── Static Maskers ────────────────────────────────────────

public static class DataMasker
{
    // Built-in maskers
    public static string Email(string email);
    public static string Phone(string phone);
    public static string Ssn(string ssn);
    public static string CreditCard(string number);
    public static string Password(string password);
    public static string Custom(string value, string pattern, string replacement);

    // Generic: mask by type
    public static string Mask(string value, MaskType type);

    // Object masking: returns new object with masked fields
    public static T MaskObject<T>(T obj, params string[] fieldPaths);
}

public enum MaskType { Email, Phone, Ssn, CreditCard, Password, Custom }

// ── Middleware ─────────────────────────────────────────────

public sealed class DataMaskingOptions
{
    public List<FieldMaskRule> FieldMasks { get; init; } = [];
    public List<RegexMaskRule> RegexMasks { get; init; } = [];
}

public sealed record FieldMaskRule(string FieldPath, MaskType Type);
public sealed record RegexMaskRule(string Pattern, string Replacement);

public static class DataMaskingExtensions
{
    public static IApplicationBuilder UseDataMasking(
        this IApplicationBuilder app,
        Action<DataMaskingOptions>? configure = null);
}

// ── Usage ─────────────────────────────────────────────────

// Static masking
var maskedEmail = DataMasker.Email("user@example.com");     // "u***@example.com"
var maskedPhone = DataMasker.Phone("555-123-4567");          // "***-***-4567"

// Middleware: auto-mask response fields
app.UseDataMasking(options => {
    options.FieldMasks.Add(new("user.email", MaskType.Email));
    options.FieldMasks.Add(new("user.phone", MaskType.Phone));
    options.FieldMasks.Add(new("user.ssn", MaskType.Ssn));
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.DataMasking/` with standard `.csproj`.
2. Implement masker functions (email, phone, SSN, credit card, password).
3. Implement `MaskObject<T>` with recursive field traversal.
4. Implement response-stream interception middleware for JSON masking.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit.
7. Register in `HexGuard.slnx`.
8. Publish as NuGet.
