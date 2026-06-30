import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Color, injectColorPicker } from '@hexguard/angular-color';
import { ANGULAR_COLOR_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-color-demo-page',
  templateUrl: './color-demo-page.component.html',
  styleUrl: './color-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorDemoPageComponent {
  protected readonly demo = ANGULAR_COLOR_DEMO;
  protected readonly picker = injectColorPicker({ initialColor: '#3b82f6' });

  // Second picker for contrast checker
  protected readonly contrastColor = injectColorPicker({ initialColor: '#ffffff' });

  protected readonly contrastRatio = computed(() =>
    this.picker.color().contrastRatio(this.contrastColor.color()),
  );

  protected readonly contrastLevel = computed(() =>
    this.picker.color().contrastLevel(this.contrastColor.color()),
  );

  protected readonly palette = computed(() => this.picker.color().palette('analogous'));

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      hex: this.picker.hex(),
      rgb: this.picker.color().toRgb(),
      hsl: this.picker.color().toHsl(),
      hue: this.picker.hue(),
      saturation: this.picker.saturation(),
      lightness: this.picker.lightness(),
      alpha: this.picker.alpha(),
      contrastRatio: this.contrastRatio(),
      contrastLevel: this.contrastLevel(),
      palette: this.palette().map((c) => c.toHex()),
    }),
  );

  setHue(event: Event): void {
    this.picker.setHue(+(event.target as HTMLInputElement).value);
  }

  setSaturation(event: Event): void {
    this.picker.setSaturation(+(event.target as HTMLInputElement).value);
  }

  setLightness(event: Event): void {
    this.picker.setLightness(+(event.target as HTMLInputElement).value);
  }

  setAlpha(event: Event): void {
    this.picker.setAlpha(+(event.target as HTMLInputElement).value);
  }

  setHex(event: Event): void {
    this.picker.setHex((event.target as HTMLInputElement).value);
  }

  setContrastHex(event: Event): void {
    this.contrastColor.setHex((event.target as HTMLInputElement).value);
  }
}
