---
id: feature-dotnet-result
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Result
---

# HexGuard.Result

## Summary

Standard result/error pattern — `Result<T>` discriminated union with `Success`/`Error` states, `Match()` pattern matching, and ProblemDetails-based error type. Lighter than `OneOf`, `FluentResults`, or `CSharpFunctionalExtensions`. Pairs naturally with `HexGuard.ProblemDetails` for error serialization.

**Competition check:** Multiple result-pattern libraries exist but none integrate with ProblemDetails. HexGuard.Result fills the gap for HexGuard-consuming APIs.

## Goals

1. Provide `Result<T>` value type — lightweight, zero-alloc for success path.
2. Provide `Success(value)` and `Failure(problemDetails)` factory methods.
3. Provide `Match(onSuccess, onError)` for exhaustive handling.
4. Provide implicit operators for returning `T` or `ProblemDetails` directly.
5. Provide `Bind()` and `Map()` for chaining.

## Proposed Public API

```csharp
public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public bool IsError => !IsSuccess;
    public T? Value { get; }
    public ProblemDetails? Error { get; }

    public static Result<T> Success(T value);
    public static Result<T> Failure(ProblemDetails error);

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<ProblemDetails, TResult> onError);

    public Result<U> Map<U>(Func<T, U> mapper);
    public Result<U> Bind<U>(Func<T, Result<U>> binder);

    // Implicit operators
    public static implicit operator Result<T>(T value) => Success(value);
    public static implicit operator Result<T>(ProblemDetails error) => Failure(error);
}

// Usage
app.MapGet("/users/{id}", async (string id) =>
{
    Result<User> result = await userService.GetAsync(id);
    return result.Match(
        user => Results.Ok(user),
        error => Results.Problem(error)
    );
});

// Or with chaining:
Result<UserDto> dto = await userService.GetAsync(id)
    .Map(user => user.ToDto())
    .Bind(dto => validateDto(dto));
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Result/` with standard `.csproj`.
2. Add project reference to `HexGuard.ProblemDetails`.
3. Implement `Result<T>` with implicit operators and monadic methods.
4. Add tests: success/failure/match/map/bind/implicit conversion.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
