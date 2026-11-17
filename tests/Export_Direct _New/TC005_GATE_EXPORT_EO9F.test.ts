
import { test } from '@playwright/test';

import { login, selectEntityAndSite,SwitchModule} from '../../utils/test-helpers';

import { ExportDirectPage } from 'Pages/DirectExport';




test('TC005_GATE_EXPORT_EO9F.ts', async ({ page }) => {

  test.setTimeout(800000);

  const loginPage = await login(page);

  await selectEntityAndSite(loginPage);

  await ExportDirectPage.loadTestData();

   await ExportDirectPage.gateInCargo(loginPage);

  SwitchModule(loginPage, 'Yard Operations');

   await ExportDirectPage.cargoShift(loginPage);

  await page.waitForTimeout(1000);

  await SwitchModule(loginPage, 'Cargo Warehouse Management');

  await ExportDirectPage.DExportEO9FTally(loginPage);
  
  SwitchModule(loginPage, 'Customer Service Portal');

  await ExportDirectPage.markLeo(loginPage);

  SwitchModule(loginPage, 'Cargo Warehouse Management');

  await ExportDirectPage.completeStuffing(loginPage);

  SwitchModule(loginPage, 'Gate Operations');

  await ExportDirectPage.gateOutCargoemptytruck(loginPage);
  
});


