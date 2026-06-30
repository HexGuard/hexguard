---
id: feature-angular-icon-registry
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-icon-registry'
---

# @hexguard/angular-icon-registry

## Summary

Headless icon registry — centralized SVG icon management with lazy loading, caching, sizing via design tokens, and coloring via currentColor. For design system icon consistency.

## Goals

- Centralized icon registry with typed icon names
- SVG sprite and individual SVG loading
- Lazy loading with caching
- Sizing via standardized scale tokens
- Coloring via design tokens (currentColor)
- Icon aliasing and deprecation

## Non-Goals

- No icon authoring tools
- No rendered icon picker UI
- No SVG optimization

## Proposed Public API

```typescript
export function provideIcons(config: {
  icons: Record<string, { svgContent: string; viewBox: string; aliases?: string[]; tags?: string[] }>;
  defaultSize?: string;
  lazyLoad?: boolean;
}): Provider[];

export function injectIcons(): {
  get(name: string): Signal<IconRenderData | null>;
  has(name: string): boolean;
  names(): string[];
  load(name: string): Promise<void>;
  preload(names: string[]): Promise<void>;
};

export interface IconRenderData {
  svgContent: string;
  viewBox: string;
  size: string;
  color: string;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-icon-registry/`.
2. Implement icon registration, lazy loading, caching, signal accessors.
3. Add sizing/coloring integration with design tokens.
4. Add tests. Register in workspace.
