import { test, expect } from '@playwright/test';

test('page tab shows the Alpine environment for v3', async ({ page }) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('tab-link-page').click();
  await expect(page.getByTestId('page-alpine-version')).toContainText('v3.');
  await expect(
    page.getByTestId('page-directives').getByText('model', { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('page-plugins-none')).toBeVisible();
  await expect(page.getByTestId('page-stores-count')).toHaveText('2');
});

test('page tab shows ecosystem tools and the scripts inventory', async ({ page }) => {
  await page.goto('/simulator?target=v3.html');
  await page.getByTestId('tab-link-page').click();
  await expect(page.getByTestId('page-ecosystem-none')).toBeVisible();
  await expect(page.getByTestId('page-script-item').first()).toBeVisible();
  await page.getByTestId('page-scripts-filter').fill('cdn');
  await expect(
    page.getByTestId('page-script-item').filter({ hasText: 'cdn.min.js' }),
  ).toBeVisible();
  await page.getByTestId('page-scripts-filter').fill('zzz-no-match');
  await expect(page.getByTestId('page-scripts-empty')).toBeVisible();
});

test('page tab marks stores as unsupported on Alpine v2', async ({ page }) => {
  await page.goto('/simulator?target=example.html');
  await page.getByTestId('tab-link-page').click();
  await expect(page.getByTestId('page-alpine-version')).toContainText('v2.');
  await expect(page.getByTestId('page-stores-unsupported')).toBeVisible();
});
