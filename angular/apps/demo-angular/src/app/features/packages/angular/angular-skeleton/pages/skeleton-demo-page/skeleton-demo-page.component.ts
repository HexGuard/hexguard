import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { skeletonState, bindLoading } from '@hexguard/angular-skeleton';
import { ANGULAR_SKELETON_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-skeleton-demo-page',
  templateUrl: './skeleton-demo-page.component.html',
  styleUrl: './skeleton-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonDemoPageComponent {
  protected readonly demo = ANGULAR_SKELETON_DEMO;

  // Standalone skeletons
  protected readonly cardSkeleton = skeletonState({ variant: 'card', count: 3, shimmer: true });
  protected readonly tableSkeleton = skeletonState({
    variant: 'table-row',
    count: 4,
    shimmer: true,
  });
  protected readonly textSkeleton = skeletonState({ variant: 'text', count: 2, shimmer: false });
  protected readonly avatarSkeleton = skeletonState({ variant: 'avatar', count: 1, shimmer: true });

  // Simulated loading
  protected readonly isLoading = signal(false);
  protected readonly loadingSkeleton = skeletonState({
    variant: 'table-row',
    count: 5,
    shimmer: true,
  });

  constructor() {
    bindLoading(this.loadingSkeleton, this.isLoading);

    this.cardSkeleton.show();
    this.tableSkeleton.show();
    this.textSkeleton.show();
    this.avatarSkeleton.show();
  }

  protected readonly variantOptions = [
    'text',
    'text-short',
    'circle',
    'avatar',
    'card',
    'table-row',
    'table-header',
    'custom',
  ] as const;

  protected readonly activeVariant = signal<string>('card');

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      cardActive: this.cardSkeleton.isActive(),
      tableActive: this.tableSkeleton.isActive(),
      textActive: this.textSkeleton.isActive(),
      loadingActive: this.loadingSkeleton.isActive(),
      isLoading: this.isLoading(),
      cardShimmer: this.cardSkeleton.shimmer(),
    }),
  );

  simulateLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
