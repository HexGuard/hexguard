---
id: feature-content-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Content + @hexguard/angular-content'
---

# Content Management Cross-Stack Package Pair

## Summary

Coordinated .NET + Angular pair for CMS content management — shared content type schema, entry status workflow (draft/published/archived/scheduled), version history, and publishing scheduling.

### .NET (`HexGuard.Content`)
Content engine with `IContentStore`, EF Core store, content scheduler, auto-mapped CRUD API.

### Angular (`@hexguard/angular-content`)
Content editing state with signals, version history, draft/publish/archive workflow.

## Implementation Plan

1. Implement .NET engine with versioning and scheduling.
2. Implement Angular editing state consuming the .NET API.
3. Register both packages.
