import { expect, test } from '@playwright/test';

const ordersRoute = '/packages/angular-url-state/orders';
const dashboardRoute = '/packages/angular-url-state/dashboard';
const queryFormOrdersRoute = '/packages/angular-query-form/orders';
const queryFormRecoveryRoute = '/packages/angular-query-form/recovery';
const asyncStateValueRoute = '/packages/angular-async-state/value';
const asyncStateObservableRoute = '/packages/angular-async-state/observable';
const asyncStateActionRoute = '/packages/angular-async-state/action';
const lookupsBackendRoute = '/packages/angular-lookups/backend';
const lookupsEditorRoute = '/packages/angular-lookups/editor';
const lookupsSummaryRoute = '/packages/angular-lookups/summary';
const optimisticStateToggleRoute = '/packages/angular-optimistic-state/toggle';
const optimisticStateInlineEditRoute = '/packages/angular-optimistic-state/inline-edit';
const optimisticStateBulkRoute = '/packages/angular-optimistic-state/bulk';
const permissionsActionsRoute = '/packages/angular-permissions/actions';
const permissionsRoutingRoute = '/packages/angular-permissions/routing';

test.describe('demo-angular', () => {
  test('shows the HexGuard landing page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('site-home-page')).toBeVisible();
    await expect(page.getByTestId('demo-title')).toContainText(
      'Open-source guardrails for Angular and .NET teams.',
    );
    await expect(page.getByTestId('site-home-featured-package-angular-url-state')).toBeVisible();
    await expect(page.getByTestId('site-home-featured-package-angular-query-form')).toBeVisible();
    await expect(page.getByTestId('site-home-featured-package-angular-async-state')).toBeVisible();
    await expect(page.getByTestId('site-home-featured-package-angular-lookups')).toBeVisible();
    await expect(
      page.getByTestId('site-home-featured-package-angular-optimistic-state'),
    ).toBeVisible();
    await expect(page.getByTestId('site-home-featured-package-angular-permissions')).toBeVisible();
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-url-state'),
    ).toHaveText('Available');
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-query-form'),
    ).toHaveText('Available');
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-async-state'),
    ).toHaveText('Available');
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-lookups'),
    ).toHaveText('Available');
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-optimistic-state'),
    ).toHaveText('Available');
    await expect(
      page.getByTestId('site-home-featured-package-status-angular-permissions'),
    ).toHaveText('Available');
    await expect(page.getByTestId('nav-link-package-angular-url-state')).toContainText('Available');
    await expect(page.getByTestId('nav-link-package-angular-query-form')).toContainText(
      'Available',
    );
    await expect(page.getByTestId('nav-link-package-angular-async-state')).toContainText(
      'Available',
    );
    await expect(page.getByTestId('nav-link-package-angular-lookups')).toContainText('Available');
    await expect(page.getByTestId('nav-link-package-angular-optimistic-state')).toContainText(
      'Available',
    );
    await expect(page.getByTestId('nav-link-package-angular-permissions')).toContainText(
      'Available',
    );
    await expect(page.getByTestId('site-home-roadmap-angular-api-errors')).toBeVisible();
  });

  test('keeps landing page package cards and badges within the viewport across widths', async ({
    page,
  }) => {
    for (const width of [320, 480, 720, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const layout = await page.evaluate(() => {
        const packageCards = Array.from(
          document.querySelectorAll<HTMLElement>(
            'article[data-testid^="site-home-featured-package-"]',
          ),
        );
        const packageBadges = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-testid^="site-home-featured-package-status-"]',
          ),
        );
        const navCards = Array.from(
          document.querySelectorAll<HTMLElement>('a[data-testid^="nav-link-package-"]'),
        );

        if (packageCards.length === 0 || packageBadges.length === 0 || navCards.length === 0) {
          throw new Error('Landing page package cards did not render.');
        }

        return {
          pageScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          cardBounds: packageCards.map((element) => {
            const rect = element.getBoundingClientRect();

            return { left: rect.left, right: rect.right };
          }),
          badgeBounds: packageBadges.map((element) => {
            const rect = element.getBoundingClientRect();
            const cardRect = element.closest('article')?.getBoundingClientRect();

            if (!cardRect) {
              throw new Error('Package badge was rendered outside an article card.');
            }

            return {
              left: rect.left,
              right: rect.right,
              cardLeft: cardRect.left,
              cardRight: cardRect.right,
            };
          }),
          navBounds: navCards.map((element) => {
            const rect = element.getBoundingClientRect();

            return { left: rect.left, right: rect.right };
          }),
        };
      });

      expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);

      for (const card of layout.cardBounds) {
        expect(card.left).toBeGreaterThanOrEqual(-0.5);
        expect(card.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      }

      for (const badge of layout.badgeBounds) {
        expect(badge.left).toBeGreaterThanOrEqual(badge.cardLeft - 0.5);
        expect(badge.right).toBeLessThanOrEqual(badge.cardRight + 0.5);
      }

      for (const nav of layout.navBounds) {
        expect(nav.left).toBeGreaterThanOrEqual(-0.5);
        expect(nav.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      }
    }
  });

  test('shows the Angular URL State package overview', async ({ page }) => {
    await page.goto('/packages/angular-url-state');

    await expect(page.getByTestId('package-angular-url-state')).toBeVisible();
    await expect(page.getByTestId('package-angular-url-state-quick-start')).toContainText(
      'pnpm add @hexguard/angular-url-state',
    );
    await expect(page.getByTestId('package-angular-url-state-best-fit')).toContainText(
      'Search pages where filters, pagination, and shareable links need one typed state contract.',
    );
    await expect(page.getByTestId('package-angular-url-state-status-notes')).toContainText(
      'most mature current HexGuard Angular surface',
    );
    await expect(page.getByTestId('package-demo-orders')).toBeVisible();
    await expect(page.getByTestId('package-demo-dashboard')).toBeVisible();
  });

  test('keeps package hub badges, pills, and demo cards within the viewport across widths', async ({
    page,
  }) => {
    for (const width of [320, 480, 720, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/packages/angular-url-state');

      const layout = await page.evaluate(() => {
        const overview = document.querySelector<HTMLElement>(
          '[data-testid="package-angular-url-state"] .package-hub__overview',
        );
        const headerMetaItems = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-testid="package-angular-url-state"] .package-hub__header-meta > *',
          ),
        );
        const overviewLinks = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-testid="package-angular-url-state"] .package-hub__overview-links > *',
          ),
        );
        const demoCards = Array.from(
          document.querySelectorAll<HTMLElement>('[data-testid^="package-demo-"]'),
        );

        if (
          !overview ||
          headerMetaItems.length === 0 ||
          overviewLinks.length === 0 ||
          demoCards.length === 0
        ) {
          throw new Error('Package hub layout elements did not render.');
        }

        const overviewRect = overview.getBoundingClientRect();

        return {
          pageScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          overview: { left: overviewRect.left, right: overviewRect.right },
          headerMeta: headerMetaItems.map((element) => {
            const rect = element.getBoundingClientRect();

            return { left: rect.left, right: rect.right };
          }),
          overviewLinks: overviewLinks.map((element) => {
            const rect = element.getBoundingClientRect();

            return { left: rect.left, right: rect.right };
          }),
          demoCards: demoCards.map((element) => {
            const rect = element.getBoundingClientRect();

            return { left: rect.left, right: rect.right };
          }),
        };
      });

      expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.overview.left).toBeGreaterThanOrEqual(-0.5);
      expect(layout.overview.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);

      for (const item of layout.headerMeta) {
        expect(item.left).toBeGreaterThanOrEqual(layout.overview.left - 0.5);
        expect(item.right).toBeLessThanOrEqual(layout.overview.right + 0.5);
      }

      for (const link of layout.overviewLinks) {
        expect(link.left).toBeGreaterThanOrEqual(layout.overview.left - 0.5);
        expect(link.right).toBeLessThanOrEqual(layout.overview.right + 0.5);
      }

      for (const card of layout.demoCards) {
        expect(card.left).toBeGreaterThanOrEqual(-0.5);
        expect(card.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      }
    }
  });

  test('shows the Angular Query Form package overview', async ({ page }) => {
    await page.goto('/packages/angular-query-form');

    await expect(page.getByTestId('package-angular-query-form')).toBeVisible();
    await expect(page.getByTestId('package-query-form-demo-query-form-orders')).toBeVisible();
    await expect(page.getByTestId('package-query-form-demo-query-form-recovery')).toBeVisible();
  });

  test('shows the Angular Async State package overview', async ({ page }) => {
    await page.goto('/packages/angular-async-state');

    await expect(page.getByTestId('package-angular-async-state')).toBeVisible();
    await expect(page.getByTestId('package-async-state-demo-async-state-value')).toBeVisible();
    await expect(page.getByTestId('package-async-state-demo-async-state-observable')).toBeVisible();
    await expect(page.getByTestId('package-async-state-demo-async-state-action')).toBeVisible();
  });

  test('shows the Angular Lookups package overview', async ({ page }) => {
    await page.goto('/packages/angular-lookups');

    await expect(page.getByTestId('package-angular-lookups')).toBeVisible();
    await expect(page.getByTestId('package-angular-lookups-quick-start')).toContainText(
      'pnpm add @hexguard/angular-lookups @hexguard/angular-async-state',
    );
    await expect(page.getByTestId('package-lookups-demo-lookups-editor')).toBeVisible();
    await expect(page.getByTestId('package-lookups-demo-lookups-summary')).toBeVisible();
    await expect(page.getByTestId('package-lookups-demo-lookups-backend')).toBeVisible();
  });

  test('shows the Angular Optimistic State package overview', async ({ page }) => {
    await page.goto('/packages/angular-optimistic-state');

    await expect(page.getByTestId('package-angular-optimistic-state')).toBeVisible();
    await expect(page.getByTestId('package-angular-optimistic-state-quick-start')).toContainText(
      'pnpm add @hexguard/angular-optimistic-state',
    );
    await expect(
      page.getByTestId('package-optimistic-state-demo-optimistic-state-toggle'),
    ).toBeVisible();
    await expect(
      page.getByTestId('package-optimistic-state-demo-optimistic-state-inline-edit'),
    ).toBeVisible();
    await expect(
      page.getByTestId('package-optimistic-state-demo-optimistic-state-bulk'),
    ).toBeVisible();
  });

  test('shows the Angular Permissions package overview', async ({ page }) => {
    await page.goto('/packages/angular-permissions');

    await expect(page.getByTestId('package-angular-permissions')).toBeVisible();
    await expect(page.getByTestId('package-angular-permissions-quick-start')).toContainText(
      'pnpm add @hexguard/angular-permissions',
    );
    await expect(page.getByTestId('package-permissions-demo-permissions-actions')).toBeVisible();
    await expect(page.getByTestId('package-permissions-demo-permissions-routing')).toBeVisible();
  });

  test('navigates between lookups demos with the reusable strip', async ({ page }) => {
    await page.goto(lookupsEditorRoute);

    await expect(page.getByTestId('lookups-editor-demo-navigation')).toBeVisible();
    await expect(page.getByTestId('lookups-editor-demo-navigation-demo-lookups-editor')).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByTestId('lookups-editor-demo-navigation-demo-lookups-summary').click();

    await expect(page).toHaveURL(/\/packages\/angular-lookups\/summary$/);
    await expect(page.getByTestId('lookups-summary-page')).toBeVisible();
    await expect(page.getByTestId('lookups-summary-demo-navigation-demo-lookups-summary')).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByTestId('lookups-summary-demo-navigation-demo-lookups-backend').click();

    await expect(page).toHaveURL(/\/packages\/angular-lookups\/backend$/);
    await expect(page.getByTestId('lookups-backend-page')).toBeVisible();
    await expect(page.getByTestId('lookups-backend-demo-navigation-demo-lookups-backend')).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByTestId('lookups-backend-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-lookups$/);
    await expect(page.getByTestId('package-angular-lookups')).toBeVisible();
  });

  test('hydrates the orders page from the remapped page query param', async ({ page }) => {
    await page.goto(`${ordersRoute}?p=2`);

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders\?p=2$/);
    await expect(page.getByTestId('orders-page-indicator')).toHaveText('Page 2 of 2');
    await expect(page.getByTestId('orders-result-summary')).toContainText(
      'Showing 6-7 of 7 matching orders.',
    );
    await expect(page.getByTestId('orders-page-input')).toHaveValue('2');
    await expect(page.getByTestId('orders-table')).toContainText('HG-1076');
    await expect(page.getByTestId('orders-table')).toContainText('HG-1080');
  });

  test('navigates between demos with the reusable demo strip', async ({ page }) => {
    await page.goto(ordersRoute);

    await expect(page.getByTestId('orders-demo-navigation')).toBeVisible();
    await expect(page.getByTestId('orders-demo-navigation-demo-orders')).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByTestId('orders-demo-navigation-demo-dashboard').click();

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/dashboard$/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('dashboard-demo-navigation-demo-dashboard')).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByTestId('dashboard-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-url-state$/);
    await expect(page.getByTestId('package-angular-url-state')).toBeVisible();
  });

  test('keeps the orders layout single-column with the inspector panel', async ({ page }) => {
    for (const width of [1100, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(ordersRoute);
      await page.getByTestId('orders-inspector-panel-tab-code').click();
      await expect(page.getByTestId('orders-code-sample')).toContainText(
        'readonly state = urlState',
      );

      const layout = await page.evaluate(() => {
        const controls = document.querySelector('[data-testid="orders-controls-card"]');
        const tableCard = document.querySelector('[data-testid="orders-table-card"]');
        const inspector = document.querySelector('[data-testid="orders-inspector-panel"]');
        const codeSample = document.querySelector('[data-testid="orders-code-sample"]');
        const tableWrap = document.querySelector('[data-testid="orders-table-wrap"]');

        if (!controls || !tableCard || !inspector || !codeSample || !tableWrap) {
          throw new Error('Orders layout elements were not rendered.');
        }

        return {
          controls: controls.getBoundingClientRect().width,
          tableCard: tableCard.getBoundingClientRect().width,
          inspector: inspector.getBoundingClientRect().width,
          tableTop: tableCard.getBoundingClientRect().top,
          inspectorTop: inspector.getBoundingClientRect().top,
          codeClientWidth: codeSample.clientWidth,
          codeScrollWidth: codeSample.scrollWidth,
          tableClientWidth: tableWrap.clientWidth,
          tableScrollWidth: tableWrap.scrollWidth,
          pageScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      expect(layout.controls).toBeGreaterThan(width * 0.75);
      expect(layout.tableCard).toBeGreaterThan(width * 0.75);
      expect(layout.inspector).toBeGreaterThan(width * 0.75);
      expect(layout.inspectorTop).toBeGreaterThan(layout.tableTop);
      expect(layout.codeScrollWidth).toBeGreaterThanOrEqual(layout.codeClientWidth);
      expect(layout.tableScrollWidth).toBeGreaterThanOrEqual(layout.tableClientWidth);
      expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    }
  });

  test('keeps the orders demo within the viewport at narrow widths', async ({ page }) => {
    for (const width of [320, 480, 720]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(ordersRoute);

      const layout = await page.evaluate(() => {
        const controls = document.querySelector('[data-testid="orders-controls-card"]');
        const tableCard = document.querySelector('[data-testid="orders-table-card"]');
        const inspector = document.querySelector('[data-testid="orders-inspector-panel"]');
        const tableWrap = document.querySelector('[data-testid="orders-table-wrap"]');

        if (!controls || !tableCard || !inspector || !tableWrap) {
          throw new Error('Orders layout elements were not rendered.');
        }

        return {
          controls: controls.getBoundingClientRect(),
          tableCard: tableCard.getBoundingClientRect(),
          inspector: inspector.getBoundingClientRect(),
          tableClientWidth: tableWrap.clientWidth,
          tableScrollWidth: tableWrap.scrollWidth,
          pageScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.controls.left).toBeGreaterThanOrEqual(-0.5);
      expect(layout.controls.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      expect(layout.tableCard.left).toBeGreaterThanOrEqual(-0.5);
      expect(layout.tableCard.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      expect(layout.inspector.left).toBeGreaterThanOrEqual(-0.5);
      expect(layout.inspector.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
      expect(layout.inspector.top).toBeGreaterThan(layout.tableCard.top);
      expect(layout.tableScrollWidth).toBeGreaterThanOrEqual(layout.tableClientWidth);
    }
  });

  test('keeps the orders demo shareable through remapped query params', async ({ page }) => {
    await page.goto(ordersRoute);

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await page.getByTestId('orders-search-input').fill('north');
    await page.getByTestId('orders-tags-input').fill('priority');

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders\?q=north&tag=priority/);
    await expect(page.getByTestId('orders-row')).toHaveCount(1);
    await expect(page.getByTestId('orders-result-summary')).toContainText('Showing 1-1 of 1');
    await expect(page.getByTestId('orders-current-url')).toContainText(
      '/packages/angular-url-state/orders?q=north&tag=priority',
    );
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"searchText": "north"');
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"selectedTags"');

    await page.getByTestId('orders-inspector-panel-tab-code').click();

    await expect(page.getByTestId('orders-code-sample')).toContainText('readonly state = urlState');
    await expect(page.getByTestId('orders-code-sample')).toContainText('debounceMs: 250');
    await expect(page.getByTestId('orders-code-sample')).toContainText("queryKey: 'q'");
    await expect(page.getByTestId('orders-code-sample').locator('.demo-code-line')).not.toHaveCount(
      0,
    );

    await page.getByTestId('orders-reset-filters').click();

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders$/);
    await expect(page.getByTestId('orders-current-url')).toHaveText(
      '/packages/angular-url-state/orders',
    );
  });

  test('shows full component TypeScript, template, and styles in the orders source panel', async ({
    page,
  }) => {
    await page.goto(ordersRoute);

    await page.getByTestId('orders-inspector-panel-tab-code').click();

    await expect(page.getByTestId('orders-code-sample')).toContainText('readonly state = urlState');

    await page.getByTestId('orders-code-sample-file-html').click();
    await expect(page.getByTestId('orders-code-sample')).toContainText(
      '<demo-page-layout testId="orders-page">',
    );

    await page.getByTestId('orders-code-sample-file-css').click();
    await expect(page.getByTestId('orders-code-sample')).toContainText('.orders-controls-grid {');
  });

  test('redirects legacy orders route to the package-scoped demo', async ({ page }) => {
    await page.goto('/orders?p=2');

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders\?p=2$/);
    await expect(page.getByTestId('orders-page-indicator')).toHaveText('Page 2 of 2');
  });

  test('replays dashboard state through browser history', async ({ page }) => {
    await page.goto(dashboardRoute);

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await page.getByTestId('dashboard-tab-revenue').click();
    await page.getByTestId('dashboard-preset-7-days').click();
    await page.getByTestId('dashboard-show-archived').check();

    await expect(page).toHaveURL(/tab=revenue/);
    await expect(page).toHaveURL(/showArchived=true/);
    await expect(page).toHaveURL(/startDate=/);
    await expect(page).toHaveURL(/endDate=/);
    await expect(page.getByTestId('dashboard-snapshot-json')).toContainText('"tab": "revenue"');
    await expect(page.getByTestId('dashboard-snapshot-json')).toContainText('"showArchived": true');

    await page.getByTestId('dashboard-inspector-panel-tab-code').click();
    await expect(page.getByTestId('dashboard-code-sample')).toContainText("history: 'push'");

    await page.goBack();
    await expect(page.getByTestId('dashboard-show-archived')).not.toBeChecked();
    await expect(page).not.toHaveURL(/showArchived=true/);

    await page.goBack();
    await expect(page.getByTestId('dashboard-range-label')).toHaveText('All time');
    await expect(page).not.toHaveURL(/startDate=/);

    await page.goBack();
    await expect(page.getByTestId('dashboard-tab-overview')).toHaveClass(/tab-button--active/);
    await expect(page).not.toHaveURL(/tab=revenue/);

    await page.goForward();
    await expect(page.getByTestId('dashboard-tab-revenue')).toHaveClass(/tab-button--active/);
  });

  test('hydrates the query-form orders page from query params', async ({ page }) => {
    await page.goto(`${queryFormOrdersRoute}?page=2&tags=enterprise`);

    await expect(page.getByTestId('query-form-orders-page')).toBeVisible();
    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?page=2&tags=enterprise$/);
    await expect(page.getByTestId('query-form-orders-page-indicator')).toHaveText('Page 2 of 2');
    await expect(page.getByTestId('query-form-orders-page-input')).toHaveValue('2');
    await expect(page.getByTestId('query-form-orders-tag-enterprise')).toHaveClass(
      /demo-tab-button--active/,
    );
    await expect(page.getByTestId('query-form-orders-result-summary')).toContainText(
      'Showing 6-7 of 7 matching orders.',
    );
  });

  test('hydrates the query-form orders page-size select from URL-owned state', async ({ page }) => {
    await page.goto(
      `${queryFormOrdersRoute}?search=bnjhhhjbj&pageSize=10&status=closed&tags=enterprise&tags=retail&tags=renewal`,
    );

    await expect(page.getByTestId('query-form-orders-page')).toBeVisible();
    await expect(page.getByTestId('query-form-orders-search-input')).toHaveValue('bnjhhhjbj');
    await expect(page.getByTestId('query-form-orders-status-select')).toHaveValue('closed');
    await expect(page.getByTestId('query-form-orders-page-size-select')).toHaveValue('10');
    await expect(page.getByTestId('query-form-orders-tag-enterprise')).toHaveClass(
      /demo-tab-button--active/,
    );
    await expect(page.getByTestId('query-form-orders-tag-retail')).toHaveClass(
      /demo-tab-button--active/,
    );
    await expect(page.getByTestId('query-form-orders-tag-renewal')).toHaveClass(
      /demo-tab-button--active/,
    );
  });

  test('keeps query-form orders shareable and resets page when filters change', async ({
    page,
  }) => {
    await page.goto(queryFormOrdersRoute);

    await page.getByTestId('query-form-orders-page-input').fill('2');
    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?page=2$/);

    await page.getByTestId('query-form-orders-search-input').fill('north');

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?page=2$/);
    await expect(page.getByTestId('query-form-orders-pending-state')).toContainText(
      'Draft changes pending',
    );
    await expect(page.getByTestId('query-form-orders-page-input')).toHaveValue('2');
    await expect(page.getByTestId('query-form-orders-mode-note')).toContainText(
      'Apply or discard before changing pagination.',
    );

    await page.getByTestId('query-form-orders-apply-filters').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?search=north$/);
    await expect(page.getByTestId('query-form-orders-page-input')).toHaveValue('1');
    await expect(page.getByTestId('query-form-orders-result-summary')).toContainText(
      'Showing 1-1 of 1 matching orders.',
    );

    await page.getByTestId('query-form-orders-tag-priority').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?search=north$/);
    await page.getByTestId('query-form-orders-apply-filters').click();

    await expect(page).toHaveURL(
      /\/packages\/angular-query-form\/orders\?search=north&tags=priority/,
    );
    await expect(page.getByTestId('query-form-orders-current-url')).toContainText(
      '/packages/angular-query-form/orders?search=north&tags=priority',
    );
    await expect(page.getByTestId('query-form-orders-snapshot-json')).toContainText(
      '"search": "north"',
    );
    await expect(page.getByTestId('query-form-orders-snapshot-json')).toContainText('"priority"');

    await page.getByTestId('query-form-orders-inspector-panel-tab-code').click();
    await expect(page.getByTestId('query-form-orders-code-sample')).toContainText(
      'readonly query = queryForm',
    );
    await expect(page.getByTestId('query-form-orders-code-sample')).toContainText('managedKeys');
    await expect(page.getByTestId('query-form-orders-code-sample')).toContainText(
      "syncMode: 'manual'",
    );

    await page.getByTestId('query-form-orders-reset-filters').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders$/);
    await expect(page.getByTestId('query-form-orders-current-url')).toHaveText(
      '/packages/angular-query-form/orders',
    );
  });

  test('discards staged query-form order edits without changing the committed URL state', async ({
    page,
  }) => {
    await page.goto(`${queryFormOrdersRoute}?page=2`);

    await page.getByTestId('query-form-orders-search-input').fill('north');
    await expect(page.getByTestId('query-form-orders-pending-state')).toContainText(
      'Draft changes pending',
    );

    await page.getByTestId('query-form-orders-discard-draft').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/orders\?page=2$/);
    await expect(page.getByTestId('query-form-orders-search-input')).toHaveValue('');
    await expect(page.getByTestId('query-form-orders-page-input')).toHaveValue('2');
    await expect(page.getByTestId('query-form-orders-pending-state')).toContainText(
      'URL is up to date',
    );
  });

  test('navigates between query-form demos with the reusable strip', async ({ page }) => {
    await page.goto(queryFormOrdersRoute);

    await expect(page.getByTestId('query-form-orders-demo-navigation')).toBeVisible();
    await expect(
      page.getByTestId('query-form-orders-demo-navigation-demo-query-form-orders'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('query-form-orders-demo-navigation-demo-query-form-recovery').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form\/recovery$/);
    await expect(page.getByTestId('query-form-recovery-page')).toBeVisible();
    await expect(
      page.getByTestId('query-form-recovery-demo-navigation-demo-query-form-recovery'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('query-form-recovery-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-query-form$/);
    await expect(page.getByTestId('package-angular-query-form')).toBeVisible();
  });

  test('navigates between async-state demos with the reusable strip', async ({ page }) => {
    await page.goto(asyncStateValueRoute);

    await expect(page.getByTestId('async-state-value-demo-navigation')).toBeVisible();
    await expect(
      page.getByTestId('async-state-value-demo-navigation-demo-async-state-value'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('async-state-value-demo-navigation-demo-async-state-action').click();

    await expect(page).toHaveURL(/\/packages\/angular-async-state\/action$/);
    await expect(page.getByTestId('async-state-action-page')).toBeVisible();
    await expect(
      page.getByTestId('async-state-action-demo-navigation-demo-async-state-action'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('async-state-action-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-async-state$/);
    await expect(page.getByTestId('package-angular-async-state')).toBeVisible();
  });

  test('navigates between optimistic-state demos with the reusable strip', async ({ page }) => {
    await page.goto(optimisticStateToggleRoute);

    await expect(page.getByTestId('optimistic-state-toggle-demo-navigation')).toBeVisible();
    await expect(
      page.getByTestId('optimistic-state-toggle-demo-navigation-demo-optimistic-state-toggle'),
    ).toHaveAttribute('aria-current', 'page');

    await page
      .getByTestId('optimistic-state-toggle-demo-navigation-demo-optimistic-state-inline-edit')
      .click();

    await expect(page).toHaveURL(/\/packages\/angular-optimistic-state\/inline-edit$/);
    await expect(page.getByTestId('optimistic-state-inline-edit-page')).toBeVisible();
    await expect(
      page.getByTestId(
        'optimistic-state-inline-edit-demo-navigation-demo-optimistic-state-inline-edit',
      ),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('optimistic-state-inline-edit-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-optimistic-state$/);
    await expect(page.getByTestId('package-angular-optimistic-state')).toBeVisible();
  });

  test('navigates between permissions demos with the reusable strip', async ({ page }) => {
    await page.goto(permissionsActionsRoute);

    await expect(page.getByTestId('permissions-actions-demo-navigation')).toBeVisible();
    await expect(
      page.getByTestId('permissions-actions-demo-navigation-demo-permissions-actions'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('permissions-actions-demo-navigation-demo-permissions-routing').click();

    await expect(page).toHaveURL(/\/packages\/angular-permissions\/routing\/overview$/);
    await expect(page.getByTestId('permissions-routing-page')).toBeVisible();
    await expect(
      page.getByTestId('permissions-routing-demo-navigation-demo-permissions-routing'),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('permissions-routing-demo-navigation-overview').click();

    await expect(page).toHaveURL(/\/packages\/angular-permissions$/);
    await expect(page.getByTestId('package-angular-permissions')).toBeVisible();
  });

  test('updates permission-gated actions and hidden surfaces when the persona changes', async ({
    page,
  }) => {
    await page.goto(permissionsActionsRoute);

    await expect(page.getByTestId('permissions-actions-page')).toBeVisible();
    await expect(page.getByTestId('permissions-actions-approve-button')).toBeDisabled();
    await expect(page.getByTestId('permissions-actions-audit-button')).toBeDisabled();
    await expect(page.getByTestId('permissions-actions-audit-state')).toHaveText(
      'Audit review: disabled',
    );
    await expect(page.getByTestId('permissions-actions-audit-panel')).toHaveCount(0);
    await expect(page.getByTestId('permissions-actions-override-fallback')).toBeVisible();

    await page.getByTestId('permissions-actions-persona-select').selectOption('admin');

    await expect(page.getByTestId('permissions-actions-approve-button')).toBeEnabled();
    await expect(page.getByTestId('permissions-actions-refund-button')).toBeEnabled();
    await expect(page.getByTestId('permissions-actions-audit-button')).toBeEnabled();
    await expect(page.getByTestId('permissions-actions-override-button')).toBeEnabled();
    await expect(page.getByTestId('permissions-actions-audit-state')).toHaveText(
      'Audit review: enabled',
    );
    await expect(page.getByTestId('permissions-actions-audit-panel')).toBeVisible();
    await expect(page.getByTestId('permissions-actions-override-panel')).toBeVisible();
    await expect(page.getByTestId('permissions-actions-override-fallback')).toHaveCount(0);
    await expect(page.getByTestId('permissions-actions-snapshot-json')).toContainText(
      '"personaId": "admin"',
    );

    await page.getByTestId('permissions-actions-inspector-panel-tab-code').click();
    await expect(page.getByTestId('permissions-actions-code-sample')).toContainText(
      'injectPermissions<string, string>()',
    );
    await expect(page.getByTestId('permissions-actions-code-sample')).toContainText(
      'HexguardCanDirective',
    );
  });

  test('loads editor options from one shared lookups catalog and keeps labels visible on invalid refresh', async ({
    page,
  }) => {
    await page.goto(lookupsEditorRoute);

    await expect(page.getByTestId('lookups-editor-page')).toBeVisible();
    await expect(page.getByTestId('lookups-editor-category-select')).toBeDisabled();

    await page.getByTestId('lookups-editor-load-button').click();

    await expect(page.getByTestId('lookups-editor-version-pill')).toContainText('products-2026-06-15');
    await expect(page.getByTestId('lookups-editor-category-select')).toBeEnabled();
    await expect(page.getByTestId('lookups-editor-category-label')).toContainText('Hardware');
    await expect(page.getByTestId('lookups-editor-supplier-label')).toContainText(
      'Contoso Industrial',
    );

    await page.getByTestId('lookups-editor-refresh-button').click();

    await expect(page.getByTestId('lookups-editor-version-pill')).toContainText('products-2026-07-01');
    await expect(page.getByTestId('lookups-editor-category-label')).toContainText(
      'Hardware and Devices',
    );
    await expect(page.getByTestId('lookups-editor-supplier-label')).toContainText(
      'Contoso Global',
    );

    await page.getByTestId('lookups-editor-invalid-button').click();

    await expect(page.getByTestId('lookups-editor-error')).toContainText(
      "Duplicate collection key 'categories'.",
    );
    await expect(page.getByTestId('lookups-editor-category-label')).toContainText(
      'Hardware and Devices',
    );

    await page.getByTestId('lookups-editor-inspector-panel-tab-code').click();
    await expect(page.getByTestId('lookups-editor-code-sample')).toContainText(
      'provideHexGuardLookups',
    );
  });

  test('resolves summary-grid labels through the shared pipe and keeps explicit fallbacks for missing keys', async ({
    page,
  }) => {
    await page.goto(lookupsSummaryRoute);

    await expect(page.getByTestId('lookups-summary-page')).toBeVisible();

    await page.getByTestId('lookups-summary-load-button').click();

    await expect(page.getByTestId('lookups-summary-category-HG-2401')).toContainText('Hardware');
    await expect(page.getByTestId('lookups-summary-supplier-HG-2403')).toContainText(
      'Unknown supplier',
    );

    await page.getByTestId('lookups-summary-refresh-button').click();

    await expect(page.getByTestId('lookups-summary-category-HG-2401')).toContainText(
      'Hardware and Devices',
    );
    await expect(page.getByTestId('lookups-summary-supplier-HG-2401')).toContainText(
      'Contoso Global',
    );
    await expect(page.getByTestId('lookups-summary-summary')).toContainText('resolved 3 rows');

    await page.getByTestId('lookups-summary-inspector-panel-tab-code').click();
    await expect(page.getByTestId('lookups-summary-code-sample')).toContainText(
      'HexguardLookupLabelPipe',
    );
  });

  test('hydrates lookups from the shared .NET sample API and preserves labels across an invalid refresh', async ({
    page,
  }) => {
    await page.goto(lookupsBackendRoute);

    await expect(page.getByTestId('lookups-backend-page')).toBeVisible();
    await expect(page.getByTestId('lookups-backend-api-base-url-input')).toHaveValue(
      'http://127.0.0.1:5074',
    );

    await page.getByTestId('lookups-backend-load-button').click();

    await expect(page.getByTestId('lookups-backend-version-pill')).toContainText(
      'products-2026-06-15',
    );
    await expect(page.getByTestId('lookups-backend-request-url')).toContainText(
      '/api/angular-lookups/catalog?scenario=base',
    );
    await expect(page.getByTestId('lookups-backend-category-HG-2401')).toContainText('Hardware');
    await expect(page.getByTestId('lookups-backend-supplier-HG-2401')).toContainText(
      'Contoso Industrial',
    );

    await page.getByTestId('lookups-backend-scenario-select').selectOption('refreshed');
    await page.getByTestId('lookups-backend-reload-button').click();

    await expect(page.getByTestId('lookups-backend-version-pill')).toContainText(
      'products-2026-07-01',
    );
    await expect(page.getByTestId('lookups-backend-category-HG-2401')).toContainText(
      'Hardware and Devices',
    );
    await expect(page.getByTestId('lookups-backend-supplier-HG-2401')).toContainText(
      'Contoso Global',
    );

    await page.getByTestId('lookups-backend-scenario-select').selectOption('invalid');
    await page.getByTestId('lookups-backend-reload-button').click();

    await expect(page.getByTestId('lookups-backend-error')).toContainText(
      "Duplicate collection key 'categories'.",
    );
    await expect(page.getByTestId('lookups-backend-category-HG-2401')).toContainText(
      'Hardware and Devices',
    );

    await page.getByTestId('lookups-backend-inspector-panel-tab-code').click();
    await expect(page.getByTestId('lookups-backend-code-sample')).toContainText(
      'PRODUCT_LOOKUPS_BACKEND_DEMO_REPOSITORY',
    );
  });

  test('redirects unauthorized permission routes and allows them for the right persona', async ({
    page,
  }) => {
    await page.goto(`${permissionsRoutingRoute}/finance`);

    await expect(page).toHaveURL(/\/packages\/angular-permissions\/routing\/denied$/);
    await expect(page.getByTestId('permissions-routing-denied-panel')).toBeVisible();

    await page.getByTestId('permissions-routing-persona-select').selectOption('admin');
    await page.getByTestId('permissions-routing-link-finance').click();

    await expect(page).toHaveURL(/\/packages\/angular-permissions\/routing\/finance$/);
    await expect(page.getByTestId('permissions-routing-finance-panel')).toBeVisible();

    await page.getByTestId('permissions-routing-persona-select').selectOption('approver');
    await page.getByTestId('permissions-routing-link-audit').click();

    await expect(page).toHaveURL(/\/packages\/angular-permissions\/routing\/denied$/);

    await page.getByTestId('permissions-routing-persona-select').selectOption('admin');
    await page.getByTestId('permissions-routing-link-audit').click();

    await expect(page).toHaveURL(/\/packages\/angular-permissions\/routing\/audit$/);
    await expect(page.getByTestId('permissions-routing-audit-panel')).toBeVisible();
    await expect(page.getByTestId('permissions-routing-snapshot-json')).toContainText(
      '"financeRoute": true',
    );
  });

  test('renders async-state value lifecycle transitions with stale-data reload behavior', async ({
    page,
  }) => {
    await page.goto(asyncStateValueRoute);

    await expect(page.getByTestId('async-state-value-idle')).toBeVisible();

    await page.getByTestId('async-state-value-load-healthy').click();
    await expect(page.getByTestId('async-state-value-loading')).toBeVisible();
    await expect(page.getByTestId('async-state-value-card')).toHaveCount(3);
    await expect(page.getByTestId('async-state-value-summary')).toContainText('Loaded 3 cards');

    await page.getByTestId('async-state-value-reload-error').click();
    await expect(page.getByTestId('async-state-value-reloading')).toBeVisible();
    await expect(page.getByTestId('async-state-value-stale-error')).toContainText(
      'Metrics service timed out while loading the dashboard cards.',
    );
    await expect(page.getByTestId('async-state-value-card')).toHaveCount(3);
    await expect(page.getByTestId('async-state-value-status')).toContainText('Lifecycle: error');

    await page.getByTestId('async-state-value-inspector-panel-tab-code').click();
    await expect(page.getByTestId('async-state-value-code-sample')).toContainText(
      'readonly cards = asyncState',
    );
    await expect(page.getByTestId('async-state-value-code-sample')).toContainText('mapError');
  });

  test('renders async-state action lifecycle transitions and duplicate-run reuse', async ({
    page,
  }) => {
    await page.goto(asyncStateActionRoute);

    await expect(page.getByTestId('async-state-action-idle')).toBeVisible();

    await page.getByTestId('async-state-action-run-double').click();
    await expect(page.getByTestId('async-state-action-pending')).toBeVisible();
    await expect(page.getByTestId('async-state-action-success')).toContainText('was approved');
    await expect(page.getByTestId('async-state-action-backend-calls')).toContainText('1');
    await expect(page.getByTestId('async-state-action-duplicate-result')).toContainText(
      'Reused the same in-flight promise.',
    );

    await page.getByTestId('async-state-action-run-error').click();
    await expect(page.getByTestId('async-state-action-error')).toContainText(
      'Approval service rejected',
    );

    await page.getByTestId('async-state-action-inspector-panel-tab-code').click();
    await expect(page.getByTestId('async-state-action-code-sample')).toContainText(
      'readonly approval = asyncAction',
    );
    await expect(page.getByTestId('async-state-action-code-sample')).toContainText('timer(450)');
    await expect(page.getByTestId('async-state-action-code-sample')).toContainText(
      'duplicateSummary',
    );
  });

  test('renders optimistic toggle conflict policy behavior and the generated source panel', async ({
    page,
  }) => {
    await page.goto(optimisticStateToggleRoute);

    await expect(page.getByTestId('optimistic-state-toggle-page')).toBeVisible();

    await page.getByTestId('optimistic-state-toggle-overlap').click();
    await expect(page.getByTestId('optimistic-state-toggle-overlap-summary')).toContainText(
      'rejected before it could replace',
    );
    await expect(page.getByTestId('optimistic-state-toggle-status-pill')).toContainText(
      'Status: idle',
    );

    await page.getByTestId('optimistic-state-toggle-policy-select').selectOption('queue');
    await page.getByTestId('optimistic-state-toggle-overlap').click();
    await expect(page.getByTestId('optimistic-state-toggle-queued-count')).toContainText('1');
    await expect(page.getByTestId('optimistic-state-toggle-status-pill')).toContainText(
      'Status: idle',
    );

    await page.getByTestId('optimistic-state-toggle-policy-select').selectOption('replace');
    await page.getByTestId('optimistic-state-toggle-overlap').click();
    await expect(page.getByTestId('optimistic-state-toggle-overlap-summary')).toContainText(
      'replaced the active optimistic overlay immediately',
    );
    await expect(page.getByTestId('optimistic-state-toggle-status-pill')).toContainText(
      'Status: idle',
    );

    await page.getByTestId('optimistic-state-toggle-inspector-panel-tab-code').click();
    await expect(page.getByTestId('optimistic-state-toggle-code-sample')).toContainText(
      'readonly featureToggles = optimisticState',
    );
    await expect(page.getByTestId('optimistic-state-toggle-code-sample')).toContainText(
      'conflictPolicy',
    );
  });

  test('renders optimistic inline-edit queue behavior and canonical reconciliation', async ({
    page,
  }) => {
    await page.goto(optimisticStateInlineEditRoute);

    await expect(page.getByTestId('optimistic-state-inline-edit-page')).toBeVisible();

    await page.getByTestId('optimistic-state-inline-edit-input').fill('resolve renewal webhook');
    await page.getByTestId('optimistic-state-inline-edit-queue').click();

    await expect(page.getByTestId('optimistic-state-inline-edit-queued-count')).toContainText('1');
    await expect(page.getByTestId('optimistic-state-inline-edit-row-draft-101')).toContainText(
      'Resolve Renewal Webhook Follow-Up',
    );
    await expect(page.getByTestId('optimistic-state-inline-edit-status-pill')).toContainText(
      'Status: idle',
    );

    await page.getByTestId('optimistic-state-inline-edit-inspector-panel-tab-code').click();
    await expect(page.getByTestId('optimistic-state-inline-edit-code-sample')).toContainText(
      "conflictPolicy: 'queue'",
    );
    await expect(page.getByTestId('optimistic-state-inline-edit-code-sample')).toContainText(
      'normalizeTitle',
    );
  });

  test('renders optimistic bulk replace behavior and rollback-friendly state inspection', async ({
    page,
  }) => {
    await page.goto(optimisticStateBulkRoute);

    await expect(page.getByTestId('optimistic-state-bulk-page')).toBeVisible();

    await page.getByTestId('optimistic-state-bulk-replace').click();
    await expect(page.getByTestId('optimistic-state-bulk-replace-summary')).toContainText(
      'replaced the active optimistic overlay immediately',
    );
    await expect(page.getByTestId('optimistic-state-bulk-status-pill')).toContainText(
      'Status: idle',
    );
    await expect(page.getByTestId('optimistic-state-bulk-row-campaign-219')).toContainText('draft');

    await page.getByTestId('optimistic-state-bulk-inspector-panel-tab-code').click();
    await expect(page.getByTestId('optimistic-state-bulk-code-sample')).toContainText(
      "conflictPolicy: 'replace'",
    );
    await expect(page.getByTestId('optimistic-state-bulk-code-sample')).toContainText(
      "getTarget: () => 'bulk-publish'",
    );
  });

  test('redirects legacy optimistic toggle route to the package-scoped demo', async ({ page }) => {
    await page.goto('/optimistic-toggle');

    await expect(page).toHaveURL(/\/packages\/angular-optimistic-state\/toggle$/);
    await expect(page.getByTestId('optimistic-state-toggle-page')).toBeVisible();
  });

  test('renders observable-state live updates, terminal events, and reconnect behavior', async ({
    page,
  }) => {
    await page.goto(asyncStateObservableRoute);

    await expect(page.getByTestId('async-state-observable-idle')).toBeVisible();

    await page.getByTestId('async-state-observable-connect').click();
    await expect(page.getByTestId('async-state-observable-connecting')).toBeVisible();

    await page.getByTestId('async-state-observable-emit-healthy').click();
    await expect(page.getByTestId('async-state-observable-live')).toContainText('Feed 1 is live');
    await expect(page.getByTestId('async-state-observable-card')).toHaveCount(3);

    await page.getByTestId('async-state-observable-fail-feed').click();
    await expect(page.getByTestId('async-state-observable-error')).toContainText(
      'Live approval feed 1 stopped while streaming backlog metrics.',
    );
    await expect(page.getByTestId('async-state-observable-card')).toHaveCount(3);

    await page.getByTestId('async-state-observable-reconnect').click();
    await expect(page.getByTestId('async-state-observable-connecting')).toBeVisible();

    await page.getByTestId('async-state-observable-emit-empty').click();
    await expect(page.getByTestId('async-state-observable-empty')).toContainText(
      'The latest live snapshot is empty.',
    );

    await page.getByTestId('async-state-observable-emit-warning').click();
    await expect(page.getByTestId('async-state-observable-card')).toHaveCount(3);

    await page.getByTestId('async-state-observable-complete-feed').click();
    await expect(page.getByTestId('async-state-observable-complete')).toContainText(
      'Feed 2 completed.',
    );

    await page.getByTestId('async-state-observable-inspector-panel-tab-code').click();
    await expect(page.getByTestId('async-state-observable-code-sample')).toContainText(
      'readonly liveFeed = observableState',
    );
    await expect(page.getByTestId('async-state-observable-code-sample')).toContainText(
      'connectionCount.update',
    );
  });

  test('cleans invalid query params on the recovery demo and replays state through history', async ({
    page,
  }) => {
    await page.goto(`${queryFormRecoveryRoute}?query=api&severity=panic&page=oops&view=matrix`);

    await expect(page.getByTestId('query-form-recovery-page')).toBeVisible();
    await expect(page).toHaveURL(/\/packages\/angular-query-form\/recovery\?query=api$/);
    await expect(page.getByTestId('query-form-recovery-search-input')).toHaveValue('api');
    await expect(page.getByTestId('query-form-recovery-severity-select')).toHaveValue('all');
    await expect(page.getByTestId('query-form-recovery-page-input')).toHaveValue('1');
    await expect(page.getByTestId('query-form-recovery-view-summary')).toHaveClass(
      /demo-tab-button--active/,
    );
    await expect(page.getByTestId('query-form-recovery-cleanup-summary')).toContainText(
      'Invalid query params are removed after parse.',
    );

    await page.getByTestId('query-form-recovery-view-detail').click();
    await expect(page).toHaveURL(/view=detail/);

    await page.getByTestId('query-form-recovery-page-input').fill('2');
    await expect(page).toHaveURL(/page=2/);

    await page.goBack();
    await expect(page.getByTestId('query-form-recovery-page-input')).toHaveValue('1');
    await expect(page).not.toHaveURL(/page=2/);

    await page.goBack();
    await expect(page.getByTestId('query-form-recovery-view-summary')).toHaveClass(
      /demo-tab-button--active/,
    );
    await expect(page).not.toHaveURL(/view=detail/);

    await page.getByTestId('query-form-recovery-inspector-panel-tab-code').click();
    await expect(page.getByTestId('query-form-recovery-code-sample')).toContainText(
      "invalidParamBehavior: 'removeInvalid'",
    );
    await expect(page.getByTestId('query-form-recovery-code-sample')).toContainText(
      "history: 'push'",
    );
  });
});
