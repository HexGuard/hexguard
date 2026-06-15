import { computed, signal } from '@angular/core';

import { OptimisticStatePendingError } from './errors';
import type { OptimisticStateOptions } from './optimistic-state-options';
import type {
  OptimisticMutationEntry,
  OptimisticMutationConflictPolicy,
  OptimisticMutationEntryStatus,
  OptimisticState,
  OptimisticStateRunArgs,
  OptimisticStateStatus,
} from './types';

const DEFAULT_CONFLICT_POLICY: OptimisticMutationConflictPolicy = 'reject';

function defaultMapError<TError>(error: unknown): TError {
  return error as TError;
}

interface InternalOptimisticMutationEntry<
  TInput,
  TResult,
  TError,
  TTarget extends PropertyKey,
> extends OptimisticMutationEntry<TInput, TResult, TError, TTarget> {
  readonly start: () => void;
}

function toPublicEntry<TInput, TResult, TError, TTarget extends PropertyKey>(
  entry: InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget>,
): OptimisticMutationEntry<TInput, TResult, TError, TTarget> {
  return {
    id: entry.id,
    target: entry.target,
    input: entry.input,
    status: entry.status,
    createdAt: entry.createdAt,
    result: entry.result,
    error: entry.error,
  };
}

/**
 * Creates a signal-first optimistic mutation handle around one committed value.
 *
 * The handle keeps committed state, optimistic overlays, queued same-target
 * work, and reconciliation outcomes explicit so consumers can inspect or demo
 * each step without hidden cache machinery.
 */
