# Changelog

## 0.1.0 — 2026-06-26

Initial release of `HexGuard.Blazor.DebouncedInput`.

### Features

- `DebouncedValue<T>` sealed class with `IDisposable` — headless debounce for any value type
- `DebounceMode` enum: `Trailing`, `Leading`, `LeadingAndTrailing`
- `Push()`, `Flush()`, `Cancel()`, `LastProcessed` API
- Pure C# implementation — no JS interop required
- `AddDebouncedValue<T>()` DI registration extension
