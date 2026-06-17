import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import {
  getUnifiedPackages,
  SITE_CURRENT_PACKAGES,
  SITE_HEADER_LINKS,
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

  /** Menu sections grouped by scope. */
  readonly menuSections: PackageMenuSection[] = buildMenuSections();

  togglePackageMenu(): void {
    this.packageMenuOpen.update((v) => !v);
  }

  closePackageMenu(): void {
    this.packageMenuOpen.set(false);
  }
}

/** Build the three menu sections (Angular / .NET / Cross-stack). */
function buildMenuSections(): PackageMenuSection[] {
  const all = getUnifiedPackages();
  const scopes: { scope: UnifiedScope; label: string }[] = [
    { scope: 'Angular', label: 'Angular packages' },
    { scope: '.NET', label: '.NET packages' },
    { scope: 'Cross-stack', label: 'Cross-stack pairs' },
  ];
  return scopes
    .map(({ scope, label }) => ({
      scope,
      label,
      packages: all.filter((p) => p.scope === scope),
    }))
    .filter((s) => s.packages.length > 0);
}
