export interface StorageDemoItem {
  readonly key: string;
  readonly label: string;
  readonly defaultValue: string;
}

export const STORAGE_DEMO_ITEMS: readonly StorageDemoItem[] = [
  { key: 'demo-theme', label: 'Theme preference', defaultValue: 'light' },
  { key: 'demo-sidebar', label: 'Sidebar visibility', defaultValue: 'visible' },
  { key: 'demo-font-size', label: 'Font size', defaultValue: 'medium' },
] as const;
