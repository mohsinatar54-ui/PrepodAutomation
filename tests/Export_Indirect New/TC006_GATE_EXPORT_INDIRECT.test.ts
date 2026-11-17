import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport } from 'Locators/GateLocators';
// import { GateCommon, GateExport } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators'; 



import { GateEmptyBookingLocators } from 'Locators/All locators/GateEmptyIn_Out';
import { ExportINDirectPage } from 'Pages/Export_Indirect';

const containerNo = await readTestArtifact('ExportINDirect_EO91_Container.txt')
const EO9FvehicleNo = await readTestArtifact('ExportINDirect_EO91_Vehicle.txt')



test('TC006_GATE_EXPORT_INDIRECT.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes
  // await login(page);
  const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo);
   await ExportINDirectPage.loadTestData();
   await ExportINDirectPage.newJobOrder1(loginPage,{},'EO91');
   SwitchModule(loginPage, 'Yard Operations');
   await ExportINDirectPage.cargoShift(loginPage);
   SwitchModule(loginPage, 'Cargo Warehouse Management');
   await ExportINDirectPage.IndirectCargoTally1(loginPage);
 
});