---
id: feature-error-reporter-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Errors + @hexguard/angular-error-reporter'
---

# Error Reporter Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for structured error capture and reporting — the .NET side captures unhandled exceptions via middleware and routes them to a configurable sink; the Angular side captures client-side errors (unhandled promises, angular error handlers, console errors) and sends them to the server or a third-party service.

**Promoted from sidenote:** `@hexguard/angular-error-reporter` was an Angular sidenote. This brief adds the .NET counterpart for server-side error capture.

## Why Wide Adoption

Client-side errors (unhandled rejections, angular change detection errors, network failures) are invisible without a capture mechanism. Server-side unhandled exceptions need standardized capture and routing. Every production app needs both — yet every team wires them up ad-hoc.

## Goals

### .NET (`HexGuard.Errors`)

1. Provide `UseErrorCapture()` middleware that catches unhandled exceptions.
2. Provide `IErrorSink` interface with implementations for file, database, and HTTP forwarding.
3. Capture standard context: exception type, message, stack trace, request path, user, timestamp.
4. Support configurable error filtering (ignore expected errors).
5. Return standardized ProblemDetails to the client.

### Angular (`@hexguard/angular-error-reporter`)

1. Provide `provideErrorReporter()` — registers Angular `ErrorHandler` + global `onunhandledrejection` listener.
2. Capture errors with context: component, action, user, URL, timestamp.
3. Send to a configured endpoint or fallback sink.
4. Support error filtering (ignore known non-critical errors).
5. Expose `lastErrors` signal for debug UI.

## Proposed Public API

### .NET

```csharp
public interface IErrorSink
{
    Task CaptureAsync(ErrorContext error, CancellationToken ct);
}

public sealed record ErrorContext
{
    public string ErrorId { get; init; }
    public string ExceptionType { get; init; }
    public string Message { get; init; }
    public string StackTrace { get; init; }
    public string? RequestPath { get; init; }
    public string? UserId { get; init; }
    public DateTime Timestamp { get; init; }
    public IReadOnlyDictionary<string, string> Metadata { get; init; }
}

public static class ErrorCaptureExtensions
{
    public static IApplicationBuilder UseErrorCapture(
        this IApplicationBuilder app,
        Action<ErrorCaptureOptions>? configure = null);
}
```

### Angular

```typescript
export function provideErrorReporter(config: {
  endpoint?: string;                    // POST /api/errors
  sink?: ErrorSink;                     // Custom sink
  filter?: (error: Error) => boolean;   // Return true to capture
  includeContext?: boolean;
}): Provider[];

export function injectErrorReporter(): {
  readonly lastErrors: Signal<ReportedError[]>;
  readonly errorCount: Signal<number>;
  clear(): void;
};

export interface ReportedError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  component?: string;
  action?: string;
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Errors/` with standard `.csproj`.
2. Implement error capture middleware, `IErrorSink`, file and HTTP sinks.
3. Create Angular package with `provideErrorReporter()`.
4. Implement global error handler and unhandled rejection listener.
5. Add tests on both sides.
6. Register both packages.
