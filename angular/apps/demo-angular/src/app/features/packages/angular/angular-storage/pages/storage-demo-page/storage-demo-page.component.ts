import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectStorage } from '@hexguard/angular-storage';

import { ANGULAR_STORAGE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';
import { STORAGE_DEMO_ITEMS } from '../../data/storage-demo.data';

@Component({
  standalone: true,
  selector: 'demo-storage-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  template: `
    <demo-page-layout testId="storage-demo-page">
      <demo-navigation-strip demoNavigation testId="storage-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Storage</p>
            <h2>Typed, signal-backed local and session storage.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectStorage()</code> provides typed read/write access to
          <code>localStorage</code> or <code>sessionStorage</code> with JSON serialization,
          versioning, TTL expiry, cross-tab sync, and graceful fallback.
        </p>

        <demo-status-strip
          testId="storage-demo-status"
          summary="Typed storage with signals, versioning, and cross-tab sync."
          currentUrl="Angular Storage — Demo"
          summaryTestId="storage-demo-summary"
          urlTestId="storage-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-storage/demo-state -->
      <article demoPrimary class="demo-card demo-card--stack" data-testid="storage-playground">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Storage</p>
            <h3>Persistent preference panel</h3>
          </div>
        </div>

        @for (item of storageItems; track item.key) {
          <div class="demo-field-group" data-testid="storage-item">
            <h4 class="demo-field-label">{{ item.label }}</h4>
            <input
              class="demo-input"
              [ngModel]="getValue(item.key)"
              (ngModelChange)="setValue(item.key, $event)"
              [attr.data-testid]="'storage-input-' + item.key"
            />
            <p>
              Meta:
              <strong [attr.data-testid]="'storage-meta-' + item.key">{{
                getMeta(item.key)
              }}</strong>
            </p>
          </div>
        }

        <div class="demo-card__note">
          <p>
            Values persist in localStorage across page reloads. Open this page in another tab to see
            cross-tab synchronization in action.
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="storage-inspector-panel"
        eyebrow="Reference"
        title="Storage snapshot"
        summary="Live storage values."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="storage-snapshot-json"
        codeTestId="storage-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .demo-field-group {
        margin-bottom: 1.25rem;
      }
      .demo-card__note {
        margin-top: 1.25rem;
        padding: 0.75rem;
        background: var(--bg-muted, #f5f5f5);
        border-radius: 0.5rem;
        font-size: 0.85rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageDemoPageComponent {
  protected readonly demo = ANGULAR_STORAGE_DEMO;
  protected readonly storageItems = STORAGE_DEMO_ITEMS;

  protected readonly theme = injectStorage('demo-theme', { defaultValue: 'light' });
  protected readonly sidebar = injectStorage('demo-sidebar', { defaultValue: 'visible' });
  protected readonly fontSize = injectStorage('demo-font-size', { defaultValue: 'medium' });

  protected getValue(key: string): string {
    switch (key) {
      case 'demo-theme':
        return this.theme.value();
      case 'demo-sidebar':
        return this.sidebar.value();
      case 'demo-font-size':
        return this.fontSize.value();
      default:
        return '';
    }
  }

  protected getMeta(key: string): string {
    switch (key) {
      case 'demo-theme':
        return this.theme.meta();
      case 'demo-sidebar':
        return this.sidebar.meta();
      case 'demo-font-size':
        return this.fontSize.meta();
      default:
        return 'missing';
    }
  }

  protected setValue(key: string, value: string): void {
    switch (key) {
      case 'demo-theme':
        this.theme.set(value);
        break;
      case 'demo-sidebar':
        this.sidebar.set(value);
        break;
      case 'demo-font-size':
        this.fontSize.set(value);
        break;
    }
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      theme: this.theme.value(),
      sidebar: this.sidebar.value(),
      fontSize: this.fontSize.value(),
      themeMeta: this.theme.meta(),
    }),
  );
}
