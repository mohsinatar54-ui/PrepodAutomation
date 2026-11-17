// import { test, expect } from '@playwright/test';
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
//   // ================================
//   // Read container number from file
//   // ================================
//    const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
//    const EO9FvehicleNo = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
  
//    console.log('Using container number:', containerNo);

//   await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//button[normalize-space()="Cargo"]', 'Route to Gate tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//a[normalize-space()="Export Cargo"]', 'Route to Cargo tab');

//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Export Cargo"]', '//input[@placeholder="Search by booking no."]', 'Route to Export Cargo');

//   const bookingNumber = await readTestArtifact('ExportDirect_Empty_BookingNumber.txt');

//    console.log(`Booking No : ${bookingNumber}`)

//   await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);
//   await page.locator('//button[normalize-space()="Search"]').click();


//     // Validate Button
//    await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

//  //   //Execute Button
//     await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

//     SwitchModule(page, 'Yard Operations');
// //  await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice'); // temp**
//   await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
//   await clickAndMeasureDynamic(page,YardPlanner.Shiftingbutton ,YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');
//   await page.locator(YardPlanner.FirstContainerY).click();
//   await page.locator(YardPlanner.Shiftbutton).click();
//   await page.waitForTimeout(10000);
//   const shiftToStack = page.locator(YardPlanner.Shifttostack);
  
// await shiftToStack.waitFor({ state: 'visible' });
// await shiftToStack.scrollIntoViewIfNeeded();
// await shiftToStack.click();

// const search = page.locator('//input[@placeholder="Search options..."]');

// await search.waitFor({ state: 'visible' });
// await search.fill('stuff-destuff');

// // Wait until the required option is actually available
// const option = page.locator(
//   '//div[@class="options-list"]/div[normalize-space()="stuff-destuff"]'
// );

// await option.waitFor({ state: 'visible', timeout: 30000 });
// await option.click();

// //  await clickAndMeasureDynamic(page,YardPlanner.Shiftbutton ,YardPlanner.Shiftbuttonverify, 'Route to Lift of container'); // temp code
// ///***//    await page.locator(YardPlanner.Shiftbutton).click(); 
// //   await page.waitForTimeout(1000);
// //   await page.locator(YardPlanner.Shifttostack).click();
 
// // const search = page.locator('//input[@placeholder="Search options..."]');

// // await search.fill('stuff-destuff');
// // await page.waitForTimeout(1000);

// //  await page.locator('//div[@class="options-list"]/div').first().click();///**
// //  await page.getByText('stuff-destuff', { exact: true }).click(); // temp code
// //   // await page.locator(YardPlanner.Crane).click(); // temp code
// //   // await page.getByText('ECMO', { exact: true }).click(); // temp code
// // //   await page.locator('//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]').click(); // temp code

// // // await page.locator('//input[@placeholder="Search options..."]').fill('stuff-destuff');// temp code

// // // await page.getByText('stuff-destuff', { exact: true }).click(); // temp code
// //  // await clickAndMeasureDynamic(page,YardPlanner.Shiftbutton ,YardPlanner.Shiftingbuttonverify, 'Route to Lift of container'); // temp code
//    await page.locator(YardPlanner.Shiftbutton).click(); 
//    await page.waitForTimeout(20000);
// //  // await page.pause();

//   SwitchModule(page, 'Cargo Warehouse Management');

//  //await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp

//  await page.waitForTimeout(10000);
//  await EO9FTally(page, `${EO9FvehicleNo}`); // neqw chahanges updated button to save button
// // ////
//   SwitchModule(page, 'Customer Service Portal');
//  // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service'); //temp code

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
//    await page.locator(CSMExport.LeoDate).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
//  // await page.keyboard.press('ArrowRight'); // not use in full
//  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
//  // await page.keyboard.press('ArrowRight');  // not use in full
//  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 }); 
//  //await page.keyboard.press('ArrowRight');  // not use in 
//  // await page.locator(CSMExport.LeoDate).click();
// //  await selectFutureDay(page, 1);
//  await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');

//   SwitchModule(page, 'Cargo Warehouse Management');
 
//  // await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp
//   await clickAndMeasureDynamic(page, '//button[text()="Cargo Verification"]', '//button[text()="Export Cargo Verification"]', 'Route to Export cargo verification tab '); //new code 
//  // await page.locator('//input[@placeholder="Search"]').fill(EO9FvehicleNo); //temp code// not use in full
//   await clickAndMeasureDynamic(page, '//button[text()="Export Cargo Verification"]','//span[text()="Export Cargo Verification"]', 'Click on Export cargo verification tab '); //new code
//   await page.locator('((//th[text()="#"]/ancestor::table/child::tbody/child::tr)[1]/child::td/div)[1]//span/span').first().click(); // New CODE

//    await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();
 
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Unload"]', '//button[normalize-space()="Complete Container Stuffing"]', 'Complete Transport Cargo Unload'); //bug
//   await page.locator('//button[normalize-space()="Yes"]').click();   // bug 
  
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

//   await page.locator('//button[normalize-space()="Yes"]').click();

  
// //  await clickAndMeasureDynamic(page, CSMExport.CompleteDestffing, CSMExport.Containertally, 'Route to complete stuff'); //added code 


//    SwitchModule(page, 'Gate Operations');
// // await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.ExportCargo, 'Add Cargo');  
//   await clickAndMeasureDynamic(page, CSMExport.ExportCargo,'//button[normalize-space()="Search"]', 'Add Cargo');  
//   //Toggle (Gate In/Out)
//   const gateToggleLabel = page.locator(
//     '//span[normalize-space()="Gate In"]/following-sibling::label'
//   );
 
//   await gateToggleLabel.click();
//  // await page.locator(YardPlanner.FirstContainerY).click(); not required 

//  await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);
//  await page.waitForTimeout(1000);
//   await page.locator('//button[normalize-space()="Search"]').click();

//  // Validate Button
//  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);
//  await page.waitForTimeout(10000);
//  // Execute Button
//  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
// await page.waitForTimeout(10000);
// });
   
