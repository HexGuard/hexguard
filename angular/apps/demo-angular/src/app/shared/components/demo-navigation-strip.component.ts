import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  getDemoPackage,
  getDotnetPackage,
  type DemoPageEntry,
  type DotnetDemoPageEntry,
  type DotnetPackageEntry,
} from '../../demo-registry';

@Component({
  selector: 'demo-navigation-strip',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (dotnetPackage(); as dp) {
      <nav class="demo-nav-strip" [attr.data-testid]="testId()" aria-label="Demo navigation">
        <a
          class="demo-nav-strip__back"
          [routerLink]="dp.route"
          [attr.data-testid]="testId() + '-overview'"
        >
          <span>{{ dp.nugetId }}</span>
          <strong>.NET package overview</strong>
        </a>

        <div class="demo-nav-strip__demos" aria-label="Package demos">
          @for (demoEntry of dp.demos; track demoEntry.route) {
            <a
              class="demo-nav-strip__demo"
              [class.demo-nav-strip__demo--active]="demoEntry.id === (dotnetDemo()?.id ?? '')"
              [routerLink]="demoEntry.route"
              [attr.aria-current]="demoEntry.id === (dotnetDemo()?.id ?? '') ? 'page' : null"
              [attr.data-testid]="testId() + '-demo-' + demoEntry.id"
            >
              @if (demoEntry.id === (dotnetDemo()?.id ?? '')) {
                <span>Current demo</span>
              } @else {
                <span>Open demo</span>
              }
              <strong>{{ demoEntry.label }}</strong>
            </a>
          }
        </div>
      </nav>
    } @else if (packageEntry(); as currentPackage) {
      <nav class="demo-nav-strip" [attr.data-testid]="testId()" aria-label="Demo navigation">
        <a
          class="demo-nav-strip__back"
          [routerLink]="currentPackage.route"
          [attr.data-testid]="testId() + '-overview'"
        >
          <span>{{ currentPackage.label }}</span>
          <strong>Package overview</strong>
        </a>

        <div class="demo-nav-strip__demos" aria-label="Package demos">
          @for (demoEntry of currentPackage.demos; track demoEntry.route) {
            <a
              class="demo-nav-strip__demo"
              [class.demo-nav-strip__demo--active]="demoEntry.id === demo().id"
              [routerLink]="demoEntry.route"
              [attr.aria-current]="demoEntry.id === demo().id ? 'page' : null"
              [attr.data-testid]="testId() + '-demo-' + demoEntry.id"
            >
              @if (demoEntry.id === demo().id) {
                <span>Current demo</span>
              } @else {
                <span>Open demo</span>
              }
              <strong>{{ demoEntry.label }}</strong>
            </a>
          }
        </div>
      </nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoNavigationStripComponent {
  readonly demo = input.required<DemoPageEntry>();
  readonly dotnetDemo = input<DotnetDemoPageEntry | undefined>(undefined);
  readonly dotnetPackage = input<DotnetPackageEntry | undefined>(undefined);
  readonly testId = input.required<string>();
  readonly packageEntry = computed(() => getDemoPackage(this.demo().packageId));
}
