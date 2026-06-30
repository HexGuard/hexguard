import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { fieldsEqual, fieldsNotEqual, requiredIf, requiresAtLeastOne, injectFormDirtyState, aggregateFormErrors, asyncFieldValidator, injectFormArrayDirtyState, arrayToggleItem, moveArrayItem, syncArrayValues } from '@hexguard/angular-form-utils';
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
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent, ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUtilsDemoPageComponent {
  protected readonly demo = ANGULAR_FORM_UTILS_DEMO;

  // Section 1: fieldsEqual (confirm-password)
  protected readonly passwordForm = new FormGroup({
    password: new FormControl('', { nonNullable: true }),
    confirm: new FormControl('', { nonNullable: true }),
  }, { validators: fieldsEqual('password', 'confirm', 'Passwords must match.') });

  // Section 2: fieldsNotEqual
  protected readonly emailForm = new FormGroup({
    currentEmail: new FormControl('user@example.com', { nonNullable: true }),
    newEmail: new FormControl('', { nonNullable: true }),
  }, { validators: fieldsNotEqual('currentEmail', 'newEmail', 'New email must differ from current.') });

  // Section 3: requiredIf + requiresAtLeastOne
  protected readonly contactForm = new FormGroup({
    contactMethod: new FormControl('email', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
  }, { validators: [
    requiredIf('phone', (v) => (v as string) === 'phone'),
    requiredIf('email', (v) => (v as string) === 'email'),
  ]});

  // Section 4: injectFormDirtyState
  protected readonly dirtyForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
  });
  protected readonly dirty = injectFormDirtyState(this.dirtyForm);

  // Section 5: aggregateFormErrors
  protected readonly errorForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormGroup({
      street: new FormControl('', [Validators.required]),
    }),
  });

  protected readonly aggregateFormErrors = aggregateFormErrors;

  // Section 6: asyncFieldValidator
  protected readonly asyncUsername = signal('');
  protected readonly asyncResult = signal<string | null>(null);
  protected readonly asyncForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      asyncValidators: asyncFieldValidator<string>(async (value) => {
        if (!value) return null;
        // Simulate server check
        await new Promise(r => setTimeout(r, 600));
        const taken = ['admin', 'root', 'test'].includes(value.toLowerCase());
        return taken ? { usernameTaken: { message: `"${value}" is already taken.` } } : null;
      }),
    }),
  });

  // Section 7: FormArray helpers
  protected readonly tagInput = signal('');
  protected readonly tagArray = new FormArray([new FormControl('angular', { nonNullable: true }), new FormControl('forms', { nonNullable: true })]);
  protected readonly arrayDirty = injectFormArrayDirtyState(this.tagArray);
  protected readonly arrayToggleItem = arrayToggleItem;
  protected readonly injectFormArrayDirtyState = injectFormArrayDirtyState;
  protected readonly moveArrayItem = moveArrayItem;
  protected readonly syncInput = signal('');

  protected addTag(): void {
    const val = this.tagInput().trim();
    if (val) {
      arrayToggleItem(this.tagArray, val, (v) => new FormControl(v, { nonNullable: true }));
      this.tagInput.set('');
    }
  }

  protected removeTag(value: string): void {
    arrayToggleItem(this.tagArray, value, (v) => new FormControl(v, { nonNullable: true }));
  }

  protected moveUp(index: number): void {
    if (index > 0) moveArrayItem(this.tagArray, index, index - 1);
  }

  protected moveDown(index: number): void {
    if (index < this.tagArray.length - 1) moveArrayItem(this.tagArray, index, index + 1);
  }

  protected syncTags(): void {
    const values = this.syncInput().split(',').map(v => v.trim()).filter(Boolean);
    if (values.length > 0) {
      syncArrayValues(this.tagArray, values, (v) => new FormControl(v, { nonNullable: true }));
      this.syncInput.set('');
    }
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      passwordMatch: this.passwordForm.valid ? '✅' : this.passwordForm.errors?.['fieldsEqual']?.message,
      emailDiff: this.emailForm.valid ? '✅' : this.emailForm.errors?.['fieldsNotEqual']?.message,
      contactErrors: this.contactForm.valid ? '✅' : Object.keys(this.contactForm.errors ?? {}),
      dirtyState: this.dirty.isDirty(),
      controlStates: this.dirty.controlStates(),
      aggregatedErrors: aggregateFormErrors(this.errorForm),
      asyncValid: this.asyncForm.valid ? '✅' : this.asyncForm.get('username')?.errors?.['usernameTaken']?.message,
      arrayValues: this.tagArray.value,
      arrayDirty: this.arrayDirty.isDirty(),
      arrayItemStates: this.arrayDirty.itemStates(),
    }));

  protected checkUsername(): void {
    const ctrl = this.asyncForm.get('username');
    if (!ctrl) return;
    this.asyncUsername.set(ctrl.value);
    ctrl.updateValueAndValidity();
    // Show pending state briefly
    this.asyncResult.set(null);
    setTimeout(() => {
      if (ctrl.pending) {
        this.asyncResult.set('Checking...');
      } else if (ctrl.valid) {
        this.asyncResult.set('✅ Available');
      } else {
        this.asyncResult.set(ctrl.errors?.['usernameTaken']?.message ?? 'Invalid');
      }
    }, 50);
  }
}
