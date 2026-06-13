import { expect, test } from '@playwright/test';

const ordersRoute = '/packages/angular-url-state/orders';
const dashboardRoute = '/packages/angular-url-state/dashboard';

test.describe('demo-angular', () => {
  test('shows the Angular URL State package overview', async ({ page }) => {
    await page.goto('/packages/angular-url-state');

    await expect(page.getByTestId('package-angular-url-state')).toBeVisible();
    await expect(page.getByTestId('package-demo-orders')).toBeVisible();
    await expect(page.getByTestId('package-demo-dashboard')).toBeVisible();
  });

  test('hydrates the orders page from the page query param', async ({ page }) => {
    await page.goto(`${ordersRoute}?page=2`);

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders\?page=2$/);
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

  test('keeps the orders demo shareable through query params', async ({ page }) => {
    await page.goto(ordersRoute);

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await page.getByTestId('orders-search-input').fill('north');
    await page.getByTestId('orders-tags-input').fill('priority');

    await expect(page).toHaveURL(
      /\/packages\/angular-url-state\/orders\?search=north&tags=priority/,
    );
    await expect(page.getByTestId('orders-row')).toHaveCount(1);
    await expect(page.getByTestId('orders-result-summary')).toContainText('Showing 1-1 of 1');
    await expect(page.getByTestId('orders-current-url')).toContainText(
      '/packages/angular-url-state/orders?search=north&tags=priority',
    );
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"search": "north"');
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"priority"');

    await page.getByTestId('orders-inspector-panel-tab-code').click();

    await expect(page.getByTestId('orders-code-sample')).toContainText('readonly state = urlState');
    await expect(page.getByTestId('orders-code-sample')).toContainText('debounceMs: 250');
    await expect(page.getByTestId('orders-code-sample').locator('.demo-code-line')).not.toHaveCount(
      0,
    );

    await page.getByTestId('orders-reset-filters').click();

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders$/);
    await expect(page.getByTestId('orders-current-url')).toHaveText(
      '/packages/angular-url-state/orders',
    );
  });

  test('redirects legacy orders route to the package-scoped demo', async ({ page }) => {
    await page.goto('/orders?page=2');

    await expect(page).toHaveURL(/\/packages\/angular-url-state\/orders\?page=2$/);
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
});
