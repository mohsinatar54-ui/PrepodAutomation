import { test, expect, Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact, SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite, IndirectCargoTally } from '../../utils/test-helpers';

import fs from 'fs';
import { Cargo } from 'Locators/CargoLocators';
import { ExportINDirectPage } from 'Pages/Export_Indirect';

// ================================
  // Read container number from file
  // ================================
   const containerNo = await readTestArtifact('ExportINDirect_EO91_Container.txt')
   const EO91vehicleNo = await readTestArtifact('ExportINDirect_EO91_Vehicle.txt')
   const IndirectbookingNumber = await readTestArtifact('ExportINDirect_BookingNumber.txt');


test('TC005_GATE_EXPORT_INDIRECT.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes

  //await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await ExportINDirectPage.loadTestData();
  await ExportINDirectPage.gateInCargoIndirect(loginPage);
  SwitchModule(loginPage, 'Cargo Warehouse Management');
  await page.waitForTimeout(2000);
  await IndirectCargoTally(loginPage, `${EO91vehicleNo}`); 
  SwitchModule(loginPage, 'Customer Service Portal');
  await ExportINDirectPage.IndirectmarkLeo(loginPage);
  SwitchModule(loginPage, 'Gate Operations');
  await ExportINDirectPage.gateOutCargoemptytruckIndirect(loginPage);
  
});
   
