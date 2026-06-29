---
id: feature-blazor-dev-tools
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.DevTools'
---

# HexGuard.Blazor.DevTools

## Summary

Development-time helpers for Blazor — hot reload diagnostics, component render tracking, circuit inspector, and dependency graph visualization. Accelerates the Blazor development feedback loop.

## Problem

Blazor's development experience has pain points: hot reload sometimes silently fails without explanation, unnecessary component re-renders waste cycles, circuit state is invisible, and the component tree is opaque. Developers spend time on "why didn't my change take effect?" and "why is this re-rendering?" instead of building features.

## Goals

- Hot reload diagnostics (why a change didn't apply)
- Component render counter (highlight excessive re-renders)
- Circuit inspector (active circuits, memory, user sessions)
- Dependency graph visualization data
- Render mode indicator overlay (SSR vs Interactive)
- Compile-time warning for common mistakes
- Development-only — stripped from production builds

## Non-Goals

- No browser DevTools extension
- No production monitoring
- No performance profiling (uses built-in .NET profilers)

## Proposed Public API

```csharp
// Program.cs — development only
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddBlazorDevTools(options =>
    {
        options.ShowRenderCounters = true;    // shows re-render count per component
        options.ShowRenderMode = true;        // shows SSR/Server/WASM indicator
        options.HotReloadDiagnostics = true;  // logs why hot reload failed
        options.CircuitInspector = true;      // /_circuits endpoint
        options.ComponentTree = true;         // /_components endpoint
    });
}

// Render counter (auto-injected)
// In development, every component shows a small badge:
// [ProductsPage renders: 3]  ← auto-inserted

// Hot reload diagnostics
// Console output:
// [HotReload] Change in ProductsPage.razor applied ✓
// [HotReload] Change in CartService.cs REJECTED: method signature changed
//   → Restart required for: void AddToCart(int productId)

// Circuit inspector (GET /_circuits)
// Returns JSON:
// {
//   "circuits": [
//     { "id": "abc123", "user": "alice", "connectedAt": "...", "memoryMb": 45 },
//   ],
//   "totalCircuits": 3,
//   "totalMemoryMb": 135
// }

// Component tree (GET /_components)
// Returns JSON:
// {
//   "components": [
//     { "type": "MainLayout", "renderCount": 5, "children": [...] }
//   ]
// }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.DevTools/` with `.csproj` (RCL).
2. Implement render counter, render mode indicator, hot reload diagnostics.
3. Add circuit inspector endpoint and component tree endpoint.
4. Add conditional compilation for production stripping.
5. Add xunit tests. Register in `HexGuard.slnx`.
