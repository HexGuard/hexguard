---
id: feature-ts-seo
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-seo'
---

# @hexguard/ts-seo

## Summary

Zero-dependency SEO utilities for TypeScript — JSON-LD structured data builders, meta tag generators, and sitemap XML generation. For SSR and static site generation.

## Proposed Public API

```typescript
// JSON-LD builders
export function articleSchema(args: { headline: string; datePublished: Date; author: string; image?: string }): string;
export function productSchema(args: { name: string; description: string; price: number; currency: string; image?: string }): string;
export function faqSchema(questions: { question: string; answer: string }[]): string;
export function breadcrumbSchema(items: { name: string; url: string }[]): string;
export function organizationSchema(args: { name: string; url: string; logo: string }): string;
export function websiteSchema(args: { name: string; url: string; searchUrl?: string }): string;
export function localBusinessSchema(args: { name: string; address: string; phone: string; openingHours?: string }): string;
export function recipeSchema(args: { name: string; ingredients: string[]; instructions: string[] }): string;

// Meta tag generators
export function ogTags(args: { title: string; description: string; image: string; url: string; type?: string }): Record<string, string>;
export function twitterCard(args: { title: string; description: string; image: string; card?: 'summary' | 'summary_large_image' }): Record<string, string>;

// Sitemap
export function generateSitemapXml(urls: { loc: string; lastmod?: Date; changefreq?: string; priority?: number }[]): string;
export function generateRobotsTxt(rules: { userAgent: string; allow?: string[]; disallow?: string[]; sitemap?: string }[]): string;
```

## Implementation Plan
1. Create `ts/packages/ts-seo/` with zero dependencies.
2. Implement all schema builders, meta generators, sitemap/robots generation.
3. Add tests with schema.org validation.
4. Publish to npm.
