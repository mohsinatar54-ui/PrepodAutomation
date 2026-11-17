import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite, selectEntityAndSiteM } from '../../utils/test-helpers';
import { createExcelFile, createPreAdviceExcel } from '../../utils/createExcelData';
import {CSMEmpty, Common, CSMImport, CSMExport, CommonM} from 'Locators/BookingLocators'
import { createPreAdviceImport } from 'Flows/ExportFlow';
import { Mercantile } from 'Pages/Mercantile';


// import fs from 'fs';
// import { waitForDebugger } from 'inspector';
// import { text } from 'stream/consumers';


 test('TC001_Vessal_Operation.test', async ({ page }) => {
    await test.setTimeout(700000);

  const loginPage = await login(page);
  await selectEntityAndSiteM(loginPage);
  await test.step('Login and navigate to Import Booking screen', async () => {
        // // await login(page);
        // await selectEntityAndSite(page);
      await clickAndMeasureDynamic(loginPage, CommonM.VesselOperationsLogo, CommonM.DashBoard, 'Route to DashBoard');
      await Mercantile.navigateHeaders(loginPage,'Masters');
      await Mercantile.clickonLeftNavigationTab(loginPage,'Cut-Offs');
      await Mercantile.verifyDropdownOptions(loginPage.locator('select[formcontrolname="CutoffTypeID"]'),'Cut-Off Type'
);
      await Mercantile.verifyCompleteTable(loginPage);
    });

});


