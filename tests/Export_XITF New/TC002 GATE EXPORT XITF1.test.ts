
import { test } from '@playwright/test';

import { login, selectEntityAndSite, SwitchModule } from '../../utils/test-helpers';

import { ExportXITFPage } from 'Pages/FactoryExport';


test('TC002 GATE EXPORT XITF1.test.ts', async ({ page }) => {

  test.setTimeout(500000);

  const loginPage = await login(page);

  await selectEntityAndSite(loginPage);

  await ExportXITFPage.loadTestData();

  await ExportXITFPage.gateInNewVehicleXITF1(loginPage);

  SwitchModule(loginPage, 'Yard Operations');

  await ExportXITFPage.yardExecution1(loginPage);

  SwitchModule(loginPage, 'Gate Operations');

  await ExportXITFPage.gateOutWithCargoAndTruck1(loginPage);

  SwitchModule(loginPage, 'Customer Service Portal');

  await ExportXITFPage.IndirectmarkLeo(loginPage);
});

