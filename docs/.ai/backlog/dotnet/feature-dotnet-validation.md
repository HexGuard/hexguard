---
id: feature-dotnet-validation
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Validation
---

# HexGuard.Validation

## Summary

Fluent validation builder for .NET — `Validator<T>.Create().RuleFor(x => x.Name).NotEmpty()`. Pairs with `HexGuard.ValidationContracts` for error output.

**Competition check:** FluentValidation (100M+) is dominant. This is a lighter alternative built on `ValidationContracts`.

## Proposed Public API

```csharp
var validator = Validator<CreateUserRequest>.Create()
    .RuleFor(x => x.Name, r => r.NotEmpty().MaxLength(100))
    .RuleFor(x => x.Email, r => r.NotEmpty().Email())
    .RuleFor(x => x.Age, r => r.Min(0).Max(150))
    .RuleFor(x => x.Role, r => r.IsIn("admin", "user", "viewer"));

var result = validator.Validate(request);
// Result<CreateUserRequest, ValidationError[]>

public sealed class Validator<T>
{
    public static Validator<T> Create();
    public Validator<T> RuleFor<TProp>(Expression<Func<T, TProp>> property,
        Action<RuleBuilder<TProp>> rules);
    public ValidationResult<T> Validate(T instance);
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Validation/`.
2. Implement rule builder with built-in validators.
3. Add project reference to `HexGuard.ValidationContracts`.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
