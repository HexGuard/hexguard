---
id: feature-blazor-import
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Import
---

# HexGuard.Blazor.Import

## Summary

Data import wizard state for Blazor. Counterpart to `@hexguard/angular-import`.

## Proposed Public API

```csharp
public sealed class ImportWizard<T> : IDisposable where T : new()
{
    public ImportPhase Phase { get; private set; }
    public IReadOnlyList<T> ValidRows { get; private set; }
    public IReadOnlyList<ImportError<T>> InvalidRows { get; private set; }
    public double Progress { get; private set; }
    public event Action? OnChanged;

    public Task SelectFileAsync(IBrowserFile file);
    public void SetColumnMap(Dictionary<string, string> map);
    public void Validate();
    public Task ImportAsync();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Import/` Razor class library.
2. Implement multi-phase state machine.
3. Test with bUnit.
4. Publish as NuGet.
