export type DebounceMode = 'trailing' | 'leading' | 'both';

export interface DebounceDemoConfig {
  readonly mode: DebounceMode;
  readonly dueTime: number;
  readonly label: string;
}

export const DEBOUNCE_DEMO_CONFIGS: readonly DebounceDemoConfig[] = [
  { mode: 'trailing', dueTime: 300, label: 'Trailing (default)' },
  { mode: 'leading', dueTime: 300, label: 'Leading only' },
  { mode: 'both', dueTime: 300, label: 'Leading + trailing' },
] as const;
