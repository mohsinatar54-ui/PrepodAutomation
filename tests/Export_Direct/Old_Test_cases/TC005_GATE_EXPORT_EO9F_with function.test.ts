// import { test, expect, Page } from '@playwright/test';
// import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact, SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../../utils/test-helpers';
// import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
// import { YardPlanner } from 'Locators/YardLocators';
// import { CSMEmpty } from 'Locators/BookingLocators';
// import { GateCommon } from 'Locators/GateLocators';
// import { GateEmpty } from 'Locators/GateLocators';


// //import { Common,CSME } from 'Locators/BookingLocators';
// // import { selectFutureDay } from 'utils/createExcelData';
// import fs from 'fs';
// // ================================
//   // Read container number from file
//   // ================================
// const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
//    const EO9FvehicleNo = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
//    const bookingNumber = await readTestArtifact('ExportDirect_Empty_BookingNumber.txt');

//    console.log(`Booking No : ${bookingNumber}`)
  
//    console.log('Using container number:', containerNo);
// export async function gateInCargo(page: Page) {

//   await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, '//button[normalize-space()="Cargo"]', 'Route to Cargo');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//a[normalize-space()="Export Cargo"]', 'Route to Export Cargo');

//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Export Cargo"]', '//input[@placeholder="Search by booking no."]', 'Route to Export Cargo');

//   await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   // Validate
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

//   // Execute
//   await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
// }
// export async function cargoShift(page: Page) {

//   await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

//   await clickAndMeasureDynamic(page, YardPlanner.Shiftingbutton, YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');

//   await page.locator(YardPlanner.FirstContainerY).click();

//   await page.locator(YardPlanner.Shiftbutton).click();

//   await page.waitForTimeout(10000);

//   const shiftToStack = page.locator(YardPlanner.Shifttostack);

//   await shiftToStack.waitFor({ state: 'visible' });

//   await shiftToStack.scrollIntoViewIfNeeded();

//   await shiftToStack.click();

//   const search = page.locator('//input[@placeholder="Search options..."]');

//   await search.waitFor({ state: 'visible' });

//   await search.fill('stuff-destuff');

//   const option = page.locator('//div[@class="options-list"]/div[normalize-space()="stuff-destuff"]');

//   await option.waitFor({ state: 'visible', timeout: 30000 });

//   await option.click();

//   await page.locator(YardPlanner.Shiftbutton).click();

//   await page.waitForTimeout(20000);
// }

// export async function markLeo(page: Page) {

//   await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

//   await page.locator('//input[@placeholder="Search"]').fill(bookingNumber);

//   await page.waitForTimeout(10000);

//   await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();

//   await page.locator(CSMExport.UpdateDetails).click();

//   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');

//   await page.locator(CSMExport.button).click();

//   await page.locator(CSMExport.Arrived).click();

//   await page.waitForTimeout(1000);

//   await clickAndMeasureDynamic(page, CSMExport.Arrivedbutton, CSMExport.Cargo, 'Route to cargo and mark leo');

//   await page.locator(CSMExport.button).click();

//   await page.locator(CSMExport.Leo).click();

//   await page.waitForTimeout(1000);

//   await page.locator('//input[@formcontrolname="LEONumber"]').fill('83737345');

//   await page.locator(CSMExport.LeoDate).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

//   await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
// }
// export async function completeStuffing(page: Page) {

//   await clickAndMeasureDynamic(page, '//button[text()="Cargo Verification"]', '//button[text()="Export Cargo Verification"]', 'Route to Export cargo verification tab');

//   await clickAndMeasureDynamic(page, '//button[text()="Export Cargo Verification"]', '//span[text()="Export Cargo Verification"]', 'Click on Export cargo verification tab');

//   await page.locator('((//th[text()="#"]/ancestor::table/child::tbody/child::tr)[1]/child::td/div)[1]//span/span').first().click();

//   await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Unload"]', '//button[normalize-space()="Complete Container Stuffing"]', 'Complete Transport Cargo Unload');

//   await page.locator('//button[normalize-space()="Yes"]').click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

//   await page.locator('//button[normalize-space()="Yes"]').click();
//   //  await clickAndMeasureDynamic(page, CSMExport.CompleteDestffing, CSMExport.Containertally, 'Route to complete stuff'); //added code 

// }
// export async function gateOutCargoemptytruck(page: Page) {

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

//   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.ExportCargo, 'Route to Export Cargo');

//   await clickAndMeasureDynamic(page, CSMExport.ExportCargo, '//button[normalize-space()="Search"]', 'Route to Export Cargo Search');

//   // Toggle Gate In/Out
//   const gateToggleLabel = page.locator('//span[normalize-space()="Gate In"]/following-sibling::label');

//   await gateToggleLabel.click();

//   await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);

//   await page.waitForTimeout(1000);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

//   await page.waitForTimeout(10000);

//   // Execute Button
//   await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

//   await page.waitForTimeout(10000);
// }

// function generateVehicleNumber(): string {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   const randomLetters =
//     letters[Math.floor(Math.random() * 26)] +
//     letters[Math.floor(Math.random() * 26)];

//   const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

//   return `MH46${randomLetters}${randomDigits}`;
// }

// // const surveyRemark = 'Condition OK';
// // const containerNo = 'CNTU0795079';
// // //const EO9FvehicleNo ='EO9F254257';
// // const bookingNumber='11110BN20260818001EXP';

// // Container number artifact file

// test('TC002 GATE EXPORT XITF', async ({ page }) => {
//   test.setTimeout(800000); // 2 minutes

//   await login(page);
//   await selectEntityAndSite(page);
//   await gateInCargo(page);
//   SwitchModule(page, 'Yard Operations');
//   await cargoShift(page);   
//   await page.waitForTimeout(20000);
//   SwitchModule(page, 'Cargo Warehouse Management');
//   await page.waitForTimeout(10000);
//   await EO9FTally(page, `${EO9FvehicleNo}`); 
//   SwitchModule(page, 'Customer Service Portal');
//   await markLeo(page);
//   SwitchModule(page, 'Cargo Warehouse Management');
//   await completeStuffing(page);
//   SwitchModule(page, 'Gate Operations');
//   await gateOutCargoemptytruck(page);

  
// });
   
