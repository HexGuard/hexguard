import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectConfirmation } from '@hexguard/angular-confirmation';
import { ANGULAR_CONFIRMATION_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-confirmation-demo-page',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  template: `
    <demo-page-layout testId="confirmation-demo-page">
      <demo-navigation-strip demoNavigation testId="confirmation-demo-navigation" [demo]="demo" />
      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header"><div><p class="demo-eyebrow">Angular Confirmation</p><h2>Headless confirmation dialog state.</h2></div></div>
        <p class="demo-card__summary"><code>injectConfirmation()</code> provides promise-based <code>ask()</code> and <code>run()</code> flows for destructive actions, with <code>confirm()</code>/<code>cancel()</code> control and reactive <code>isOpen</code>/<code>currentRequest</code> signals.</p>
        <demo-status-strip testId="confirmation-demo-status" summary="Headless confirmation dialog state with promise-based flows." currentUrl="Angular Confirmation — Demo" summaryTestId="confirmation-demo-summary" urlTestId="confirmation-demo-url" />
      </article>

      <article demoPrimary class="demo-card demo-card--stack" data-testid="confirmation-playground">
        <div class="confirm-actions">
          <button class="demo-button" (click)="deleteItem()" data-testid="confirm-delete">Delete item</button>
          <button class="demo-button demo-button--ghost" (click)="archiveItem()" data-testid="confirm-archive">Archive item</button>
        </div>
        <div class="confirm-log">
          @for (entry of log(); track entry) {
            <div class="confirm-log__entry" [style.color]="entry.color">{{ entry.text }}</div>
          }
        </div>
        @if (confirm.isOpen()) {
          <div class="confirm-overlay" data-testid="confirm-dialog">
            <div class="confirm-dialog">
              <p class="confirm-dialog__title">{{ confirm.currentRequest()?.title }}</p>
              <p class="confirm-dialog__msg">{{ confirm.currentRequest()?.message }}</p>
              <div class="confirm-dialog__actions">
                <button class="demo-button demo-button--small" (click)="confirm.confirm()" data-testid="confirm-ok">{{ confirm.currentRequest()?.confirmLabel || 'OK' }}</button>
                <button class="demo-button demo-button--small demo-button--ghost" (click)="confirm.cancel()" data-testid="confirm-cancel">{{ confirm.currentRequest()?.cancelLabel || 'Cancel' }}</button>
              </div>
            </div>
          </div>
        }
      </article>

      <demo-inspector-panel demoAside panelTestId="confirmation-inspector-panel" eyebrow="Reference" title="Confirmation snapshot" summary="Live confirmation state."
        [snapshotJson]="snapshotJson()" [snippetId]="demo.codeSample.snippetId" [docsLinks]="demo.docsLinks"
        snapshotTestId="confirmation-snapshot-json" codeTestId="confirmation-code-sample" />
    </demo-page-layout>
  `,
  styles: [`
    .confirm-actions { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .confirm-log { min-height: 2rem; font-family: monospace; font-size: 0.85rem; margin-bottom: 1rem; }
    .confirm-log__entry { padding: 0.15rem 0; }
    .confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .confirm-dialog { background: var(--color-surface); padding: 1.5rem; border-radius: 1rem; max-width: 24rem; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    .confirm-dialog__title { font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem; }
    .confirm-dialog__msg { color: var(--color-text-weak); margin-bottom: 1rem; }
    .confirm-dialog__actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDemoPageComponent {
  protected readonly demo = ANGULAR_CONFIRMATION_DEMO;
  protected readonly confirm = injectConfirmation();
  private logEntries: { text: string; color: string }[] = [];
  protected readonly log = computed(() => [...this.logEntries]);

  protected async deleteItem(): Promise<void> {
    const ok = await this.confirm.ask({ title: 'Delete item?', message: 'This action cannot be undone.', confirmLabel: 'Delete', destructive: true });
    this.logEntries = [...this.logEntries, { text: ok ? '✓ Item deleted' : '✗ Delete cancelled', color: ok ? 'green' : 'var(--color-text-weak)' }];
  }
  protected async archiveItem(): Promise<void> {
    const result = await this.confirm.run({ title: 'Archive item?', message: 'This will archive the selected item.' }, async () => 'archived');
    this.logEntries = [...this.logEntries, { text: result.confirmed ? '✓ Item archived' : '✗ Archive cancelled', color: result.confirmed ? 'green' : 'var(--color-text-weak)' }];
  }
  protected readonly snapshotJson = computed(() => formatSnapshot({ isOpen: this.confirm.isOpen(), currentRequest: this.confirm.currentRequest()?.title ?? null }));
}
