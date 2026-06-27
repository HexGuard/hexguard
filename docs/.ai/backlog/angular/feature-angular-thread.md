---
id: feature-angular-thread
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-thread'
---

# @hexguard/angular-thread

## Summary

Headless threaded discussion state — topic list, thread view, reply/reply-to, moderation. For forums, Q&A, support threads.

## Proposed Public API

```typescript
export function injectThread(config: { endpoint: string }): {
  readonly topics: Signal<ThreadTopic[]>;
  readonly selectedTopic: Signal<ThreadTopic | null>;
  readonly replies: Signal<ThreadReply[]>;
  readonly isLoading/error/submitting: Signal<boolean>;
  createTopic(title: string, body: string, tags?: string[]): Promise<ThreadTopic>;
  reply(topicId: string, body: string, parentReplyId?: string): Promise<void>;
  editReply(replyId: string, body: string): Promise<void>;
  deleteReply(replyId: string): Promise<void>;
  moderate(topicId: string, action: 'pin' | 'lock' | 'hide'): Promise<void>;
};

export interface ThreadTopic { id: string; title: string; body: string; author: AuthorInfo; tags: string[]; isPinned/isLocked: boolean; replyCount: number; }
export interface ThreadReply { id: string; topicId: string; parentId?: string; body: string; author: AuthorInfo; depth: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-thread/`.
2. Implement topic/reply CRUD, moderation, threading with signals.
3. Add tests. Register in workspace.
