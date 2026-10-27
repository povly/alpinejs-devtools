import { test, expect } from '@playwright/test';
import { target } from './helpers';

test('component data change flashes the changed row, the list badge and the activity log (v3)', async ({
  page,
}) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('component-name').filter({ hasText: 'model-no-render' }).click();
  await page.getByTestId('activity-button').click();
  await expect(page.getByTestId('activity-empty')).toBeVisible();

  await target(page).getByTestId('model-no-render').pressSequentially('a', { delay: 20 });

  await expect(page.getByTestId('data-attribute-row-text')).toHaveClass(/data-row-flash/);
  const componentItem = page.locator(
    '[data-testid="component-container"]:has([data-testid="component-name"]:text-is("model-no-render"))',
  );
  await expect(componentItem.getByTestId('component-changed-indicator')).toBeVisible();
  await expect(page.getByTestId('activity-entry').first()).toContainText('model-no-render');
  await expect(page.getByTestId('activity-entry').first()).toContainText('text');
});

test('store edit round-trip flashes the changed row and records activity (v3)', async ({
  page,
}) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('tab-link-stores').click();
  await page.getByTestId('store-name').filter({ hasText: 'primitiveVal' }).click();
  await page.getByTestId('activity-button').click();

  await page
    .getByTestId('data-property-value-__root_value')
    .locator('[type=checkbox]')
    .click({ force: true });

  await expect(page.getByTestId('data-attribute-row-__root_value')).toHaveClass(/data-row-flash/);
  const storeItem = page.locator(
    '[data-testid="store-container"]:has([data-testid="store-name"]:text-is("primitiveVal"))',
  );
  await expect(storeItem.getByTestId('store-changed-indicator')).toBeVisible();
  await expect(page.getByTestId('activity-entry').first()).toContainText('primitiveVal');
});

test('component data change flashes on Alpine v2 (mutation observer flow)', async ({ page }) => {
  await page.goto('/simulator?target=example.html');
  await page.getByTestId('component-name').filter({ hasText: 'model-no-render' }).click();
  await page.getByTestId('activity-button').click();
  await target(page).getByTestId('model-no-render').pressSequentially('ab', { delay: 30 });
  await expect(page.getByTestId('activity-entry').first()).toContainText('model-no-render');
  await expect(page.getByTestId('data-attribute-row-text')).toHaveClass(/data-row-flash/);
});
