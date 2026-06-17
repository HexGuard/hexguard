# HexGuard.ReferenceData

Typed reference-data catalog contracts and validation helpers for .NET applications.

Reference data — option lists, category keys, supplier codes, lifecycle states — is one of the most
repeated patterns in line-of-business apps. This library puts a single typed contract around that
pattern so catalogs are validated at the boundary, queried by stable keys through a shared provider
interface, and stay inspectable instead of scattered across ad hoc key-value maps.

## Quick Start

```shell
dotnet add package HexGuard.ReferenceData
```

### Build a catalog in memory

```csharp
using HexGuard.ReferenceData;

var catalog = new ReferenceDataCatalog(
    new ReferenceDataCatalogMetadata(
        Version: "products-2026-06-15",
        GeneratedAtUtc: DateTimeOffset.UtcNow),
    [
        new ReferenceDataCollection(
            Key: "categories",
            Revision: "categories-r1",
            Items: [
                new ReferenceDataItem("hardware", "Hardware"),
                new ReferenceDataItem("software", "Software"),
                new ReferenceDataItem("services", "Services", IsActive: false),
            ]),
    ]);

// Validate before serving
ReferenceDataCatalogValidator.ValidateOrThrow(catalog);
```

### Serve through the provider interface

```csharp
// The provider validates the catalog on construction.
var provider = new StaticReferenceDataCatalogProvider(catalog);
var result = await provider.GetCatalogAsync();

// Look up labels
var collection = result.FindCollection("categories");
string? label = collection?.FindLabel("hardware"); // "Hardware"
```

### Validate without throwing

```csharp
var errors = ReferenceDataCatalogValidator.Validate(catalog);

if (errors.Count > 0)
{
    foreach (var error in errors)
    {
        Console.WriteLine(error);
    }
}
```

## Core Types

### `ReferenceDataCatalog`

The root aggregate. Holds one set of metadata and one list of named collections.

| Member                              | Type                                     | Description                            |
| ----------------------------------- | ---------------------------------------- | -------------------------------------- |
| `Metadata`                          | `ReferenceDataCatalogMetadata`           | Version + generation timestamp         |
| `Collections`                       | `IReadOnlyList<ReferenceDataCollection>` | Named collection families              |
| `FindCollection(string key)`        | `ReferenceDataCollection?`               | Finds one collection by key (ordinal)  |
| `GetRequiredCollection(string key)` | `ReferenceDataCollection`                | Same but throws `KeyNotFoundException` |

### `ReferenceDataCatalogMetadata`

| Field            | Type             | Description                                           |
| ---------------- | ---------------- | ----------------------------------------------------- |
| `Version`        | `string`         | Cache-invalidation key (e.g. `"products-2026-06-15"`) |
| `GeneratedAtUtc` | `DateTimeOffset` | When this catalog was generated                       |

### `ReferenceDataCollection`

| Field                   | Type                               | Description                          |
| ----------------------- | ---------------------------------- | ------------------------------------ |
| `Key`                   | `string`                           | Unique collection identifier         |
| `Revision`              | `string?`                          | Optional revision tracker            |
| `Items`                 | `IReadOnlyList<ReferenceDataItem>` | Lookup options                       |
| `FindItem(string key)`  | `ReferenceDataItem?`               | Finds one item by key (ordinal)      |
| `FindLabel(string key)` | `string?`                          | Shorthand for `FindItem(key)?.Label` |

### `ReferenceDataItem`

| Field         | Type      | Default | Description                             |
| ------------- | --------- | ------- | --------------------------------------- |
| `Key`         | `string`  | —       | Stable identifier                       |
| `Label`       | `string`  | —       | Display text                            |
| `IsActive`    | `bool`    | `true`  | Whether this option is currently active |
| `Description` | `string?` | `null`  | Optional longer description             |

### `IReferenceDataCatalogProvider`

Async provider boundary for any catalog source:

```csharp
public interface IReferenceDataCatalogProvider
{
    ValueTask<ReferenceDataCatalog> GetCatalogAsync(
        CancellationToken cancellationToken = default);
}
```

### `StaticReferenceDataCatalogProvider`

In-memory implementation that validates the catalog instance on construction
and returns the same frozen instance on every call.

### `ReferenceDataCatalogValidator`

