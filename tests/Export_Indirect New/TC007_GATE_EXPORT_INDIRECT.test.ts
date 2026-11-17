import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';
import fs from 'fs';
import {  ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';

// import { Gate_Import } from 'Flows/ImportFlow';
import { GateEmptyBookingLocators } from 'Locators/All locators/GateEmptyIn_Out';
import { ExportINDirectPage } from 'Pages/Export_Indirect';

const containerNo = await readTestArtifact('ExportINDirect_EO91_Container.txt')
const EO9FvehicleNo = await readTestArtifact('ExportINDirect_EO91_Vehicle.txt')





test('TC007_GATE_EXPORT_INDIRECT.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes
  // await login(page);
  const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo);
   await ExportINDirectPage.loadTestData();
   await ExportINDirectPage.newJobOrder2(loginPage,{},'XOTP');
   await ExportBooking_XOTP_With_JobPlan_Savesubmit(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await ExportINDirectPage.gateInNewVehicle(loginPage); 
   SwitchModule(loginPage, 'Yard Operations');
   await ExportINDirectPage.yardExecution(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await ExportINDirectPage.gateOutWithCargoAndTruck(loginPage);

});