---
id: feature-ts-template
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-template'
---

# @hexguard/ts-template

## Summary

String template engine â€” `{{variable}}` interpolation, `{{#each}}` loops, `{{#if}}` conditionals, pipes. For email templates, reports, scaffolding.

**Competition check:** Handlebars/mustache are full engines. This is narrow and zero-dependency.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
export interface TemplateOptions {
  delimiters?: [string, string];   // Default: ['{{', '}}']
  escapeHtml?: boolean;             // Default: true
  helpers?: Record<string, (...args: unknown[]) => string>;
}

export function compile(template: string, options?: TemplateOptions): (data: Record<string, unknown>) => string;
export function render(template: string, data: Record<string, unknown>, options?: TemplateOptions): string;
// Supports: {{name}}, {{name | uppercase}}, {{#if cond}}...{{/if}}, {{#each items}}...{{/each}}
```

## Implementation Plan

1. Create `ts/packages/ts-template/`.
2. Implement parser + renderer.
3. Add tests.
4. Publish to npm.
