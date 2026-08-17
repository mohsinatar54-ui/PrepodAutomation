import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, SwitchModule, login, MOTL, readTestArtifact, routeToMicroservice } from '../../utils/test-helpers';
import fs from 'fs';

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
const surveyRemark = 'Condition OK';

// const containerFilePath =
//   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Import_Container_Number.txt';


test('TC002_Gate_Import_MOTL', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);

  // // ================================
  //   // Read container number from file
  //   // ================================
  //   if (!fs.existsSync(containerFilePath)) {
  //     throw new Error(`Container number file not found at: ${containerFilePath}`);
  //   }

  //   const containerNo = fs.readFileSync(containerFilePath, 'utf-8').trim();

  //   if (!containerNo) {
  //     throw new Error('Container number file is empty');
  //   }

  //   console.log('Using container number:', containerNo);

  const containerNo = await readTestArtifact('MOTL_Container.txt')

  await clickAndMeasureDynamic(page, '(//img[@alt="Gate Operations Logo"])[1]', '//button[normalize-space()="Standard Services"]', 'Route to Gate Operations');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Import Container"]', 'Route to Import Container tab');
  await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Container"]', `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, 'Route to Import Container');

  console.log(`Container No : ${containerNo}`)

  await clickAndMeasureDynamic(page, `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, '//button[normalize-space()="Edit"]', 'Open Import Container details');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Edit"]', '//label[contains(., "Vehicle No")]/following-sibling::input', 'Route to Edit page');
  // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

  // Fill Vehicle No
  const Vehicle_No = generateVehicleNumber();
  await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

  await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
  await page.locator('//div[@class="dropdown-list"]//div[1]').click();

  // Fill Tare Weight
  await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');

  // Fill Damage Details
  await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');

  // Fill Max Permissible Weight(Kgs.)
  await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');

  // Fill Custom / Actual Seal
  await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

  // Fill IGM Seal No.
  await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

  // Fill Truck RFID No.
  await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

  await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

  // Fill EIR No.
  await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
  // Fill Port Exit Pass No.

  await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
  await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
  await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

  await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

  // Fill Port Out Date Time
  await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

  // Fill CFS Gate In Date Time
  await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:15');

  // Fill Port Trans No
  await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

  // Check Scan Status
  // await page.locator("//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']").check();

  // Check Is Hold?
  // await page.locator("//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']").check();

  // Check Is Weighment?
  await page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']").uncheck();

  // Check Semi Low Bed Trailer Required
  // await page.locator("//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']").check();

  // Save
  await page.locator('//button[normalize-space()="Save"]').click();

  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

  //Execute Button
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`, '//a[normalize-space()="Import Container"]', 'Execute Button');

  await routeToMicroservice(page, 'Yard Operations Logo');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Yard Rule Config"]', 'Route to Masters');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Rule Config"]', '//label[normalize-space()="AutoPlan For Yard Position"]', 'Route to Yard Rule Config');

  await page.locator('//h2[normalize-space()="Yard Rule Configuration"]').click();

  console.log('Using container number:', containerNo);

  const autoPlanEnabled = await page
    .locator('//input[@id="isAutoPlan"]')
    .isChecked();

  console.log('AutoPlan enabled:', autoPlanEnabled);

  if (!autoPlanEnabled) {
    console.log('AutoPlan disabled → running Yard Planner');

    // ====================
    // YARD PLANNER PATCH
    // ====================

    await clickAndMeasureDynamic(
      page,
      `//button[normalize-space()="Yard Planner"]`,
      '//input[@formcontrolname="search"]',
      'Open Yard Planner'
    );

    await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

    await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

    await clickAndMeasureDynamic(
      page,
      `(//td//a[normalize-space()='${containerNo}'])[1]`,
      '//p[text()="Planned Container No"]/following-sibling::p',
      'Click container'
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Plan"]',
      `//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`,
      'Open planner'
    );

    await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="StackTypeID"]`,
      '(//div[contains(@class, "option-item")])[1]',
      'Click Stack Type LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `(//div[contains(@class, "option-item")])[1]`,
      '//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]',
      'Select Stack Type'
    );


    await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`,
      `(//div[contains(@class, "option-item")])[1]`,
      'Click Planned Stack Name LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `(//div[contains(@class, "option-item")])[1]`,
      '//button[normalize-space()="Auto Plan Position"]',
      'Select Planned Stack Name'
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Auto Plan Position"]',
      `(//input[@name="selectedPlan"])[1]`,
      'Open Auto Plan List'
    );

    await clickAndMeasureDynamic(
      page,
      `(//input[@name="selectedPlan"])[1]`,
      '//button//span[normalize-space()="Select"]',
      'Select first position'
    );

    await clickAndMeasureDynamic(
      page,
      '//button//span[normalize-space()="Select"]',
      `//button[normalize-space()="Submit"]`,
      'Wait for planning to complete'
    );

    await clickAndMeasureDynamic(
      page,
      `//button[normalize-space()="Submit"]`,
      `//button[normalize-space()="Yard Execution"]`,
      'Return to planner main screen'
    );

  }
  else {
    console.log('AutoPlan enabled → skipping Yard Planner');
  }


  // ====================
  // YARD EXECUTION PATCH
  // ====================

  await clickAndMeasureDynamic(
    page,
    `//button[normalize-space()="Yard Execution"]`,
    '//div[normalize-space()="Gate"]',
    'Open Yard Execution'
  );

  await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

  await clickAndMeasureDynamic(
    page,
    `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`,
    '//button[normalize-space()="Execute"]',
    'Execute move'
  );

  await page.locator(`//app-custom-dropdown[@formcontrolname="CraneID"]`).click();
  await page.locator(`(//div[contains(@class,"option-item")])[1]`).click();

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Execute"]',
    '//input[@formcontrolname="search"]',
    'Confirm execution'
  );


  await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');

  await routeToMicroservice(page, 'Customer Service Logo');

  await MOTL(page);

  await routeToMicroservice(page, 'Gate Operations Logo');


  await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Import Container"]', 'Route to Import Container tab');
  await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Container"]', `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, 'Route to Import Container');

  console.log(`Container No : ${containerNo}`)

  await clickAndMeasureDynamic(page, `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, '//button[normalize-space()="Edit"]', 'Open Import Container details');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Edit"]', '//label[contains(., "Vehicle No")]/following-sibling::input', 'Route to Edit page');
  // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

  // Fill Vehicle No
  const BareTruckIn = generateVehicleNumber();
  await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(BareTruckIn);

  await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
  await page.locator('//div[@class="dropdown-list"]//div[1]').click();

  // Fill Tare Weight
  await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('250000');

  // Fill Damage Details
  await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');

  // Fill Max Permissible Weight(Kgs.)
  await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('300000');

  // Fill Custom / Actual Seal
  await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

  // Fill IGM Seal No.
  await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

  // Fill Truck RFID No.
  await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

  await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

  // Fill EIR No.
  await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
  // Fill Port Exit Pass No.

  // await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();  
  // await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
  // await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

  await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

  // Fill Port Out Date Time
  // await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

  // Fill CFS Gate In Date Time
  // await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:15');

  // Fill Port Trans No
  await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

  // Check Scan Status
  // await page.locator("//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']").check();

  // Check Is Hold?
  // await page.locator("//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']").check();

  // Check Is Weighment?
  await page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']").uncheck();

  // Check Semi Low Bed Trailer Required
  // await page.locator("//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']").check();

  // Save
  await page.locator('//button[normalize-space()="Save"]').click();

  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Validate"]`);

  //Execute Button
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Execute"]`, '//a[normalize-space()="Import Container"]', 'Execute Button');


  await routeToMicroservice(page, 'Yard Operations Logo');

  await clickAndMeasureDynamic(page, `//button[normalize-space()="Yard Execution"]`, '//div[normalize-space()="Gate"]', 'Open Yard Execution - Gate tab');

  await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

  await expect(page.locator(`(//td/a[normalize-space()='${containerNo}'])[1]`)).toBeVisible();

  await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`, '//button[normalize-space()="Execute"]', 'Click on container number in Yard Execution');

  await page.locator(`//app-custom-dropdown[@formcontrolname="CraneID"]`).click();
  await page.locator(`(//div[contains(@class,"option-item")])[1]`).click();

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', '//input[@formcontrolname="search"]', 'Execute the planned move');

  // await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');

  routeToMicroservice(page, 'Gate Operations Logo');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Import Container"]', 'Route to Import Container tab');
  await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Container"]', '//span[normalize-space()="Gate In"]/following-sibling::label', 'Route to Import Container');

  // Toggle (Gate In/Out)
  const gateToggleLabel = page.locator(
    '//span[normalize-space()="Gate In"]/following-sibling::label'
  );

  await gateToggleLabel.click();

  await page.locator('//input[contains(@placeholder, "Search by container no")]').fill(containerNo);
  await page.locator(`//button[normalize-space()="Search"]`).click();

  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Validate"]`);

  //Execute Button
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${BareTruckIn}"]]//button[normalize-space()="Execute"]`, '//span[contains(text(), "Execution successful")]', 'Execute Button');


}
)
