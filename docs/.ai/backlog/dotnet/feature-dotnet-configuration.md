---
id: feature-dotnet-configuration
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Configuration
---

# HexGuard.Configuration

## Summary

Typed configuration binding with validation for .NET — bind `IConfiguration` sections to typed records with validation on startup, returning clear error messages when config is invalid. `IOptions<T>` and `.Bind()` don't validate — this fills the gap.

**Competition check:** `FluentValidation.AspNetCore` handles validation but not config binding. `Microsoft.Extensions.Options.DataAnnotations` supports `[Required]` etc. but lacks programmatic validation.

## Goals

1. Provide `BindAndValidate<T>()` — bind + validate config section.
2. Support `IValidatableObject` and custom validator delegates.
3. Fail fast on startup if config is invalid.
4. Return typed `Result<T, ConfigError[]>` for functional error handling.

## Proposed Public API

```csharp
public static class ConfigurationExtensions
{
    public static T BindAndValidate<T>(this IConfiguration configuration,
        string section, Func<T, IEnumerable<string>>? validator = null) where T : new();
}

// Usage
var dbConfig = builder.Configuration.BindAndValidate<DatabaseConfig>("Database", cfg =>
{
    var errors = new List<string>();
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        errors.Add("ConnectionString is required");
    if (cfg.MaxPoolSize < 1)
        errors.Add("MaxPoolSize must be >= 1");
    return errors;
});

// Throws ConfigurationException on startup if invalid — fail fast!
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Configuration/`.
2. Implement `BindAndValidate` with `IValidatableObject` support.
3. Implement startup validation middleware.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
