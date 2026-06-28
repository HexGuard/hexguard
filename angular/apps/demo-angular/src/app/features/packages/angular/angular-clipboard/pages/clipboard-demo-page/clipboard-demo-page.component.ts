import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
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

  protected async onCopy(): Promise<void> {
    await this.clip.copy(this.copyText);
  }

  protected async onPaste(): Promise<void> {
    const text = await this.clip.paste();
    if (text !== null) {
      this.copyText = text;
    }
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      lastCopied: this.clip.lastCopied(),
      lastPasted: this.clip.lastPasted(),
      historyLength: this.clip.history().length,
      isCopying: this.clip.isCopying(),
      copyError: this.clip.copyError(),
      permissionState: this.clip.permissionState(),
    }),
  );
}
