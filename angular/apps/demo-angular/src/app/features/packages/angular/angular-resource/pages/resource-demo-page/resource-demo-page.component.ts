import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ANGULAR_RESOURCE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-resource-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="resource-demo-page">
      <demo-navigation-strip demoNavigation testId="resource-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Resource</p>
            <h2>Cached, retry, and deduplicated resource helpers</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>cachedResource()</code>, <code>retryResource()</code>, and
          <code>deduplicatedResource()</code> extend Angular 22's resource() API with
          production-ready patterns.
        </p>

        <demo-status-strip
          testId="resource-demo-status"
          summary="Resource helpers: cache, retry, dedup."
          currentUrl="Angular Resource — Demo"
          summaryTestId="resource-demo-summary"
          urlTestId="resource-demo-url"
        />
      </article>

      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="resource-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Resource Helpers</p>
            <h3>Live resource operations</h3>
          </div>
        </div>

        <div class="demo-message">
          <p>
            The <strong>angular-resource</strong> package provides three wrappers around
            Angular 22's <code>resource()</code> API that add caching, retry, and
            deduplication. These helpers work in any injection context where
            <code>resource()</code> is available.
          </p>
          <ul>
            <li><strong>cachedResource</strong> — in-memory cache with configurable TTL and stale-while-revalidate.</li>
            <li><strong>retryResource</strong> — exponential-backoff retry on transient failures.</li>
            <li><strong>deduplicatedResource</strong> — shares in-flight promises for identical concurrent requests.</li>
          </ul>
        </div>
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="resource-inspector-panel"
        eyebrow="Reference"
        title="Resource snapshot"
        summary="Resource helper reference."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="resource-snapshot-json"
        codeTestId="resource-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [`
    .demo-message { padding: 1rem; background: var(--color-surface-weak); border-radius: 0.75rem; }
    .demo-message ul { margin-top: 0.75rem; padding-left: 1.25rem; }
    .demo-message li { margin-bottom: 0.5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDemoPageComponent {
  readonly demo = ANGULAR_RESOURCE_DEMO;
  readonly snapshotJson = computed(() => formatSnapshot({
    package: 'angular-resource',
    exports: ['cachedResource', 'retryResource', 'deduplicatedResource'],
    status: 'Available',
  }));
}
