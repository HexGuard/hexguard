# HexGuard.Blazor.DebouncedInput

Headless debounced value primitive for Blazor applications.

## Public API

### `DebouncedValue<T>` (sealed class, `IDisposable`)

The core debounce handler for any value type.

| Member | Signature | Description |
|--------|-----------|-------------|
| `Create` | `static DebouncedValue<T> Create(Func<T, Task> onValue, int delayMs = 300, DebounceMode mode = Trailing, int maxDelayMs = 0, Action<Exception>? onError = null)` | Static factory. Creates a new debounce handler. `maxDelayMs` caps total deferral time even during continuous input. |
| `Push` | `void Push(T value)` | Pushes a value into the debounce pipeline. The callback fires according to the configured `DebounceMode`. |
| `Flush` | `void Flush()` | Immediately invokes the callback with the most recent pending value. Cancels any in-flight debounce. |
| `Cancel` | `void Cancel()` | Cancels any in-flight debounce without invoking the callback. Pending values are discarded. |
| `LastProcessed` | `T? LastProcessed { get; }` | The last value that was successfully processed by the callback. `null` until the first invocation. |
| `Dispose` | `void Dispose()` | Disposes the handler, cancelling any in-flight operation. |

### `DebounceMode` (enum)

| Value | Behavior |
|-------|----------|
| `Trailing` | Fire after the debounce window elapses with no new pushes (default). |
| `Leading` | Fire immediately on the first push, suppress subsequent pushes until the window elapses. |
| `LeadingAndTrailing` | Fire immediately on the first push AND again after the window elapses with the most recent value. |

### `ServiceCollectionExtensions`

| Method | Description |
|--------|-------------|
| `AddDebouncedValue<T>(IServiceCollection)` | Registers a transient factory for `DebouncedValue<T>`. Each component creates its own instance. |

## Usage Patterns

### Search-as-you-type with max delay (Trailing)

```csharp
var search = DebouncedValue<string>.Create(
    async query => { /* call search API */ },
    delayMs: 300,
    maxDelayMs: 1000);
// Fires after 300ms of inactivity, or at most 1000ms from first keystroke
```

### Search-as-you-type (Trailing)

```csharp
// Registration
builder.Services.AddDebouncedValue<string>();

// Component — inject the factory
@inject Func<Func<string, Task>, int, DebounceMode, DebouncedValue<string>> DebounceFactory

@code {
    private DebouncedValue<string>? _debounce;

    protected override void OnInitialized()
    {
        _debounce = DebounceFactory(
            async query => { /* call search API */ },
            delayMs: 300);
    }

    private void OnInput(ChangeEventArgs e)
    {
        _debounce!.Push(e.Value?.ToString() ?? "");
    }

    public void Dispose() => _debounce?.Dispose();
}
```

### Form auto-save (Trailing, longer delay)

```csharp
var autoSave = DebouncedValue<FormData>.Create(
    async data => { await SaveToApi(data); },
    delayMs: 2000); // 2-second pause before save
```

### Leading mode — immediate response

```csharp
var instant = DebouncedValue<string>.Create(
    async value => { /* immediately process */ },
    delayMs: 500,
    mode: DebounceMode.Leading);
// First Push() fires immediately; subsequent within 500ms are suppressed
```

## Behavior Contract

### Trailing mode

```
Push("a") ──────[300ms]──────→ callback("a")
Push("b") ─┬─[100ms]─┤         (reset)
           Push("c") ──[300ms]──→ callback("c")
```

### Leading mode

```
Push("a") → callback("a") ──[300ms]──┤
Push("b") ─────────(suppressed)──────┤
Push("c") ─────────(suppressed)──────┤
```

### LeadingAndTrailing mode

```
Push("a") → callback("a") ──[300ms]──→ callback("a")
```

### Flush

```
Push("a") ──Flush()──→ callback("a")  (immediately, no waiting)
```

### Cancel

```
Push("a") ──Cancel()──→ (nothing fires)
```

### Max delay (prevents infinite deferral)

```
delayMs=300, maxDelayMs=800

Push("a") ──[100ms]── Push("b") ──[100ms]── Push("c") ──[100ms]── Push("d")
    │                                                              │
    └────────── 800ms from first push ─────────────────────────────┘
                                                                    → callback("d")
```

## Thread Safety

`DebouncedValue<T>` is designed for Blazor's single-threaded synchronization context. It uses `CancellationTokenSource` for cooperative cancellation of in-flight delay tasks.

## Release Contract

- `0.x` — Breaking changes may occur between minor versions. Changes will be documented in `CHANGELOG.md`.
- No JavaScript interop dependency — pure .NET.
- Target framework: `net10.0`.
