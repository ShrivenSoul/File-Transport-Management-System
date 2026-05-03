import { test, expect } from '@playwright/test';

test('Affirm non-admin user cannot access the user menu', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Admin Privileges' }).click();
  await expect(page.getByRole('heading', { name: 'Upload file here:' })).toBeVisible();
});

test('Affirm that uploading no file does not crash site', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Send to server!' }).click();
  await page.getByRole('heading', { name: 'Upload file here:' }).click();
});

test('Affirm file upload works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/testFiles/testFile(1).txt');
  await page.getByRole('button', { name: 'Send to server!' }).click();
  await page.getByRole('button', { name: 'Get current files' }).click();
  await page.locator('#fileSelection').selectOption('testFile(1).txt');
  await expect(page.locator('#fileSelection')).toContainText('testFile(1).txt');
});

test('Affirm that get current files updates files dropdown box', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await expect(page.locator('#fileSelection')).toBeEmpty();
  await page.getByRole('button', { name: 'Get current files' }).click();
  await expect(page.locator('#fileSelection')).not.toBeEmpty();
});

test('Affirm file download works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await expect(page.locator('#fileSelection')).toBeEmpty();
  await page.getByRole('button', { name: 'Get current files' }).click();
  await page.locator('#fileSelection').selectOption('FILES TO UPLOAD (1).txt');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download!' }).click();
  const download = await downloadPromise;
});

test('Affirm malicious file is not uploaded to server', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/testFiles/eicar.com.txt');
  await page.getByRole('button', { name: 'Send to server!' }).click();
  await page.getByRole('button', { name: 'Get current files' }).click();
  await expect(page.locator('#fileSelection')).not.toContainText('eicar.com.txt');
});

test('Affirm signout button works', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('00107795@nebraska.edu');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password$1');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await expect(page.getByText('Simple Auth PageSign Up')).toBeVisible();
});