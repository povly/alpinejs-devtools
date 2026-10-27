import { test, expect } from '@playwright/test';
import { target } from './helpers';

test('stores tab is available without a license', async ({ page }) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('tab-link-stores').click();
  await expect(page.getByTestId('store-name')).toHaveCount(2);
  await expect(page.getByTestId('early-access-notice')).toHaveCount(0);
});

test('history entries beyond the old free limit are accessible', async ({ page }) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('component-name').filter({ hasText: 'model-no-render' }).click();
  await page.getByTestId('history-flyout').getByText('History').click();
  await target(page).getByTestId('model-no-render').pressSequentially('new', { delay: 20 });
  await expect(page.getByTestId('history-message-2')).toBeVisible();
  await page.getByTestId('history-message-2').click();
  await expect(page.getByTestId('early-access-notice')).toHaveCount(0);
});

test('no trial or license UI is shown', async ({ page }) => {
  await page.goto('/simulator?target=v3.html');
  await expect(page.getByTestId('activate-license-button')).toHaveCount(0);
  await expect(page.getByText('Start 7 day trial')).toHaveCount(0);
  await expect(page.getByText('Trial expires')).toHaveCount(0);
});
