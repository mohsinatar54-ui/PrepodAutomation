import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { time } from 'console';

const RepairMaterialCode = 'R' + getRandomNumberString(2);
const RepairMaterialCurrency =  'pound'
const RepairMaterialAmount = '100';
const Currency = 'Rupee';

async function fillRepairMaterialForm(
  page: any,
  code: string,
  currency: string,
  amount: string
) {
  await page.locator('input[formcontrolname="Code"]').fill(code);
  await page.locator('input[formcontrolname="Name"]').fill(`Automation Test ${code}`);
  await page.locator('select[formcontrolname="CurrencyID"]').selectOption(currency);
  await page.locator('input[formcontrolname="Amount"]').fill(amount);
}

test('TC009_MNR_Masters_RepairMaterialCodeCost', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await clickAndMeasureDynamic(page, '//img[@alt="MNR Logo"]', '//button[normalize-space()="Masters"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Repair Material & Staff"]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Repair Material & Staff"]', '//h2[normalize-space()="Add Repair Material Code & Cost"]', 'Click on Menu Code and wait for Country Code button');

  // await fillRepairMaterialForm(page, RepairMaterialCode, RepairMaterialCurrency, RepairMaterialAmount);
  // await page.locator('//button[normalize-space()="Reset"]').click();

  // expect(await page.locator('input[formcontrolname="Code"]').inputValue()).toBe('');
  // expect(await page.locator('input[formcontrolname="Name"]').inputValue()).toBe('');
  // expect(await page.locator('select[formcontrolname="CurrencyID"]').inputValue()).toBe('');
  // expect(await page.locator('input[formcontrolname="Amount"]').inputValue()).toBe('');
  
  await fillRepairMaterialForm(page, RepairMaterialCode, RepairMaterialCurrency, RepairMaterialAmount);
  await page.locator('//span[normalize-space()="Add"]').click();
  // Validate that the entered values are saved and visible in the table row
  const row = page.locator(`//tr[td/a[normalize-space()="${RepairMaterialCode}"]]`);
  await expect(row.locator('td').nth(0).locator('a')).toHaveText(RepairMaterialCode);
  await expect(row.locator('td').nth(1)).toHaveText(`Automation Test ${RepairMaterialCode}`);
  await expect(row.locator('td').nth(2)).toHaveText(RepairMaterialCurrency);
  // Amount column may have formatting, so we check for partial match
  await expect(row.locator('td').nth(3)).toContainText(RepairMaterialAmount);
  await expect(row.locator('td').nth(4)).toHaveText(/Active/i);
  await expect(page.getByText('Code Cost added successfully.')).toBeVisible();

  await page.locator(`//tr[.//text()[normalize-space()='${RepairMaterialCode}']]//i[contains(@class,'fa-pen-to-square')]`).click();
  const codeInput = page.locator("input[formcontrolname='Code']");
  await expect(codeInput).toBeEditable({ editable: false });
  await page.locator('select[formcontrolname="CurrencyID"]').selectOption(Currency);
  await page.locator('input[formcontrolname="Amount"]').fill('20');
  await page.locator('//span[normalize-space()="Save"]').click();
  await expect(page.getByText('Code Cost updated successfully.')).toBeVisible();

  await page.locator(`//tr[.//text()[normalize-space()='${RepairMaterialCode}']]//i[contains(@class,'fa-trash')]`).click();
    await page.getByText(`Do you want to InActive ${RepairMaterialCode}`).click();
  await expect(page.getByText(`Do you want to InActive ${RepairMaterialCode}`)).toBeVisible();
  await expect(page.getByRole('button', { name: 'No' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByText(`${RepairMaterialCode} Inactive successfully.`).click();
  await expect(page.getByText(`${RepairMaterialCode} Inactive successfully.`)).toBeVisible();
  await expect(page.locator(`//tr[.//text()[normalize-space()='${RepairMaterialCode}']]//td[contains(text(),'InActive')]`)).toBeVisible();

});

