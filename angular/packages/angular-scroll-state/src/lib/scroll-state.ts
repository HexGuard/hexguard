import { inject } from '@angular/core';
import type { ScrollStateHandle, ScrollStateOptions } from './types';
import { ScrollStateService } from './scroll-state-service';

export function injectScrollState(options?: ScrollStateOptions): ScrollStateHandle {
  const service = inject(ScrollStateService);
  service.init(options);

  return {
    scrollY: service.scrollY,
    save: (key: string) => service.save(key),
    restore: (key: string) => service.restore(key),
  };
}
