// import { test, expect } from '@playwright/test';
// import { login, clickAndMeasureDynamic, generateVehicleNumber, readTestArtifact, writeTestArtifact } from '../../utils/test-helpers';
// import fs from 'fs';


// const surveyRemark = 'Automation Test Check for Depot Estimate';
// const Vehicle_No = generateVehicleNumber();

// test('TC001_GWB_EmptyBooking', async ({ page }) => {
//   test.setTimeout(120_000); // 2 minutes timeout for this test
//   await login(page);
//   await clickAndMeasureDynamic(page, '(//img[@alt="Gate Operations Logo"])[1]', '//button[normalize-space()="Standard Service"]', 'Route to Gate Operations');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Service"]', '//a[normalize-space()="Empty Container"]', 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Empty Container"]', '//input[contains(@placeholder, "Search by container no.")]', 'Route to Empty Container screen');

//   const containerNo = await readTestArtifact('EmptyIn_Container_MNR.txt')

//   console.log('Using container number:', containerNo);


//   await page.locator('//input[contains(@placeholder, "Search by container no.")]').fill(containerNo);
//   await page.locator(`//button[normalize-space()="Search"]`).click();

//   await clickAndMeasureDynamic(page, `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, '//button[normalize-space()="Edit"]', 'Open Import Container details');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Edit"]', '//label[contains(., "Vehicle No")]/following-sibling::input', 'Route to Edit page');

//   // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

//   // Fill Vehicle No
//   await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
//   await page.locator('//div[@class="dropdown-list"]//div[1]').click();

//   // Fill Tare Weight
//   await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');

//   // Fill Survey Remark
//   await page.locator('//label[normalize-space()="Container Survey Remark"]/following::input[1]').fill(surveyRemark);

//   writeTestArtifact('Depot_Estimate_SurveyRemark.txt', surveyRemark);

//   // Fill Damage Details
//   await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('visible damage');

//   // Fill Max Permissible Weight(Kgs.)
//   await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');

//   // Fill Custom / Actual Seal
//   // await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

//   // await page.pause();

//   // Fill IGM Seal No.
//   // await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

//   // Fill Truck RFID No.
//   await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

//   // Fill EIR No.
//   await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

//   // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
//   // Fill Port Exit Pass No.
//   await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

//   // Fill Port Out Date Time
//   await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

//   // Fill CFS Gate In Date Time
//   await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:15');


//   await page.locator('//div[normalize-space()="Select Condition Code"]').click();
//   await page.locator('//app-searchable-dropdown//input[@placeholder="Select Condition Code"]').fill('Damage');
//   await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

//   await page.locator('//div[normalize-space()="Select Port Name And Threshold Limit"]').click();
//   await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
//   await page.locator('//div[contains(@class, "dropdown-item")]').first().click();


//   // Fill Port Trans No
//   // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

//   // Check Scan Status
//   // await page.locator("//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']").check();

//   // Check Is Hold?
//   // await page.locator("//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']").check();

//   // Check Is Weighment?
//   // await page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']").uncheck();

//   // Check Semi Low Bed Trailer Required
//   // await page.locator("//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']").check();

//   // Save
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

//   //Execute Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);

//   await page.pause();

//   // Toggle (Gate In/Out)
//   // await page.locator('input[type="checkbox"]').first();
//   // await page.locator('label input[type="checkbox"]').check();

//   // Validate Button
//   // await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

//   //Execute Button
//   // await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);

//   // await page.pause();

// }
// )


import { test, expect } from '@playwright/test';
import {
  login,
  clickAndMeasureDynamic,
  generateVehicleNumber,
  readTestArtifact,
  writeTestArtifact
} from '../../utils/test-helpers';

const surveyRemark = 'Automation Test Check for Depot Estimate';
const conditionRemark = 'Condition Damage';

test('TC001_GWB_EmptyBooking', async ({ page }) => {
  test.setTimeout(120_000);

  const Vehicle_No = generateVehicleNumber();
  let containerNo = '';

  // =========================
  // STEP 1: Login
  // =========================
  await test.step('Login to application', async () => {
    await login(page);
  });

  // =========================
  // STEP 2: Navigate to Empty Container
  // =========================
  await test.step('Navigate to Empty Container screen', async () => {
    await clickAndMeasureDynamic(
      page,
      '(//img[@alt="Gate Operations Logo"])[1]',
      '//button[normalize-space()="Standard Services"]',
      'Route to Gate Operations'
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Standard Services"]',
      '//a[normalize-space()="Empty Container"]',
      'Route to Empty Container tab'
    );

    await clickAndMeasureDynamic(
      page,
      '//a[normalize-space()="Empty Container"]',
      '//input[contains(@placeholder, "Search by container no.")]',
      'Route to Empty Container screen'
    );
  });

  // =========================
  // STEP 3: Fetch Container
  // =========================
  await test.step('Fetch container from artifact and search', async () => {
    containerNo = await readTestArtifact('EmptyIn_Container_MNR.txt');

    console.log('Using container number:', containerNo);

    await page.locator('//input[contains(@placeholder, "Search by container no.")]')
      .fill(containerNo);

    await page.locator('//button[normalize-space()="Search"]').click();

    await clickAndMeasureDynamic(
      page,
      `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,
      '//button[normalize-space()="Edit"]',
      'Open container record'
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Edit"]',
      '//div[label[contains(., "Vehicle No")]]//input',
      'Open Edit screen'
    );
  });

  // =========================
  // STEP 4: Fill Container Details
  // =========================
  await test.step('Fill container details form', async () => {

    // Vehicle
    await page.locator('//div[label[contains(., "Vehicle No")]]//input')
      .fill(Vehicle_No);

    // Transport
    await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
    await page.locator('//div[@class="dropdown-list"]//div[1]').click();

    // Basic fields
    await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');
    await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('visible damage');
    await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');
    await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

    // Survey Remark
    await page.locator('//label[normalize-space()="Container Survey Remark"]/following::input[1]')
      .fill(surveyRemark);

    writeTestArtifact('Depot_Estimate_SurveyRemark.txt', surveyRemark);

    await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
    await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${conditionRemark}"]`).click();

    // Other fields
    await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');
    await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

    await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input")
      .fill('2026-01-09T11:10');

    await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input")
      .fill('2026-01-09T11:15');

    // Condition Code
    await page.locator('//div[normalize-space()="Select Condition Code"]').first().click();
    await page.locator('//app-searchable-dropdown//input[@placeholder="Select Condition Code"]').first().fill('Damage');
    await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

    // Port
    await page.locator('//div[normalize-space()="Select Port Name And Threshold Limit"]').first().click();
    await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').first().  fill('BPCL');
    await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

    // Save

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Save"]',
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
      'Wait for save to complete'
    );
  });

  // ===============================
  // STEP 5: Validate Record Actions
  // ===============================
  await test.step('Validate and Execute container', async () => {

    const validateBtn = page.locator(
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`
    );

    await expect(validateBtn).toBeVisible();

    await validateBtn.click();

    const executeBtn = page.locator(
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`
    );

    await expect(executeBtn).toBeVisible();

    await executeBtn.click();
  });

});