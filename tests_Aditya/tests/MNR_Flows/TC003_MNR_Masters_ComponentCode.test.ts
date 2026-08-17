import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';

const comp_code = '4228';

test('TC003_MNR_Masters_ComponentCode', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
// Step 2: Login flow + MNR visibility selection
  await clickAndMeasureDynamic(page, '//div//img[@alt="MNR Logo"]', '//button[normalize-space()="Container"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Menu Code"]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Menu Code"]', '//button[normalize-space()="Component Code"]', 'Click External Containers button');

  // --- Click New Container ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Component Code"]', '//input[@formcontrolname="Code"]', 'Click + New Container button');

  const comp_code = getRandomNumberString(4);

  await console.log(`Generated Component Code: ATCC${comp_code}`);

  // ----- Component Code Reset -----
  // Fill fields before reset to verify they are cleared
  await page.fill('//input[@formcontrolname="Code"]', `ATCC${comp_code}`);
  expect(await page.inputValue('//input[@formcontrolname="Code"]')).not.toBe('');

  await page.fill('//input[@formcontrolname="Name"]', `AUTO CC ${comp_code}`);
  expect(await page.inputValue('//input[@formcontrolname="Name"]')).not.toBe('');

  await page.fill('//input[@formcontrolname="LongName"]', `Auto Component Code ${comp_code}`);
  expect(await page.inputValue('//input[@formcontrolname="LongName"]')).not.toBe('');

  await page.locator('//label[.//text()[normalize-space()="Machinery"]]/following::label[.//text()[normalize-space()="Yes"]][1]').click();

  await page.locator('//label[.//text()[normalize-space()="Structural"]]/following::label[.//text()[normalize-space()="Yes"]][1]').click();


  // Click Reset button
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Reset"]', '//input[@formcontrolname="Code"]', 'Click Reset button');

  // Ensure all fields are empty after reset
  let codeVal = await page.inputValue('//input[@formcontrolname="Code"]');
  let nameVal = await page.inputValue('//input[@formcontrolname="Name"]');
  let longNameVal = await page.inputValue('//input[@formcontrolname="LongName"]');

  expect(codeVal).toBe('');
  expect(nameVal).toBe('');
  expect(longNameVal).toBe('');

  await page.type('//input[@formcontrolname="Code"]', `ATCC${comp_code}`, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.type('//input[@formcontrolname="Name"]', `AUTO CC ${comp_code}`, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.type('//input[@formcontrolname="LongName"]', `Auto Component Code ${comp_code}`, { delay: 100 });
  await page.waitForTimeout(2000);

  // Click Add button (span text)
  await clickAndMeasureDynamic(page, '//button[@class="btn-add"]', '//input[@formcontrolname="Code"]', 'Click Add button');
  await page.waitForTimeout(2000);

  // Assertions for the row just added
  const codeText = await page.textContent('//tr[1]//td[1]//a');
  const nameText = await page.textContent('//tr[1]//td[2]');
  const longNameText = await page.textContent('//tr[1]//td[3]');
  const statusText = await page.textContent('//tr[1]//td[4]');

  expect(codeText?.trim()).toBe(`ATCC${comp_code}`);
  expect(nameText?.trim()).toBe(`AUTO CC ${comp_code}`);
  expect(longNameText?.trim()).toBe(`Auto Component Code ${comp_code}`);
  expect(statusText?.trim()).toBe('Active');

  // ----- Component Code Edit Inactive -----
  // Wait for the edit (pen) icon for this row
  await page.waitForSelector(`//tr[.//td[normalize-space()='ATCC${comp_code}']]//i[contains(@class,'fa-pen-to-square')]`, { timeout: 60_000 });

  // Click the edit icon
  await page.click(`//tr[.//td[normalize-space()='ATCC${comp_code}']]//i[contains(@class,'fa-pen-to-square')]`);

  // Wait for the Inactive/No label/radio (mark inactive)
  await page.waitForSelector('//label[text()=" No "]');
  await page.click('//label[text()=" No "]');
  await page.waitForTimeout(1000);

  // Visibility checks for "Cancel" and "Reset" buttons
  await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
  await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();

  // Click Save
  await clickAndMeasureDynamic(page, '//button//span[normalize-space()="Save"]', '//input[@formcontrolname="Code"]', 'Click Save button');

  // Wait for status update in grid
  await page.waitForSelector(`//tr[.//td[normalize-space()='ATCC${comp_code}']]/td[4]`, { timeout: 60_000 });

  // Validate the status is now "InActive"
  const newStatus = await page.textContent(`//tr[.//td[normalize-space()='ATCC${comp_code}']]/td[4]`);
  // expect(newStatus.tohavetext('InActive');
  console.log(`Updated Status: ${newStatus}`);
  await page.waitForTimeout(2000);
  await expect(newStatus?.trim()).toContain('InActive');

  // await page.click(`//tr[.//td[normalize-space()='ATCC${comp_code}']]//i[contains(@class,'fa-trash')]`);
  // await page.click('//button[normalize-space()="Yes"]');
  // await expect(page.locator(`//tr//td[normalize-space()='ATCC${comp_code}']`)).not.toBeVisible();

});

