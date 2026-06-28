---
id: feature-angular-content
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-content'
---

# @hexguard/angular-content

## Summary

Headless CMS content editing state â€” content types, entries, draft/published/archived, version history.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export interface ContentEntry {
  id: string; contentTypeId: string;
  status: 'draft' | 'published' | 'archived';
  data: Record<string, unknown>; version: number;
  createdAt: Date; updatedAt: Date; publishedAt?: Date;
}

export function injectContentService(config: { apiEndpoint: string }): {
  readonly entries: Signal<ContentEntry[]>;
  readonly selectedEntry: Signal<ContentEntry | null>;
  readonly versions: Signal<ContentEntry[]>;
  create(typeId: string, data: Record<string, unknown>): Promise<ContentEntry>;
  update(id: string, data: Record<string, unknown>): Promise<ContentEntry>;
  publish(id: string): Promise<void>;
  archive(id: string): Promise<void>;
  restoreVersion(id: string, version: number): Promise<void>;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-content/`.
2. Implement CRUD with signals.
3. Implement version history and status workflow.
4. Add tests.
5. Register in workspace.
