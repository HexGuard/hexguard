import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { querySignalForm, stringParam, numberParam, booleanParam, enumParam, arrayParam, dateIsoParam } from '@hexguard/angular-query-signal-forms';
import type { InferSchemaValue } from '@hexguard/angular-query-signal-forms';
import type { UrlStateSchema } from '@hexguard/angular-url-state';
import { ANGULAR_QUERY_SIGNAL_FORMS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

const SCHEMA = {
  search: stringParam(''),
  page: numberParam(1),
  status: enumParam(['all', 'open', 'closed'] as const, 'all'),
  priority: enumParam(['low', 'medium', 'high'] as const, 'medium'),
  archived: booleanParam(false),
  tags: arrayParam(stringParam(''), { defaultValue: [] }),
  dueAfter: dateIsoParam(null),
} as const satisfies UrlStateSchema;

type Schema = typeof SCHEMA;

function createForm(mode: 'live' | 'manual') {
  return querySignalForm(SCHEMA, {
    syncMode: mode,
    history: 'replace',
    writeDelayMs: 0,
    resetKeysOnChange: { search: ['page'], status: ['page'], priority: ['page'] },
  });
}

@Component({
  standalone: true,
  selector: 'demo-query-signal-forms-demo-page',
  templateUrl: './query-signal-forms-demo-page.component.html',
  styleUrl: './query-signal-forms-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuerySignalFormsDemoPageComponent {
  protected readonly demo = ANGULAR_QUERY_SIGNAL_FORMS_DEMO;
  protected readonly syncMode = signal<'live' | 'manual'>('live');

  /** Incremented on every state-changing call so snapshotJson re-evaluates. */
  private readonly _version = signal(0);

  /** Pre-create both mode instances at construction time (injection context). */
  private readonly _liveForm = createForm('live');
  private readonly _manualForm = createForm('manual');

  /** Holds the current querySignalForm instance. */
  private readonly _query = signal(this._liveForm);

  protected readonly query = this._query.asReadonly();

  protected readonly snapshotJson = computed(() => {
    // Track version so we re-evaluate on every patch/reset/commit/revert
    this._version();
    const q = this._query();
    const snap = q.snapshot();
    return formatSnapshot({
      syncMode: this.syncMode(),
      search: snap.search,
      page: snap.page,
      status: snap.status,
      priority: snap.priority,
      archived: snap.archived,
      tags: snap.tags,
      dueAfter: snap.dueAfter,
      hasPendingChanges: q.hasPendingChanges(),
    });
  });

  protected toggleMode(): void {
    const newMode = this.syncMode() === 'live' ? 'manual' : 'live';
    this._query.set(newMode === 'manual' ? this._manualForm : this._liveForm);
    this.syncMode.set(newMode);
    this._version.update(v => v + 1);
  }

  protected patch(value: Partial<InferSchemaValue<Schema>>): void {
    this._query().patch(value);
    this._version.update(v => v + 1);
  }

  protected reset(): void {
    this._query().reset();
    this._version.update(v => v + 1);
  }

  protected commit(): void {
    this._query().commit();
    this._version.update(v => v + 1);
  }

  protected revert(): void {
    this._query().revert();
    this._version.update(v => v + 1);
  }

  protected addTag(tag: string): void {
    const snap = this._query().snapshot();
    const current = snap.tags;
    if (!current.includes(tag)) {
      this.patch({ tags: [...current, tag] });
    }
  }

  protected removeTag(tag: string): void {
    const snap = this._query().snapshot();
    this.patch({ tags: snap.tags.filter((t: string) => t !== tag) });
  }

  /** Format a Date as YYYY-MM-DD for `<input type="date">` (local timezone). */
  protected formatDate(d: Date | null): string {
    if (d === null) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Parse a YYYY-MM-DD string back to a local-midnight Date. */
  protected parseDate(value: string): Date | null {
    if (!value) return null;
    const [y, m, day] = value.split('-').map(Number);
    return new Date(y, m - 1, day);
  }
}
