import { test, expect } from '@playwright/test';

test('Affirm login page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByText('Simple Auth PageSign Up').click();
});

test('Affirm signup page does not take invalid email', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('a');
  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('b');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('b');
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
  await page.getByText('At least 8 charactersOne uppercase letterOne numberOne special characterSign Up').click();
});

test('Affirm signup page does not take mismatched passwords', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@unomaha.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('A');
  await page.getByRole('textbox', { name: 'Password', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('4');
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByText('Passwords do not match')).toBeVisible();
});

test('Affirm signup page does not take insufficient passwords', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@unomaha.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('a');
  await page.getByRole('textbox', { name: 'Password', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('a');
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByText('Password does not meet')).toBeVisible();
});

test('Affirm signup page does not let you sign up with an email that has been used already', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@unomaha.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password$1');
  await page.getByRole('textbox', { name: 'Password', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByText('User already exists')).toBeVisible();
});

test('Affirm button to login menu works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form').getByRole('button', { name: 'Login' })).toBeVisible();
});

test('Affirm button to signup menu works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form').getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.locator('form').getByRole('button', { name: 'Sign Up' })).toBeVisible();
});

test('Affirm password rest button works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  await expect(page.getByRole('button', { name: 'Send Reset Code' })).toBeVisible();
});

test('Affirm you cannot reset password for account that does not exist', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  await expect(page.getByRole('button', { name: 'Send Reset Code' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('00107795@unomaha.edu');
  await page.getByRole('button', { name: 'Send Reset Code' }).click();
  await expect(page.getByText('Cannot reset password for the')).toBeVisible();
});

test('Affirm login does not take incorrect emails/passwords', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknownmage97@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Incorrect username or')).toBeVisible();
});

test('Affirm login takes user to the landing page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('unknownmage97@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('CD$Capstone1');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Cross Domain Solutions' })).toBeVisible();
});