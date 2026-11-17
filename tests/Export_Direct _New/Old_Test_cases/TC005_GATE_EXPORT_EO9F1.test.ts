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
//   // SwitchModule(page, 'Customer Service Portal');
//    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service'); //temp code
//   await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');
//   await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');
//   await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');
//      await page.locator('//input[@placeholder="Container No."]').fill(containerNo);  // Temp 
//      await page.waitForTimeout(2000);             // Temp      
//      await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
//      await page.waitForTimeout(2000); // Temp 
//      await page.locator(CSMExport.UpdateDetails).click();// Temp 
//   await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
//   await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
//    await page.locator(CSMExport.JobCatId).selectOption('Container Job');
//     await page.locator(CSMExport.JobActId).selectOption('Depot Gate Operation');
//   //  await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription });
//   //  await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' });
//   const dropdown = page.locator("//select[@formcontrolname='JODID']");
//   const option = dropdown.locator("option").filter({ hasText: "Export Container Out By Truck To Port  (XOTP)" });
//   await dropdown.selectOption(await option.getAttribute("value")!);
//     await page.locator(CSMExport.JobConId).selectOption(containerNo);
//  //   await page.locator(CSMExport.EstDtTime).click();
//  //   await selectFutureDay(page, 1);
//     await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
//     await page.click(CSMExport.Save);

//  SwitchModule(page, 'Gate Operations');

//   await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code
//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page,'//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');
//   await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
//   await page.locator(GateEmpty.SearchButton).click();
//   await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');
//   await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');
//   const EO9FvehicleNo1 = `EO9F${getRandomNumberString(6)}`;
//    // writeTestArtifact(vehicleArtifactFile, EO9FvehicleNo);
//     console.log(`Vehicle Number stored: ${EO9FvehicleNo1}`);
//   await page.locator(GateEmpty.VehicleNoInput).fill(EO9FvehicleNo1);
//   await page.locator(GateEmpty.TransportDropdown).click();
//   await page.locator(GateEmpty.TransportDropdownFirst).click();
//    // Fill Custom / Actual Seal
//   await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');
//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');
  
//   // await page.locator(GateEmpty.PlannedInWeighbridge).click();
//   // await page.locator(GateEmpty.PlannedInWeighbridgefirst).click();
  
//   await page.locator(GateEmpty.PortNameDropdown).click();
//  // await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
//   await page.locator(GateEmpty.PortNameFirstOption).first().click();
 
// const dropdown2 = page.locator(
//   "//label[text()=' Planned Out Weighbridge ']/following-sibling::app-searchable-dropdown"
// );

// await dropdown2.locator("input").click({ force: true });

// await page.locator('//label[text()=" Planned Out Weighbridge "]/following-sibling::app-searchable-dropdown//div').first().click({ force: true });
//  const dropdown1 = page.locator(
//   "//label[text()=' Planned In Weighbridge ']/following-sibling::app-searchable-dropdown"
// );

// await dropdown1.waitFor({ state: 'visible' });
// await dropdown1.click();
// await page.locator('//label[text()=" Planned In Weighbridge "]/following-sibling::app-searchable-dropdown//div').first().click({ force: true });
//   //  await page.locator(GateEmpty.PlannedInWeighbridge).click();
//   // await page.locator(GateEmpty.PlannedInWeighbridgefirst).click();
//  await page.locator(GateEmpty.SaveButton).click();
//  await page.waitForTimeout(20000);
//  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
//   await page.locator(GateEmpty.SearchButton)

// // const EO9FvehicleNo1 = 'EO9F948795';
//   // Validate Button
//  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

//  // Execute Button
//  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

  
//  SwitchModule(page, 'Yard Operations');
// // await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice'); // temp**
// await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
// await page.locator(YardPlanner.SearchInput).fill(containerNo);
// await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');
// await page.locator(YardPlanner.CraneDropdown).click();
// await page.locator(YardPlanner.FirstOptionItem).click();
// await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

// await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();
// console.log('Yard Operations for container number ' + containerNo + ' completed successfully');

// SwitchModule(page, 'Gate Operations');
// // await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp
// await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

// await clickAndMeasureDynamic(page,'//a[text()=" Export Container "]', '//button[normalize-space()="Search"]', 'Route to Export Container tab');

// const gateToggleLabel1 = page.locator(
//     '//span[normalize-space()="Gate In"]/following-sibling::label'
//   );
 
//   await gateToggleLabel1.click();
// await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
// await page.locator(GateEmpty.SearchButton).click();

// // Validate Button
// // await page.locator(`//button[normalize-space()="Validate"]`).click();
// await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

//  // await page.click(`//button[normalize-space()="Validate"]`);

//  // Execute Button

//   //Execute Button
// //  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
//  // await page.locator('//button[normalize-space()="Execute"]').click();

// });
