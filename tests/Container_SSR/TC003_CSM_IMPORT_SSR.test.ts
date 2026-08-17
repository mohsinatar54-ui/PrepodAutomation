
import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact } from '../../utils/test-helpers';
import { Common } from '../../Locators/BookingLocators';
const Remarks = 'Test remark for Seal Cutting';


test('TC003_CSM_IMPORT_SSR', async ({ page }) => {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
  await login(page);

  const containerNo = await readTestArtifact('SSRImport_ContainerNumber.txt')
  const blnNumber = await readTestArtifact('SSRImport_BLN_Number.txt')
  
  console.log('Using container number:', containerNo);
  console.log('Using BL number:', blnNumber);
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.SSRTab, 'Route to Customer Service');
  await clickAndMeasureDynamic(page, Common.SSRTab, Common.Search, 'Route to SSR Screen');

  await page.locator(Common.blnNumberSearch).fill(blnNumber)

  // await page.locator('//a[@class="booking-link"]').first().click();
  // await page.locator(`//a[normalize-space()="${containerNo}"]`).click();
  await page.locator(`//tr[.//td[normalize-space()='${blnNumber}']]//span[@nztype='plus']`).click();
  await page.locator(`//a[normalize-space()="${containerNo}"]`).click();

  await page.locator(`//div[normalize-space(text())='Job Remark']//following::textarea[1]`).fill(Remarks);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Execute"]', 'Update Job');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', Common.Search, 'Execute Job');


  // await page.locator('input[formcontrolname="ContainerNo"]').fill(containerNo)
  // await page.locator('//button[normalize-space()="Search"]').click();

  // await page.locator(Common.Search).fill(containerNo)
  // await page.locator('//a[@class="booking-link"]').first().click();
  // await page.locator(`//a[normalize-space()="${containerNo}"]`).click();

  // await page.locator('//label[normalize-space()="Job Remark*"]/following::textarea[1]').fill(Remarks);

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Execute"]', 'Update Job');
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', 'input[formcontrolname="ContainerNo"]', 'Execute Job');

});