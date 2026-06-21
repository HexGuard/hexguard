import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectDateUtils, DateRange } from '@hexguard/angular-date-utils';

import { ANGULAR_DATE_UTILS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';
import { DATE_UTILS_DEMO_EXAMPLES } from '../../data/date-utils-demo.data';

@Component({
  standalone: true,
  selector: 'demo-date-utils-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="date-utils-demo-page">
      <demo-navigation-strip demoNavigation testId="date-utils-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Date Utils</p>
            <h2>Signal-based date formatting, ranges, and business-day calculations.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectDateUtils()</code> provides relative time, compact dates, date ranges,
          duration formatting, and business-day helpers — all locale-aware.
        </p>

        <demo-status-strip
          testId="date-utils-demo-status"
          summary="Locale-aware date utilities with Intl formatting."
          currentUrl="Angular Date Utils — Demo"
          summaryTestId="date-utils-demo-summary"
          urlTestId="date-utils-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-date-utils/demo-state -->
      <article demoPrimary class="demo-card demo-card--stack" data-testid="date-utils-playground">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Date Utilities</p>
            <h3>Live formatting playground</h3>
          </div>
        </div>

        <!-- Relative time -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Relative Time</h4>
          <p data-testid="date-utils-relative">
            Past: <strong>{{ relativeTime(examples.pastDate) }}</strong>
          </p>
          <p data-testid="date-utils-future">
            Future: <strong>{{ relativeTime(examples.futureDate) }}</strong>
          </p>
          <p data-testid="date-utils-short">
            Short: <strong>{{ shortRelativeTime(examples.pastDate) }}</strong>
          </p>
        </div>

        <!-- Compact dates -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Compact Dates</h4>
          <p data-testid="date-utils-compact-date">
            Same year: <strong>{{ compactDate(examples.startDate) }}</strong>
          </p>
          <p data-testid="date-utils-compact-dt">
            With time: <strong>{{ compactDateTime(now) }}</strong>
          </p>
        </div>

        <!-- Date range -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Date Range</h4>
          <p data-testid="date-utils-range">
            {{ examples.startDate.toLocaleDateString() }} –
            {{ examples.endDate.toLocaleDateString() }} ({{ range.durationDays }} days, valid:
            {{ range.isValid }})
          </p>
          <p data-testid="date-utils-contains">
            Contains Jun 15: <strong>{{ range.contains(sampleDate) }}</strong>
          </p>
        </div>

        <!-- Duration -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Duration</h4>
          <p data-testid="date-utils-duration">
            Between start and end:
            <strong>{{
              formatDuration(durationBetween(examples.startDate, examples.endDate))
            }}</strong>
          </p>
          <p data-testid="date-utils-age">
            Age (birth 1992-06-17): <strong>{{ ageInYears(examples.birthDate) }} years</strong>
          </p>
        </div>

        <!-- Business days -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Business Days</h4>
          <p data-testid="date-utils-business">
            {{ businessDaysBetween(examples.startDate, examples.endDate) }} business days ({{
              examples.startDate.toLocaleDateString()
            }}
            – {{ examples.endDate.toLocaleDateString() }})
          </p>
        </div>

        <!-- Preset ranges -->
        <div class="demo-field-group">
          <h4 class="demo-field-label">Preset Ranges</h4>
          <p data-testid="date-utils-last7">
            Last 7 days:
            <strong>{{ formatDuration(durationBetween(last7.start, last7.end)) }}</strong>
          </p>
          <p data-testid="date-utils-thismonth">
            This month:
            <strong>{{ compactDate(thisMonth.start) }} – {{ compactDate(thisMonth.end) }}</strong>
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="date-utils-inspector-panel"
        eyebrow="Reference"
        title="Date Utils snapshot"
        summary="Live state for the date utilities demo."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="date-utils-snapshot-json"
        codeTestId="date-utils-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .demo-field-group {
        margin-bottom: 1.25rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateUtilsDemoPageComponent {
  protected readonly demo = ANGULAR_DATE_UTILS_DEMO;
  protected readonly examples = DATE_UTILS_DEMO_EXAMPLES;

  private readonly utils = injectDateUtils();
  protected readonly relativeTime = this.utils.relativeTime;
  protected readonly shortRelativeTime = this.utils.shortRelativeTime;
  protected readonly compactDate = this.utils.compactDate;
  protected readonly compactDateTime = this.utils.compactDateTime;
  protected readonly formatDuration = this.utils.formatDuration;
  protected readonly durationBetween = this.utils.durationBetween;
  protected readonly ageInYears = this.utils.ageInYears;
  protected readonly businessDaysBetween = this.utils.businessDaysBetween;

  protected readonly now = new Date();
  protected readonly sampleDate = new Date('2026-06-15');
  protected readonly range = new DateRange(this.examples.startDate, this.examples.endDate);
  protected readonly last7 = DateRange.last7Days();
  protected readonly thisMonth = DateRange.thisMonth();

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      locale: this.utils.locale,
      range: {
        start: this.examples.startDate.toISOString(),
        end: this.examples.endDate.toISOString(),
      },
      last7: { start: this.last7.start.toISOString(), end: this.last7.end.toISOString() },
      thisMonth: {
        start: this.thisMonth.start.toISOString(),
        end: this.thisMonth.end.toISOString(),
      },
    }),
  );
}
