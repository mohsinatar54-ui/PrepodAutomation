import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { createExcelFile, createPreAdviceExcel } from '../../utils/createExcelData';
import {CSMEmpty, Common, CSMImport, CSMExport} from 'Locators/BookingLocators'
import { createPreAdviceImport } from 'Flows/ExportFlow';


// import fs from 'fs';
// import { waitForDebugger } from 'inspector';
// import { text } from 'stream/consumers';


 test('TC001_CSM_Import_MOTL', async ({ page }) => {
    await test.setTimeout(700000);

  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  const { referenceNo, preContainer1 } = await createPreAdviceImport(loginPage);
  console.log(referenceNo, preContainer1);
});


