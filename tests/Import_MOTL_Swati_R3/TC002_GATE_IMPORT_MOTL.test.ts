import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, SwitchModule, login, MOTL, readTestArtifact, routeToMicroservice } from '../../utils/test-helpers';
import fs from 'fs';
import { GateImport } from '../../Locators/GateImport';
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
  await test.step('Step 1: Login to CSM Application', async () => {
    await login(page);
  });
  await test.step('Step 2:Nevigate on Gate import page to GateIn Container', async () => {
    // ================================
    //   Read container number from file
    //  ================================
    //   if (!fs.existsSync(containerFilePath)) {
    //     throw new Error(`Container number file not found at: ${containerFilePath}`);
    //   }  
    //   const containerNo = fs.readFileSync(containerFilePath, 'utf-8').trim();
    //   if (!containerNo) {
    //     throw new Error('Container number file is empty');
    //   }
    //   console.log('Using container number:', containerNo);
    const containerNo = readTestArtifact('MOTL_Container.txt')
    await clickAndMeasureDynamic(page, GateImport.Logo, GateImport.Service, 'Route to Gate Operations');
    await clickAndMeasureDynamic(page, GateImport.Service, GateImport.Import, 'Route to Import Container tab');
    await clickAndMeasureDynamic(page, GateImport.Import, GateImport.ImContainer(containerNo), 'Route to Import Container');
    console.log(`Container No : ${containerNo}`);
  });

  await test.step('Step 3: Edit Selected cotainer with valid data to Gate_Import', async () => {
    const containerNo = readTestArtifact('MOTL_Container.txt')
    await clickAndMeasureDynamic(page, GateImport.ImContainer(containerNo), GateImport.Edit, 'Open Import Container details');
    await clickAndMeasureDynamic(page, GateImport.Edit, GateImport.VehicleNo, 'Route to Edit page');
    // await page.locator(GateImport.VehicleNo).fill(Vehicle_No);
    // Fill Vehicle No
    const Vehicle_No = generateVehicleNumber();
    await page.locator(GateImport.VehicleNo).fill(Vehicle_No);
    await page.locator(GateImport.Transport).click();
    await page.locator(GateImport.List).click();
    // Fill Tare Weight
    await page.locator(GateImport.TareWeight).fill('2500');
    // Fill Damage Details
    await page.locator(GateImport.Damage).fill('No visible damage');
    // Fill Max Permissible Weight(Kgs.)
    await page.locator(GateImport.MaxWeight).fill('30000');
    // Fill Custom / Actual Seal
    await page.locator(GateImport.Seal).fill('100');
    // Fill IGM Seal No.
    await page.locator(GateImport.IGMSeal).fill('IGM98765');
    // Fill Truck RFID No.
    await page.locator(GateImport.TruckRFID).fill('RFID0001');
    await page.locator(GateImport.Remark).click();
    await page.locator(GateImport.SelectRemark(surveyRemark)).click();
    // Fill EIR No.
    await page.locator(GateImport.EIRNo).fill('EIR20260109');
    // await page.locator(GateImport.Remark).click();
    // await page.locator(GateImport.SelectRemark(surveyRemark)).click();
    // Fill Port Exit Pass No.
    await page.locator(GateImport.Port).click();
    await page.locator(GateImport.PortList).fill('BPCL');
    await page.locator(GateImport.ListClick).first().click();
    await page.locator(GateImport.PExit).fill('PEP123456');
    // Fill Port Out Date Time
    await page.locator(GateImport.OutDate).fill('2026-01-09T11:10');
    // Fill CFS Gate In Date Time
    await page.locator(GateImport.InDate).fill('2026-01-09T11:15');
    // Fill Port Trans No
    await page.locator(GateImport.TransNo).fill('PTN20260109');
    // Check Scan Status
    // await page.locator(GateImport.Scan).check();
    // Check Is Hold?
    // await page.locator(GateImport.Hold).check();
    // Check Is Weighment?
    await page.locator(GateImport.Weightment).uncheck();
    // Check Semi Low Bed Trailer Required
    // await page.locator(GateImport.Trailer).check();
    // Save
    await page.locator(GateImport.Save).click();
  });

  await test.step('Step 4: Update import container details to validate and Execute container for GateOut', async () => {
    const Vehicle_No = generateVehicleNumber();
    const containerNo = readTestArtifact('MOTL_Container.txt')
    // Validate Button
    await page.click(GateImport.Validate(Vehicle_No));
    //Execute Button
    await clickAndMeasureDynamic(page, GateImport.Execute(Vehicle_No), GateImport.Container, 'Execute Button');
    await routeToMicroservice(page, 'Customer Service Logo');
    await MOTL(page);
    await routeToMicroservice(page, 'Gate & Weighbridge Operations Logo');
    await clickAndMeasureDynamic(page, GateImport.Service, GateImport.Import, 'Route to Import Container tab');
    await clickAndMeasureDynamic(page, GateImport.Import, GateImport.ImContainer(containerNo), 'Route to Import Container');
    console.log(`Container No : ${containerNo}`)
    await clickAndMeasureDynamic(page, GateImport.ImContainer(containerNo), GateImport.Edit, 'Open Import Container details');
    await clickAndMeasureDynamic(page, GateImport.Edit, GateImport.VehicleNo, 'Route to Edit page');
    // await page.locator(GateImport.VehicleNo).fill(Vehicle_No);
    // Fill Vehicle No
    const BareTruckIn = generateVehicleNumber();
    await page.locator(GateImport.VehicleNo).fill(BareTruckIn);
    await page.locator(GateImport.Transport).click();
    await page.locator(GateImport.List).click();
    // Fill Tare Weight
    await page.locator(GateImport.TareWeight).fill('250000');
    // Fill Damage Details
    await page.locator(GateImport.Damage).fill('No visible damage');
    // Fill Max Permissible Weight(Kgs.)
    await page.locator(GateImport.MaxWeight).fill('300000');
    // Fill Custom / Actual Seal
    await page.locator(GateImport.Seal).fill('100');
    // Fill IGM Seal No.
    await page.locator(GateImport.IGMSeal).fill('IGM98765');
    // Fill Truck RFID No.
    await page.locator(GateImport.TruckRFID).fill('RFID0001');
    await page.locator(GateImport.Remark).click();
    await page.locator(GateImport.SelectRemark(surveyRemark)).click();
    // Fill EIR No.
    await page.locator(GateImport.EIRNo).fill('EIR20260109');
    //  await page.locator(GateImport.Remark).click();
    //  await page.locator(GateImport.SelectRemark(surveyRemark)).click();
    // Fill Port Exit Pass No.
    // await page.locator(GateImport.Port).click();  
    // await page.locator(GateImport.PortList).fill('BPCL');
    // await page.locator(GateImport.ListClick).first().click();
    await page.locator(GateImport.PExit).fill('PEP123456');
    // Fill Port Out Date Time
    await page.locator(GateImport.OutDate).fill('2026-01-09T11:10');
    // Fill CFS Gate In Date Time
    await page.locator(GateImport.InDate).fill('2026-01-09T11:15');
    // Fill Port Trans No
    await page.locator(GateImport.TransNo).fill('PTN20260109');
    // Check Scan Status
    // await page.locator(GateImport.Scan).check();
    // Check Is Hold?
    // await page.locator(GateImport.Hold).check();
    // Check Is Weighment?
    await page.locator(GateImport.Weightment).uncheck();
    // Check Semi Low Bed Trailer Required
    // await page.locator(GateImport.Trailer).check();
    // Save
    await page.locator(GateImport.Save).click();
    // Validate Button
    await page.click(GateImport.ValidateBT(BareTruckIn));
    //Execute Button
    await clickAndMeasureDynamic(page, GateImport.ExecuteBT(BareTruckIn), GateImport.Import, 'Execute Button');
    // Toggle (Gate In/Out)
    const gateToggleLabel = page.locator(GateImport.GateIn);
    await gateToggleLabel.click();
    await page.locator(GateImport.SearchCon).fill(containerNo);
    await page.locator(GateImport.Search).click();
    // Validate Button
    await page.click(GateImport.ValidateBT(BareTruckIn));
    //Execute Button
    await page.click(GateImport.ExecuteBT(BareTruckIn));
  });
});
