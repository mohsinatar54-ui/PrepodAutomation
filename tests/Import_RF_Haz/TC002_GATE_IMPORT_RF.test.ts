// import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact } from '../../utils/test-helpers';

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


// test('Gate_Operations_Import_RF', async ({ page }) => {
//   test.setTimeout(120_000); // 2 minutes timeout for this test

//   // Login
//   await login(page);

//   // ==================================
//   // Read container number from file
//   // ================================
//   const containerNo = await readTestArtifact('Import_Container_RF_Haz.txt')

//   console.log('Using container number:', containerNo);

//   //Navigate to Gate Ops Module to check & update Hazard Alert configuration
//   await clickAndMeasureDynamic(page, '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]', '//button[normalize-space()="Masters"]', 'Route to Gate & Weighbridge Operations');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Site Configuration"]', 'Route to Site Configuration');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Site Configuration"]', '//label[normalize-space()="Hazard alert"]', 'Route to Hazard Alert configuration');


//   const hazardCheckbox = page.locator('//input[@id="isHazAlert"]');
//   // const hazardMessageInput = page.locator('#hazAlertMessage');

//   await expect(hazardCheckbox).toBeVisible();

//   await page.locator('//input[@id="isHazAlert"]').check();

//   const hazardMessage = await page.locator('#hazAlertMessage').inputValue();
//   console.log(hazardMessage);
//   // Output: "⚠ Warning: Hazardous Cargo. Do Not Open the Door ⚠"

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Site Configuration"]', 'Save Hazard Alert configuration');

//   await expect(hazardCheckbox).toBeVisible();

//   await expect(hazardCheckbox).toBeChecked();


//   // Navigate to Import Container Gate Operations and fill details for the container
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Import Container"]', 'Route to Import Container tab');
//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Container"]', `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, 'Route to Import Container');

//   console.log(`Container No : ${containerNo}`)

//   await clickAndMeasureDynamic(page, `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, '//button[normalize-space()="Edit"]', 'Open Import Container details');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Edit"]', '//label[contains(., "Vehicle No")]/following-sibling::input', 'Route to Edit page');
//   // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

//   // Fill Vehicle No
//   const Vehicle_No = generateVehicleNumber();
//   await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
//   await page.locator('//div[@class="dropdown-list"]//div[1]').click();

//   // Fill Tare Weight
//   await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');

//   // Fill Damage Details
//   await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');

//   // Fill Max Permissible Weight(Kgs.)
//   await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');

//   // Fill Custom / Actual Seal
//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

//   // Fill IGM Seal No.
//   await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

//   // Fill Truck RFID No.
//   await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

//   await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

//   // Fill EIR No.
//   await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

//   // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
//   // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
//   // Fill Port Exit Pass No.

//   await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
//   await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
//   await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

//   await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

//   // Fill Port Out Date Time
//   await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

//   // Fill CFS Gate In Date Time
//   await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:15');

//   // Fill Port Trans No
//   await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

//   // Check Scan Status
//   // await page.locator("//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']").check();

//   // Check Is Hold?
//   // await page.locator("//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']").check();

//   // Check Is Weighment?
//   await page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']").uncheck();

//   // Check Semi Low Bed Trailer Required
//   // await page.locator("//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']").check();

//   // Save the filled details
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

//   // The popup check will look something like this:
//   await expect(page.locator('POPUP_SELECTOR')).toBeVisible();
//   await expect(page.locator('POPUP_SELECTOR')).toContainText(
//     `${hazardMessage}`
//   );

//   // Step 5 - Click OK to dismiss
//   await page.locator('OK_BUTTON_SELECTOR').click();
//   //Execute Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);

//   //await page.pause();

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


//=========================
//NEW
//=========================


import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, readTestArtifact } from '../../utils/test-helpers';

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `MH46${randomLetters}${randomDigits}`;
}

const surveyRemark = 'Condition OK';

test('Gate_Operations_Import_RF', async ({ page }) => {
  test.setTimeout(120_000);

  // =========================
  // STEP 1: Login
  // =========================
  await test.step('Login to application', async () => {
    await login(page);
  });

  // =========================
  // STEP 2: Read Test Data
  // =========================
  const containerNo = await test.step('Read container number from artifact', async () => {
    const container = await readTestArtifact('Import_Container_RF_Haz.txt');
    console.log('Using container number:', container);
    return container;
  });

  let hazardMessage = '';

  // =========================
  // STEP 3: Configure Hazard Alert
  // =========================
  await test.step('Enable and validate Hazard Alert configuration', async () => {

    await clickAndMeasureDynamic(page,
      '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]',
      '//button[normalize-space()="Masters"]',
      'Route to Gate & Weighbridge Operations'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Masters"]',
      '//button[normalize-space()="Site Configuration"]',
      'Route to Site Configuration'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Site Configuration"]',
      '//label[normalize-space()="Hazard alert"]',
      'Route to Hazard Alert configuration'
    );

    const hazardCheckbox = page.locator('#isHazAlert');

    await expect(hazardCheckbox).toBeVisible();

    // Only check if enabled
    if (await hazardCheckbox.isEnabled()) {
      await hazardCheckbox.check();
    }

    await expect(hazardCheckbox).toBeChecked();

    hazardMessage = await page.locator('#hazAlertMessage').inputValue();
    console.log('Hazard Message:', hazardMessage);

    await expect(hazardMessage).toContain('Hazardous');

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Update"]',
      '//button[normalize-space()="Site Configuration"]',
      'Save Hazard Alert configuration'
    );
  });

  let Vehicle_No = '';

  // =========================
  // STEP 4: Fill Import Container Details
  // =========================
  await test.step('Fill Import Container details', async () => {

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Standard Services"]',
      '//a[normalize-space()="Import Container"]',
      'Route to Import Container tab'
    );

    await clickAndMeasureDynamic(page,
      '//a[normalize-space()="Import Container"]',
      `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,
      'Open container record'
    );

    await clickAndMeasureDynamic(page,
      `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,
      '//button[normalize-space()="Edit"]',
      'Open Edit screen'
    );

    Vehicle_No = generateVehicleNumber();

    await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

    await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
    await page.locator('//div[@class="dropdown-list"]//div[1]').click();

    await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');
    await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');
    await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');
    await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');
    await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');
    await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

    await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
    await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

    await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

    await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
    await page.locator('//app-searchable-dropdown//input').fill('BPCL');
    await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

    await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');
    await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input").fill('2026-01-09T11:10');
    await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input").fill('2026-01-09T11:15');
    await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

    await page.locator("//div[label[contains(., 'Is Weighment?')]]//input").uncheck();

    await page.locator('//button[normalize-space()="Save"]').click();
  });

  // =========================
  // STEP 5: Validate Hazard Popup
  // =========================
  await test.step('Validate Hazard Alert popup on Validate action', async () => {

    await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

    const popup = page.locator('POPUP_SELECTOR');

    await expect(popup).toBeVisible();
    await expect(popup).toContainText(hazardMessage);

    await page.locator('OK_BUTTON_SELECTOR').click();
  });

  // =========================
  // STEP 6: Execute Operation
  // =========================
  await test.step('Execute container operation', async () => {
    await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);
  });

});