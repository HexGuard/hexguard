---
id: feature-dotnet-threads
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Threads
---

# HexGuard.Threads

## Summary

Threaded discussion engine — topics, replies, threading, moderation, subscriptions. Pairs with `@hexguard/angular-thread`.

## Proposed Public API

```csharp
public interface IThreadService
{
    Task<DiscussionTopic> CreateAsync(string title, string body, string[] tags, CancellationToken ct);
    Task<DiscussionReply> ReplyAsync(string topicId, string body, string? parentId, CancellationToken ct);
    Task<IReadOnlyList<DiscussionTopic>> ListAsync(ThreadQuery query, CancellationToken ct);
    Task<IReadOnlyList<DiscussionReply>> GetRepliesAsync(string topicId, CancellationToken ct);
    Task ModerateAsync(string topicId, ModerationAction action, CancellationToken ct);
}

public enum ModerationAction { Pin, Unpin, Lock, Unlock, Hide, Unhide }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Threads/`.
2. Implement topic/reply CRUD, threading, moderation engine.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
