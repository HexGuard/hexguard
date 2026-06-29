import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { fieldsEqual, injectFormDirtyState } from '@hexguard/angular-form-utils';
import { ANGULAR_FORM_UTILS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-form-utils-demo-page',
  templateUrl: './form-utils-demo-page.component.html',
  styleUrl: './form-utils-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUtilsDemoPageComponent {
  protected readonly demo = ANGULAR_FORM_UTILS_DEMO;
  protected readonly form = new FormGroup({
    password: new FormControl(''),
    confirm: new FormControl(''),
  }, { validators: fieldsEqual('password', 'confirm', 'Passwords must match.') });
  protected readonly dirty = injectFormDirtyState(this.form);
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({ password: this.form.value.password, confirm: this.form.value.confirm, valid: this.form.valid, dirty: this.dirty.isDirty() }));
}
