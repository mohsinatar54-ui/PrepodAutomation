import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { time } from 'console';

const randomNumber = getRandomNumberString(5);
const partCode = 'PC' + randomNumber
const partDescription = 'Part Description ' + randomNumber;
const cedexCode = 'CDC' + randomNumber;
const vendorName = 'Vendor Automation' + randomNumber;
const manufacturerName = 'Automation Manufacturer ' + randomNumber;
const manufacturerPartNo = 'MPN' + randomNumber;
const openingQuantity = '10';
const buyingPrice = '1000';
const stockInQuantity = '50';
const currency = 'Rupees';

test('TC008_MNR_Masters_SparePartInventory', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await clickAndMeasureDynamic(page, '//img[@alt="MNR Logo"]', '//button[normalize-space()="Spare Parts"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Spare Parts"]', '(//button[normalize-space()="Spare Parts Inventory"])[1]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '(//button[normalize-space()="Spare Parts Inventory"])[1]', '//app-inventory//button[normalize-space()="Spare Parts Inventory"]', 'Click on Menu Code and wait for Country Code button');

  await page.getByRole('button', { name: '+ New Inventory' }).click();
  await page.locator('div').filter({ hasText: /^Part Code \*$/ }).getByRole('textbox').fill(partCode);
  await page.locator('div').filter({ hasText: /^Part Description \*$/ }).getByRole('textbox').fill(partDescription);
  await page.locator('div').filter({ hasText: /^Cedex Code \*$/ }).getByRole('textbox').fill(cedexCode);
 
  await page.locator('div').filter({ hasText: /^Minimum Quantity \*$/ }).getByRole('spinbutton').fill('1000');
  await page.getByRole('radio', { name: 'No' }).nth(1).check();
  await page.locator('div').filter({ hasText: /^Vendor \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Vendor \*$/ }).getByRole('textbox').fill(vendorName);
  await page.locator('div').filter({ hasText: /^Manufacturer Name$/ }).getByRole('textbox').fill(manufacturerName);
  await page.locator('div').filter({ hasText: /^Manufacturer Part No$/ }).getByRole('textbox').fill(manufacturerPartNo);
  await page.locator('div').filter({ hasText: /^Opening Quantity \*$/ }).getByRole('spinbutton').fill(openingQuantity);
  await page.locator('div').filter({ hasText: /^Stock In Quantity\*$/ }).getByRole('spinbutton').fill(stockInQuantity);
  await page.locator('div').filter({ hasText: /^Buying Price \*$/ }).getByRole('spinbutton').fill(buyingPrice);
  // await page.locator('app-add-vendor').getByRole('combobox').selectOption('21');
  await page.locator('select[formcontrolname="CurrencyID"]').selectOption(currency);
  await expect(page.locator('app-add-vendor').getByRole('button', { name: 'Reset' })).toBeVisible();
  // await page.getByRole('button', { name: 'Add Vendor' }).click();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add Vendor"]', `//tr//td[normalize-space()="${vendorName}"]`, 'Click Add Vendor and wait for success message');
  await expect(page.getByRole('cell', { name: vendorName }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: manufacturerName })).toBeVisible();
  await expect(page.getByRole('cell', { name: manufacturerPartNo })).toBeVisible();
  await expect(page.getByRole('cell', { name: openingQuantity, exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: stockInQuantity, exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: buyingPrice })).toBeVisible();
  await expect(page.getByRole('cell', { name: currency })).toBeVisible();
  // await page.getByRole('button', { name: 'Add Inventory' }).click();
  await clickAndMeasureDynamic(page, '//span[normalize-space()="Add Inventory"]', `//tr//td[normalize-space()="${partCode}"]`, 'Click Add Inventory and wait for success message');
  await expect(page.getByText(partCode)).toBeVisible();
  await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${partCode}']]//i[contains(@class,'fa-pen-to-square')]`, `//tr[.//a[normalize-space()='${partCode}']]//i[contains(@class,'fa-pen-to-square')]`, 'Open the created Spare Part Inventory');
  await page.getByRole('row', { name: `${partCode} Automation testing` }).getByRole('button').first().click();
  await page.getByRole('radio', { name: 'No' }).first().check();
  await page.getByRole('row', { name: 'Automation Testing Automation' }).getByRole('button').nth(1).click();
  await page.locator('div').filter({ hasText: /^Opening Quantity \*$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Opening Quantity \*$/ }).getByRole('spinbutton').fill('100');
  await page.getByRole('button', { name: 'Update Vendor' }).click();
  await expect(page.getByRole('cell', { name: '100' }).nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('row', { name: 'Automation Testing Automation' }).getByRole('button').nth(1).click();
  await page.locator('div').filter({ hasText: /^Vendor \*$/ }).getByRole('textbox').fill('Automation Testing Edit');
  await page.getByRole('button', { name: 'Update Vendor' }).click();
  await page.getByRole('row', { name: 'Automation Testing Automation' }).getByRole('button').first().click();
  await expect(page.getByText('Do you want to Delete ?')).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('row', { name: 'Automation Testing Automation' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Yes' }).click();
  
});

