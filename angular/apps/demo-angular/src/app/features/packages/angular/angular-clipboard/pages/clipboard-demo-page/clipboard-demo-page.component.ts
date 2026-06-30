import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectClipboard } from '@hexguard/angular-clipboard';
import { ANGULAR_CLIPBOARD_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-clipboard-demo-page',
  templateUrl: './clipboard-demo-page.component.html',
  styleUrl: './clipboard-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClipboardDemoPageComponent {
  protected readonly demo = ANGULAR_CLIPBOARD_DEMO;
  protected readonly clip = injectClipboard({ historySize: 5 });
  protected copyText = 'Text to copy';
  protected readonly autoCopy = signal(false);

  protected readonly snippets = [
    { id: 'url', label: 'URL', value: 'https://hexguard.dev/packages/angular-clipboard' },
    { id: 'cmd', label: 'Shell command', value: 'npm install @hexguard/angular-clipboard' },
    { id: 'json', label: 'JSON payload', value: '{"package":"@hexguard/angular-clipboard","version":"0.1.0"}' },
    { id: 'code', label: 'Code snippet', value: 'import { injectClipboard } from \'@hexguard/angular-clipboard\';' },
  ];

  protected onInputChange(value: string): void {
    this.copyText = value;
    if (this.autoCopy()) {
      this.clip.copy(value);
    }
  }

  protected async onCopy(): Promise<void> {
    await this.clip.copy(this.copyText);
  }

  protected async onPaste(): Promise<void> {
    const text = await this.clip.paste();
    if (text !== null) {
      this.copyText = text;
    }
  }

  protected copyFromHistory(text: string): void {
    this.copyText = text;
    this.clip.copy(text);
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      lastCopied: this.clip.lastCopied(),
      lastPasted: this.clip.lastPasted(),
      historyLength: this.clip.history().length,
      history: this.clip.history(),
      isCopying: this.clip.isCopying(),
      copyError: this.clip.copyError(),
      permissionState: this.clip.permissionState(),
      autoCopy: this.autoCopy(),
    }),
  );
}
