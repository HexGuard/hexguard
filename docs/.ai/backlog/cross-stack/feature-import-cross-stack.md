---
id: feature-import-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Import + @hexguard/angular-import'
---

# Data Import Cross-Stack Package Pair

## Summary

Coordinated .NET + Angular pair for data import — file parsing, column mapping, validation, preview, and execution with shared error contract.

### .NET (`HexGuard.Import`)
Server-side file parsing, validation endpoint, batch import processing.

### Angular (`@hexguard/angular-import`)
Client-side import wizard state with phases: select → map → validate → preview → import.

## Implementation Plan

1. Implement .NET import processing pipeline.
2. Implement Angular import wizard state.
3. Register both packages.
