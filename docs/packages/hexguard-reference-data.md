# HexGuard.ReferenceData Deep Dive

This page complements the NuGet-facing README with repo-specific implementation notes, validation
guidance, and cross-stack integration details.

## Purpose

`HexGuard.ReferenceData` provides typed reference-data catalog contracts for .NET applications. It
is the backend counterpart to `@hexguard/angular-lookups` and validates the same catalog shape that
the Angular frontend consumes.

The package is intentionally narrow:

- typed catalog, collection, and item records
- one built-in validator for duplicate keys, missing metadata, and empty labels
- an async provider interface with a validating in-memory default
- no storage, caching, or transport coupling

## Cross-Stack Pairing

| Layer   | Package                     | Role                                                                                             |
| ------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| .NET    | `HexGuard.ReferenceData`    | Validates and serves the versioned catalog contract                                              |
| Angular | `@hexguard/angular-lookups` | Loads, caches, and resolves labels from the catalog                                              |
| Shared  | `HexGuard.SampleApi`        | Exposes the catalog via `GET /api/angular-lookups/catalog` and `GET /api/reference-data/catalog` |

The `lookups` Angular demo at `/packages/angular-lookups/backend` and the `reference-data` .NET demo
at `/dotnet/reference-data` both draw from the same SampleApi and prove that the contract stays
consistent across stacks.

## Public API Map

| Type                                 | Role                                                                |
| ------------------------------------ | ------------------------------------------------------------------- |
| `ReferenceDataCatalog`               | Versioned root with `Metadata` and `Collections`                    |
| `ReferenceDataCatalogMetadata`       | Cache invalidation key (`Version` + `GeneratedAtUtc`)               |
| `ReferenceDataCollection`            | Named family with `Key`, `Revision`, and `Items`                    |
| `ReferenceDataItem`                  | One lookup option with `Key`, `Label`, `IsActive`, `Description`    |
| `ReferenceDataCatalogValidator`      | Static validator — catches duplicates, missing fields, null entries |
| `ReferenceDataValidationException`   | Thrown by `ValidateOrThrow()` with collected errors                 |
| `IReferenceDataCatalogProvider`      | Async provider interface for loading catalogs                       |
| `StaticReferenceDataCatalogProvider` | Validate-on-construct in-memory provider                            |

## Validation Rules

The `ReferenceDataCatalogValidator.Validate()` method checks:

- Metadata is not null
- `Metadata.Version` is not empty
- `Metadata.GeneratedAtUtc` is not the default value
- Collections array is not null
- No null entries in collections
- Every collection key is non-empty and unique
- Every collection has a non-null items array
- No null items in any collection
- Every item key is non-empty and unique
- Every item label is non-empty

## Demo Endpoints

The shared SampleApi exposes these `HexGuard.ReferenceData`-specific endpoints:

| Endpoint                                    | Description                                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `GET /api/reference-data/catalog`           | Serves a valid `ReferenceDataCatalog` through `StaticReferenceDataCatalogProvider` |
| `GET /api/reference-data/catalog/validate`  | Runs the validator on a known-good catalog and returns the error list              |
| `GET /api/reference-data/catalog/invalid`   | Returns a malformed catalog (duplicate collections) and the validator's error list |
| `GET /api/reference-data/collections/{key}` | Fetches one collection by key from the valid catalog                               |

Start the API from the repo root:

```bash
pnpm dotnet:start:demo-api
```

Then open the .NET showcase at `/dotnet/reference-data` in the Angular demo.

## SampleApi Source

The shared SampleApi demonstrates the intended library usage pattern:

```csharp
// Create a validated catalog
var catalog = new ReferenceDataCatalog(metadata, collections);

// StaticReferenceDataCatalogProvider validates on construction
var provider = new StaticReferenceDataCatalogProvider(catalog);
var result = await provider.GetCatalogAsync();

// Run validation without throwing
var errors = ReferenceDataCatalogValidator.Validate(catalog);
```

The full endpoint code lives in
`dotnet/samples/HexGuard.SampleApi/Packages/HexGuardReferenceData/`.

## Release Contract

- Version follows SemVer for the public API surface.
- The `ReferenceDataCatalog` record shape, `IReferenceDataCatalogProvider`, and
  `ReferenceDataCatalogValidator` public methods are stable in `0.x`.
- New validation rules or collection constraints are additive in minor versions.

## Related Resources

- [Package README](../../dotnet/src/HexGuard.ReferenceData/README.md)
- [Package Catalog](../README.md)
- [Sample API Endpoints](../../dotnet/samples/HexGuard.SampleApi/Packages/HexGuardReferenceData/)
- [Source Code](../../dotnet/src/HexGuard.ReferenceData/)
- [Angular Counterpart: `@hexguard/angular-lookups`](./angular-lookups.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                      | Severity |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| Public API Design         | Clean typed catalog contract with comprehensive validation (duplicate keys, nulls, empty labels).            | praise   |
| Implementation Quality    | `IReferenceDataCatalogProvider` interface with `StaticReferenceDataCatalogProvider` for dev/test.            | praise   |
| Cross-package Consistency | Release workflow included in `release-dotnet.yml`. Deep-dive doc exists. No Angular counterpart (pure .NET). | praise   |
| Implementation Quality    | No `InternalsVisibleTo` for test project — unlike Pagination, FeatureFlags, BulkOperations.                  | minor    |
