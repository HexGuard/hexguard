---
id: feature-dotnet-sagas
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Sagas
---

# HexGuard.Sagas

## Summary

Lightweight saga/process manager — coordinate long-running business transactions with compensating actions and state persistence.

## Proposed Public API

```csharp
public abstract class Saga<TData> where TData : new()
{
    protected TData Data { get; }
    public SagaState State { get; private set; }
    public string SagaId { get; }

    protected void TransitionTo(SagaState state);
    protected void MarkComplete();
    protected void MarkFailed(string reason);

    public abstract Task HandleAsync<TEvent>(TEvent @event);
}

public enum SagaState { Pending, Running, Completed, Failed, Compensating }

// Usage
public class OrderSaga : Saga<OrderSagaData>
{
    public override async Task HandleAsync<TEvent>(TEvent @event)
    {
        switch (@event)
        {
            case OrderPlaced e:
                Data.OrderId = e.OrderId;
                await ReserveInventory(e);       // Step 1
                TransitionTo(SagaState.Running);
                break;
            case PaymentConfirmed:
                await ConfirmOrder(Data.OrderId);  // Step 2
                MarkComplete();
                break;
            case PaymentFailed:
                await ReleaseInventory(Data.OrderId);  // Compensate
                MarkFailed("Payment declined");
                break;
        }
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Sagas/`.
2. Implement saga base class and state persistence.
3. Add tests.
4. Register in `HexGuard.slnx`.
5. Publish as NuGet.
