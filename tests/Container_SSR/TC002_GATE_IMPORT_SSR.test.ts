import { test, expect } from '@playwright/test';
import { login, MOTL, clickAndMeasureDynamic, SwitchModule, SealCuttingSSR, generateVehicleNumber, readTestArtifact, selectEntityAndSite, routeToMicroservice } from '../../utils/test-helpers';
import { Gate_Import } from '../../Flows/ImportFlow';
import { Common } from '../../Locators/BookingLocators';


const SSRGateData = {
  tareWeight: '2500',
  damageDetails: 'No visible damage',
  maxPermissibleWeight: '30000',
  customSeal: '100',
  igmSealNo: 'IGM98765',
  truckRFID: 'RFID0001',
  surveyRemark: 'Condition OK',
  EIRNo: 'EIR20260109',
  portName: 'BPCL',
  portExitPassNo: 'PEP123456',
  portOutDateTime: '2026-01-09T11:10',
  cfsGateInDateTime: '2026-01-09T11:15',
  portTransNo: 'PTN20260109',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Container Operation',
  JobDescription: "19: 1090", //'Seal Cutting  (CO02)';
  // JobDescription: 'Seal Cutting  (CO02)', //'Seal Cutting  (CO02)';
};


test('TC002_GATE_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(120_000); // 2 minutes timeout for this test
  // await login(page);
  await login(page);
  await selectEntityAndSite(page);
  // await Gate_Import(page, SSRGateData, 'SSRImport_BookingNumber.txt', 'SSRImport_BLN_Number.txt', 'SSRImport_ContainerNumber.txt');
  
  // // ================================
  // // Read container number from file
  // // ================================
  
  // const containerNo = readTestArtifact('Container_SSR_ContainerNumber.txt')

  // console.log('Using container number:', containerNo);

  // await clickAndMeasureDynamic(page, '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations');
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Import Container"]', 'Route to Import Container tab');
  // await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Container"]', `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, 'Route to Import Container');

  // console.log(`Container No : ${containerNo}`)

  // await clickAndMeasureDynamic(page, `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`, '//button[normalize-space()="Edit"]', 'Open Import Container details');
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Edit"]', '//label[contains(., "Vehicle No")]/following-sibling::input', 'Route to Edit page');
  // // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

  // // Fill Vehicle No
  // const Vehicle_No = generateVehicleNumber();
  // await page.locator('//div[label[contains(., "Vehicle No")]]//input').fill(Vehicle_No);

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]').click();
  // await page.locator('//div[@class="dropdown-list"]//div[1]').click();

  // // Fill Tare Weight
  // await page.locator("//div[label[contains(., 'Tare Weight')]]//input").fill('2500');

  // // Fill Damage Details
  // await page.locator("//div[label[contains(., 'Damage Details')]]//input").fill('No visible damage');

  // // Fill Max Permissible Weight(Kgs.)
  // await page.locator("//div[label[contains(., 'Max Permissible Weight')]]//input").fill('30000');

  // // Fill Custom / Actual Seal
  // await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

  // // Fill IGM Seal No.
  // await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

  // // Fill Truck RFID No.
  // await page.locator("//div[label[contains(., 'Truck RFID No.')]]//input").fill('RFID0001');

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();

  // // Fill EIR No.
  // await page.locator("//div[label[contains(., 'EIR No.')]]//input").fill('EIR20260109');

  // // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
  // // Fill Port Exit Pass No.

  // await page.locator('//div[text()=" Select Port Name And Threshold Limit "]').click();
  // await page.locator('//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]').fill('BPCL');
  // await page.locator('//div[contains(@class, "dropdown-item")]').first().click();

  // await page.locator("//div[label[contains(., 'Port Exit Pass No.')]]//input").fill('PEP123456');

  // // Fill Port Out Date Time
  // await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

  // // Fill CFS Gate In Date Time
  // await page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:15');

  // // Fill Port Trans No
  // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

  // // Check Scan Status
  // // await page.locator("//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']").check();

  // // Check Is Hold?
  // // await page.locator("//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']").check();

  // // Check Is Weighment?
  // await page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']").uncheck();

  // // Check Semi Low Bed Trailer Required
  // // await page.locator("//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']").check();

  // // Save
  // await page.locator('//button[normalize-space()="Save"]').click();

  // // Validate Button
  // await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

  // //Execute Button
  // await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`, '//a[normalize-space()="Import Container"]', 'Execute Gate In for the container');

  // await SwitchModule(page, 'Customer Service');
  // await routeToMicroservice(page,CSMCommon.CustomerServiceLogo);

  await SealCuttingSSR(page, SSRGateData, 'SSRImport_ContainerNumber.txt');

  // await SwitchModule(page, 'Gate & Weighbridge Operations');
  await routeToMicroservice(page,Common.GateWeighbridgeLogo);

}
)
