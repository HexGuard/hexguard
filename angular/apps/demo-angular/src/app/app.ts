import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import {
  getUnifiedPackages,
  SITE_HEADER_LINKS,
  STACK_REGISTRY,
  STACK_ORDER,
  type UnifiedPackageEntry,
  type UnifiedScope,
} from './site-catalog';

/** A menu section grouping packages by scope. */
export interface PackageMenuSection {
  readonly scope: UnifiedScope;
  readonly label: string;
  readonly packages: readonly UnifiedPackageEntry[];
}

@Component({
  selector: 'demo-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly headerLinks = SITE_HEADER_LINKS;
  readonly pageTitle = 'Open-source guardrails for Angular and .NET teams.';
  readonly packageMenuOpen = signal(false);

  /** Stack definitions for header navigation links. */
  readonly stackNav = STACK_ORDER.map((id) => STACK_REGISTRY[id]);

  /** Menu sections grouped by scope. */
  readonly menuSections: PackageMenuSection[] = buildMenuSections();

  togglePackageMenu(): void {
    this.packageMenuOpen.update((v) => !v);
  }

  closePackageMenu(): void {
    this.packageMenuOpen.set(false);
  }
}

/** Build menu sections from the stack registry. */
function buildMenuSections(): PackageMenuSection[] {
  const all = getUnifiedPackages();
  return STACK_ORDER.map((id) => {
    const def = STACK_REGISTRY[id];
    return {
      scope: id,
      label: `${def.label} packages`,
      packages: all.filter((p) => p.scope === id),
    };
  }).filter((s) => s.packages.length > 0);
}
