import { Location } from '@angular/common';
import {
  DestroyRef,
  assertInInjectionContext,
  inject,
  isDevMode,
  signal,
  type WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InvalidQueryParamError } from './errors';
import {
  buildNavigationQuery,
  parseUrlState,
  readQueryString,
  readQueryParamValue,
  type InvalidParamDescriptor,
} from './router-sync';
import {
  HEXGUARD_URL_STATE_OPTIONS,
  mergeUrlStateOptions,
  type UrlStateOptionsInput,
} from './url-state-options';
import type {
  InferSchemaValue,
  ParamCodec,
  UrlState as UrlStateHandle,
  UrlStateSchema,
  UrlStateSignalMap,
} from './types';
import { serializeUrlState } from './router-sync';

const RESERVED_SCHEMA_KEYS = new Set(['patch', 'reset', 'snapshot']);

const defaultEquals = <T>(left: T, right: T): boolean => Object.is(left, right);

type EqualityFn<T> = (left: T, right: T) => boolean;

interface SignalEntry<T> {
  readonly key: string;
  readonly codec: ParamCodec<T>;
  readonly signal: WritableSignal<T>;
  readonly equals: EqualityFn<T>;
  setFromUrl(value: T): void;
}

type AnySignalEntry = SignalEntry<any>;

function snapshotFromEntries<TSchema extends UrlStateSchema>(
  schemaKeys: readonly string[],
  entries: ReadonlyMap<string, AnySignalEntry>,
): InferSchemaValue<TSchema> {
  const snapshot = {} as InferSchemaValue<TSchema>;

  for (const key of schemaKeys) {
    (snapshot as Record<string, unknown>)[key] = entries.get(key)?.signal();
  }

  return snapshot;
}

function createSignalEntry<T>(
  key: string,
  codec: ParamCodec<T>,
  initialValue: T,
  onWrite: () => void,
): SignalEntry<T> {
  const equals = codec.equals ?? defaultEquals;
  const writable = signal(initialValue, { equal: equals });
  const originalSet = writable.set.bind(writable);

  // Wrap the writable signal so direct writes schedule router synchronization
  // while URL-originated writes can still bypass re-entrant navigation.
  writable.set = (value: T) => {
    if (equals(writable(), value)) {
      return;
    }

    originalSet(value);
    onWrite();
  };

  writable.update = (updateFn: (value: T) => T) => {
    writable.set(updateFn(writable()));
  };

  return {
    key,
    codec,
    signal: writable,
    equals,
    setFromUrl(value: T) {
      if (equals(writable(), value)) {
        return;
      }

      originalSet(value);
    },
  };
}

function throwIfReservedSchemaKeys(schemaKeys: readonly string[]): void {
  for (const key of schemaKeys) {
    if (RESERVED_SCHEMA_KEYS.has(key)) {
      throw new Error(`The schema key "${key}" is reserved by urlState.`);
    }
  }
}

/**
 * Creates a typed, signal-backed view of a query-param schema.
 *
 * The factory must run inside an Angular injection context because it relies on
 * `Router`, `ActivatedRoute`, `Location`, and optional global defaults provided
 * through `provideHexGuardUrlState()`.
 */
