import { expect, test } from '@playwright/test';

test.describe('demo-angular', () => {
  test('hydrates the orders page from the page query param', async ({ page }) => {
    await page.goto('/orders?page=2');

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await expect(page).toHaveURL(/\/orders\?page=2$/);
    await expect(page.getByTestId('orders-page-indicator')).toHaveText('Page 2 of 2');
    await expect(page.getByTestId('orders-result-summary')).toContainText(
      'Showing 6-7 of 7 matching orders.',
    );
    await expect(page.getByTestId('orders-page-input')).toHaveValue('2');
    await expect(page.getByTestId('orders-table')).toContainText('HG-1076');
    await expect(page.getByTestId('orders-table')).toContainText('HG-1080');
  });

  test('keeps the orders demo shareable through query params', async ({ page }) => {
    await page.goto('/orders');

    await expect(page.getByTestId('orders-page')).toBeVisible();
    await page.getByTestId('orders-search-input').fill('north');
    await page.getByTestId('orders-tags-input').fill('priority');

    await expect(page).toHaveURL(/\/orders\?search=north&tags=priority/);
    await expect(page.getByTestId('orders-row')).toHaveCount(1);
    await expect(page.getByTestId('orders-result-summary')).toContainText('Showing 1-1 of 1');
    await expect(page.getByTestId('orders-current-url')).toContainText(
      '/orders?search=north&tags=priority',
    );
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"search": "north"');
    await expect(page.getByTestId('orders-snapshot-json')).toContainText('"priority"');

    await page.getByTestId('orders-reset-filters').click();

    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByTestId('orders-current-url')).toHaveText('/orders');
  });

  test('replays dashboard state through browser history', async ({ page }) => {
    await page.goto('/dashboard');

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
