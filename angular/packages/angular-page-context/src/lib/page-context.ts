import { inject } from '@angular/core';
import type { PageContextHandle } from './types';
import { PageContextService } from './page-context-service';

export function injectPageContext(): PageContextHandle {
  const service = inject(PageContextService);

  return {
    title: service.title.asReadonly(),
    breadcrumbs: service.breadcrumbs.asReadonly(),
    activeTab: service.activeTab.asReadonly(),
    actions: service.actions.asReadonly(),
    set: (context) => service.set(context),
    setActiveTab: (id) => service.setActiveTab(id),
  };
}
