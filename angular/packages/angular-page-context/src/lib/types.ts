import type { Signal } from '@angular/core';

export interface Breadcrumb {
  readonly label: string;
  readonly route?: string;
}

export interface PageAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly route?: string;
  readonly confirm?: string;
  readonly disabled?: boolean;
}

export interface PageTab {
  readonly id: string;
  readonly label: string;
}

export interface PageContext {
  readonly title?: string;
  readonly breadcrumbs?: readonly Breadcrumb[];
  readonly tabs?: readonly PageTab[];
  readonly actions?: readonly PageAction[];
}

export interface PageContextHandle {
  /** The current page title. */
  readonly title: Signal<string>;

  /** The current breadcrumb trail. */
  readonly breadcrumbs: Signal<readonly Breadcrumb[]>;

  /** The currently active tab ID. */
  readonly activeTab: Signal<string>;

  /** The current set of contextual page actions. */
  readonly actions: Signal<readonly PageAction[]>;

  /** Update all page context fields at once. */
  set(context: PageContext): void;

  /** Switch the active tab by ID. */
  setActiveTab(id: string): void;
}
