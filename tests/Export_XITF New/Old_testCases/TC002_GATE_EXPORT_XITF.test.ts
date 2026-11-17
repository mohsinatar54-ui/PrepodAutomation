// import { test, expect } from '@playwright/test';
// import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule, XOTP } from '../../../utils/test-helpers';
// import fs from 'fs';

// function generateVehicleNumber(): string {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   const randomLetters =
//     letters[Math.floor(Math.random() * 26)] +
//     letters[Math.floor(Math.random() * 26)];

//   const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

//   return `MH46${randomLetters}${randomDigits}`;
// }
// const surveyRemark = 'Condition OK';

// // Container number artifact file

// test('TC002 GATE EXPORT XITF', async ({ page }) => {
//   test.setTimeout(120_000); // 2 minutes

//   await login(page);

//   // ================================
//   // Read container number from file
//   // ================================
//   const containerNo = await readTestArtifact('XITF_Container.txt')

//   console.log('Using container number:', containerNo);

//   // ================================
//   // Navigationawait page.pause();
//   // ================================
//   await clickAndMeasureDynamic(
//     page,
//     '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]',
//     '//button[normalize-space()="Standard Services"]',
//     'Route to Gate & Weighbridge Operations'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Standard Services"]',
//     '//a[normalize-space()="Export Container"]',
//     'Route to Container tab'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//a[normalize-space()="Export Container"]',
//     `//tr[td[normalize-space()="${containerNo}"]]//a[normalize-space()="TBA"]`,
//     'Route to Export Container tab'
//   );

//   // ================================
//   // Open container details
//   // ================================
//   await clickAndMeasureDynamic(
//     page,
//     `//tr[td[normalize-space()="${containerNo}"]]//a[normalize-space()="TBA"]`,
//     '//button[normalize-space()="Edit"]',
//     'Open Export Container details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Edit"]',
//     '//label[contains(., "Vehicle No")]/following-sibling::input',
//     'Route to Edit page'
//   );

//   // ================================
//   // Fill form fields
//   // ================================
//   const Vehicle_No = generateVehicleNumber();
//   await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
//   await page.locator('//div[@class="dropdown-list"]//div[1]').click();

//   await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');
//   await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');
//   await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');
//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

//   // await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');
  
//   await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

//   await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');
//   await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

//   await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
//   await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
//   await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

//   await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

//   await page
//     .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']")
//     .fill('2026-01-09T11:15');

//   // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

//   // Is Weighment?
//   await page
//     .locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']")
//     .uncheck();

//   // ================================
//   // Save, Validate, Execute
//   // ================================
  
//   await page.locator('//button[normalize-space()="Save"]').click();

//   await page.click(
//     `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`
//   );

//   await clickAndMeasureDynamic(
//     page, `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,'//button[normalize-space()="Standard Services"]', "Execute Gate Ops for XITF In"
//   );


//   SwitchModule(page, 'Customer Service');

//   await XOTP(page);

//   SwitchModule(page, 'Gate & Weighbridge Operations');

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Standard Services"]',
//     '//a[normalize-space()="Export Container"]',
//     'Route to Container tab'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//a[normalize-space()="Export Container"]',
//     `//tr[td[normalize-space()="${containerNo}"]]//a[normalize-space()="TBA"]`,
//     'Route to Export Container tab'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     `//tr[td[normalize-space()="${containerNo}"]]//a[normalize-space()="TBA"]`,
//     '//button[normalize-space()="Edit"]',
//     'Open Export Container details'
//   );

//   // ================================
//   // Fill form fields
//   // ================================

//   const BareTruckIn = generateVehicleNumber();
//   await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(BareTruckIn);

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
//   await page.locator('//div[@class="dropdown-list"]//div[1]').click();

//   await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');
//   await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');
//   await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');
//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

//   // await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');
  
//   await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

//   await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');
//   await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

//   await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
//   await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
//   await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

//   await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

//   await page
//     .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']")
//     .fill('2026-01-09T11:15');

//   // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

//   // Is Weighment?
//   await page
//     .locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']")
//     .uncheck();

//   // ================================
//   // Save, Validate, Execute
//   // ================================
  
//   await page.locator('//button[normalize-space()="Save"]').click();

//   await page.click(
//     `//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Validate"]`
//   );

//   await clickAndMeasureDynamic(
//     page, `//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Execute"]`,'//button[normalize-space()="Standard Services"', "Execute Gate Ops for XITF In"
//   );



//   //await page.pause();
// });
