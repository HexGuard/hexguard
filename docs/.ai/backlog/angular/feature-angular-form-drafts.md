---
id: feature-angular-form-drafts
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-form-drafts'
---

# Angular Form Drafts Package

## Summary

Design `@hexguard/angular-form-drafts` as a package for standardizing draft persistence, restore,
discard, and autosave ergonomics for Angular edit flows.

The repeated problem is that complex forms often need local draft recovery, but teams implement
storage keys, schema changes, restore prompts, and discard behavior differently on every screen.

## Goals

- Standardize draft lifecycle state for edit forms.
- Support explicit save, discard, restore, and autosave-driven workflows.
- Allow pluggable storage such as memory, session storage, local storage, or app-defined adapters.
- Compose with dirty-state and async-state rather than duplicating them.

## Non-Goals

- Collaborative editing or live conflict resolution.
- Server-side draft synchronization in the first version.
- Validation-rule ownership.

## Decisions

- Prefer a storage-agnostic core contract.
- Keep draft identity explicit so apps can scope drafts by route, entity, or user.
- Avoid tying the package only to one Angular form model in v0.1.

## Proposed Public API

```ts
import { injectDraft, type DraftStorage } from '@hexguard/angular-form-drafts';

const draft = injectDraft('order-form-42', {
  version: 2,
  storage: localStorageDraftStorage(),
  autosaveIntervalMs: 10_000,
});

draft.data;              // Signal<T | null>
draft.hasDraft;          // Signal<boolean>
draft.isSaving;          // Signal<boolean>
draft.lastSaved;         // Signal<Date | null>
draft.version;           // number

// Autosave watches a signal source
draft.autosave(formValuesSignal);

// Manual control
draft.save(data);
draft.restore();
draft.discard();
draft.clear();

// Storage adapters
localStorageDraftStorage(namespace: string): DraftStorage;
sessionStorageDraftStorage(namespace: string): DraftStorage;
inMemoryDraftStorage(): DraftStorage;
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-form-drafts/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `DraftStorage` interface and built-in adapters (localStorage, sessionStorage, in-memory).
4. Implement `injectDraft()` with save, restore, discard, clear operations.
5. Implement versioning — compare draft version against expected version, discard on mismatch.
6. Implement autosave via `effect()` + configurable debounce interval.
7. Implement `hasDraft` signal for showing restore prompts.
8. Add unit tests for: save/restore cycle, version mismatch discard, autosave timing, discard, clear, missing key, storage error recovery, concurrent saves.

### Phase 2: Demo & Docs

9. Add demo route with an edit form, autosave indicator, restore prompt on revisit, discard button.
10. Add Playwright coverage.
11. Write docs, update README.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:form-drafts`.
- `pnpm test:e2e`.

## Validation

- Unit tests for storage adapters and draft lifecycle transitions.
- Demo coverage for autosave, restore, and discard behavior.
- Manual checks for route changes and entity-scoped draft isolation.

## Follow-Ups

- Decide whether Reactive Forms and Signal Forms adapters should live here or in companion packages.
- Revisit server-backed draft workflows only after local-first drafts prove broadly useful.
