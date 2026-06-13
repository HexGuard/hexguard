export function formatSnapshot(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, entry) => (entry instanceof Date ? entry.toISOString() : entry),
    2,
  );
}
