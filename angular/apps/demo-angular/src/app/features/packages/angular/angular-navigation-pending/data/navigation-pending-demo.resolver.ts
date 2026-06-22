/**
 * A `canDeactivate` guard that delays the navigation by the given number
 * of milliseconds. This lets the navigation-pending demo component observe
 * the isNavigating → isSlowNavigation → completed lifecycle before the
 * component is destroyed.
 */
export function slowDeactivateGuard(delayMs = 2500): () => Promise<boolean> {
  return () => new Promise((resolve) => setTimeout(() => resolve(true), delayMs));
}
