import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debouncedSignal } from '@hexguard/angular-debounce';

import { ANGULAR_DEBOUNCE_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../shared/formatting';

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
      <demo-navigation-strip
        demoNavigation
        testId="debounce-demo-navigation"
        [demo]="demo"
      />

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
      </article>

      <!-- demo-snippet:start angular-debounce/demo-state -->
      <section class="demo-card" data-testid="debounce-demo-playground">
        <p class="demo-card__section-label">Playground</p>

        <div class="debounce-controls">
          <input
            type="text"
            [ngModel]="inputValue()"
            (ngModelChange)="inputValue.set($event)"
            placeholder="Type here..."
            data-testid="debounce-input"
            class="debounce-input"
          />
        </div>

        <div class="debounce-values">
          <div class="debounce-row">
            <span class="debounce-label">Live:</span>
            <span class="debounce-value" data-testid="debounce-live-value">{{
              inputValue()
            }}</span>
          </div>
          <div class="debounce-row">
            <span class="debounce-label">Trailing (300ms):</span>
            <span class="debounce-value" data-testid="debounce-trailing-value">{{
              trailing.value()
            }}</span>
            @if (trailing.isPending()) {
              <span class="debounce-pending" data-testid="debounce-trailing-pending"
                >⋯ pending</span
              >
            }
          </div>
          <div class="debounce-row">
            <span class="debounce-label">Leading (300ms):</span>
            <span class="debounce-value" data-testid="debounce-leading-value">{{
              leading.value()
            }}</span>
          </div>
          <div class="debounce-row">
            <span class="debounce-label">Both edges (300ms):</span>
            <span class="debounce-value" data-testid="debounce-both-value">{{
              both.value()
            }}</span>
            @if (both.isPending()) {
              <span class="debounce-pending" data-testid="debounce-both-pending"
                >⋯ pending</span
              >
            }
          </div>
        </div>

        <div class="debounce-actions">
          <button type="button" (click)="trailing.flush()" data-testid="debounce-flush">
            Flush trailing
          </button>
          <button type="button" (click)="trailing.cancel()" data-testid="debounce-cancel">
            Cancel trailing
          </button>
        </div>
      </section>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
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

      <demo-status-strip
        summary="Debounced signal with three edge modes."
        currentUrl="Angular Debounce Demo"
        summaryTestId="debounce-demo-summary"
        urlTestId="debounce-demo-url"
        testId="debounce-demo-status"
      />
    </demo-page-layout>
  `,
  styles: [
    `
    .debounce-controls { margin-bottom: 1rem; }
    .debounce-input {
      width: 100%; max-width: 20rem; padding: 0.5rem;
      border: 1px solid #ccc; border-radius: 0.25rem; font-size: 1rem;
    }
    .debounce-values { margin-bottom: 1rem; }
    .debounce-row { margin: 0.375rem 0; display: flex; align-items: center; gap: 0.5rem; }
    .debounce-label { font-weight: 600; font-size: 0.875rem; min-width: 10rem; }
    .debounce-value { font-size: 0.875rem; }
    .debounce-pending {
      font-style: italic; color: #888; font-size: 0.75rem;
    }
    .debounce-actions { display: flex; gap: 0.5rem; }
    .debounce-actions button {
      padding: 0.375rem 0.75rem; border: 1px solid #ccc;
      border-radius: 0.25rem; background: #fff; cursor: pointer; font-size: 0.8125rem;
    }
    .debounce-actions button:hover { background: #f5f5f5; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebounceDemoPageComponent {
  readonly demo = ANGULAR_DEBOUNCE_DEMO;
  readonly inputValue = signal('hello');
  readonly trailing = debouncedSignal('hello', 300);
  readonly leading = debouncedSignal('hello', 300, { leading: true, trailing: false });
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
  readonly both = debouncedSignal('hello', 300, { leading: true, trailing: true });
}
