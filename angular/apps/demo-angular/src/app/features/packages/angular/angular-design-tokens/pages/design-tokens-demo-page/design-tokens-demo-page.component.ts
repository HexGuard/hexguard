import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  defineTokens,
  injectTokens,
  syncTokensToRoot,
  tokenAliases,
  TokenThemeLayer,
  unsyncTokensFromRoot,
} from '@hexguard/angular-design-tokens';
import { ANGULAR_DESIGN_TOKENS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

const TOKENS = defineTokens({
  color: {
    primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 900: '#1e3a5f' },
    neutral: { 50: '#fafafa', 100: '#f5f5f5', 500: '#737373', 900: '#171717' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
});

const SEMANTIC = tokenAliases(TOKENS, {
  'color.surface': 'color.neutral.50',
  'color.text': 'color.neutral.900',
  'color.brand': 'color.primary.500',
});

const DARK_OVERRIDES: Record<string, string> = {
  'color.neutral.50': '#1a1a1a',
  'color.neutral.100': '#262626',
  'color.neutral.500': '#a3a3a3',
  'color.neutral.900': '#f0f0f0',
};

@Component({
  standalone: true,
  selector: 'demo-design-tokens-demo-page',
  templateUrl: './design-tokens-demo-page.component.html',
  styleUrl: './design-tokens-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignTokensDemoPageComponent {
  protected readonly demo = ANGULAR_DESIGN_TOKENS_DEMO;
  protected readonly TOKENS = TOKENS;
  protected readonly tokens = injectTokens(TOKENS, { syncCss: true });
  protected readonly darkActive = signal(false);

  protected readonly aliasedEntries = computed(() =>
    Array.from(SEMANTIC.entries.entries()).filter(([k]) => k.startsWith('color.')),
  );

  protected readonly tokenEntries = computed(() =>
    Array.from(TOKENS.entries.entries()).map(([k, v]) => ({ key: k, value: v })),
  );

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      tokenCount: TOKENS.size,
      prefix: TOKENS.prefix,
      darkLayerActive: this.darkActive(),
      primary500: TOKENS.get('color.primary.500'),
      brand: SEMANTIC.get('color.brand'),
      surface: SEMANTIC.get('color.surface'),
      spacingMd: TOKENS.get('spacing.md'),
      validationErrors: TOKENS.validate(),
    }),
  );

  applyDarkLayer(): void {
    this.darkActive.set(true);
    // Override the CSS custom properties that syncTokensToRoot wrote
    const style = document.documentElement.style;
    for (const [path, value] of Object.entries(DARK_OVERRIDES)) {
      const propName = `--${TOKENS.prefix}-${path.replace(/\./g, '-')}`;
      style.setProperty(propName, value);
    }
    // Also set semantic properties
    const surfacePath = `--${TOKENS.prefix}-color-surface`;
    const textPath = `--${TOKENS.prefix}-color-text`;
    style.setProperty(surfacePath, '#1a1a1a');
    style.setProperty(textPath, '#f0f0f0');
  }

  removeDarkLayer(): void {
    this.darkActive.set(false);
    // Remove dark overrides and re-sync base tokens
    const style = document.documentElement.style;
    for (const path of Object.keys(DARK_OVERRIDES)) {
      const propName = `--${TOKENS.prefix}-${path.replace(/\./g, '-')}`;
      style.removeProperty(propName);
    }
    style.removeProperty(`--${TOKENS.prefix}-color-surface`);
    style.removeProperty(`--${TOKENS.prefix}-color-text`);
    syncTokensToRoot(TOKENS);
  }

  /** Get the current value of a CSS custom property from :root (for display). */
  getCssVar(path: string): string {
    if (typeof document === 'undefined') return '';
    return document.documentElement.style.getPropertyValue(
      `--${TOKENS.prefix}-${path.replace(/\./g, '-')}`,
    );
  }
}
