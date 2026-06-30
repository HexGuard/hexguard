import { Injectable, signal } from '@angular/core';
import type { Breadcrumb, PageAction, PageContext } from './types';

const EMPTY_BREADCRUMBS: readonly Breadcrumb[] = [];
const EMPTY_ACTIONS: readonly PageAction[] = [];

interface PageTab {
  readonly id: string;
  readonly label: string;
}

const EMPTY_TABS: readonly PageTab[] = [];

/**
 * Singleton service managing page-level metadata.
 *
 * There is exactly one "current page" at any time, so all
 * `injectPageContext()` calls share the same `title`, `breadcrumbs`,
 * `activeTab`, and `actions` signals.
 */
@Injectable({ providedIn: 'root' })
export class PageContextService {
  readonly title = signal('');
  readonly breadcrumbs = signal<readonly Breadcrumb[]>(EMPTY_BREADCRUMBS);
  readonly tabs = signal<readonly PageTab[]>(EMPTY_TABS);
  readonly activeTab = signal('');
  readonly actions = signal<readonly PageAction[]>(EMPTY_ACTIONS);

  /** Reset all signals to their default empty state. */
  reset(): void {
    this.title.set('');
    this.breadcrumbs.set(EMPTY_BREADCRUMBS);
    this.tabs.set(EMPTY_TABS);
    this.activeTab.set('');
    this.actions.set(EMPTY_ACTIONS);
  }

  set(context: PageContext): void {
    if (context.title !== undefined) {
      this.title.set(context.title);
    }
    if (context.breadcrumbs !== undefined) {
      this.breadcrumbs.set(context.breadcrumbs);
    }
    if (context.tabs !== undefined) {
      this.tabs.set(context.tabs);
      if (context.tabs.length > 0 && !this.activeTab()) {
        this.activeTab.set(context.tabs[0].id);
      }
    }
    if (context.actions !== undefined) {
      this.actions.set(context.actions);
    }
  }

  setActiveTab(id: string): void {
    this.activeTab.set(id);
  }
}
