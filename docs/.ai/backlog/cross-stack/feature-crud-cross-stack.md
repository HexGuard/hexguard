---
id: feature-crud-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Crud + @hexguard/angular-data-grid'
---

# CRUD Cross-Stack Acceleration Pair

## Summary

Server-side auto-CRUD (`HexGuard.Crud`) + client-side pre-built data grid (`@hexguard/angular-data-grid`) consuming the same pagination, filter, and error contracts. **10x faster CRUD screen development.**

### .NET (`HexGuard.Crud`)
`MapCrud<T>()` auto-generates paginated, validated CRUD endpoints with ProblemDetails.

### Angular (`@hexguard/angular-data-grid`)
`injectDataGrid<T>()` composes table + pagination + selection + filter + sort consuming the .NET CRUD endpoints.
