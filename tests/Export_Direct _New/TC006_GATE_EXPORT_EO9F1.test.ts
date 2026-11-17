import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';

import fs from 'fs';
import { ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';
import { ExportDirectPage } from 'Pages/DirectExport';


test('TC006_GATE_EXPORT_EO9F1.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes

  //  await login(page);
  const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
 //  console.log('Using container number:', containerNo);
     await ExportDirectPage.loadTestData();
    await ExportDirectPage.newJobOrderXOTP(loginPage);
    SwitchModule(loginPage, 'Gate Operations');
   await ExportDirectPage.gateInNewVehicle(loginPage); 
   SwitchModule(loginPage, 'Yard Operations');
   await ExportDirectPage.yardExecution(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await ExportDirectPage.gateOutWithCargoAndTruck(loginPage);

});
