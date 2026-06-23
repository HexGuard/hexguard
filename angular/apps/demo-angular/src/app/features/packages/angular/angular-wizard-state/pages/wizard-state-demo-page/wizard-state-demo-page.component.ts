import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectWizardState } from '@hexguard/angular-wizard-state';
import type { WizardStep } from '@hexguard/angular-wizard-state';
import { ANGULAR_WIZARD_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-wizard-state-demo-page',
  templateUrl: './wizard-state-demo-page.component.html',
  styleUrl: './wizard-state-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStateDemoPageComponent {
  protected readonly demo = ANGULAR_WIZARD_STATE_DEMO;
  protected readonly agree = signal(false);

  private readonly steps: readonly WizardStep[] = [
    { id: 'details', title: 'Details' },
    { id: 'config', title: 'Configuration', validate: this.agree.asReadonly() },
    { id: 'review', title: 'Review' },
  ];

  protected readonly wizard = injectWizardState({ steps: this.steps });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      currentStep: this.wizard.currentStep()?.id,
      currentIndex: this.wizard.currentIndex(),
      isFirst: this.wizard.isFirst(),
      isLast: this.wizard.isLast(),
      canGoNext: this.wizard.canGoNext(),
      canGoBack: this.wizard.canGoBack(),
      progress: this.wizard.progress(),
      isFinished: this.wizard.isFinished(),
    }),
  );
}
