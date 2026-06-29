---
id: feature-blazor-form-helpers
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.FormHelpers'
---

# HexGuard.Blazor.FormHelpers

## Summary

Form state management helpers for Blazor — dirty tracking, validation summary, submission state, and auto-save. Reduces `EditContext` boilerplate.

## Pain Point

Blazor's form model (`EditForm` + `EditContext` + `DataAnnotationsValidator`) is functional but verbose:
- No built-in dirty/unsaved changes tracking
- No submission state (isSubmitting, submitError)
- Manual `EditContext.Validate()` calls before submit
- No auto-save or debounced save
- No form reset to original values
- Field-level validation messages require manual markup
- No confirmation on navigate-away with unsaved changes

## Goals

- Dirty/unsaved changes tracking per form
- Submission state with loading/error signals
- Auto-save with configurable debounce
- Form reset to original or default values
- Navigate-away confirmation when dirty
- Field-level validation summary
- Integration with `EditContext` — drop-in, not replacement

## Non-Goals

- No custom form controls or input components
- No replacement for DataAnnotations validation
- No form generation from models

## Proposed Public API

```csharp
public sealed class FormState : IDisposable
{
    public bool IsDirty { get; }
    public bool IsSubmitting { get; }
    public bool HasErrors { get; }
    public string? SubmitError { get; }
    public IReadOnlyDictionary<string, IEnumerable<string>> FieldErrors { get; }
    public int ModifiedFieldCount { get; }

    public void MarkAsSubmitted();
    public void MarkAsSubmitFailed(string error);
    public void Reset();
    public void ResetToValues(object values);

    public event Action? OnStateChanged;

    // Auto-save
    public void EnableAutoSave(Func<Task> saveAction, int debounceMs = 2000);
    public void DisableAutoSave();
}

// Usage in component
@code {
    private EditContext? _editContext;
    private FormState? _formState;

    protected override void OnInitialized()
    {
        _editContext = new EditContext(Model);
        _formState = new FormState(_editContext);
        _formState.EnableAutoSave(SaveAsync);
    }

    private async Task SaveAsync()
    {
        _formState.MarkAsSubmitted();
        try { await Api.Save(Model); }
        catch (Exception ex) { _formState.MarkAsSubmitFailed(ex.Message); }
    }

    // Navigate-away guard
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            Navigation.RegisterLocationChangingHandler(LocationChangingHandler);
    }

    private ValueTask LocationChangingHandler(LocationChangingContext ctx)
    {
        if (_formState!.IsDirty)
            return new ValueTask(Task.CompletedTask); // Blazor will prompt
        return ValueTask.CompletedTask;
    }
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.FormHelpers/` with `.csproj` (RCL).
2. Implement `FormState`, auto-save, dirty tracking, navigate-away guard.
3. Add field-level validation summary.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
