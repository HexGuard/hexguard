import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HexguardNotificationOutletComponent,
  type NotificationType,
  NotificationService,
} from '@hexguard/angular-notifications';

import { ANGULAR_NOTIFICATIONS_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../shared/formatting';

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
      <demo-navigation-strip
        demoNavigation
        testId="notifications-demo-navigation"
        [demo]="demo"
      />

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
      </article>

      <!-- demo-snippet:start angular-notifications/demo-state -->
      <section class="demo-card" data-testid="notifications-demo-playground">
        <p class="demo-card__section-label">Playground</p>

        <div class="notify-actions">
          @for (action of typeActions; track action.type) {
            <button
              type="button"
              class="notify-btn notify-btn--{{ action.type }}"
              (click)="notify(action.type)"
              [attr.data-testid]="'notify-' + action.type"
            >
              {{ action.label }}
            </button>
          }
        </div>

        <div class="notify-controls">
          <label class="notify-label">
            Duration (ms):
            <input
              type="number"
              [ngModel]="durationMs()"
              (ngModelChange)="durationMs.set($event)"
              min="0"
              step="500"
              class="notify-input"
              data-testid="notifications-duration"
            />
            <span class="notify-hint">(0 = persistent)</span>
          </label>
        </div>

        <div class="notify-toolbar">
          <button
            type="button"
            class="notify-dismiss-all"
            (click)="dismissAll()"
            data-testid="dismiss-all"
          >
            Dismiss All ({{ service.count() }})
          </button>
        </div>

        <p class="notify-counter" data-testid="notification-count">
          Active notifications: {{ service.count() }}
        </p>

        <hexguard-notification-outlet />
      </section>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
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

      <demo-status-strip
        summary="Headless notification queue with auto-dismiss."
        currentUrl="Angular Notifications Demo"
        summaryTestId="notifications-demo-summary"
        urlTestId="notifications-demo-url"
        testId="notifications-demo-status"
      />
    </demo-page-layout>
  `,
  styles: [
    `
    .notify-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .notify-btn {
      padding: 0.5rem 1rem; border: none; border-radius: 0.25rem;
      cursor: pointer; font-size: 0.875rem; color: #fff;
    }
    .notify-btn--success { background: #28a745; }
    .notify-btn--error { background: #dc3545; }
    .notify-btn--info { background: #17a2b8; }
    .notify-btn--warning { background: #ffc107; color: #333; }
    .notify-controls { margin-bottom: 0.75rem; }
    .notify-label { font-size: 0.875rem; }
    .notify-input {
      width: 5rem; margin-left: 0.5rem; padding: 0.25rem;
      border: 1px solid #ccc; border-radius: 0.25rem;
    }
    .notify-hint { margin-left: 0.5rem; color: #888; font-size: 0.75rem; }
    .notify-toolbar { margin-bottom: 0.75rem; }
    .notify-dismiss-all {
      padding: 0.5rem 1rem; border: 1px solid #ccc;
      border-radius: 0.25rem; background: #fff; cursor: pointer;
    }
    .notify-dismiss-all:hover { background: #f5f5f5; }
    .notify-counter { font-size: 0.875rem; color: #666; margin-bottom: 1rem; }
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
