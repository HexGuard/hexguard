---
id: feature-comments-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Comments + @hexguard/angular-comments'
---

# Comments Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for threaded comments — the .NET side provides comment storage, threading, moderation, and notification triggers; the Angular side provides headless comment tree state, reply flows, mention support, reactions, and file attachments.

**Promoted from sidenote:** Both `HexGuard.Comments` and `@hexguard/angular-comments` were sidenotes. This brief formalizes them as a cross-stack pair.

## Why Wide Adoption

Threaded comments appear in virtually every collaborative app: task comments, document annotations, blog comments, code review discussions, support ticket threads. Every team rebuilds the same threading tree, reply-to tracking, mention detection, and reaction state.

## Goals

### .NET (`HexGuard.Comments`)

1. Provide comment models: `Comment` with id, parentId (for threading), authorId, body, createdAt, updatedAt, isEdited.
2. Provide `ICommentStore` interface with CRUD operations.
3. Provide `ICommentModerationService` for spam/abuse filtering hook.
4. Support reactions/likes per comment.
5. Support file attachments per comment with storage abstraction.

### Angular (`@hexguard/angular-comments`)

1. Provide `injectCommentThread()` — tree-shaped comment state for a given entity.
2. Expose signals: `comments` (tree), `replyTarget`, `isSubmitting`, `error`.
3. Support reply-to threading (flatten nested replies for rendering).
4. Support mentions (`@username`) within comment input (compose with `angular-mention`).
5. Support reactions (emoji picker integration).
6. Support optimistic updates — show comment immediately, roll back on failure.

## Non-Goals

- No comment UI components (consumer renders their own comment tree).
- No real-time updates (compose with SignalR or polling via `angular-live-data`).

## Proposed Public API

### .NET

```csharp
public sealed record Comment
{
    public string Id { get; init; }
    public string EntityType { get; init; }    // "task", "document", "post"
    public string EntityId { get; init; }
    public string? ParentId { get; init; }     // null for top-level
    public string AuthorId { get; init; }
    public string Body { get; init; }
    public IReadOnlyList<string> Mentions { get; init; }
    public IReadOnlyList<CommentAttachment> Attachments { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public bool IsEdited { get; init; }
    public bool IsDeleted { get; init; }
}

public interface ICommentStore
{
    Task<Comment> CreateAsync(Comment comment, CancellationToken ct);
    Task<Comment?> GetAsync(string id, CancellationToken ct);
    Task<IReadOnlyList<Comment>> GetByEntityAsync(string entityType, string entityId, CancellationToken ct);
    Task<Comment> UpdateAsync(string id, string body, CancellationToken ct);
    Task DeleteAsync(string id, CancellationToken ct);
}
```

### Angular

```typescript
export function injectCommentThread(config: {
  entityType: string;
  entityId: string | Signal<string>;
  store: CommentStore;   // Adapter for API calls
}): {
  readonly comments: Signal<CommentNode[]>;      // Flattened tree for rendering
  readonly isSubmitting: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly replyTo: Signal<CommentNode | null>;  // Currently replying to

  addComment(body: string, attachments?: File[]): Promise<void>;
  replyToComment(parentId: string, body: string): Promise<void>;
  editComment(id: string, body: string): Promise<void>;
  deleteComment(id: string): Promise<void>;
  setReplyTo(comment: CommentNode | null): void;
  toggleReaction(commentId: string, emoji: string): void;
};

export interface CommentNode {
  id: string;
  author: { id: string; name: string; avatar?: string };
  body: string;
  createdAt: Date;
  isEdited: boolean;
  depth: number;
  replies: CommentNode[];       // Only depth-1 for rendering
  reactions: Record<string, string[]>;  // emoji → userIds
  isOptimistic: boolean;
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Comments/` with standard `.csproj`.
2. Implement `Comment` models and `ICommentStore` interface.
3. Implement in-memory store and EF Core store.
4. Create Angular package with `injectCommentThread()`.
5. Add tests on both sides.
6. Register both packages.
