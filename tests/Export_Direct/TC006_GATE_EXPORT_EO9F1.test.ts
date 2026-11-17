import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';


//import { Common,CSME } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
import fs from 'fs';
import { ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';
const containerNo = await readTestArtifact('ExportDirectEO9F_Container.txt')
// const EO9FvehicleNo1 = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
// const vehicleArtifactFile1 = await readTestArtifact('ExportDirect_EO9F_Vehicle1.txt');

export async function newJobOrderXOTP(page: Page) {

  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service'); // Start Final code

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo);

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.firstBookingLink).click();

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.UpdateDetails).click();

  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');

  await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');

  await page.locator(CSMExport.JobCatId).selectOption('Container Job');

  await page.locator(CSMExport.JobActId).selectOption('Depot Gate Operation');

  const dropdown = page.locator(CSMExport.JobDescription);

  const option = dropdown.locator("option").filter({
    hasText: "Export Container Out By Truck To Port  (XOTP)"
  });

  await dropdown.selectOption(await option.getAttribute("value")!);

  await page.locator(CSMExport.JobConId).selectOption(containerNo);
   await page.locator(CSMExport.EstDtTime).click();
  await selectFutureDay(page, 3);


  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
}
export async function gateInNewVehicle(page: Page) {
 //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  //const containerNo = await readTestArtifact('ExportDirect_EmptyIn_Container.txt');

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');

  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // Generate new vehicle number
  const EO9FvehicleNo1 = `EO9F${getRandomNumberString(6)}`;

  // Store vehicle number in artifact
  writeTestArtifact('vehicleArtifactFile1.txt', EO9FvehicleNo1);

  console.log(`Vehicle Number stored: ${EO9FvehicleNo1}`);

  // Enter vehicle number
  await page.locator(GateEmpty.VehicleNoInput).fill(EO9FvehicleNo1);

    await page.locator(GateImport.TransportDropdown).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
      await page.locator(GateImport.TransportDropdown).click();
    }
    await page.locator(GateImport.TransportDropdownFirst).click();

  // await page.locator(GateEmpty.TransportDropdown).click();

  // await page.locator(GateEmpty.TransportDropdownFirst).click();

  // Fill Custom / Actual Seal
  
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');
  
  const DepotQC = page.locator(GateImport.DepotQualityCODE);
  await DepotQC.click({ force: true });
  await DepotQC.locator('input').fill('AQUABA');
  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

  await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');


//   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

// await PortNameDropdown_TH.click({ force: true });
// await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).click();
// await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).fill(' Automation Testing Script ');
// await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

 const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

await PortNameDropdown_TH.click({ force: true });

await PortNameDropdown_TH.locator('input').click({ force: true });

await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

// const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);

// await plannedOutDropdown.click({ force: true });
// // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).click();
// // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).fill(' Weighbridge 2 ');
// await plannedOutDropdown.locator('input').click();
// await plannedOutDropdown.locator('input').fill('Weighbridge 2');
// await plannedOutDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });

const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);
const input = plannedOutDropdown.locator('input');
const option = page.getByText('Weighbridge 2', { exact: true });

await plannedOutDropdown.click({ force: true });

// Wait for dropdown to actually open
try {
    await input.waitFor({ state: 'visible', timeout: 2000 });
} catch {
    // Dropdown didn't open, click again
    await plannedOutDropdown.click({ force: true });

    await input.waitFor({ state: 'visible', timeout: 5000 });
}

await input.click();
await input.fill('Weighbridge 2');

await option.waitFor({ state: 'visible' });
await option.click({ force: true });
// Weighbridge_input

const plannedInDropdown = page.locator(GateEmpty.Planned_In_Weighbridge_input);
const input1 = plannedInDropdown.locator('input');
const option1 = plannedInDropdown.getByText('Weighbridge 2', { exact: true });

await plannedInDropdown.click({ force: true });

try {
    await option1.waitFor({ state: 'visible', timeout: 2000 });
} catch {
    // Dropdown didn't open, click again
    await plannedInDropdown.click({ force: true });
    await option1.waitFor({ state: 'visible', timeout: 5000 });
}

await input1.waitFor({ state: 'visible' });
await input1.click();
await input1.fill('Weighbridge 2');

await option1.click({ force: true });

// await plannedInDropdown.click({ force: true });
// // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).click();
// // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).fill(' Weighbridge 2 ');
// await plannedInDropdown.locator('input').click();
// await plannedInDropdown.locator('input').fill('Weighbridge 2');
// await plannedInDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });
  // Save
  await page.locator(GateEmpty.SaveButton).click();

  await page.waitForTimeout(10000);

  // Search again
  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

  // Execute
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
}
export async function yardExecution(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await page.locator(YardPlanner.SearchInput).fill(containerNo);

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

  await page.locator(YardPlanner.CraneDropdown).click();

  await page.locator(YardPlanner.FirstOptionItem).click();
   

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');
}

export async function gateOutWithCargoAndTruck(page: Page) {

 // const containerNo = await readTestArtifact('ExportDirect_EmptyIn_Container.txt');

  const EO9FvehicleNo1 = await readTestArtifact('vehicleArtifactFile1.txt');

  console.log(`Using container number: ${containerNo}`);
  console.log(`Using vehicle number: ${EO9FvehicleNo1}`);

  //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page,GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

    await gateToggleLabel1.waitFor({
  state: 'visible',
  timeout: 30000
});
  await gateToggleLabel1.click();

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);
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

test('TC006_GATE_EXPORT_EO9F1.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes

  //  await login(page);
  const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo);
    await newJobOrderXOTP(loginPage);
  //  await ExportBooking_XOTP_With_JobPlan_Savesubmit(page);
    SwitchModule(loginPage, 'Gate Operations');
   await gateInNewVehicle(loginPage); 
   SwitchModule(loginPage, 'Yard Operations');
   await yardExecution(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await gateOutWithCargoAndTruck(loginPage);

});
