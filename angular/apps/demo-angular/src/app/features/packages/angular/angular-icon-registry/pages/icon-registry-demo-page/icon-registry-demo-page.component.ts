import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { provideIcons, injectIcons } from '@hexguard/angular-icon-registry';
import { ANGULAR_ICON_REGISTRY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

const DEMO_ICONS = {
  home: {
    svgContent: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
    viewBox: '0 0 24 24',
    tags: ['navigation'],
  },
  settings: {
    svgContent:
      '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
    viewBox: '0 0 24 24',
    aliases: ['gear', 'cog'],
    tags: ['navigation'],
  },
  search: {
    svgContent:
      '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
    viewBox: '0 0 24 24',
    tags: ['action'],
  },
  favorite: {
    svgContent:
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
    viewBox: '0 0 24 24',
    aliases: ['heart'],
    tags: ['action'],
  },
  person: {
    svgContent:
      '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
    viewBox: '0 0 24 24',
    aliases: ['user', 'account'],
    tags: ['social'],
  },
  delete: {
    svgContent:
      '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
    viewBox: '0 0 24 24',
    aliases: ['trash', 'remove'],
    tags: ['action'],
  },
  add: {
    svgContent: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
    viewBox: '0 0 24 24',
    aliases: ['plus', 'new'],
    tags: ['action'],
  },
  close: {
    svgContent:
      '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
    viewBox: '0 0 24 24',
    aliases: ['x', 'cancel'],
    tags: ['navigation'],
  },
  check: {
    svgContent: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
    viewBox: '0 0 24 24',
    aliases: ['done', 'tick'],
    tags: ['action'],
  },
} as const;

@Component({
  standalone: true,
  selector: 'demo-icon-registry-demo-page',
  templateUrl: './icon-registry-demo-page.component.html',
  styleUrl: './icon-registry-demo-page.component.css',
  providers: [provideIcons({ icons: DEMO_ICONS, defaultSize: '1.5rem' })],
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconRegistryDemoPageComponent {
  protected readonly demo = ANGULAR_ICON_REGISTRY_DEMO;
  protected readonly icons = injectIcons();
  protected readonly selectedIcon = signal('home');
  protected readonly iconSize = signal('1.5rem');
  private readonly sanitizer = inject(DomSanitizer);

  /** Bypass Angular sanitization for trusted SVG path markup. */
  sanitizeSvg(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  protected readonly iconNames = this.icons.names();
  protected readonly selectedIconData = computed(() => this.icons.get(this.selectedIcon())());

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      registrySize: this.iconNames.length,
      selectedIcon: this.selectedIcon(),
      size: this.iconSize(),
      hasDelete: this.icons.has('delete'),
      hasTrash: this.icons.has('trash'), // alias
      hasGear: this.icons.has('gear'), // alias
      allNames: this.iconNames,
    }),
  );

  selectIcon(name: string): void {
    this.selectedIcon.set(name);
  }

  setSize(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.iconSize.set(`${val}rem`);
  }
}
