import { test, expect } from '@playwright/test';

test('Affirm admins can access admin privileges', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknownmage97@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('CD$Capstone1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin Privileges' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
});

test('Affirm audit logs displays when fetched', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknownmage97@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('CD$Capstone1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin Privileges' }).click();
  await page.getByRole('button', { name: 'Load Audit Logs' }).click();
  await expect(page.locator('tbody')).toContainText('::1');
});

test('Affirm user list displays when fetched', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknownmage97@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('CD$Capstone1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin Privileges' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.getByText('AngryBird@pigs.com')).toBeVisible();
});