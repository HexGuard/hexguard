# HexGuard.Blazor.DebouncedInput

Headless debounced value primitive for Blazor — delay value propagation until the user stops typing, with configurable debounce window and leading/trailing invocation modes.

## Install

```bash
dotnet add package HexGuard.Blazor.DebouncedInput
```

## Quickstart

```csharp
// Program.cs
builder.Services.AddDebouncedValue<string>();
```

```razor
@* SearchField.razor *@
@implements IDisposable
@inject Func<Func<string, Task>, int, DebounceMode, DebouncedValue<string>> DebounceFactory

<input @oninput="OnSearch" @bind-value="searchText" placeholder="Search..." />

@code {
    private string searchText = "";
    private DebouncedValue<string>? _debounce;

    protected override void OnInitialized()
    {
        _debounce = DebounceFactory(
            async value => { /* call API */ },
            delayMs: 300,
            mode: DebounceMode.Trailing);
    }

    private void OnSearch(ChangeEventArgs e)
    {
        searchText = e.Value?.ToString() ?? "";
        _debounce!.Push(searchText);
    }

    public void Dispose() => _debounce?.Dispose();
}
```

## Features

| Feature | Description |
|---------|-------------|
| **Trailing debounce** (default) | Fire after pause — best for search-as-you-type |
| **Leading debounce** | Fire immediately, suppress subsequent within window |
| **Leading + Trailing** | Fire immediately AND after pause |
| **Flush** | Immediately invoke with latest pending value |
| **Cancel** | Discard pending without firing |
| **Max delay** | Hard cap on deferral — fires even while still typing |
| **No JS interop** | Pure C# — `CancellationTokenSource` + `Task.Delay` |
| **DI-friendly** | `AddDebouncedValue<T>()` registers a transient factory |

## Scope Boundaries

- ✅ Headless debounce primitive for any value type
- ✅ Works with any Blazor component or input
- ❌ No input component UI — value debouncing only
- ❌ No UI framework integration

## API

### `DebouncedValue<T>` (sealed, `IDisposable`)

| Member | Description |
|--------|-------------|
| `Create(onValue, delayMs, mode, maxDelayMs, onError)` | Static factory — creates a new debounce handler |
| `Push(T value)` | Push a new value into the debounce pipeline |
| `Flush()` | Immediately invoke with latest pending |
| `Cancel()` | Cancel in-flight debounce, discard pending |
| `LastProcessed` | The last value successfully processed |
| `Dispose()` | Cancel and clean up |

### `DebounceMode` (enum)

- `Trailing` — fire after pause (default)
- `Leading` — fire immediately, suppress subsequent
- `LeadingAndTrailing` — fire immediately and after pause

### `maxDelayMs`

When set (> 0), the debounce will fire after at most `maxDelayMs` milliseconds
even if new pushes keep resetting the delay timer. This prevents infinite deferral
when inputs never pause (e.g., holding down a key). Default is 0 (unlimited).

## License

MIT
