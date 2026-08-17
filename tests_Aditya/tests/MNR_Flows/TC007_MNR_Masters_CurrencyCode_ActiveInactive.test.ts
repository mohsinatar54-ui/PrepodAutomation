import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { time } from 'console';


test('TC007_MNR_Masters_CurrencyCode_ActiveInactive', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await clickAndMeasureDynamic(page, '//img[@alt="MNR Logo"]', '//button[normalize-space()="Masters"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Menu Code"]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Menu Code"]', '//button[normalize-space()="Currency Code"]', 'Click on Menu Code and wait for Country Code button');

  // --- Click New Container ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Currency Code"]', '//h2[normalize-space()="Add Currency Code"]', 'Route to Currency Code Master screen');
 const   currencyCode = await page.locator('//tr[1]//td[1]').innerText();
  await expect(
  page.locator(`//tr[.//td[normalize-space()='${currencyCode}']]//td[normalize-space()='Active']`)
).toBeVisible();
  // await page.getByRole('row', { name: currencyCode }).locator('span').first().click({
  //   button: 'right'
  // });
  await page.locator(
  `(//tr[.//td[normalize-space()='${currencyCode}']])[1]//label[contains(@class,'cursor-pointer')]`
).click();
  await expect(page.getByText(`Do you want to set ${currencyCode} to InActive? Yes No`)).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  // await expect(page.getByRole('cell', { name: 'InActive' })).toBeVisible();
  await expect(page.getByText(`${currencyCode} set to InActive`)).toBeVisible();
  page.locator(`//tr[.//td[normalize-space()='${currencyCode}']]//td[normalize-space()='InActive']`).isVisible();

  await page.locator(
  `(//tr[.//td[normalize-space()='${currencyCode}']])[1]//label[contains(@class,'cursor-pointer')]`
).click();
  await expect(page.locator('form')).toContainText(`Do you want to set ${currencyCode} to Active?`);
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText(`${currencyCode} set to Active`)).toBeVisible();
  await page.locator(`//tr[.//td[normalize-space()='${currencyCode}']]//td[normalize-space()='Active']`).isVisible();

});

