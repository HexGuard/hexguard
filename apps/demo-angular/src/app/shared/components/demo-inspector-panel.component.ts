import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import type { DemoLink } from '../../demo-registry';
import { DEMO_SOURCE_SNIPPETS } from '../../generated/demo-snippets';

@Component({
  selector: 'demo-inspector-panel',
  standalone: true,
  template: `
    <aside class="demo-card demo-card--stack" [attr.data-testid]="panelTestId()">
      <div class="demo-card__header">
        <div>
          <p class="demo-eyebrow">{{ eyebrow() }}</p>
          <h3>{{ title() }}</h3>
        </div>

        <div class="demo-tab-bar" role="tablist" aria-label="Inspector tabs">
          <button
            type="button"
            class="demo-tab-button"
            [class.demo-tab-button--active]="activeTab() === 'state'"
            [attr.data-testid]="panelTestId() + '-tab-state'"
            (click)="activeTab.set('state')"
          >
            Live state
          </button>
          <button
            type="button"
            class="demo-tab-button"
            [class.demo-tab-button--active]="activeTab() === 'code'"
            [attr.data-testid]="panelTestId() + '-tab-code'"
            (click)="activeTab.set('code')"
          >
            Source
          </button>
        </div>
      </div>

      @if (summary()) {
        <p class="demo-card__summary">{{ summary() }}</p>
      }

      @if (activeTab() === 'state') {
        <pre class="demo-code-block" [attr.data-testid]="snapshotTestId()">{{
          snapshotJson()
        }}</pre>
      } @else {
        @if (snippet(); as currentSnippet) {
          <div class="demo-source-meta">
            <strong>{{ currentSnippet.title }}</strong>
            <p>{{ currentSnippet.description }}</p>
            <code>{{ currentSnippet.sourcePath }}</code>
          </div>
          <div class="demo-code-frame" [attr.data-testid]="codeTestId()">
            <ol class="demo-code-list" aria-label="Generated source sample">
              @for (line of codeLines(); track $index) {
                <li class="demo-code-line">
                  <span class="demo-code-line__number">{{ $index + 1 }}</span>
                  <code>{{ line || ' ' }}</code>
                </li>
              }
            </ol>
          </div>
        } @else {
          <p class="demo-card__summary" [attr.data-testid]="codeTestId()">
            Code sample unavailable.
          </p>
        }
      }

      @if (docsLinks().length > 0) {
        <div class="demo-link-row">
          @for (link of docsLinks(); track link.href) {
            <a class="demo-link-chip" [href]="link.href" target="_blank" rel="noreferrer">
              {{ link.label }}
            </a>
          }
        </div>
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoInspectorPanelComponent {
  readonly eyebrow = input<string>('Reference');
  readonly title = input.required<string>();
  readonly summary = input<string>('');
  readonly snapshotJson = input.required<string>();
  readonly snippetId = input.required<string>();
  readonly docsLinks = input<readonly DemoLink[]>([]);
  readonly panelTestId = input.required<string>();
  readonly snapshotTestId = input.required<string>();
  readonly codeTestId = input.required<string>();
  readonly activeTab = signal<'state' | 'code'>('state');
  readonly snippet = computed(() => DEMO_SOURCE_SNIPPETS[this.snippetId()] ?? null);
  readonly codeLines = computed(() => this.snippet()?.code.split('\n') ?? []);
}
