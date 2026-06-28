/**
 * Options for configuring a persisted signal.
 */
export interface PersistSignalOptions<T> {
  /**
   * Storage backend to use.
   * @default typeof localStorage !== 'undefined' ? localStorage : undefined
   */
  readonly backend?: typeof localStorage | typeof sessionStorage;

  /**
   * Custom serializer for non-JSON-serializable values.
   * @default JSON.stringify
   */
  readonly serializer?: (value: T) => string;

  /**
   * Custom deserializer for non-JSON-deserializable values.
   * @default JSON.parse
   */
  readonly deserializer?: (raw: string) => T;

  /**
   * Time-to-live in milliseconds.
   * When set, the stored value is ignored if it was persisted longer than `ttlMs` ago.
   * @default undefined (no expiry)
   */
  readonly ttlMs?: number;

  /**
   * Migration callback invoked on restore with the stored value.
   * Return the migrated value to use (e.g., to handle schema upgrades).
   */
  readonly onRestore?: (stored: T) => T;

  /**
   * Debounce write operations in milliseconds.
   * Batches rapid signal changes into a single storage write.
   * @default 0 (immediate write)
   */
  readonly writeDelayMs?: number;

  /**
   * Listen for cross-tab storage events to sync the signal
   * when another tab writes to the same key.
   * @default true
   */
  readonly syncAcrossTabs?: boolean;
}
