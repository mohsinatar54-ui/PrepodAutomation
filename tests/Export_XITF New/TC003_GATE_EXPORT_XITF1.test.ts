import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite, ClickonModule } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';

import fs from 'fs';
import { ExportBooking_XITC_With_JobPlan_Savesubmit, ExportBooking_XITF, ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';
import { cargoShift } from '@tests/Export_Direct/TC005_GATE_EXPORT_EO9F.test';
import { ExportXITFPage } from 'Pages/FactoryExport';

//const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
const containerNo1 = await readTestArtifact('XITF_Container.txt')



test('TC003_GATE_EXPORT_XITF1.test.ts', async ({ page }) => 
    {

  test.setTimeout(500000); // 2 minutes
   // await login(page);
   const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo1);
    await ExportXITFPage.loadTestData();
   await ExportXITFPage.newJobOrder(loginPage, {}, 'XOTP');
   await ExportBooking_XOTP_With_JobPlan_Savesubmit(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await ExportXITFPage.gateInNewVehicleXITF2(loginPage);
   SwitchModule(loginPage, 'Yard Operations');
   await ExportXITFPage.yardExecution2(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await ExportXITFPage.gateOutWithCargoAndTruck2(loginPage);

});