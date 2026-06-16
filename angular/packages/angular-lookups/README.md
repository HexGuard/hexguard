# `@hexguard/angular-lookups`

Typed lookup catalog caching and label resolution for Angular applications.

`@hexguard/angular-lookups` standardizes a repeated business-app problem: option lists and detail
labels often come from one backend reference-data catalog, but Angular screens repeatedly re-fetch,
re-normalize, and re-resolve those values in forms, filters, and summary views. This package keeps
that contract explicit through one loader-backed cache, one injected facade, and one thin template
label pipe.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-lookups.md)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-lookups @hexguard/angular-async-state
```

For the full in-repo frontend + backend example, start the Angular demo and the shared sample API
in separate terminals:

```bash
pnpm start
pnpm dotnet:start:demo-api
```

## Quickstart

```ts
import { Component } from '@angular/core';
import {
  HexguardLookupLabelPipe,
  injectLookups,
  provideHexGuardLookups,
  type LookupCatalog,
} from '@hexguard/angular-lookups';

// Production apps typically inject HttpClient and read the base URL from
// environment configuration. The example below keeps the loader at the
// integration boundary so the package owns validation, caching, and
// label resolution after the payload is returned.
const catalogLoader = async (): Promise<LookupCatalog> => {
  const apiBaseUrl = 'http://127.0.0.1:5074';
  const response = await fetch(`${apiBaseUrl}/api/angular-lookups/catalog?scenario=base`);
  return (await response.json()) as LookupCatalog;
};

export const appProviders = [provideHexGuardLookups({ load: catalogLoader })];

@Component({
  standalone: true,
  imports: [HexguardLookupLabelPipe],
  template: ` <p>Category: {{ categoryKey | hexguardLookupLabel: 'categories' : 'Unknown' }}</p> `,
})
export class ProductSummaryComponent {
  protected readonly categoryKey = 'hardware';
  private readonly lookups = injectLookups();

  constructor() {
    void this.lookups.ensureLoaded();
  }
}
```

## What It Owns

- one typed lookup catalog contract with version metadata
- one loader-backed cache with explicit load, reload, and invalidate behavior
- one injected facade for collection, option, and label resolution
- one thin label pipe for templates that need display-only lookup rendering

## First Demo Route To Open

After both processes are running, open `/packages/angular-lookups/backend` in the Angular demo.
That page shows the intended production shape:

- one backend endpoint returning a full versioned catalog
- one `provideHexGuardLookups()` registration loading that endpoint
- one shared cache reused across edit-form labels and summary-grid labels
- one explicit invalid-catalog path proving validation errors stay visible

## What It Does Not Own

- backend endpoint implementation or storage concerns
- localization and per-locale catalog composition
- complex UI widgets such as selects, comboboxes, or page shells
- cross-language code generation in the first release