export function optimisticState<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
>(
  options: OptimisticStateOptions<TValue, TInput, TResult, TError, TTarget>,
): OptimisticState<TValue, TInput, TResult, TError, TTarget> {
  const {
    initialValue,
    run,
    getTarget,
    apply,
    reconcile = (value: TValue, _result: TResult, input: TInput) => apply(value, input),
  } = options;
  const mapError = options.mapError ?? defaultMapError<TError>;
  const now = options.now ?? Date.now;

  const conflictPolicy = signal<OptimisticMutationConflictPolicy>(
    options.conflictPolicy ?? DEFAULT_CONFLICT_POLICY,
  );
  const settledValue = signal(initialValue);
  const error = signal<TError | null>(null);
  const lastResult = signal<TResult | null>(null);
  const entries = signal<
    readonly InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget>[]
  >([]);

  let nextEntryId = 0;

  function hasPendingTarget(target: TTarget): boolean {
    return entries().some((entry) => entry.target === target && entry.status === 'pending');
  }

  function updateEntry(
    id: number,
    mutate: (
      entry: InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget>,
    ) => InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget>,
  ): InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget> | undefined {
    let updated: InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget> | undefined;

    entries.update((currentEntries) =>
      currentEntries.map((entry) => {
        if (entry.id !== id) {
          return entry;
        }

        updated = mutate(entry);

        return updated;
      }),
    );

    return updated;
  }

  function markTargetEntriesReplaced(target: TTarget): void {
    entries.update((currentEntries) =>
      currentEntries.map((entry) => {
        if (entry.target !== target || (entry.status !== 'pending' && entry.status !== 'queued')) {
          return entry;
        }

        return {
          ...entry,
          status: 'replaced' as OptimisticMutationEntryStatus,
        };
      }),
    );
  }

  function activateNextQueuedMutation(target: TTarget): void {
    if (hasPendingTarget(target)) {
      return;
    }

    const nextQueuedEntry = entries().find(
      (entry) => entry.target === target && entry.status === 'queued',
    );

    nextQueuedEntry?.start();
  }

  function settleFailure(id: number, mappedError: TError): void {
    const updatedEntry = updateEntry(id, (entry) => {
      if (entry.status === 'replaced') {
        return entry;
      }

      return {
        ...entry,
        status: 'failed',
        error: mappedError,
      };
    });

    if (!updatedEntry || updatedEntry.status === 'replaced') {
      return;
    }

    error.set(mappedError);
    activateNextQueuedMutation(updatedEntry.target);
  }

  function settleSuccess(id: number, result: TResult): void {
    const currentEntry = entries().find((entry) => entry.id === id);

    if (!currentEntry || currentEntry.status === 'replaced') {
      return;
    }

    settledValue.set(reconcile(settledValue(), result, currentEntry.input));
    error.set(null);
    lastResult.set(result);

    const updatedEntry = updateEntry(id, (entry) => ({
      ...entry,
      status: 'succeeded',
      result,
      error: null,
    }));

    if (!updatedEntry) {
      return;
    }

    activateNextQueuedMutation(updatedEntry.target);
  }

  function startEntry(
    id: number,
    resolve: (value: TResult) => void,
    reject: (reason: unknown) => void,
  ) {
    const queuedEntry = updateEntry(id, (entry) => {
      if (entry.status !== 'queued') {
        return entry;
      }

      return {
        ...entry,
        status: 'pending',
      };
    });
    const currentEntry = queuedEntry ?? entries().find((entry) => entry.id === id);

    if (!currentEntry || currentEntry.status === 'replaced') {
      return;
    }

    error.set(null);

    let pendingRun: Promise<TResult>;

    try {
      pendingRun = Promise.resolve(
        run(...([currentEntry.input] as OptimisticStateRunArgs<TInput>)),
      );
    } catch (cause) {
      const mappedError = mapError(cause);

      settleFailure(id, mappedError);
      reject(mappedError);

      return;
    }

    void pendingRun.then(
      (result) => {
        settleSuccess(id, result);
        resolve(result);
      },
      (cause) => {
        const mappedError = mapError(cause);

        settleFailure(id, mappedError);
        reject(mappedError);
      },
    );
  }

  return {
    conflictPolicy,
    entries: computed(() => entries().map(toPublicEntry)),
    error,
    hasPendingMutations: computed(() => entries().some((entry) => entry.status === 'pending')),
    hasQueuedMutations: computed(() => entries().some((entry) => entry.status === 'queued')),
    isError: computed(
      () => error() !== null && !entries().some((entry) => entry.status === 'pending'),
    ),
    isIdle: computed(
      () => entries().every((entry) => entry.status !== 'pending') && error() === null,
    ),
    isPending: computed(() => entries().some((entry) => entry.status === 'pending')),
    lastResult,
    pendingCount: computed(() => entries().filter((entry) => entry.status === 'pending').length),
    queuedCount: computed(() => entries().filter((entry) => entry.status === 'queued').length),
    settledValue,
    status: computed<OptimisticStateStatus>(() => {
      if (entries().some((entry) => entry.status === 'pending')) {
        return 'pending';
      }

      if (error() !== null) {
        return 'error';
      }

      return 'idle';
    }),
    value: computed(() =>
      entries().reduce((currentValue, entry) => {
        if (entry.status !== 'pending') {
          return currentValue;
        }

        return apply(currentValue, entry.input);
      }, settledValue()),
    ),
    run(...args: OptimisticStateRunArgs<TInput>): Promise<TResult> {
      const input = args[0] as TInput;
      const target = getTarget(input);
      const currentPolicy = conflictPolicy();
      const hasConflictingEntry = entries().some(
        (entry) =>
          entry.target === target && (entry.status === 'pending' || entry.status === 'queued'),
      );

      if (hasConflictingEntry && currentPolicy === 'reject') {
        return Promise.reject(new OptimisticStatePendingError());
      }

      if (hasConflictingEntry && currentPolicy === 'replace') {
        markTargetEntriesReplaced(target);
      }

      return new Promise<TResult>((resolve, reject) => {
        const shouldQueue =
          currentPolicy === 'queue' &&
          entries().some(
            (entry) =>
              entry.target === target && (entry.status === 'pending' || entry.status === 'queued'),
          );
        const entryId = nextEntryId;
        nextEntryId += 1;
        const entry: InternalOptimisticMutationEntry<TInput, TResult, TError, TTarget> = {
          id: entryId,
          target,
          input,
          status: shouldQueue ? 'queued' : 'pending',
          createdAt: now(),
          result: null,
          error: null,
          start: () => startEntry(entryId, resolve, reject),
        };

        entries.update((currentEntries) => [...currentEntries, entry]);

        if (!shouldQueue) {
          entry.start();
        }
      });
    },
    setConflictPolicy(policy): void {
      conflictPolicy.set(policy);
    },
    reset(value = initialValue): void {
      settledValue.set(value);
      error.set(null);
      lastResult.set(null);
      entries.set([]);
    },
  };
}
