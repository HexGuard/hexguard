import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectDirtyGuard, injectDirtyState } from '@hexguard/angular-dirty-state';
import { ANGULAR_DIRTY_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-dirty-state-demo-page',
  templateUrl: './dirty-state-demo-page.component.html',
  styleUrl: './dirty-state-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent, DemoNavigationStripComponent,
    DemoPageLayoutComponent, DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirtyStateDemoPageComponent {
  protected readonly demo = ANGULAR_DIRTY_STATE_DEMO;
  protected readonly dirty = injectDirtyState();

  /** Simulated form field. */
  protected readonly formValue = signal('');

  /** Track guard invocations. */
  protected readonly guardResult = signal<'allowed' | 'blocked' | null>(null);
  protected readonly guardMessage =
    'You have unsaved changes. Are you sure you want to leave?';

  /** The route guard — created with a custom message. */
  private readonly guard = injectDirtyGuard(this.dirty, {
    message: this.guardMessage,
  });

  onInput(value: string): void {
    this.formValue.set(value);
    this.dirty.markDirty();
    this.guardResult.set(null);
  }

  save(): void {
    this.dirty.markClean();
    this.guardResult.set(null);
  }

  reset(): void {
    this.formValue.set('');
    this.dirty.reset();
    this.guardResult.set(null);
  }

  /** Simulate a route deactivation check using the guard. */
  tryLeave(): void {
    const result = this.guard(null as never, null as never, null as never, null as never);
    this.guardResult.set(result ? 'allowed' : 'blocked');
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      isDirty: this.dirty.isDirty(),
      formValue: this.formValue(),
      guardResult: this.guardResult(),
    }),
  );
}
