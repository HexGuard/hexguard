---
id: feature-angular-prompt
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-prompt'
---

# @hexguard/angular-prompt

## Summary

Headless AI prompt management state — prompt templates, variable interpolation, version history, test-run with live preview, and evaluation. Composes with `angular-chat` for streaming output display. **Essential for AI-powered features.**

## Proposed Public API

```typescript
export interface PromptTemplate { id: string; name: string; template: string; variables: string[]; version: number; }

export function injectPromptManager(config: { endpoint: string }): {
  readonly templates: Signal<PromptTemplate[]>;
  readonly selected: Signal<PromptTemplate | null>;
  readonly rendered: Signal<string>;                                    // Template with variables filled
  readonly testResult: Signal<string | null>;                           // AI response from test run
  readonly isTesting/error: Signal<boolean>;
  select(id: string): void; create/update/delete: Promise<void>;
  setVariable(name: string, value: string): void;
  testRun(): Promise<void>;                                            // Sends to AI, streams back
};

export function injectPromptVariables(template: string): {
  readonly variables: Signal<string[]>;                                 // Auto-detected from {{var}}
  readonly values: Signal<Record<string, string>>;
  readonly preview: Signal<string>;                                     // Live preview with current values
  setValue(name: string, value: string): void;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-prompt/`.
2. Implement template management, variable interpolation, test-run with streaming.
3. Add tests. Register in workspace.
