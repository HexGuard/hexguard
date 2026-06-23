import { DestroyRef, inject, signal } from '@angular/core';
import type { Breadcrumb, PageAction, PageContext, PageContextHandle } from './types';

const EMPTY_BREADCRUMBS: readonly Breadcrumb[] = [];
const EMPTY_TABS: readonly PageTab[] = [];
const EMPTY_ACTIONS: readonly PageAction[] = [];

interface PageTab {
  readonly id: string;
  readonly label: string;
}

export function injectPageContext(): PageContextHandle {
  const destroyRef = inject(DestroyRef);
  const title = signal('');
  const breadcrumbs = signal<readonly Breadcrumb[]>(EMPTY_BREADCRUMBS);
  const tabs = signal<readonly PageTab[]>(EMPTY_TABS);
  const activeTab = signal('');
  const actions = signal<readonly PageAction[]>(EMPTY_ACTIONS);

  function set(context: PageContext): void {
    if (context.title !== undefined) {
      title.set(context.title);
    }
    if (context.breadcrumbs !== undefined) {
      breadcrumbs.set(context.breadcrumbs);
    }
    if (context.tabs !== undefined) {
      tabs.set(context.tabs);
      if (context.tabs.length > 0 && !activeTab()) {
        activeTab.set(context.tabs[0].id);
      }
    }
    if (context.actions !== undefined) {
      actions.set(context.actions);
    }
  }

  function setActiveTab(id: string): void {
    activeTab.set(id);
  }

  destroyRef.onDestroy(() => {
    title.set('');
    breadcrumbs.set(EMPTY_BREADCRUMBS);
    tabs.set(EMPTY_TABS);
    activeTab.set('');
    actions.set(EMPTY_ACTIONS);
  });

  return {
    title: title.asReadonly(),
    breadcrumbs: breadcrumbs.asReadonly(),
    activeTab: activeTab.asReadonly(),
    actions: actions.asReadonly(),
    set,
    setActiveTab,
  };
}
