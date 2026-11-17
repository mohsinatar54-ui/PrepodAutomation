import { test, expect, Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact, SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite, IndirectCargoTally } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { GateExport } from 'Locators/GateLocators';


//import { Common,CSME } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
import fs from 'fs';
import { Cargo } from 'Locators/CargoLocators';
// ================================
  // Read container number from file
  // ================================
   const containerNo = await readTestArtifact('ExportINDirect_EO91_Container.txt')
   const EO91vehicleNo = await readTestArtifact('ExportINDirect_EO91_Vehicle.txt')
   const IndirectbookingNumber = await readTestArtifact('ExportINDirect_BookingNumber.txt');

   console.log(`Booking No : ${IndirectbookingNumber}`)
  
   console.log('Using container number:', containerNo);
   
export async function gateInCargoIndirect(page: Page) {

  await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateExport.CargoButton, 'Route to Cargo');

await clickAndMeasureDynamic(page, GateExport.CargoButton, GateExport.ExportCargoLink, 'Route to Export Cargo');

await clickAndMeasureDynamic(page, GateExport.ExportCargoLink, GateExport.SearchByBookingInput, 'Route to Export Cargo');

await page.locator(GateExport.SearchByBookingInput).fill(IndirectbookingNumber);

await page.locator(GateExport.SearchButton).click();

await page.click(GateExport.ValidateButtonE(EO91vehicleNo));

