---
id: feature-angular-seo
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-seo'
---

# @hexguard/angular-seo

## Summary

Headless SEO metadata management — structured data (JSON-LD), meta tags, Open Graph, Twitter Cards, canonical URLs, and hreflang. SSR-safe with signal-based dynamic updates.

## Goals

- JSON-LD structured data builder (Article, Product, FAQ, Breadcrumb, Organization, Event, Recipe, etc.)
- Meta tag management (title, description, robots, viewport)
- Open Graph tag generation (og:title, og:image, og:type)
- Twitter Card tag generation
- Canonical URL management
- Hreflang alternate link generation
- SSR-safe (works with Angular Universal)
- Route-level SEO configuration via route data

## Non-Goals

- No rendered SEO preview tool
- No sitemap generation (separate package)
- No page speed analysis

## Proposed Public API

```typescript
// Structured data
export function injectStructuredData(): {
  setJsonLd(schema: JsonLdSchema): void;
  clear(): void;
};

export type JsonLdSchema =
  | { '@type': 'Article'; headline: string; datePublished: string; author: { name: string } }
  | { '@type': 'Product'; name: string; description: string; offers: { price: number; priceCurrency: string } }
  | { '@type': 'FAQPage'; mainEntity: { '@type': 'Question'; name: string; acceptedAnswer: { text: string } }[] }
  | { '@type': 'BreadcrumbList'; itemListElement: { position: number; name: string; item: string }[] }
  | { '@type': 'Organization'; name: string; url: string; logo: string }
  | { '@type': 'WebSite'; name: string; url: string; potentialAction: { '@type': 'SearchAction'; target: string; 'query-input': string } };

// Meta tags
export function injectSeoMeta(): {
  readonly title: Signal<string>;
  readonly description: Signal<string>;
  readonly canonical: Signal<string>;
  readonly robots: Signal<string>;
  setTitle(title: string): void;
  setDescription(desc: string): void;
  setCanonical(url: string): void;
  setRobots(directive: string): void;
  setOpenGraph(og: OpenGraphTags): void;
  setTwitterCard(card: TwitterCardTags): void;
  setHreflang(langs: HreflangEntry[]): void;
};

// Route-level helper
export function provideRouteSeo(config: RouteSeoConfig): Provider[];
```

## Implementation Plan
1. Scaffold `angular/packages/angular-seo/`.
2. Implement JSON-LD builder, meta tag service, route-level config.
3. Add SSR safety (TransferState for hydration).
4. Add tests. Register in workspace.
