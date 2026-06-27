---
id: feature-ts-cli
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-cli'
---

# @hexguard/ts-cli

## Summary

CLI helpers for TypeScript — argument parsing, progress bars, spinners, prompts, colored output. For building Node.js CLI tools and scripts.

## Proposed Public API

```typescript
// Argument parsing
export function parseArgs<T>(schema: ArgSchema<T>): T & { _: string[]; help: boolean };

// Progress bar
export function progress(label: string, total: number): ProgressBar;
export interface ProgressBar { tick(n?: number): void; update(n: number): void; complete(msg?: string): void; }

// Spinner
export function spinner(label: string): Spinner;
export interface Spinner { start(): void; stop(): void; succeed(text?: string): void; fail(text?: string): void; }

// Prompts
export function prompt(questions: Question[]): Promise<Record<string, string>>;

// Colors (ANSI)
export const colors: { red: (s: string) => string; green; blue; yellow; cyan; magenta; gray; bold; dim };
```

## Implementation Plan
1. Create `ts/packages/ts-cli/`.
2. Implement all helpers.
3. Add tests.
4. Publish to npm.
