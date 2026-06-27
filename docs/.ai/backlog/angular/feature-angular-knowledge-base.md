---
id: feature-angular-knowledge-base
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-knowledge-base'
---

# @hexguard/angular-knowledge-base

## Summary

Knowledge base / help center state — article list, search, categories, feedback. For customer-facing documentation and self-service support.

## Proposed Public API

```typescript
export function injectKnowledgeBase(config: { endpoint: string }): {
  readonly articles: Signal<KbArticle[]>;
  readonly categories: Signal<KbCategory[]>;
  readonly searchQuery: Signal<string>;
  readonly searchResults: Signal<KbArticle[]>;
  readonly selectedArticle: Signal<KbArticle | null>;
  readonly isLoading/error: Signal<boolean>;
  search(query: string): void;
  selectArticle(id: string): Promise<void>;
  submitFeedback(articleId: string, helpful: boolean, comment?: string): Promise<void>;
};

export interface KbArticle { id: string; title: string; category: string; excerpt: string; readingTime: number; helpfulCount: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-knowledge-base/`.
2. Implement article list, search, categories, feedback with signals.
3. Add tests. Register in workspace.
