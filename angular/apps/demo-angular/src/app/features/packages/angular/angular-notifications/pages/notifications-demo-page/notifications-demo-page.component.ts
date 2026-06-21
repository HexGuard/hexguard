import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HexguardNotificationOutletComponent,
  type NotificationType,
  NotificationService,
} from '@hexguard/angular-notifications';

import { ANGULAR_NOTIFICATIONS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-notifications-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardNotificationOutletComponent,
  ],
  template: `
    <demo-page-layout testId="notifications-demo-page">
      <demo-navigation-strip demoNavigation testId="notifications-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Notifications</p>
            <h2>Headless notification queue with auto-dismiss and action support.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>NotificationService</code> manages a typed notification queue. Click the buttons
          below to trigger different notification types.
        </p>

        <demo-status-strip
          testId="notifications-demo-status"
          summary="Headless notification queue with auto-dismiss."
          currentUrl="Angular Notifications Demo"
          summaryTestId="notifications-demo-summary"
          urlTestId="notifications-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-notifications/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="notifications-demo-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Notifications</p>
            <h3>Toast playground</h3>
          </div>
        </div>

        <div class="notify-grid">
          <div class="notify-controls">
            <p class="notify-sub-label">Trigger a notification:</p>
            <div class="notify-buttons">
              @for (action of typeActions; track action.type) {
                <button
                  type="button"
                  class="demo-button demo-button--sm"
                  (click)="notify(action.type)"
                  [attr.data-testid]="'notify-' + action.type"
                >
                  {{ action.label }}
                </button>
              }
            </div>

            <div class="notify-config">
              <label class="notify-config-row">
                <span class="notify-config-label">Duration:</span>
                <input
                  type="number"
                  [ngModel]="durationMs()"
                  (ngModelChange)="durationMs.set($event)"
                  min="0"
                  step="500"
                  class="demo-input"
                  style="max-width:7rem"
                  data-testid="notifications-duration"
                />
                <span class="notify-hint">ms (0 = persistent)</span>
              </label>
            </div>

            <div class="notify-toolbar">
              <span class="notify-queue-count" data-testid="notification-count">
                Queue: <strong>{{ service.count() }}</strong>
              </span>
              <button
                type="button"
                class="demo-button demo-button--ghost"
                (click)="dismissAll()"
                data-testid="dismiss-all"
              >
                Dismiss All
              </button>
            </div>
          </div>

          <div class="notify-preview">
            <p class="notify-sub-label">Toast preview:</p>
            <div class="notify-preview-box">
              @if (service.count() === 0) {
                <p class="notify-empty">Notifications appear here</p>
              }
              <hexguard-notification-outlet [inline]="true" />
            </div>
          </div>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="notifications-inspector-panel"
        eyebrow="Reference"
        title="Toast queue state"
        summary="Current notification queue snapshot."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="notifications-snapshot-json"
        codeTestId="notifications-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .notify-grid {
        display: grid;
        gap: 1.25rem;
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 800px) {
        .notify-grid {
          grid-template-columns: 1fr;
        }
      }
      .notify-sub-label {
        margin: 0 0 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-muted);
      }
      .notify-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .notify-config {
        margin-bottom: 1rem;
      }
      .notify-config-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .notify-config-label {
        font-size: 0.85rem;
        color: var(--color-muted);
      }
      .notify-hint {
        color: var(--color-muted);
        font-size: 0.72rem;
      }
      .notify-toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        padding: 0.6rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        box-shadow: var(--shadow-soft);
      }
      .notify-queue-count {
        font-size: 0.85rem;
      }
      .notify-queue-count strong {
        color: var(--color-ink);
      }
      .notify-preview-box {
        min-height: 6rem;
        border: 1px dashed var(--color-border);
        border-radius: 1rem;
        padding: 0.75rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
      }
      .notify-empty {
        margin: 0;
        color: var(--color-muted);
        font-size: 0.82rem;
        text-align: center;
        padding: 2rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDemoPageComponent {
  readonly demo = ANGULAR_NOTIFICATIONS_DEMO;
  readonly service = inject(NotificationService);
  readonly durationMs = signal(5000);

  readonly typeActions: { type: NotificationType; label: string }[] = [
    { type: 'success', label: 'Show Success' },
    { type: 'error', label: 'Show Error' },
    { type: 'info', label: 'Show Info' },
    { type: 'warning', label: 'Show Warning' },
  ];

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      count: this.service.count(),
      types: this.service.notifications().map((n) => n.type),
    }),
  );

  notify(type: NotificationType): void {
    const duration = this.durationMs();
    const options = duration > 0 ? { duration } : { duration: 0 };
    this.service.show(`This is a ${type} notification.`, type, options);
  }

  dismissAll(): void {
    this.service.dismissAll();
  }
}