Static guard that checks all contract rules (see [Validation Rules](#validation-rules)).

| Method                     | Behavior                                                |
| -------------------------- | ------------------------------------------------------- |
| `Validate(catalog)`        | Returns error list (empty when valid)                   |
| `ValidateOrThrow(catalog)` | Throws `ReferenceDataValidationException` on violations |

### `ReferenceDataValidationException`

Carries the full list of contract-violation messages in its `Errors` property.

## Real-World Scenarios

### Scenario 1: Product editor with cascading selects

A product form needs category, supplier, and lifecycle selects populated from a backend catalog.

```csharp
// Backend API loads and validates the catalog once at startup
var catalog = await LoadCatalogFromDatabaseAsync();
ReferenceDataCatalogValidator.ValidateOrThrow(catalog);

var provider = new StaticReferenceDataCatalogProvider(catalog);

// API endpoint returns typed JSON
app.MapGet("/api/catalog", async (IReferenceDataCatalogProvider provider) =>
{
    var catalog = await provider.GetCatalogAsync();
    return Results.Ok(catalog);
});
```

The Angular frontend uses `@hexguard/angular-lookups` to cache and resolve labels from the same
payload — see the [cross-stack demo](../../../docs/demo/README.md).

### Scenario 2: Label resolution in a summary grid

A product detail page shows category and supplier names resolved from shared catalog keys instead
of storing display text in the product record.

```csharp
var categories = catalog.GetRequiredCollection("categories");
var suppliers = catalog.GetRequiredCollection("suppliers");

foreach (var product in products)
{
    var categoryLabel = categories.FindLabel(product.CategoryKey) ?? "Unknown";
    var supplierLabel = suppliers.FindLabel(product.SupplierKey) ?? "Unknown";
    // Render summary row
}
```

The same label resolution happens on the Angular side via the
[`HexguardLookupLabelPipe`](../../../angular/packages/angular-lookups/src/lib/hexguard-lookup-label.pipe.ts),
so both server-rendered and client-rendered views use the same catalog data.

### Scenario 3: Versioned catalog with refresh

A backend service publishes catalog snapshots at known versions. Consumers detect stale data by
comparing the `Version` field and request a refresh.

```csharp
// Version 1
var catalogV1 = new ReferenceDataCatalog(
    new ReferenceDataCatalogMetadata("products-2026-06-15", /* ... */), collectionsV1);

// After data change — version 2
var catalogV2 = new ReferenceDataCatalog(
    new ReferenceDataCatalogMetadata("products-2026-07-01", /* ... */), collectionsV2);

// Consumers compare metadata.Version to decide whether to refresh
if (current.Version != latest.Version)
{
    // Trigger reload
}
```

The Angular side exposes this through `injectLookups().version` and `injectLookups().metadata` signals
so UI components react to version changes automatically.

### Scenario 4: Validation at the API boundary

An API endpoint returns a validation summary alongside the catalog so callers can inspect contract
compliance without running their own validator.

```csharp
app.MapGet("/api/catalog/validate", () =>
{
    var catalog = SampleReferenceDataCatalogs.CreateProductCatalog();
    var errors = ReferenceDataCatalogValidator.Validate(catalog);

    return Results.Ok(new
    {
        isValid = errors.Count == 0,
        errors,
        catalog,
    });
});
```

## Validation Rules

The validator checks 13 contract rules:

| #   | Rule                                   | Error message                                                   |
| --- | -------------------------------------- | --------------------------------------------------------------- |
| 1   | Catalog is not null                    | _(ArgumentNullException)_                                       |
| 2   | `Metadata` is not null                 | `"Metadata is required."`                                       |
| 3   | `Metadata.Version` is not empty        | `"Metadata.Version is required."`                               |
| 4   | `Metadata.GeneratedAtUtc` is set       | `"Metadata.GeneratedAtUtc must be set."`                        |
| 5   | `Collections` is not null              | `"Collections are required."`                                   |
| 6   | No null entries in `Collections`       | `"Collections cannot contain null entries."`                    |
| 7   | Every collection `Key` is non-empty    | `"Collection keys are required."`                               |
| 8   | No duplicate collection keys           | `"Duplicate collection key '{key}'."`                           |
| 9   | Every collection has non-null `Items`  | `"Collection '{key}' must include items."`                      |
| 10  | No null items in any collection        | `"Collection '{key}' cannot contain null items."`               |
| 11  | Every item `Key` is non-empty          | `"Collection '{key}' contains an item with an empty key."`      |
| 12  | No duplicate item keys in a collection | `"Collection '{key}' contains duplicate item key '{key}'."`     |
| 13  | Every item `Label` is non-empty        | `"Collection '{key}' contains an empty label for key '{key}'."` |

## Cross-Stack Pairing

`HexGuard.ReferenceData` is the .NET counterpart of
[`@hexguard/angular-lookups`](../../../angular/packages/angular-lookups).

- The **.NET library** defines the canonical catalog shape, validates it, and serves it through
  the `IReferenceDataCatalogProvider` interface.
- The **Angular library** consumes the same JSON shape through its loader-backed cache, resolves
  labels in templates via `HexguardLookupLabelPipe`, and exposes version-change signals.
- The **shared SampleApi** at `dotnet/samples/HexGuard.SampleApi` serves live catalog endpoints
  that both the .NET and Angular demos consume.

## Links

- [Deep package notes](../../../docs/packages/hexguard-reference-data.md)
- [Angular counterpart README](../../../angular/packages/angular-lookups/README.md)
- [Sample API source](../../../dotnet/samples/HexGuard.SampleApi)
- [Demo runbook](../../../docs/demo/README.md)
- [.NET workspace overview](../../../dotnet/README.md)
- [NuGet](https://www.nuget.org/packages/HexGuard.ReferenceData)
- [GitHub repository](https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ReferenceData)
