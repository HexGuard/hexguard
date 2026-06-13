import { Location } from '@angular/common';
import { DestroyRef, inject, signal } from '@angular/core';

export function createTrackedCurrentUrl(fallback: string) {
  const location = inject(Location);
  const destroyRef = inject(DestroyRef);
  const currentUrl = signal(location.path() || fallback);
  const stopTrackingUrl = location.onUrlChange((url) => {
    currentUrl.set(url || fallback);
  });

  destroyRef.onDestroy(stopTrackingUrl);

  return currentUrl;
}
