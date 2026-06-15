import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  HexguardOptimisticStateOutletComponent,
  optimisticState,
  type OptimisticMutationConflictPolicy,
} from '@hexguard/angular-optimistic-state';

import { ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  createToggleDemoFeatures,
  OPTIMISTIC_POLICY_OPTIONS,
  type ToggleDemoFeature,
} from '../../data/optimistic-state-demo.data';

type MutationOutcome = 'error' | 'success';

interface ToggleMutationInput {
  readonly id: string;
  readonly enabled: boolean;
}

interface ToggleMutationResult {
  readonly id: string;
  readonly enabled: boolean;
  readonly note: string;
}

const INITIAL_FEATURES = createToggleDemoFeatures();
const DEFAULT_OVERLAP_SUMMARY = 'No overlapping toggle run has been attempted yet.';

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown optimistic-state toggle demo error.';
}

@Component({
  standalone: true,
  selector: 'demo-optimistic-state-toggle-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardOptimisticStateOutletComponent,
  ],
  templateUrl: './optimistic-state-toggle-demo-page.component.html',
  styleUrl: './optimistic-state-toggle-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimisticStateToggleDemoPageComponent {
  readonly demo = ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO;
  readonly policyOptions = OPTIMISTIC_POLICY_OPTIONS;

  readonly selectedFeatureId = signal(INITIAL_FEATURES[0]?.id ?? '');
  private readonly nextOutcome = signal<MutationOutcome>('success');
  readonly overlapSummary = signal(DEFAULT_OVERLAP_SUMMARY);

  // demo-snippet:start optimistic-state-toggle-demo
  readonly featureToggles = optimisticState<
    readonly ToggleDemoFeature[],
    ToggleMutationInput,
    ToggleMutationResult,
    string
  >({
    initialValue: INITIAL_FEATURES,
    getTarget: (input) => input.id,
    apply: (features, input) =>
      features.map((feature) =>
        feature.id === input.id ? { ...feature, enabled: input.enabled, pending: true } : feature,
      ),
    reconcile: (features, result) =>
      features.map((feature) =>
        feature.id === result.id
          ? { ...feature, enabled: result.enabled, pending: false }
          : feature,
      ),
    run: (input) => this.simulateToggle(input),
    mapError: mapDemoError,
  });
  readonly selectedFeature = computed(
    () =>
      this.featureToggles.value().find((feature) => feature.id === this.selectedFeatureId()) ??
      this.featureToggles.value()[0],
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly policyDetail = computed(
    () =>
      this.policyOptions.find((option) => option.value === this.featureToggles.conflictPolicy())
        ?.detail ?? 'Same-target overlap stays explicit through the selected policy.',
  );
  readonly statusSummary = computed(() => {
    if (this.featureToggles.isPending()) {
      return `Applying an optimistic toggle for ${this.selectedFeature()?.label ?? 'the selected feature'}.`;
    }

    if (this.featureToggles.isError()) {
      return this.featureToggles.error() ?? 'The last optimistic toggle failed.';
    }

    return (
      this.featureToggles.lastResult()?.note ??
      'Choose a feature and run optimistic toggles, failures, or overlap experiments.'
    );
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.featureToggles.status(),
      conflictPolicy: this.featureToggles.conflictPolicy(),
      error: this.featureToggles.error(),
      lastResult: this.featureToggles.lastResult(),
      pendingCount: this.featureToggles.pendingCount(),
      queuedCount: this.featureToggles.queuedCount(),
      overlapSummary: this.overlapSummary(),
      entries: this.featureToggles.entries(),
      settledValue: this.featureToggles.settledValue(),
      value: this.featureToggles.value(),
    }),
  );
  // demo-snippet:end optimistic-state-toggle-demo

  updateSelectedFeature(id: string): void {
    this.selectedFeatureId.set(id);
  }

  updateConflictPolicy(policy: OptimisticMutationConflictPolicy): void {
    this.featureToggles.setConflictPolicy(policy);
    this.overlapSummary.set(DEFAULT_OVERLAP_SUMMARY);
  }

  enableSelected(): void {
    this.runSelectedToggle(true, 'success');
  }

  disableSelected(): void {
    this.runSelectedToggle(false, 'success');
  }

  failSelected(): void {
    const selectedFeature = this.selectedFeature();

    if (!selectedFeature) {
      return;
    }

    this.runSelectedToggle(!selectedFeature.enabled, 'error');
  }

  runOverlap(): void {
    const selectedFeature = this.selectedFeature();

    if (!selectedFeature) {
      return;
    }

    this.nextOutcome.set('success');

    const policy = this.featureToggles.conflictPolicy();
    const firstRun = this.featureToggles.run({
      id: selectedFeature.id,
      enabled: !selectedFeature.enabled,
    });
    const secondRun = this.featureToggles.run({
      id: selectedFeature.id,
      enabled: selectedFeature.enabled,
    });

    if (policy === 'queue') {
      this.overlapSummary.set(
        'Second mutation queued behind the active toggle and will apply next.',
      );
    }

    if (policy === 'replace') {
      this.overlapSummary.set(
        'Second mutation replaced the active optimistic overlay immediately.',
      );
    }

    void firstRun.catch(() => undefined);
    void secondRun.catch(() => {
      if (policy === 'reject') {
        this.overlapSummary.set(
          'Second mutation rejected before it could replace the active optimistic toggle.',
        );
      }
    });
  }

  resetDemo(): void {
    this.featureToggles.reset(createToggleDemoFeatures());
    this.selectedFeatureId.set(createToggleDemoFeatures()[0]?.id ?? '');
    this.nextOutcome.set('success');
    this.overlapSummary.set(DEFAULT_OVERLAP_SUMMARY);
  }

  private runSelectedToggle(enabled: boolean, outcome: MutationOutcome): void {
    const selectedFeature = this.selectedFeature();

    if (!selectedFeature) {
      return;
    }

    this.nextOutcome.set(outcome);

    const promise = this.featureToggles.run({
      id: selectedFeature.id,
      enabled,
    });

    void promise.catch(() => undefined);
  }

  private simulateToggle(input: ToggleMutationInput): Promise<ToggleMutationResult> {
    const feature =
      this.featureToggles.value().find((candidate) => candidate.id === input.id) ??
      this.featureToggles.settledValue().find((candidate) => candidate.id === input.id);
    const featureLabel = feature?.label ?? input.id;

    return new Promise<ToggleMutationResult>((resolve, reject) => {
      setTimeout(() => {
        if (this.nextOutcome() === 'error') {
          reject(
            new Error(
              `Saving ${featureLabel} failed and the optimistic toggle rolled back to the committed value.`,
            ),
          );

          return;
        }

        resolve({
          id: input.id,
          enabled: input.enabled,
          note: `${featureLabel} is now ${input.enabled ? 'enabled' : 'disabled'} on the committed server copy.`,
        });
      }, 480);
    });
  }
}