export function urlState<TSchema extends UrlStateSchema>(
  schema: TSchema,
  options: UrlStateOptionsInput = {},
): UrlStateHandle<TSchema> {
  assertInInjectionContext(urlState);

  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const location = inject(Location);
  const destroyRef = inject(DestroyRef);
  const globalOptions = inject(HEXGUARD_URL_STATE_OPTIONS, { optional: true });
  const resolvedOptions = mergeUrlStateOptions(globalOptions ?? {}, options);
  const schemaKeys = Object.keys(schema) as Array<Extract<keyof TSchema, string>>;

  throwIfReservedSchemaKeys(schemaKeys);

  const initialParsed = parseUrlState(schema, (key) =>
    readQueryParamValue(route.snapshot.queryParamMap, key),
  );

  if (
    resolvedOptions.invalidParamBehavior === 'throwInDev' &&
    isDevMode() &&
    initialParsed.invalid.length > 0
  ) {
    const [firstInvalid] = initialParsed.invalid;
    throw new InvalidQueryParamError(firstInvalid.key, firstInvalid.raw, firstInvalid.reason);
  }

  let destroyed = false;
  let navigationBatchDepth = 0;
  let applyingUrlState = false;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingQueryString: string | null = null;
  let lastKnownQueryString = readQueryString(route.snapshot.queryParamMap, schemaKeys);

  const entries = new Map<string, AnySignalEntry>();
  const signalMap = {} as UrlStateSignalMap<TSchema>;

  const scheduleNavigation = (): void => {
    // Debounced writes coalesce bursty UI updates such as type-ahead search.
    if (destroyed || applyingUrlState || navigationBatchDepth > 0) {
      return;
    }

    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }

    if (resolvedOptions.debounceMs > 0) {
      pendingTimer = setTimeout(() => {
        pendingTimer = null;
        void flushNavigation();
      }, resolvedOptions.debounceMs);
      return;
    }

    void flushNavigation();
  };

  const flushNavigation = async (): Promise<void> => {
    if (destroyed || applyingUrlState) {
      return;
    }

    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }

    const snapshot = snapshotFromEntries<TSchema>(schemaKeys, entries);
    const managedQuery = serializeUrlState(schema, snapshot, resolvedOptions);
    const navigationTarget = buildNavigationQuery(
      schemaKeys,
      route.snapshot.queryParamMap,
      managedQuery,
    );

    // Compare deterministic query strings instead of object identity so we can
    // avoid no-op router navigations and navigation loops.
    if (
      navigationTarget.queryString === lastKnownQueryString ||
      navigationTarget.queryString === pendingQueryString
    ) {
      return;
    }

    pendingQueryString = navigationTarget.queryString;

    try {
      await router.navigate([], {
        relativeTo: route,
        queryParams: navigationTarget.queryParams,
        replaceUrl: resolvedOptions.history === 'replace',
      });
    } finally {
      pendingQueryString = null;
    }
  };

  const applyParsedState = (
    nextState: InferSchemaValue<TSchema>,
    invalid: readonly InvalidParamDescriptor[],
  ): void => {
    if (
      resolvedOptions.invalidParamBehavior === 'throwInDev' &&
      isDevMode() &&
      invalid.length > 0
    ) {
      const [firstInvalid] = invalid;
      throw new InvalidQueryParamError(firstInvalid.key, firstInvalid.raw, firstInvalid.reason);
    }

    applyingUrlState = true;

    try {
      // URL-originated updates write directly into the wrapped signals without
      // scheduling another router navigation.
      for (const key of schemaKeys) {
        const entry = entries.get(key);

        if (!entry) {
          continue;
        }

        entry.setFromUrl((nextState as Record<string, unknown>)[key]);
      }
    } finally {
      applyingUrlState = false;
    }

    if (resolvedOptions.invalidParamBehavior === 'removeInvalid' && invalid.length > 0) {
      scheduleNavigation();
    }
  };

  const batchMutate = (mutate: () => void): void => {
    navigationBatchDepth += 1;

    try {
      mutate();
    } finally {
      navigationBatchDepth -= 1;
    }

    scheduleNavigation();
  };

  for (const key of schemaKeys) {
    const codec = schema[key] as ParamCodec<InferSchemaValue<TSchema>[typeof key]>;
    const entry = createSignalEntry(key, codec, initialParsed.state[key], scheduleNavigation);

    entries.set(key, entry);
    signalMap[key] = entry.signal as UrlStateSignalMap<TSchema>[typeof key];
  }

  applyParsedState(initialParsed.state, initialParsed.invalid);

  const stopTrackingUrlChanges = location.onUrlChange((url) => {
    // Listen at the Location boundary so router navigations, popstate, and
    // direct URL changes all converge through one parse-and-apply path.
    const queryParamMap = router.parseUrl(url).queryParamMap;

    lastKnownQueryString = readQueryString(queryParamMap, schemaKeys);
    pendingQueryString = null;

    const parsed = parseUrlState(schema, (key) => readQueryParamValue(queryParamMap, key));
    applyParsedState(parsed.state, parsed.invalid);
  });

  destroyRef.onDestroy(() => {
    destroyed = true;
    stopTrackingUrlChanges();

    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  });

  return Object.assign(signalMap, {
    reset(): void {
      batchMutate(() => {
        for (const key of schemaKeys) {
          const entry = entries.get(key);

          if (!entry) {
            continue;
          }

          entry.signal.set(entry.codec.defaultValue);
        }
      });
    },
    snapshot(): InferSchemaValue<TSchema> {
      return snapshotFromEntries<TSchema>(schemaKeys, entries);
    },
    patch(value: Partial<InferSchemaValue<TSchema>>): void {
      batchMutate(() => {
        for (const [key, nextValue] of Object.entries(value) as Array<
          [Extract<keyof TSchema, string>, InferSchemaValue<TSchema>[keyof TSchema]]
        >) {
          const entry = entries.get(key);

          if (!entry || nextValue === undefined) {
            continue;
          }

          entry.signal.set(nextValue);
        }
      });
    },
  });
}
