import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HexguardClickOutsideDirective } from '@hexguard/angular-click-outside';

import { ANGULAR_CLICK_OUTSIDE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-click-outside-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    HexguardClickOutsideDirective,
  ],
  template: `
    <demo-page-layout testId="click-outside-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="click-outside-demo-navigation"
        [demo]="demo"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Click Outside</p>
            <h2>Click-outside detection with injectable and directive.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectClickOutside()</code> and <code>HexguardClickOutsideDirective</code>
          provide signal-based and template-based click-outside detection for dismissing
          dropdowns, modals, and popovers.
        </p>

        <demo-status-strip
          testId="click-outside-demo-status"
          summary="Click-outside detection with signals and directive."
          currentUrl="Angular Click Outside — Demo"
          summaryTestId="click-outside-demo-summary"
          urlTestId="click-outside-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-click-outside/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="click-outside-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Click Outside</p>
            <h3>Live click-outside detection</h3>
          </div>
        </div>

        <div class="co-section">
          <h4 class="co-section__title">Directive demo</h4>
          <p class="co-hint">Click outside the box below to trigger the event.</p>

          <div
            class="co-box"
            [class.co-box--active]="directiveTriggered()"
            (hexguardClickOutside)="onDirectiveOutside()"
            data-testid="co-directive-box"
          >
            <p>Click <strong>outside</strong> this box.</p>
            @if (directiveTriggered()) {
              <p class="co-feedback" data-testid="co-directive-feedback">
                ✨ Outside click detected via directive!
              </p>
            }
          </div>
          <button
            type="button"
            class="demo-button demo-button--small"
            (click)="directiveTriggered.set(false); $event.stopPropagation()"
            data-testid="co-directive-reset"
          >
            Reset
          </button>
        </div>

        <div class="co-section">
          <h4 class="co-section__title">Injectable demo</h4>
          <p class="co-hint">
            Try clicking the toggle button — then click outside to close.
          </p>

          <button
            type="button"
            class="demo-button"
            (click)="dropdownOpen.set(true)"
            data-testid="co-open-dropdown"
          >
            Open dropdown
          </button>

          @if (dropdownOpen()) {
            <div
              class="co-dropdown"
              data-testid="co-dropdown"
              (hexguardClickOutside)="dropdownOpen.set(false)"
            >
              <p>Dropdown content. Click outside to close.</p>
              <button
                type="button"
                class="demo-button demo-button--small"
                (click)="dropdownOpen.set(false); $event.stopPropagation()"
              >
                Close
              </button>
            </div>
          }
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="click-outside-inspector-panel"
        eyebrow="Reference"
        title="Click Outside snapshot"
        summary="Live click-outside state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="click-outside-snapshot-json"
        codeTestId="click-outside-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .co-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid var(--color-border);
      }
      .co-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .co-section__title {
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--color-text-strong);
      }
      .co-hint {
        font-size: 0.85rem;
        color: var(--color-text-weak);
        margin-bottom: 0.75rem;
      }
      .co-box {
        padding: 1.5rem;
        border-radius: 1rem;
        border: 2px solid var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        margin-bottom: 0.5rem;
        text-align: center;
        transition: border-color 200ms ease;
        cursor: default;
      }
      .co-box--active {
        border-color: rgba(92, 184, 92, 0.5);
        box-shadow: 0 0 0 1px rgba(92, 184, 92, 0.2);
      }
      .co-feedback {
        margin-top: 0.5rem;
        font-weight: 600;
        color: green;
      }
      .co-dropdown {
        margin-top: 0.5rem;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        box-shadow: var(--shadow-soft);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClickOutsideDemoPageComponent {
  protected readonly demo = ANGULAR_CLICK_OUTSIDE_DEMO;
  protected readonly directiveTriggered = signal(false);
  protected readonly dropdownOpen = signal(false);

  protected onDirectiveOutside(): void {
    this.directiveTriggered.set(true);
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      directiveTriggered: this.directiveTriggered(),
      dropdownOpen: this.dropdownOpen(),
    }),
  );
}
