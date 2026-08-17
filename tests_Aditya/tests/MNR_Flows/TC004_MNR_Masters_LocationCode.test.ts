import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { time } from 'console';



const Operator_Value = '1';
const Estimate_Type_Value = '955';

const DepotSizeType = '20STD';
const ISOSizeType = '22G1';

const Quality_Value = '943';
const Condition_Value = '932';

const Location_Code = 'LT5N';
const Repair_Mode_Code = "03-5121/Door Panel - Replace - 1954x943x2.0 mm (For 8'6'' containers)";
const Comp_Code = 'Roof bow pin';
const Damage_Type = 'WB - Bald';
const Qty = '1';
const Repair_Type = 'AB - Abrasive clean and paint';
const Responsible = 'Owner';
const Estimate_Done_Value = '43';

async function fetchFirstMNRContainerNumber(page: any) {
  const apiBase = 'https://gateappapi.logstarerp.com/MNRIntegration/MNR-container-list?GeoId=1';
  const url = `${apiBase}`;
  
  // Use page.request which uses the same browser context (includes cookies/auth)
  const response = await page.request.get(url);
  
  const status = response.status();
  const text = await response.text();
  
  if (status !== 200) {
    throw new Error(`API status ${status} (expected 200) from ${url}. Response: ${text}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse API response as JSON: ' + e + '\nRaw response: ' + text);
  }
  
  console.log('API Response:', json);
  return json;
}

test('TC004_MNR_Masters_LocationCode', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await clickAndMeasureDynamic(page, '//img[@alt="MNR Logo"]', '//button[normalize-space()="Masters"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Menu Code"]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Menu Code"]', '//button[normalize-space()="Location Code"]', 'Click External Containers button');

  // --- Click New Container ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Location Code"]', '//input[@formcontrolname="Code"]', 'Click + New Container button');

  const comp_code = getRandomNumberString(4);

  // // ----- Component Code Reset -----
  // // Fill fields before reset to verify they are cleared
  // await page.fill('//input[@formcontrolname="Code"]', `ATLC${comp_code}`);
  // await expect(await page.inputValue('//input[@formcontrolname="Code"]')).not.toBe('');

  // await page.fill('//input[@formcontrolname="Name"]', `AUTO LC ${comp_code}`);
  // await expect(await page.inputValue('//input[@formcontrolname="Name"]')).not.toBe('');

  // await page.fill('//input[@formcontrolname="LongName"]', `Auto Location Code ${comp_code}`);
  // await expect(await page.inputValue('//input[@formcontrolname="LongName"]')).not.toBe('');

  // // Click Reset button
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Reset"]', '//input[@formcontrolname="Code"]', 'Click Reset button');

  // // Ensure all fields are empty after reset
  // let codeVal = await page.inputValue('//input[@formcontrolname="Code"]');
  // let nameVal = await page.inputValue('//input[@formcontrolname="Name"]');
  // let longNameVal = await page.inputValue('//input[@formcontrolname="LongName"]');

  // await expect(codeVal).toBe('');
  // await expect(nameVal).toBe('');
  // await expect(longNameVal).toBe('');

  await page.type('//input[@formcontrolname="Code"]', `ATLC${comp_code}`, { delay: 100 });
  await page.locator('//input[@formcontrolname="Name"]').isVisible();
  await page.type('//input[@formcontrolname="Name"]', `AUTO LC ${comp_code}`, { delay: 100 });
  await page.locator('//input[@formcontrolname="LongName"]').isVisible();
  await page.type('//input[@formcontrolname="LongName"]', `Auto Location Code ${comp_code}`, { delay: 100 });
  await page.locator('//app-multi-select-dropdown[@formcontrolname="componentIds"]').isVisible();
  await page.locator('//app-multi-select-dropdown[@formcontrolname="componentIds"]').click();
  await page.locator('input[placeholder="Search select component code"]').fill('ATCC');
  await page.locator('li[class="option-item"]').first().click();
  await page.locator('app-multi-select-dropdown[formcontrolname="repairIds"]').click();
  await page.locator('span[class="option-text"]').first().click();

  // Click Add button (span text)
  await clickAndMeasureDynamic(page, '//button[@class="btn-add"]', '//input[@formcontrolname="Code"]', 'Click Add button');
  await page.waitForTimeout(2000);

  // Assertions for the row just added
  const codeText = await page.textContent(`//tr[.//td[normalize-space()='ATLC${comp_code}']]//a`);
  const nameText = await page.textContent(`//tr[.//td[normalize-space()='ATLC${comp_code}']]//td[2]`);
  const longNameText = await page.textContent(`//tr[.//td[normalize-space()='ATLC${comp_code}']]//td[3]`);
  const statusText = await page.textContent(`//tr[.//td[normalize-space()='ATLC${comp_code}']]//td[4]`);

  await expect(codeText?.trim()).toBe(`ATLC${comp_code}`);
  await expect(nameText?.trim()).toBe(`AUTO LC ${comp_code}`);
  await expect(longNameText?.trim()).toBe(`Auto Location Code ${comp_code}`);
  await expect(statusText?.trim()).toBe('Active');

  // Click the edit icon
  await page.click(`//tr[.//td[normalize-space()='ATLC${comp_code}']]//i[contains(@class,'fa-pen-to-square')]`);

  // Wait for the Inactive/No label/radio (mark inactive)
  await page.click('//label[text()=" No "]');

  // Visibility checks for "Cancel" and "Reset" buttons
  await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
  await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();

  // Click Save
  await clickAndMeasureDynamic(page, '//button//span[normalize-space()="Save"]', '//input[@formcontrolname="Code"]', 'Click Save button');

  // Wait for status update in grid
  await page.waitForSelector(`//tr[.//td[normalize-space()='ATLC${comp_code}']]/td[4]`, { timeout: 60_000 });

  // Validate the status is now "InActive"
  const newStatus = await page.textContent(`//tr[.//td[normalize-space()='ATLC${comp_code}']]/td[4]`);
  await expect(newStatus?.trim()).toBe('InActive');

});

