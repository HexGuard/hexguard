import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { injectTheme, injectTokenTheme } from '@hexguard/angular-theme';
import { ANGULAR_THEME_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-theme-demo-page',
  templateUrl: './theme-demo-page.component.html',
  styleUrl: './theme-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDemoPageComponent {
  protected readonly demo = ANGULAR_THEME_DEMO;
  protected readonly theme = injectTheme({ transitionClass: 'theme-transitioning', transitionDuration: 300 });
  protected readonly useTransition = signal(true);

  // Token layer demo — registers light/dark CSS custom property overrides
  protected readonly tokenTheme = injectTokenTheme({
    tokens: {
      light: { '--demo-surface': '#ffffff', '--demo-text': '#1a1a2e' },
      dark: { '--demo-surface': '#16213e', '--demo-text': '#e0e0e0' },
    },
  });

  // CSS tokens to display (computed from DOM)
  protected readonly cssTokens = [
    { name: 'surface', cssVar: '--demo-surface', value: this.readCssVar('--demo-surface') },
    { name: 'text', cssVar: '--demo-text', value: this.readCssVar('--demo-text') },
  ];

  // System preference detection
  protected readonly systemPrefersDark = signal(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  );
  protected readonly systemPrefersReducedMotion = signal(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  protected readonly systemPrefersContrast = signal<string>(this.detectContrast());

  protected readonly domDataTheme = signal(
    typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') ?? '—' : 'ssr',
  );

  constructor() {
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) =>
        this.systemPrefersDark.set(e.matches),
      );
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) =>
        this.systemPrefersReducedMotion.set(e.matches),
      );
    }
    // Keep DOM attribute in sync
    effect(() => {
      this.theme.effectiveTheme(); // read to trigger re-computation
      if (typeof document !== 'undefined') {
        this.domDataTheme.set(document.documentElement.getAttribute('data-theme') ?? '—');
      }
    });
  }

  protected toggleTransition(): void {
    this.useTransition.update((v) => !v);
    if (typeof document !== 'undefined') {
      if (this.useTransition()) {
        document.documentElement.classList.add('theme-transitioning');
      } else {
        document.documentElement.classList.remove('theme-transitioning');
      }
    }
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      mode: this.theme.mode(),
      effectiveTheme: this.theme.effectiveTheme(),
      isDark: this.theme.isDark(),
      isLight: this.theme.isLight(),
      domAttribute: this.domDataTheme(),
      systemPrefersDark: this.systemPrefersDark(),
      systemPrefersReducedMotion: this.systemPrefersReducedMotion(),
      systemPrefersContrast: this.systemPrefersContrast(),
      useTransition: this.useTransition(),
    }),
  );

  private readCssVar(name: string) {
    return computed(() => this.readCssVarRaw(name));
  }

  private readCssVarRaw(name: string): string {
    if (typeof document === 'undefined') return 'ssr';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';
  }

  private detectContrast(): string {
    if (typeof window === 'undefined') return 'ssr';
    if (window.matchMedia('(prefers-contrast: more)').matches) return 'more';
    if (window.matchMedia('(prefers-contrast: less)').matches) return 'less';
    return 'no-preference';
  }
}
