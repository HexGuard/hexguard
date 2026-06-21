import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debouncedSignal } from '@hexguard/angular-debounce';

import { ANGULAR_DEBOUNCE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-debounce-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  template: `
    <demo-page-layout testId="debounce-demo-page">
      <demo-navigation-strip demoNavigation testId="debounce-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Debounce</p>
            <h2>Debounced signal primitive with three edge modes.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>debouncedSignal()</code> provides a configurable trailing, leading, or both-edge
          debounce. Type in the input below to see how each mode behaves.
        </p>

        <demo-status-strip
          testId="debounce-demo-status"
          summary="Debounced signal with three edge modes."
          currentUrl="Angular Debounce Demo"
          summaryTestId="debounce-demo-summary"
          urlTestId="debounce-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-debounce/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="debounce-demo-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Debounce</p>
            <h3>Debounce playground</h3>
          </div>
        </div>

        <div class="demo-field-group">
          <label class="demo-field-label">Type to see different debounce modes in real time:</label>
          <input
            type="text"
            [ngModel]="inputValue()"
            (ngModelChange)="onInput($event)"
            placeholder="Type here..."
            data-testid="debounce-input"
            class="demo-input"
          />
        </div>

        <div class="debounce-modes">
          <!-- Live value -->
          <div class="debounce-mode debounce-mode--live">
            <div class="debounce-mode__head">
              <span>Live value</span>
              <span class="demo-hint-pill">immediate</span>
            </div>
            <span class="debounce-mode__value" data-testid="debounce-live-value">{{
              inputValue() || '—'
            }}</span>
          </div>

          <!-- Trailing -->
          <div class="debounce-mode" [class.debounce-mode--pending]="trailing.isPending()">
            <div class="debounce-mode__head">
              <span>Trailing</span>
              <span class="demo-hint-pill">300ms after last change</span>
            </div>
            <span class="debounce-mode__value" data-testid="debounce-trailing-value">{{
              trailing.value() || '—'
            }}</span>
            @if (trailing.isPending()) {
              <div class="debounce-mode__timer">
                <span class="debounce-pulse"></span>
                <span data-testid="debounce-trailing-pending">pending…</span>
              </div>
            }
          </div>

          <!-- Leading -->
          <div class="debounce-mode debounce-mode--leading">
            <div class="debounce-mode__head">
              <span>Leading</span>
              <span class="demo-hint-pill">immediate, no trailing</span>
            </div>
            <span class="debounce-mode__value" data-testid="debounce-leading-value">{{
              leading.value() || '—'
            }}</span>
          </div>

          <!-- Both edges -->
          <div class="debounce-mode" [class.debounce-mode--pending]="both.isPending()">
            <div class="debounce-mode__head">
              <span>Both edges</span>
              <span class="demo-hint-pill">immediate + trailing</span>
            </div>
            <span class="debounce-mode__value" data-testid="debounce-both-value">{{
              both.value() || '—'
            }}</span>
            @if (both.isPending()) {
              <div class="debounce-mode__timer">
                <span class="debounce-pulse"></span>
                <span data-testid="debounce-both-pending">pending…</span>
              </div>
            }
          </div>
        </div>

        <div class="demo-actions-row">
          <button
            type="button"
            class="demo-button"
            (click)="trailing.flush()"
            data-testid="debounce-flush"
          >
            Flush trailing
          </button>
          <button
            type="button"
            class="demo-button demo-button--ghost"
            (click)="trailing.cancel()"
            data-testid="debounce-cancel"
          >
            Cancel trailing
          </button>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="debounce-inspector-panel"
        eyebrow="Reference"
        title="Debounce snapshot"
        summary="Live state for all three debounce modes."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="debounce-snapshot-json"
        codeTestId="debounce-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .debounce-modes {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
        margin-bottom: 1rem;
      }
      .debounce-mode {
        display: grid;
        gap: 0.4rem;
        padding: 0.85rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        box-shadow: var(--shadow-soft);
        transition: border-color 200ms ease;
      }
      .debounce-mode--live {
        background: linear-gradient(180deg, rgba(91, 192, 222, 0.08), rgba(91, 192, 222, 0.04));
      }
      .debounce-mode--leading {
        background: linear-gradient(180deg, rgba(92, 184, 92, 0.08), rgba(92, 184, 92, 0.04));
      }
      .debounce-mode--pending {
        border-color: rgba(240, 173, 78, 0.5);
        box-shadow:
          0 0 0 1px rgba(240, 173, 78, 0.2),
          var(--shadow-soft);
      }
      .debounce-mode__head {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-weight: 600;
        font-size: 0.82rem;
      }
      .debounce-mode__value {
        display: block;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--color-ink);
        letter-spacing: -0.02em;
        word-break: break-all;
      }
      .debounce-mode__timer {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.72rem;
        color: #b8860b;
        font-style: italic;
      }
      .debounce-pulse {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: #f0ad4e;
        animation: debouncePulse 1s ease-in-out infinite;
      }
      @keyframes debouncePulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.8);
        }
      }
      .demo-actions-row {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebounceDemoPageComponent {
  readonly demo = ANGULAR_DEBOUNCE_DEMO;
  readonly inputValue = signal('hello');
  readonly trailing = debouncedSignal('hello', 300);
  readonly leading = debouncedSignal('hello', 300, { leading: true, trailing: false });
  readonly both = debouncedSignal('hello', 300, { leading: true, trailing: true });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      liveValue: this.inputValue(),
      trailing: this.trailing.value(),
      trailingPending: this.trailing.isPending(),
      leading: this.leading.value(),
      both: this.both.value(),
      bothPending: this.both.isPending(),
    }),
  );

  onInput(value: string): void {
    this.inputValue.set(value);
    this.trailing.set(value);
    this.leading.set(value);
    this.both.set(value);
  }
}
