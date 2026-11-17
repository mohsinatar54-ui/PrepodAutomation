import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';
import { Master } from 'Locators/All locators/VBSMasters';


test('TC002_VBS_Masters_DepotMaster', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes

  await test.step('Login and select entity/site', async () => {
    await login(page);
    await selectEntityAndSite(page);    
  });

  await test.step('Navigate to VBS Microservice and select Truck', async () => {
    // await clickAndMeasureDynamic(page, Master.VBS_Microservice, Master.MastersTab, 'Click VBS tile');
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.DayOffTab, 'Click Vehicle Masters');
  });

  await test.step('Verify table headers', async () => {
    // await expect(page.locator('table thead')).toContainText('Site Name');
    // await expect(page.locator('table thead')).toContainText('Site Code');
    // await expect(page.locator('table thead')).toContainText('Maximum Appointment');
    // await expect(page.locator('table thead')).toContainText('Pickup Appointment');
    // await expect(page.locator('table thead')).toContainText('Dropoff Appointment');
    // await expect(page.locator('table thead')).toContainText('Action');
  //   await expect(page.locator('thead tr')).toHaveText([
  // 'Site name',
  // 'Site code',
  // 'Max appointments',
  // 'Pickup appointments',
  // 'Dropoff appointments',
  // 'Appointment approval required',
  // 'Pre Gate Charges',
  // 'Caa file',
  // 'Action'
  // ]);
 
    const headers = await page.locator('thead tr th').evaluateAll(
      elements => elements.map(el => el.textContent?.trim())
    );

    expect(headers).toEqual([
      'Site Name',
      'Site Code',
      'Max Appointments',
      'Pickup Appointments',
      'Dropoff Appointments',
      'Appointment approval required',
      'Pre Gate Charges',
      'CAA file',
      'Action'
    ]);
  });
  await test.step('Edit depot values', async () => {
    // await expect(page.locator('//i[following-sibling::span[normalize-space()="Edit"]]')).toBeEnabled();
    await clickAndMeasureDynamic(page, '//div[@class="relative inline-block group"]', '//span[normalize-space()="Save Action"]/preceding-sibling::i', 'Click Edit button');
    // await clickAndMeasureDynamic(page, '//span[normalize-space()="Cancel Action"]/preceding-sibling::i', '//button[normalize-space()="Yes"]', 'Click Save button');
    // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Cancel"]]', '//div[@class="relative inline-block group"]', 'Click Save button');
    // await expect(page.locator('//button[normalize-space()="No"]')).toBeVisible();
    // await clickAndMeasureDynamic(page, '//button[normalize-space()="Yes"]', '//i[following-sibling::span[normalize-space()="Edit"]]', 'Click No button');
    // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Edit"]]', '//span[normalize-space()="Save Action"]/preceding-sibling::i', 'Click Edit button');
    await page.locator('(//td//input)[1]').clear();  

    await page.locator('(//td//input)[1]').fill('1000');
    await page.locator('(//td//input)[2]').clear();  
    await page.locator('(//td//input)[2]').fill('500');
    await page.locator('(//td//input)[3]').clear();  
    await page.locator('(//td//input)[3]').fill('500');
    // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Save"]]', '//button[normalize-space()="Save"]', 'Click Save button');
    // await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
    await clickAndMeasureDynamic(page, '//span[normalize-space()="Save Action"]/preceding-sibling::i', '//span[text()="Depot updated successfully"]', 'Click Yes button');
    // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Save"]]', '//span[text()="Depot updated successfully"]', 'Click Yes button');
    await expect(page.locator('//div[@class="relative inline-block group"]')).toBeVisible();
  });

  await test.step('Close page and log success', async () => {
    page.close();
    console.log('Browser closed successfully');
    console.log('TC002_VBS_Masters_DepotMaster completed successfully');
  });

});
