---
id: feature-search-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.Search + @hexguard/angular-search'
---

# Search / Autocomplete Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.Search` + `@hexguard/angular-search`) for standardized search-query contracts, autocomplete response models, server-driven typeahead with debounce, result-highlight tokens, and typed autocomplete response models for consistent search and finder experiences.

The repeated problem is that most business apps need search-as-you-type, autocomplete dropdowns, and finder dialogs — for products, customers, orders, documents, users — yet every team builds the same debounce-input → API call → result-list → highlight-tokens → loading-state → error-state → empty-state → keyboard-navigation pipeline from scratch. The API contract (query string, result limit, highlighting tokens, metadata) is invented independently each time.

## Goals

- Define a shared search/autocomplete contract with typed request and response models.
- Provide a .NET package (`HexGuard.Search`) for search-query parsing, paginated search-response envelopes, result-highlighting token conventions, and minimal-API endpoint helpers.
- Provide an Angular package (`@hexguard/angular-search`) that composes debounced input, async-state loading, dropdown visibility, keyboard navigation, and result highlighting into a headless autocomplete lifecycle.
- Compose the Angular package with `@hexguard/angular-debounce` (proposed) and `@hexguard/angular-async-state` (available).
- Keep the core contract flexible — simple string query with typed results, adaptable to full-text search, database LIKE queries, or external search services.

## Non-Goals

- Full-text search engine integration (Elasticsearch, Azure AI Search, MeiliSearch) — the contract stays search-engine agnostic.
- Search relevance ranking or tuning — that's backend-specific.
- Search analytics or query-logging.
- Filter or facet support in the first version — keep the contract narrow.

## Decisions

- Keep the search query simple: `query: string`, `maxResults: number`, optional `scope: string`.
- Highlight tokens are returned as an array of `{ start, length }` offsets that the Angular side maps to `<mark>` or `<strong>` elements.
- The Angular package provides a headless `autocompleteState()` primitive — the consumer renders the dropdown UI.
- Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape) is built into the Angular headless state.
- Release-coupling: independent minor versions with opt-in coordinated major releases.

## Proposed Contracts

### .NET Models

```csharp
public record SearchRequest(
    string Query,
    int MaxResults = 10,
    string? Scope = null
);

public record SearchResponse<T>(
    IReadOnlyList<SearchResult<T>> Results,
    int TotalCount,
    string Query
);

public record SearchResult<T>(
    T Item,
    string DisplayText,                          // rendered text with highlights
    IReadOnlyList<HighlightToken>? Highlights    // nullable — server may not support
);

public record HighlightToken(
    int Start,
    int Length
);
```

### Angular Types

```ts
interface SearchRequest {
  query: string;
  maxResults?: number;
  scope?: string;
}

interface SearchResponse<T> {
  results: SearchResult<T>[];
  totalCount: number;
  query: string;
}

interface SearchResult<T> {
  item: T;
  displayText: string;
  highlights?: HighlightToken[];
}

interface HighlightToken {
  start: number;
  length: number;
}

// Headless autocomplete state
interface AutocompleteState<T> {
  readonly query: WritableSignal<string>; // bound to input
  readonly results: Signal<SearchResult<T>[]>;
  readonly isOpen: Signal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly isEmpty: Signal<boolean>;
  readonly selectedIndex: Signal<number | null>;
  readonly highlightedText: (result: SearchResult<T>) => string; // applies <mark> tags
  open(): void;
  close(): void;
  selectNext(): void;
  selectPrevious(): void;
  selectCurrent(): T | null;
}
```

## Implementation Plan

### Phase 0: .NET — HexGuard.Search

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.Search/` and `dotnet/tests/HexGuard.Search.Tests/`.
2. Define the core types: `SearchRequest`, `SearchResponse<T>`, `SearchResult<T>`, `HighlightToken`.
3. Implement `SearchEndpoint` minimal-API helper — parses query, maxResults, scope from query string.
4. Implement `SearchResponseBuilder<T>` — wraps search results into the response envelope with highlight token extraction.
5. Implement basic text-highlight token generation (case-insensitive substring match → offset array).
6. Add a sample search endpoint in `HexGuard.SampleApi` under `Packages/HexGuardSearch/` with an in-memory product/user/order catalog.
7. Add unit and integration tests via `WebApplicationFactory`.

### Phase 1: Angular — @hexguard/angular-search

8. Scaffold the publishable Angular library under `angular/packages/angular-search/` following existing conventions.
9. Define the Angular TypeScript types mirroring the .NET contracts.
10. Implement `autocompleteState<T>(searchFn, options?)` headless primitive:
    - Manages query signal, results signal, loading state, open/closed state
    - Composes with `@hexguard/angular-debounce` for input debounce
    - Composes with `@hexguard/angular-async-state` for the fetch lifecycle
    - Implements keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
    - Provides `highlightedText()` helper that wraps highlight tokens in `<mark>` tags
11. Implement `injectSearch<T>()` convenience facade.
12. Add unit tests for: query debounce, result display, open/close behavior, keyboard navigation, highlight token rendering, loading state, empty state, error handling, and cleanup.

### Phase 2: Demo & Docs

13. Add a demo route at `/packages/angular-search` showing:
    - Product search-as-you-type with autocomplete dropdown
    - Keyboard navigation (ArrowDown/ArrowUp/Enter)
    - Highlighted matching tokens in results
    - Loading indicator during search
    - Empty state when no results
    - Error state when API fails
    - Integration with the .NET sample API via `pnpm dotnet:start:demo-api`
14. Add the search endpoint to the shared `HexGuard.SampleApi`.
15. Add Playwright coverage for the demo page.
16. Write deep-dive docs: `docs/packages/angular-search.md`, `docs/packages/hexguard-search.md`.
17. Update the npm-facing and NuGet READMEs.

### Phase 3: Release

18. Add build, test, and verify scripts for both packages.
19. Add `.github/workflows/release-angular-search.yml` and `.github/workflows/release-dotnet-search.yml`.
20. Run `pnpm test:ci`, `pnpm build`, `pnpm dotnet:test`, and `pnpm dotnet:build` for the full validation gate.

## Validation

- `pnpm dotnet:test` — .NET unit and integration tests for search response building, highlight generation.
- `pnpm test:lib:search` — Angular unit tests for autocomplete state, keyboard nav, highlighting, debounce composition.
- `pnpm build:lib` — Angular package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm dotnet:build` — .NET package builds.

## Follow-Ups

- Revisit filter/facet support in the search contract once the base search flow proves out.
- Evaluate server-side highlight strategies (case-insensitive, diacritic-insensitive, stemming-aware) as optional plugins.
- Consider a `@hexguard/angular-search-ui` companion with a default dropdown template for quick adoption.
