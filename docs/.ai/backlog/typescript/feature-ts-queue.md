---
id: feature-ts-queue
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-queue'
---

# @hexguard/ts-queue

## Summary

Data structures — `Queue<T>`, `Deque<T>`, `PriorityQueue<T>`, `Stack<T>` with typed, efficient implementations.

**Competition check:** `mnemonist` is dominant but heavy. This is a narrow, TS-first package.

## Proposed Public API

```typescript
export class Queue<T> {
  enqueue(item: T): void; dequeue(): T | undefined; peek(): T | undefined;
  readonly size: number; readonly isEmpty: boolean; clear(): void; [Symbol.iterator](): Iterator<T>;
}

export class Deque<T> {
  pushFront(item: T): void; pushBack(item: T): void; popFront(): T | undefined; popBack(): T | undefined;
  peekFront(): T | undefined; peekBack(): T | undefined; readonly size: number;
}

export class PriorityQueue<T> {
  constructor(comparator?: (a: T, b: T) => number);
  enqueue(item: T): void; dequeue(): T | undefined; peek(): T | undefined; readonly size: number;
}

export class Stack<T> {
  push(item: T): void; pop(): T | undefined; peek(): T | undefined; readonly size: number;
}
```

## Implementation Plan

1. Create `ts/packages/ts-queue/`.
2. Implement all four structures.
3. Add tests.
4. Publish to npm.
