import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  defineVariants,
  injectVariantState,
  HexguardVariantsDirective,
  type VariantDefinition,
} from '@hexguard/angular-component-variants';
import { ANGULAR_COMPONENT_VARIANTS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

// ── Button: directive-compatible with compound variants ────

const BUTTON_VARIANTS = defineVariants(
  {
    size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    },
    state: { default: '', loading: 'btn-loading', disabled: 'btn-disabled' },
  },
  {
    defaults: { size: 'md', color: 'primary', state: 'default' },
    aria: {
      'state.loading': { 'aria-busy': 'true' },
      'state.disabled': { 'aria-disabled': 'true' },
    },
    compounds: [
      { conditions: { size: 'lg', color: 'primary' }, class: 'btn-lg-primary' },
      { conditions: { size: 'lg', color: 'outline' }, class: 'btn-lg-outline' },
      { conditions: { size: 'sm', color: 'ghost' }, class: 'btn-sm-ghost' },
    ],
  },
);

// ── Card: compound variants for elevation ──────────────────

const CARD_VARIANTS = defineVariants(
  {
    size: { sm: 'card-sm', md: 'card-md', lg: 'card-lg' },
    elevation: { flat: 'card-flat', raised: 'card-raised', floating: 'card-floating' },
  },
  {
    compounds: [
      { conditions: { size: 'lg', elevation: 'floating' }, class: 'card-lg-floating' },
    ],
  },
);

// ── Alert: severity + dismissible ──────────────────────────

const ALERT_VARIANTS = defineVariants(
  {
    severity: {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    },
    dismissible: { yes: 'alert-dismissible', no: '' },
  },
  {
    defaults: { severity: 'info', dismissible: 'no' },
  },
);

// ── Badge ──────────────────────────────────────────────────

const BADGE_VARIANTS = defineVariants({
  color: { info: 'badge-info', success: 'badge-success', warning: 'badge-warning', error: 'badge-error' },
  style: { filled: 'badge-filled', outline: 'badge-outline' },
});

@Component({
  standalone: true,
  selector: 'demo-component-variants-demo-page',
  templateUrl: './component-variants-demo-page.component.html',
  styleUrl: './component-variants-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    HexguardVariantsDirective,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentVariantsDemoPageComponent {
  protected readonly demo = ANGULAR_COMPONENT_VARIANTS_DEMO;
  protected readonly button = injectVariantState(BUTTON_VARIANTS);
  protected readonly card = injectVariantState(CARD_VARIANTS);
  protected readonly alert = injectVariantState(ALERT_VARIANTS);
  protected readonly badge = injectVariantState(BADGE_VARIANTS);

  // Expose definitions for the directive
  protected readonly ButtonVariants: VariantDefinition = BUTTON_VARIANTS;
  protected readonly CardVariants: VariantDefinition = CARD_VARIANTS;
  protected readonly AlertVariants: VariantDefinition = ALERT_VARIANTS;

  protected readonly sizeOptions = ['sm', 'md', 'lg'] as const;
  protected readonly colorOptions = ['primary', 'secondary', 'outline', 'ghost'] as const;
  protected readonly stateOptions = ['default', 'loading', 'disabled'] as const;

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      button: { cssClasses: this.button.cssClasses(), values: this.button.values(), aria: this.button.aria() },
      card: { cssClasses: this.card.cssClasses(), values: this.card.values() },
      alert: { cssClasses: this.alert.cssClasses(), values: this.alert.values() },
      badge: { cssClasses: this.badge.cssClasses(), values: this.badge.values() },
    }),
  );

  setButtonSize(s: string) { this.button.set('size', s); }
  setButtonColor(c: string) { this.button.set('color', c); }
  setButtonState(s: string) { this.button.set('state', s); }
  setCardSize(s: string) { this.card.set('size', s); }
  setCardElevation(e: string) { this.card.set('elevation', e); }
  setAlertSeverity(s: string) { this.alert.set('severity', s); }
  setAlertDismissible(d: string) { this.alert.set('dismissible', d); }
  setBadgeColor(c: string) { this.badge.set('color', c); }
  setBadgeStyle(s: string) { this.badge.set('style', s); }
}
