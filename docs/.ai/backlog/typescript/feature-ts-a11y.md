---
id: feature-ts-a11y
type: feature
status: proposed
created: 2026-06-29
package: '@hexguard/ts-a11y'
---

# @hexguard/ts-a11y

## Summary

Zero-dependency accessibility utilities — ARIA attribute builders, contrast ratio calculation, focus order helpers, and WCAG compliance check functions.

## Proposed Public API

```typescript
// ARIA attribute builders
export function ariaLabel(label: string): { 'aria-label': string };
export function ariaDescribedBy(id: string): { 'aria-describedby': string };
export function ariaExpanded(expanded: boolean): { 'aria-expanded': string };
export function ariaSelected(selected: boolean): { 'aria-selected': string };
export function ariaHidden(hidden: boolean): { 'aria-hidden': string };
export function ariaLive(politeness: 'off' | 'polite' | 'assertive'): { 'aria-live': string };

// Contrast ratio (WCAG 2.1)
export function contrastRatio(foreground: string, background: string): number;
export function meetsWcagAA(foreground: string, background: string, isLargeText?: boolean): boolean;
export function meetsWcagAAA(foreground: string, background: string, isLargeText?: boolean): boolean;

// Color utilities
export function relativeLuminance(hex: string): number;
export function parseHexColor(hex: string): [number, number, number];

// Focus order
export function getFocusableElements(container: HTMLElement): HTMLElement[];
export function getTabbableElements(container: HTMLElement): HTMLElement[];
export function isFocusable(element: HTMLElement): boolean;

// Keyboard
export function isActivationKey(event: KeyboardEvent): boolean; // Enter or Space
export function isEscapeKey(event: KeyboardEvent): boolean;
export function isArrowKey(event: KeyboardEvent): 'up' | 'down' | 'left' | 'right' | null;

// ARIA roles
export const AriaRoles: {
  alert: string; dialog: string; tablist: string; tab: string; tabpanel: string;
  menu: string; menuitem: string; listbox: string; option: string; tooltip: string;
};
```

## Implementation Plan
1. Create `ts/packages/ts-a11y/` with zero dependencies.
2. Implement ARIA builders, contrast ratio, WCAG checks, focus order, keyboard helpers.
3. Add tests. Publish to npm.
