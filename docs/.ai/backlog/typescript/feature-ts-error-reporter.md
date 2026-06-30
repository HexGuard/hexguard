---
id: feature-ts-error-reporter
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-error-reporter'
---

# @hexguard/ts-error-reporter

## Summary

Zero-dependency error serialization and reporting utilities — error normalization, stack trace parsing, breadcrumb collection, and transport-agnostic reporting. Framework-agnostic error pipeline.

## Proposed Public API

```typescript
// Error normalization
export function normalizeError(error: unknown): NormalizedError;
export interface NormalizedError {
  type: string;
  message: string;
  stack?: StackFrame[];
  cause?: NormalizedError;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  fingerprint?: string[];
}

// Stack parsing
export function parseStackTrace(stack: string): StackFrame[];
export interface StackFrame {
  filename?: string;
  function?: string;
  line?: number;
  column?: number;
  isInternal: boolean;
  raw: string;
}

// Breadcrumbs
export class BreadcrumbCollector {
  add(breadcrumb: Breadcrumb): void;
  getAll(): Breadcrumb[];
  clear(): void;
  toJSON(): string;
}
export interface Breadcrumb {
  category: 'navigation' | 'http' | 'click' | 'console' | 'custom';
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
}

// Transport interface
export interface ErrorTransport {
  send(errors: NormalizedError[]): Promise<void>;
}

// Batch reporter
export function createErrorReporter(transport: ErrorTransport, options?: ReporterOptions): ErrorReporter;
export interface ErrorReporter {
  capture(error: unknown, context?: ErrorContext): void;
  flush(): Promise<void>;
}
export interface ReporterOptions {
  maxBatchSize?: number;
  flushIntervalMs?: number;
  maxBreadcrumbs?: number;
  beforeSend?: (error: NormalizedError) => NormalizedError | null;
}

// Console transport (dev)
export function consoleTransport(): ErrorTransport;

// Fetch transport
export function fetchTransport(endpoint: string, headers?: Record<string, string>): ErrorTransport;
```

## Implementation Plan
1. Create `ts/packages/ts-error-reporter/` with zero dependencies.
2. Implement error normalization, stack parsing, breadcrumbs, batch reporter.
3. Add console + fetch transports.
4. Add tests. Publish to npm.
