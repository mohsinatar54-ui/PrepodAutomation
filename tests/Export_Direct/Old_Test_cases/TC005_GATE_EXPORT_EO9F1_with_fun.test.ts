// import { test, expect,Page } from '@playwright/test';
// import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../../utils/test-helpers';
// import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
// import { YardPlanner } from 'Locators/YardLocators';
// import { CSMEmpty } from 'Locators/BookingLocators';
// import { GateCommon } from 'Locators/GateLocators';
// import { GateEmpty } from 'Locators/GateLocators';


// //import { Common,CSME } from 'Locators/BookingLocators';
// // import { selectFutureDay } from 'utils/createExcelData';
// import fs from 'fs';
// const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
// const EO9FvehicleNo1 = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
// const vehicleArtifactFile1 = 'ExportDirect_EO9F_Vehicle1.txt';

// export async function newJobOrderXOTP(page: Page) {

//   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service'); // Start Final code

//   await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

//   await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

//   await page.locator('//input[@placeholder="Container No."]').fill(containerNo);

//   await page.waitForTimeout(2000);

//   await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();

//   await page.waitForTimeout(2000);

//   await page.locator(CSMExport.UpdateDetails).click();

//   await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');

//   await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');

//   await page.locator(CSMExport.JobCatId).selectOption('Container Job');

//   await page.locator(CSMExport.JobActId).selectOption('Depot Gate Operation');

//   const dropdown = page.locator("//select[@formcontrolname='JODID']");

//   const option = dropdown.locator("option").filter({
//     hasText: "Export Container Out By Truck To Port  (XOTP)"
//   });

//   await dropdown.selectOption(await option.getAttribute("value")!);

//   await page.locator(CSMExport.JobConId).selectOption(containerNo);

//   await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

//   await page.click(CSMExport.Save);
// }
// export async function gateInNewVehicle(page: Page) {

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

//   await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

//   await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

//   const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

//   await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

//   await page.locator(GateEmpty.SearchButton).click();

//   await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');

//   await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

//   // Generate new vehicle number
//   const EO9FvehicleNo1 = `EO9F${getRandomNumberString(6)}`;

//   // Store vehicle number in artifact
//   writeTestArtifact(vehicleArtifactFile1, EO9FvehicleNo1);

//   console.log(`Vehicle Number stored: ${EO9FvehicleNo1}`);

//   // Enter vehicle number
//   await page.locator(GateEmpty.VehicleNoInput).fill(EO9FvehicleNo1);

//   await page.locator(GateEmpty.TransportDropdown).click();

//   await page.locator(GateEmpty.TransportDropdownFirst).click();

//   // Fill Custom / Actual Seal
  
//   await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');

//   await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');


//   // Port Name
//   await page.locator(GateEmpty.PortNameDropdown).click();

//   await page.locator(GateEmpty.PortNameFirstOption).first().click();

//   const dropdown2 = page.locator(
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

//   // Save
//   await page.locator(GateEmpty.SaveButton).click();

//   await page.waitForTimeout(20000);

//   // Search again
//   await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

//   await page.locator(GateEmpty.SearchButton).click();

//   // Validate
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

//   // Execute
//   await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
// }
// export async function yardExecution(page: Page) {

//   await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

//   await page.locator(YardPlanner.SearchInput).fill(containerNo);

//   await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

//   await page.locator(YardPlanner.CraneDropdown).click();

//   await page.locator(YardPlanner.FirstOptionItem).click();

//   await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

//   await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

//   console.log('Yard Operations for container number ' + containerNo + ' completed successfully');
// }

// export async function gateOutWithCargoAndTruck(page: Page) {

//   const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

//   const EO9FvehicleNo1 = await readTestArtifact('ExportDirect_EO9F_Vehicle1.txt');

//   console.log(`Using container number: ${containerNo}`);
//   console.log(`Using vehicle number: ${EO9FvehicleNo1}`);

//    await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

//   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

//   await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', '//button[normalize-space()="Search"]', 'Route to Export Container tab');

//   const gateToggleLabel1 = page.locator('//span[normalize-space()="Gate In"]/following-sibling::label');

//   await gateToggleLabel1.click();

//   await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

//   await page.locator(GateEmpty.SearchButton).click();

//   // Validate
//   await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);
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
//    console.log('Using container number:', containerNo);
//   SwitchModule(page, 'Customer Service Portal');
//   await newJobOrderXOTP(page);
//    SwitchModule(page, 'Gate Operations');
//    await gateInNewVehicle(page); 
//    SwitchModule(page, 'Yard Operations');
//    await yardExecution(page);
//    SwitchModule(page, 'Gate Operations');
//    await gateOutWithCargoAndTruck(page);

// });
