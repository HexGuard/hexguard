---
id: feature-dotnet-state-machine
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.StateMachine'
---

# .NET State Machine Package

## Summary

Design `HexGuard.StateMachine` as a lightweight .NET package for standardizing state-machine contracts for business workflows such as order status, document lifecycle, and approval-stage progression with explicit states, transitions, guard clauses, and transition-side-effect hooks.

The repeated problem is that business applications constantly model state machines — order status (pending → approved → shipped → delivered), document lifecycle (draft → review → published → archived), approval workflows (submitted → in-review → approved/denied) — yet every team rebuilds the same transition table, guard logic, side-effect hooks, and invalid-transition error handling.

## Goals

- Provide `IStateMachine<TState, TTrigger>` with typed states and triggers.
- Support explicit transition definitions with optional guard clauses (`canTransition` predicates).
- Support transition-side-effect hooks (`onTransitioning`, `onTransitioned`) for triggering business logic.
- Support entry/exit actions per state.
- Provide a `StateMachineBuilder` fluent API for defining states and transitions.
- Provide invalid-transition error responses (`TransitionNotAllowed`, `GuardRejected`) for integration with API error contracts.
- Keep the package dependency-free — no external workflow engine or database requirement.

## Non-Goals

- Long-running or durable/persisted state machines — transitions are ephemeral; persistence is the consumer's concern.
- Distributed workflow orchestration or saga execution.
- Visual state-machine design tools or diagram generation.
- Replacing full BPMN or workflow-engine products.

## Decisions

- Use generic type parameters for states (enum/record/string) and triggers (enum/string).
- Transition table is defined fluently at startup and is immutable at runtime.
- Guard clauses are async functions returning `ValueTask<bool>` for database or service lookups.
- Provide built-in `TransitionResult` type for API endpoint integration.
- Keep the builder pattern minimal — define states, transitions, guards, hooks — no XML/config files.

## Proposed Public API

```csharp
// Define the machine
var machine = new StateMachineBuilder<OrderStatus, OrderTrigger>()
    .Configure(OrderStatus.Pending, cfg =>
    {
        cfg.Allow(OrderTrigger.Submit, OrderStatus.Approved)
           .WithGuard(async (ctx) => ctx.Total <= 10000);
        cfg.Allow(OrderTrigger.Cancel, OrderStatus.Cancelled);
        cfg.OnEntry(() => SendNotification("Order created"));
    })
    .Configure(OrderStatus.Approved, cfg =>
    {
        cfg.Allow(OrderTrigger.Ship, OrderStatus.Shipped);
        cfg.Allow(OrderTrigger.Cancel, OrderStatus.Cancelled);
    })
    .Configure(OrderStatus.Shipped, cfg =>
    {
        cfg.Allow(OrderTrigger.Deliver, OrderStatus.Delivered);
    })
    .Build();

// Use the machine
var result = await machine.FireAsync(order.CurrentStatus, OrderTrigger.Submit, context);

if (result.IsSuccess)
{
    order.CurrentStatus = result.NewState;
}
else
{
    // result.Error contains TransitionNotAllowed or GuardRejected details
    return Conflict(result.Error);
}

// Types
public interface IStateMachine<TState, TTrigger>
{
    Task<TransitionResult<TState>> FireAsync(
        TState currentState,
        TTrigger trigger,
        object? context = null);
    bool IsAllowed(TState currentState, TTrigger trigger);
    IReadOnlySet<TTrigger> GetAllowedTriggers(TState state);
}

public record TransitionResult<TState>
{
    public bool IsSuccess { get; init; }
    public TState NewState { get; init; }
    public TransitionError? Error { get; init; }

    public static TransitionResult<TState> Success(TState newState);
    public static TransitionResult<TState> NotAllowed(TState current, TTrigger trigger);
    public static TransitionResult<TState> GuardRejected(string message);
}

public record TransitionError
{
    public string Code { get; init; }        // "TransitionNotAllowed" | "GuardRejected"
    public string Message { get; init; }
}

// API integration helper
public static IResult TransitionToTypedResult<TState>(
    TransitionResult<TState> result,
    Func<TState, IResult> onSuccess);
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold .NET project + test project under `dotnet/src/HexGuard.StateMachine/` and `dotnet/tests/HexGuard.StateMachine.Tests/`.
2. Add solution file entries.

### Phase 1: Core Implementation

3. Implement `StateMachineBuilder<TState, TTrigger>` fluent API with `Configure(state).Allow(trigger, target).WithGuard(func)`.
4. Implement `StateMachine<TState, TTrigger>` with `FireAsync()`, `IsAllowed()`, `GetAllowedTriggers()`.
5. Implement guard clause evaluation — all guards must pass for transition to succeed.
6. Implement entry/exit action hooks.
7. Implement `onTransitioning`/`onTransitioned` lifecycle hooks.
8. Implement `TransitionResult<TState>` and `TransitionError` types.
9. Implement `TransitionToTypedResult()` ASP.NET Core helper for API endpoint integration.
10. Add unit tests for: valid transitions, invalid transitions, guard acceptance/rejection, entry/exit actions, lifecycle hooks, GetAllowedTriggers, concurrent transition safety, and circular transition detection.

### Phase 2: Sample API & Docs

11. Add a `HexGuard.StateMachine` sample endpoint to `HexGuard.SampleApi` demonstrating an order-status workflow.
12. Add integration tests.
13. Write `docs/packages/hexguard-state-machine.md`.
14. Update NuGet `README.md`.

### Phase 3: Release

15. Add build/test entries.
16. Add release workflow.
17. Run `pnpm dotnet:test` and `pnpm dotnet:build`.

## Validation

- `pnpm dotnet:test` — unit and integration tests.
- `pnpm dotnet:build` — package builds.
- Sample API manual check.

## Follow-Ups

- Revisit persistence integration (EF Core state-store) as a companion package.
- Evaluate saga/choreography support if cross-service workflow demand emerges.
- Consider a visual transition reporting helper that outputs a transition table for documentation.
