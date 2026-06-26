---
id: feature-ts-markdown
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-markdown'
---

# @hexguard/ts-markdown

## Summary

Markdown → safe HTML with sanitization. Lighter than marked + DOMPurify combo.

**Competition check:** `marked` (8M+) + `dompurify` (5M+) is the standard combo. This is a single, sanitized-by-default package.

## Proposed Public API

```typescript
export interface MarkdownOptions {
  sanitize?: boolean;          // Default: true
  linkTarget?: string;         // Default: '_blank'
  linkRel?: string;            // Default: 'noopener noreferrer'
  breaks?: boolean;            // Default: true
  gfm?: boolean;               // Default: true
  highlight?: (code: string, lang: string) => string;
}

export function markdown(text: string, options?: MarkdownOptions): string;
export function markdownInline(text: string, options?: MarkdownOptions): string;
```

## Implementation Plan

1. Create `ts/packages/ts-markdown/`.
2. Implement parser + HTML renderer + sanitizer.
3. Add tests.
4. Publish to npm.
