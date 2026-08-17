import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, writeTestArtifact, getRandomNumberString, selectEntityAndSite } from '../../utils/test-helpers';
import {CSMEmpty, Common, CSMImport} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { GateCommon,GateImport, GateEmpty } from 'Locators/GateLocators';

let data : any;

data = {
  surveyRemark: 'Condition OK',
  // vehicleNo: generateVehicleNumber(),
  TareWeight: '2500',
  DamageDetails: 'No visible damage',
  MaxPermissibleWeight: '30000',
  TruckRFID: 'RFID0001',
  EIRNo: 'EIR20260109',
  PortExitPassNo: 'PEP123456',
  PortOutDateTime: '2026-01-09T11:10',
  CFSGateInDateTime: '2026-01-09T11:15',
  PortName: 'BPCL',
  Vehicle_No: 'MH' + getRandomNumberString(5)
};

test('TC005_GATE_EMPTY_OUT', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
  await selectEntityAndSite(page);
  const ContainerNo = await readTestArtifact('EmptyIn_Container.txt')
  await clickAndMeasureDynamic(page, Common.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(ContainerNo);
  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(ContainerNo), GateEmpty.EditButton, 'Open Import Container details');
  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // Fill Vehicle No
  await page.locator(GateEmpty.VehicleNoInput).fill(data.Vehicle_No);
  await writeTestArtifact('Empty_Out_Vehicle_No.txt', data.Vehicle_No);
  console.log('Vehicle No: ' + data.Vehicle_No);

  await page.locator(GateEmpty.TransportDropdown).click();
  await page.locator(GateEmpty.TransportDropdownFirst).click();

  // Fill Tare Weight
  await page.locator(GateEmpty.TareWeightInput).fill(data.TareWeight);

  // Fill Damage Details
  await page.locator(GateEmpty.DamageDetailsInput).fill(data.DamageDetails);

  // Fill Max Permissible Weight(Kgs.)
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill(data.MaxPermissibleWeight);

  // Fill Truck RFID No.
  await page.locator(GateEmpty.TruckRFIDInput).fill(data.TruckRFID);

  await page.locator(GateEmpty.SurveyRemarkDropdown).click();
  await page.locator(GateEmpty.SurveyRemarkOption(data.surveyRemark)).click();

  // Fill EIR No.
  await page.locator(GateEmpty.EIRNoInput).fill(data.EIRNo);

  // await page.locator(GateEmpty.HoldComments).fill("Automation Hold Comments"); // Required for Hold
  await page.locator(GateImport.OperatorConditionCode).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {
      await page.locator(GateImport.OperatorConditionCode).click();
    }
    await page.locator(GateImport.OperatorCCFirstOption).click();

    await page.locator(GateImport.DepotConditionCode).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {
      await page.locator(GateImport.DepotConditionCode).click();
    }
    await page.locator(GateImport.DepotCCFirstOption).click();

    await page.locator(GateImport.DepotQualityCode).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
      await page.locator(GateImport.DepotQualityCode).click();
    }
    await page.locator(GateImport.DepotQCFirstOption).click();

  if (await page.locator(GateEmpty.EmptyYard).isVisible()) {  
    await page.locator(GateEmpty.EmptyYard).click();
    // await page.waitForTimeout(1000);
      if (!(await page.locator(GateEmpty.EmptyYardFirstOption).isVisible())) {
        await page.locator(GateEmpty.EmptyYard).click();
      }
    await page.locator(GateEmpty.EmptyYardFirstOption).click();
  }  
  // Fill Port Exit Pass No.
  await page.locator(GateEmpty.PortExitPassInput).fill(data.PortExitPassNo);

  await page.locator(GateEmpty.PortNameDropdown).click();
  await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
  await page.locator(GateEmpty.PortNameFirstOption).first().click();

  // Save
  await page.locator(GateEmpty.SaveButton).click();

  // Validate Button
  await clickAndMeasureDynamic(page, GateEmpty.ValidateButton(data.Vehicle_No), GateEmpty.ExecuteButton(data.Vehicle_No), 'Validate Vehicle');

  //Execute Button
  await clickAndMeasureDynamic(page, GateEmpty.ExecuteButton(data.Vehicle_No), GateEmpty.SearchButton, 'Execute Vehicle');

}
)
