import {
  type EnvironmentProviders,
  ENVIRONMENT_INITIALIZER,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  type Provider,
  signal,
  type WritableSignal,
  DestroyRef,
} from '@angular/core';
import { EMPTY_PERMISSION_CONTEXT, provideHexGuardPermissions } from './permission-context';
import type { PermissionContext, PermissionKey } from './types';

// ──────────────────────────────────────────────────────────────
// Data shapes mirroring the .NET HexGuard.Capabilities contracts
// ──────────────────────────────────────────────────────────────

/** Server-side capability set returned by the backing API. */
export interface CapabilitySet {
  readonly roles: readonly string[];
  readonly permissions: Record<string, readonly string[]>;
}

/** Function that resolves a capability set (typically an HTTP fetch). */
export type CapabilityFetcher = () => Promise<CapabilitySet>;

// ──────────────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────────────

/** Configuration for <code>provideCapabilitySync</code>. */
export interface CapabilitySyncConfig {
  /**
   * A function that returns a promise of a {@link CapabilitySet}.
   *
   * This is typically an HTTP call to a .NET backend endpoint such as
   * <code>/api/capabilities/user</code>.
   *
   * When omitted the permission context stays empty (deny-by-default).
   */
  fetch?: CapabilityFetcher;

  /**
   * Interval in milliseconds for periodic background refresh.
   * When set, capabilities are re-fetched automatically at this interval.
   * Default is <code>0</code> (no periodic refresh).
   *
   * The interval is automatically cleared when the injector is destroyed.
   */
  refreshIntervalMs?: number;

  /**
   * Separator used to flatten resource + action pairs into a single
   * capability string. Default is <code>"."</code>.
   *
   * @example
   * // With default separator "."
   * { "orders": ["read", "write"] } → ["orders.read", "orders.write"]
   */
  separator?: string;
}

// ──────────────────────────────────────────────────────────────
// Internal injection token for the writable signal so the sync
// helper can push updates into the permission context.
// ──────────────────────────────────────────────────────────────

export const CAPABILITY_SYNC_CONTEXT = new InjectionToken<WritableSignal<PermissionContext>>(
  'CAPABILITY_SYNC_CONTEXT',
);

// ──────────────────────────────────────────────────────────────
// Pure mapper
// ──────────────────────────────────────────────────────────────

/**
 * Maps a server-side {@link CapabilitySet} to the client-side
 * {@link PermissionContext} consumed by `@hexguard/angular-permissions`.
 *
 * @param source - The capability set returned by the server.
 * @param separator - Separator between resource and action.
 * @returns A permission context ready for evaluation.
 */
export function toPermissionContext(source: CapabilitySet, separator = '.'): PermissionContext {
  const capabilities: PermissionKey[] = [];

  for (const [resource, actions] of Object.entries(source.permissions)) {
    for (const action of actions) {
      capabilities.push(`${resource}${separator}${action}`);
    }
  }

  return {
    capabilities,
    roles: [...source.roles],
  };
}

// ──────────────────────────────────────────────────────────────
// Provider factory
// ──────────────────────────────────────────────────────────────

/**
 * Provides a permission context that syncs its capabilities from a
 * .NET `HexGuard.Capabilities` backend.
 *
 * The context starts empty and is populated on app bootstrap. Use the
 * {@link CapabilitySyncConfig.fetch} option to plug in your HTTP call.
 * The returned providers can be passed directly to <code>providers</code>
 * in any Angular component, route, or <code>@NgModule</code>.
 *
 * Periodic refresh via {@link CapabilitySyncConfig.refreshIntervalMs} is
 * automatically cleaned up when the injector is destroyed.
 *
 * @example
 * ```typescript
 * // In your app.config.ts or standalone component:
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCapabilitySync({
 *       fetch: () => fetch('/api/capabilities/user').then(r => r.json()),
 *       refreshIntervalMs: 60_000,
 *     }),
 *   ],
 * };
 * ```
 */
export function provideCapabilitySync(config: CapabilitySyncConfig = {}): EnvironmentProviders {
  const ctx = signal<PermissionContext>(EMPTY_PERMISSION_CONTEXT);
  const separator = config.separator ?? '.';

  const providers: Provider[] = [{ provide: CAPABILITY_SYNC_CONTEXT, useValue: ctx }];

  if (config.fetch) {
    const doFetch = async (): Promise<void> => {
      try {
        const data = await config.fetch!();
        ctx.set(toPermissionContext(data, separator));
      } catch {
        // On error, keep the empty context (deny-by-default).
      }
    };

    providers.push({
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const destroyRef = inject(DestroyRef);
        setTimeout(() => {
          void doFetch();
        });

        if (config.refreshIntervalMs != null && config.refreshIntervalMs > 0) {
          const id = setInterval(() => {
            void doFetch();
          }, config.refreshIntervalMs);
          destroyRef.onDestroy(() => clearInterval(id));
        }
      },
    });
  }

  return makeEnvironmentProviders([...providers, provideHexGuardPermissions(ctx)]);
}

// ──────────────────────────────────────────────────────────────
// Context updater (for persona switching etc.)
// ──────────────────────────────────────────────────────────────

/**
 * Updates the capability-sync permission context from a new
 * {@link CapabilitySet}. Use this when the user persona changes
 * and you have already fetched fresh data.
 *
 * Must be called within an injection context where
 * `provideCapabilitySync` has been registered higher in the tree.
 *
 * @example
 * ```typescript
 * // After switching to a different user persona:
 * const data = await fetch(`/api/capabilities/user?persona=${persona}`).then(r => r.json());
 * updateCapabilityContext(data);
 * ```
 */
export function updateCapabilityContext(source: CapabilitySet, separator = '.'): void {
  const ctx = inject(CAPABILITY_SYNC_CONTEXT, { optional: true });
  if (ctx) {
    ctx.set(toPermissionContext(source, separator));
  }
}
