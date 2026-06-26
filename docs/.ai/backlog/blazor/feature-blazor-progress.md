---
id: feature-blazor-progress
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Progress
---

# HexGuard.Blazor.Progress

## Summary

Progress state management for Blazor — determinate (0–100%), indeterminate (animated), step-based (step 2 of 5), and circular progress state with status messages, ETA calculation, and completion callbacks. Every long-running operation, multi-step wizard, file upload, and data export needs progress state management — yet every Blazor team re-implements the same percentage tracking and timer logic.

**Competition check (NuGet):** Zero standalone Blazor progress-state packages exist. Some UI libraries include progress bar components but bundle them with rendering and styling.

## Why Wide Adoption

Progress indication is universal: file uploads, data exports, batch processing, multi-step forms, installation wizards, data synchronization. Separating progress state from progress bar UI lets apps use the same state with any design system.

## Goals

1. Provide `ProgressState` — determinate (0–100) and indeterminate modes with label, sub-label, and status.
2. Provide `StepProgress` — step-based progress (current step, total steps, step labels).
3. Support ETA calculation from rate of progress.
4. Support `Complete()`, `Reset()`, `Fail(error)` state transitions.
5. Fire `OnChanged` event for UI binding.
6. Pure C# — no JS interop required.

## Non-Goals

- No progress bar UI component (headless state only).
- No animation or transitions.

## Proposed Public API

```csharp
// ── Determinate Progress ──────────────────────────────────

public sealed class ProgressState : IDisposable
{
    public double Value { get; private set; }        // 0–100
    public bool IsIndeterminate { get; private set; }
    public string? Label { get; private set; }       // "Uploading..."
    public string? SubLabel { get; private set; }    // "12 of 45 files"
    public ProgressStatus Status { get; private set; }
    public TimeSpan? Eta { get; private set; }
    public event Action? OnChanged;

    public void Report(double value, string? label = null, string? subLabel = null);
    public void StartIndeterminate(string? label = null);
    public void Complete(string? label = null);
    public void Fail(string? error);
    public void Reset();
}

public enum ProgressStatus { Idle, Running, Indeterminate, Completed, Failed }

// ── Step Progress ─────────────────────────────────────────

public sealed class StepProgress
{
    public int CurrentStep { get; private set; }     // 1-based
    public int TotalSteps { get; private set; }
    public string? CurrentLabel { get; private set; }
    public bool IsComplete => CurrentStep > TotalSteps;
    public double Percentage => (double)(CurrentStep - 1) / TotalSteps * 100;
    public event Action? OnChanged;

    public void Advance(string? label = null);
    public void GoToStep(int step, string? label = null);
    public void Reset();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddTransient<ProgressState>();
builder.Services.AddTransient<StepProgress>();

// ── Usage ─────────────────────────────────────────────────

@inject ProgressState UploadProgress

<div>
    @if (UploadProgress.Status == ProgressStatus.Running)
    {
        <div class="progress-bar" style="width: @(UploadProgress.Value)%;">
            @($"{(int)UploadProgress.Value}%")
        </div>
        <span>@UploadProgress.Label</span>
    }
    @if (UploadProgress.Status == ProgressStatus.Completed)
    {
        <span class="success">Complete!</span>
    }
</div>

<button @onclick="StartUpload" disabled="@(UploadProgress.Status == ProgressStatus.Running)">
    Upload
</button>

@code {
    private async Task StartUpload()
    {
        UploadProgress.Report(0, "Starting...");
        foreach (var file in files)
        {
            await UploadFile(file);
            UploadProgress.Report(UploadProgress.Value + 10, $"Uploaded {file.Name}");
        }
        UploadProgress.Complete("All files uploaded");
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Progress/` Razor class library.
2. Implement `ProgressState` with determinate/indeterminate/report/complete/fail.
3. Implement `StepProgress` with advance/go-to-step/percentage.
4. Add ETA calculation from progress rate.
5. Test with xUnit + bUnit.
6. Publish as NuGet.
