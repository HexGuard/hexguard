import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

import type { DemoLink } from '../../demo-registry';
import type { DemoSourceSnippet } from '../../generated/demo-snippets';

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
            @if (selectedSourceFile(); as sourceFile) {
              <code>{{ sourceFile.sourcePath }}</code>
            }
          </div>

          <div class="demo-tab-bar" role="tablist" aria-label="Source files">
            @for (sourceFile of sourceFiles(); track sourceFile.id) {
              <button
                type="button"
                class="demo-tab-button"
                [class.demo-tab-button--active]="activeSourceFileId() === sourceFile.id"
                [attr.data-testid]="codeTestId() + '-file-' + sourceFile.id"
                (click)="activeSourceFileId.set(sourceFile.id)"
              >
                {{ sourceFile.label }}
              </button>
            }
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
        } @else if (sourceLoadState() === 'loading') {
          <p class="demo-card__summary" [attr.data-testid]="codeTestId()">
            Loading full component source...
          </p>
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
  readonly activeSourceFileId = signal<'ts' | 'html' | 'css'>('ts');
  readonly sourceLoadState = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');
  readonly sourceSnippets = signal<Record<string, DemoSourceSnippet> | null>(null);
  readonly snippet = computed(() => this.sourceSnippets()?.[this.snippetId()] ?? null);
  readonly sourceFiles = computed(() => this.snippet()?.files ?? []);
  readonly selectedSourceFile = computed(() => {
    const activeSourceFileId = this.activeSourceFileId();
    const sourceFiles = this.sourceFiles();

    return sourceFiles.find((file) => file.id === activeSourceFileId) ?? sourceFiles[0] ?? null;
  });
  readonly codeLines = computed(() => this.selectedSourceFile()?.code.split('\n') ?? []);

  private sourceLoadPromise: Promise<void> | null = null;

  constructor() {
    effect(() => {
      if (this.activeTab() === 'code') {
        void this.ensureSourceSnippetsLoaded();
      }
    });
  }

  private async ensureSourceSnippetsLoaded(): Promise<void> {
    if (this.sourceSnippets()) {
      this.sourceLoadState.set('ready');
      return;
    }

    if (this.sourceLoadPromise) {
      return this.sourceLoadPromise;
    }

    this.sourceLoadState.set('loading');
    this.sourceLoadPromise = import('../../generated/demo-snippets')
      .then(({ DEMO_SOURCE_SNIPPETS }) => {
        this.sourceSnippets.set(DEMO_SOURCE_SNIPPETS);
        this.sourceLoadState.set('ready');
      })
      .catch(() => {
        this.sourceLoadState.set('error');
      })
      .finally(() => {
        this.sourceLoadPromise = null;
      });

    return this.sourceLoadPromise;
  }
}