await clickAndMeasureDynamic(page, GateExport.ExecuteButtonE(EO91vehicleNo), GateExport.ContainerButton, 'Execute Button');
}
export async function cargoShift(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await clickAndMeasureDynamic(page, YardPlanner.Shiftingbutton, YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');

  await page.locator(YardPlanner.FirstContainerY).click();

  await page.locator(YardPlanner.Shiftbutton).click();

  await page.waitForTimeout(1000);

  const shiftToStack = page.locator(YardPlanner.Shifttostack);

  await shiftToStack.waitFor({ state: 'visible' });

  await shiftToStack.scrollIntoViewIfNeeded();

  await shiftToStack.click();

  const search = page.locator(YardPlanner.Searchshift);

  await search.waitFor({ state: 'visible' });

  await search.fill('stuff-destuff');

  const option = page.locator(YardPlanner.Stuff_destuff);

  await option.waitFor({ state: 'visible', timeout: 30000 });

  await option.click();

  await page.locator(YardPlanner.Shiftbutton).click();

  await page.waitForTimeout(20000);
}

export async function IndirectmarkLeo(page: Page) {

 //  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');// temp code

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(Cargo.SearchInput).fill(IndirectbookingNumber);

  await page.waitForTimeout(10000);

  await page.locator(CSMExport.Bookinglink).click();

  await page.locator(CSMExport.UpdateDetails).click();

  await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');

  // await page.locator(CSMExport.button).click();

  // await page.locator(CSMExport.Arrived).click();

   await page.waitForTimeout(1000);

 //await clickAndMeasureDynamic(page, CSMExport.Arrivedbutton, CSMExport.Cargo, 'Route to cargo and mark leo');

  await page.locator(CSMExport.button).click();

  await page.locator(CSMExport.Leo).click();

  await page.waitForTimeout(1000);

  await page.locator(CSMExport.LeoNumberfield).fill('83737345');

  await page.locator(CSMExport.LeoDate).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

  await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
}
// export async function completeStuffing(page: Page) {

//   // await clickAndMeasureDynamic(page, '//button[text()="Cargo Verification"]', '//button[text()="Export Cargo Verification"]', 'Route to Export cargo verification tab');

//   // await clickAndMeasureDynamic(page, '//button[text()="Export Cargo Verification"]', '//span[text()="Export Cargo Verification"]', 'Click on Export cargo verification tab');
//   await clickAndMeasureDynamic(page, Cargo.CargoVerificationButton, Cargo.ExportCargoVerificationButton, 'Route to Export cargo verification tab '); //new code 
  
//   await clickAndMeasureDynamic(page, Cargo.ExportCargoVerificationButton, Cargo.ExportCargoVerificationSpan, 'Click on Export cargo verification tab '); //new code 


//   await page.locator('((//th[text()="#"]/ancestor::table/child::tbody/child::tr)[1]/child::td/div)[1]//span/span').first().click();

//   await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Unload"]', '//button[normalize-space()="Complete Container Stuffing"]', 'Complete Transport Cargo Unload');

//   await page.locator('//button[normalize-space()="Yes"]').click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

//   await page.locator('//button[normalize-space()="Yes"]').click();
//   //  await clickAndMeasureDynamic(page, CSMExport.CompleteDestffing, CSMExport.Containertally, 'Route to complete stuff'); //added code 

// }

export async function completeStuffing(page: Page) {

  // await clickAndMeasureDynamic(page, '//button[text()="Cargo Verification"]', '//button[text()="Export Cargo Verification"]', 'Route to Export cargo verification tab');

  // await clickAndMeasureDynamic(page, '//button[text()="Export Cargo Verification"]', '//span[text()="Export Cargo Verification"]', 'Click on Export cargo verification tab');

  await clickAndMeasureDynamic(page, Cargo.CargoVerificationButton, Cargo.ExportCargoVerificationButton, 'Route to Export cargo verification tab '); //new code 
  
  await clickAndMeasureDynamic(page, Cargo.ExportCargoVerificationButton, Cargo.ExportCargoVerificationSpan, 'Click on Export cargo verification tab '); //new code 


  await page.locator(Cargo.FirstCargoTableRowSpan).first().click();

  await page.locator(`//a[normalize-space()="${EO91vehicleNo}"]`).click();

  await clickAndMeasureDynamic(page, Cargo.CargoCompleteTransportCargoUnloadButton, Cargo.CargoCompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

  await page.locator(Cargo.CargoStuffingYesButton).click();

  await clickAndMeasureDynamic(page, Cargo.CargoCompleteContainerStuffingButton, Cargo.CargoStuffingYesButton, 'Complete Container Stuffing');

  await page.locator(Cargo.CargoStuffingYesButton).click();

  //  await clickAndMeasureDynamic(page, CSMExport.CompleteDestffing, CSMExport.Containertally, 'Route to complete stuff'); //added code 

}
export async function gateOutCargoemptytruckIndirect(page: Page) {

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.ExportCargo, 'Route to Export Cargo');

  await clickAndMeasureDynamic(page, CSMExport.ExportCargo, Cargo.SearchButton, 'Route to Export Cargo Search');

  // Toggle Gate In/Out
  const gateToggleLabel = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel.click();

  await page.locator(GateExport.GateExportBNsearch).fill(IndirectbookingNumber);

  await page.waitForTimeout(1000);

  await page.locator(Cargo.SearchButton).click();

  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${EO91vehicleNo}"]]//button[normalize-space()="Validate"]`);

  await page.waitForTimeout(10000);

  // Execute Button
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO91vehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

  await page.waitForTimeout(10000);
}

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}

// const surveyRemark = 'Condition OK';
// const containerNo = 'CNTU0795079';
// //const EO9FvehicleNo ='EO9F254257';
// const bookingNumber='11110BN20260818001EXP';

// Container number artifact file

test('TC005_GATE_EXPORT_INDIRECT.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes

  //await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await gateInCargoIndirect(loginPage);
  SwitchModule(loginPage, 'Cargo Warehouse Management');
  await page.waitForTimeout(2000);
  await IndirectCargoTally(loginPage, `${EO91vehicleNo}`); 
  SwitchModule(loginPage, 'Customer Service Portal');
  await IndirectmarkLeo(loginPage);
  SwitchModule(loginPage, 'Gate Operations');
  await gateOutCargoemptytruckIndirect(loginPage);

  
});
   
