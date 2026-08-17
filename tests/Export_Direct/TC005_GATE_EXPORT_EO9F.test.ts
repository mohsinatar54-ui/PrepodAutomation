import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
//import { Common,CSME } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
import fs from 'fs';

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}

const surveyRemark = 'Condition OK';
const containerNo = 'CNTU4308779';
const EO9FvehicleNo ='EO9F559091';
const bookingNumber='35899BN20260814001EXP';

// Container number artifact file

test('TC002 GATE EXPORT XITF', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes

  await login(page);
  await selectEntityAndSite(page);
  // ================================
  // Read container number from file
  // ================================
//   const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
// // const containerNo = 'CNTU4308779';
// const EO9FvehicleNo ='EO9F559091';
  const EO9FvehicleNo = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
  
//   console.log('Using container number:', containerNo);

//   await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//button[normalize-space()="Cargo"]', 'Route to Gate tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//a[normalize-space()="Export Cargo"]', 'Route to Cargo tab');

//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Export Cargo"]', '//input[@placeholder="Search by booking no."]', 'Route to Export Cargo');

//   const bookingNumber = await readTestArtifact('ExportDirect_Empty_BookingNumber.txt');

//   console.log(`Booking No : ${bookingNumber}`)

//   await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);
//   await page.locator('//button[normalize-space()="Search"]').click();


//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

//   //Execute Button
//   await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

// SwitchModule(page, 'Yard Operations');
  // await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice'); // temp**
  // await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
  // await clickAndMeasureDynamic(page,YardPlanner.Shiftingbutton ,YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');
  // await page.locator(YardPlanner.FirstContainerY).click();
  // await clickAndMeasureDynamic(page,YardPlanner.Shiftbutton ,YardPlanner.Shiftbuttonverify, 'Route to Lift of container');
  // await page.locator(YardPlanner.Shifttostack).click();
  // await page.getByText('stuff-destuff', { exact: true }).click();
  // await page.locator(YardPlanner.Crane).click();
  // await page.getByText('ECMO', { exact: true }).click();
 // await clickAndMeasureDynamic(page,YardPlanner.Shiftbutton ,YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');
  // await page.waitForTimeout(10000);
 // await page.pause();

//  SwitchModule(page, 'Cargo Warehouse Management');

await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp

//  await page.waitForTimeout(10000);
   await EO9FTally(page, `${EO9FvehicleNo}`);
// ////
//   SwitchModule(page, 'Customer Service Portal');
  
//   await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');
//   await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');
//   await page.locator('//input[@placeholder="Search"]').fill(bookingNumber);
//   await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();
//   await page.locator(CSMExport.UpdateDetails).click();// Temp 
//   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
//   await page.locator(CSMExport.button).click();
//   await page.locator(CSMExport.Arrived).click();
//   await page.waitForTimeout(1000);
//   await clickAndMeasureDynamic(page, CSMExport.Arrivedbutton, CSMExport.Cargo, 'Route to cargo and mark leo');
//   await page.locator(CSMExport.button).click();
//   await page.locator(CSMExport.Leo).click();
//   await page.waitForTimeout(1000);
//   await page.locator(CSMExport.LeoDate).click();
//   await selectFutureDay(page, 0);
//   await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
//   SwitchModule(page, 'Cargo Warehouse Management');
//   await clickAndMeasureDynamic(page, CSMExport.CompleteDestffing, CSMExport.Containertally, 'Route to complete stuff');


//   SwitchModule(page, 'Gate Operations');

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');  
//   await clickAndMeasureDynamic(page, CSMExport.ExportCargo, CSMExport.AddCargo, 'Add Cargo');  
//   // Toggle (Gate In/Out)
//   const gateToggleLabel = page.locator(
//     '//span[normalize-space()="Gate In"]/following-sibling::label'
//   );
 
//   await gateToggleLabel.click();
//  // await page.locator(YardPlanner.FirstContainerY).click();

//  await page.locator('//input[@placeholder="Search by booking no."]').fill(bookingNumber);
//   await page.locator('//button[normalize-space()="Search"]').click();

//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

//   //Execute Button
//   await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

//   SwitchModule(page, 'Customer Service Portal');

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
//  //   await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription });
//   //  await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' });
//     await page.locator(CSMExport.JobConId).selectOption(containerNo);
//  //   await page.locator(CSMExport.EstDtTime).click();
//  //   await selectFutureDay(page, 1);
//     await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
//     await page.click(CSMExport.Save);

// SwitchModule(page, 'Gate Operations');

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
//   await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');
//   await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
//   await page.locator(GateEmpty.SearchButton).click();
//   await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');
//   await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');
//   await page.locator(GateEmpty.VehicleNoInput).fill('MH13QS23233');
//   await page.locator(GateEmpty.TransportDropdown).click();
//   await page.locator(GateEmpty.TransportDropdownFirst).click();
//    // Fill Custom / Actual Seal
//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');
//   await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');
//   await page.locator(GateEmpty.PlannedInWeighbridge).click();
//   await page.locator(GateEmpty.PlannedInWeighbridgefirst).click();
//   await page.locator(GateEmpty.PortNameDropdown).click();
//  // await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
//   await page.locator(GateEmpty.PortNameFirstOption).first().click();
//  await page.locator(GateEmpty.SaveButton).click();
  
// SwitchModule(page, 'Yard Operations');

// await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
// await page.locator(YardPlanner.SearchInput).fill(containerNo);
// await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

// await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();
// console.log('Yard Operations for container number ' + containerNo + ' completed successfully');

// SwitchModule(page, 'Gate Operations');

// await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

// await clickAndMeasureDynamic(page,'//a[text()=" Export Container "]', '//button[normalize-space()="Search"]', 'Route to Export Container tab');

// const gateToggleLabel1 = page.locator(
//     '//span[normalize-space()="Gate In"]/following-sibling::label'
//   );
 
//   await gateToggleLabel1.click();
// await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
// await page.locator(GateEmpty.SearchButton).click();

// // Validate Button
// await page.locator(`//button[normalize-space()="Validate"]`).click();

  // await page.click(`//button[normalize-space()="Validate"]`);

  //Execute Button

 //w await page.locator('//button[normalize-space()="Execute"]`).click();

});
