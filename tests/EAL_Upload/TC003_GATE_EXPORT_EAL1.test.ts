import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite, ClickonModule } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators'; 
import { GateImport } from 'Locators/GateLocators';


//import { Common,CSME } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
import fs from 'fs';
import { ExportBooking_XITC_With_JobPlan_Savesubmit, ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';
import { cargoShift } from '@tests/Export_Direct/TC005_GATE_EXPORT_EO9F.test';

// const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt')
const containerNo1 = await readTestArtifact('EAL_Container_Number.txt')
//const EO9FvehicleNo = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
// const vehicleArtifactFile1 = await readTestArtifact('ExportDirect_EO9F_Vehicle1.txt');

const jobOrderConfig = {
  XITC: {
    jobCategory: 'Cargo Job',
    activityPoint: 'Cargo Warehouse',
    jobName: 'EXPORT CARGO IN AT WAREHOUSE BY TRUCK (XICT)',
  },
  EO91: {
    jobCategory: 'Container Job',
    activityPoint: 'Container Warehouse',
    jobName: 'CFS Stuffing-Empty Container Depot Stuffed (EO91)',
  },
  XOTP: {
    jobCategory: 'Container Job',
    activityPoint: 'Depot Gate Operation',
    jobName: 'Export Container Out By Truck To Port (XOTP)',
  },
};



export async function newJobOrder(
  page: Page,
  data: any,
  jobOrderType: keyof typeof jobOrderConfig
) {
  const job = jobOrderConfig[jobOrderType];

  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo1);

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.firstBookingLink).click();

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.UpdateDetails).click();

  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');

  await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');

  // Select Job Category
  await page.locator(CSMExport.JobCatId).selectOption(job.jobCategory);

  // Select Activity Point
  await page.locator(CSMExport.JobActId).selectOption(job.activityPoint);

  // Select Job Description
  const dropdown = page.locator(CSMExport.JobDescription);

  const option = dropdown.locator('option').filter({
    hasText: job.jobName,
  });

  const optionValue = await option.getAttribute('value');

  if (!optionValue) {
    throw new Error(`Job Description not found: ${job.jobName}`);
  }

  await dropdown.selectOption(optionValue);

  // // Select Container or Cargo
  // if (job.jobCategory === 'Container Job') {
  //   await page.locator(CSMExport.JobConId).selectOption(data.containerNo);
  // } else if (job.jobCategory === 'Cargo Job') {
  //   await page.locator(CSMExport.CargoNO).selectOption(data.CargoNo);
  // }

  // Select Container or Cargo
if (job.jobCategory === 'Container Job') {
  await page.locator(CSMExport.JobConId).selectOption(containerNo1);
 // await page.locator(CSMExport.JobConId).selectOption({ index: 0 });
} else if (job.jobCategory === 'Cargo Job') {
  await page.locator(CSMExport.CargoNO).selectOption({ index: 0 });
}


  // Add Job Order
  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
}

export async function gateInNewVehicleXITF (page: Page) {
 // await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo1), GateEmpty.EditButton, 'Open Import Container details');

  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // Generate new vehicle number
  const EALvehicle2 = `EO9F${getRandomNumberString(6)}`;

  // Store vehicle number in artifact
  await writeTestArtifact('EALvehicle2.txt', EALvehicle2);

  console.log(`Vehicle Number stored: ${EALvehicle2}`);

  // Enter vehicle number
  await page.locator(GateEmpty.VehicleNoInput).fill(EALvehicle2);

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

  await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');

  // await page.locator(GateImport.OperatorConditionCode).click();
  //     await page.waitForTimeout(1000);
  //     if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {
  //       await page.locator(GateImport.OperatorConditionCode).click();
  //     }
  //     await page.locator(GateImport.OperatorCCFirstOption).click();
  
  //     await page.locator(GateImport.DepotConditionCode).click();
  //     await page.waitForTimeout(1000);
  //     if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {
  //       await page.locator(GateImport.DepotConditionCode).click();
  //     }
  //     await page.locator(GateImport.DepotCCFirstOption).click();
  
      await page.locator(GateImport.DepotQualityCode).click();
      await page.waitForTimeout(1000);
      if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
        await page.locator(GateImport.DepotQualityCode).click();
      }
      await page.locator(GateImport.DepotQCFirstOption).click();


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

// await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

  // await page
  //   .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']")
  //   .fill('2026-01-09T11:15');

  const gateInInput = page.locator(
  "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']"
);

if (await gateInInput.count() > 0) {
  await gateInInput.fill('2026-01-09T11:15');
}
const checkbox = page.locator(
  "//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']"
);

if (await checkbox.count() > 0 && await checkbox.isChecked()) {
  await checkbox.uncheck();
}


  // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

  // Is Weighment?
  // await page
  //   .locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']")
  //   .uncheck();

// const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);

// await plannedOutDropdown.click({ force: true });
// // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).click();
// // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).fill(' Weighbridge 2 ');
// await plannedOutDropdown.locator('input').click();
// await plannedOutDropdown.locator('input').fill('Weighbridge 2');
// await plannedOutDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });


// Weighbridge_input

// const plannedInDropdown = page.locator(GateEmpty.Planned_in_Weighbridgenew);

// await plannedInDropdown.click({ force: true });
// // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).click();
// // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).fill(' Weighbridge 2 ');
// await plannedInDropdown.locator('input').click();
// await plannedInDropdown.locator('input').fill('Weighbridge 2');
// await plannedInDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });
  // Save
  await page.locator(GateEmpty.SaveButton).click();

  await page.waitForTimeout(20000);

  // Search again
  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EALvehicle2}"]]//button[normalize-space()="Validate"]`);

  // Execute
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EALvehicle2}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
}

export async function yardExecution2(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await page.locator(YardPlanner.SearchInput).fill(containerNo1);

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo1), YardPlanner.ExecuteButton, 'Execute move');

  await page.locator(YardPlanner.CraneDropdown).click();

  await page.locator(YardPlanner.FirstOptionItem).click();

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

  await expect(page.locator(YardPlanner.ContainerLink(containerNo1))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo1 + ' completed successfully');
}


export async function gateOutWithCargoAndTruck1(page: Page) {

 // const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

 const EALvehicle2 = await readTestArtifact('EALvehicle2.txt');

  console.log(`Using container number: ${containerNo1}`);
  console.log(`Using vehicle number: ${EALvehicle2}`);

    await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page,GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel1.click();

  await gateToggleLabel1.waitFor({
  state: 'visible',
  timeout: 30000
});
  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EALvehicle2}"]]//button[normalize-space()="Validate"]`);
}
function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}


test('TC003_GATE_EXPORT_XITF1.test.ts', async ({ page }) => 
    {

  test.setTimeout(500000); // 2 minutes
   // await login(page);
   const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo1);
   await newJobOrder(loginPage,jobOrderConfig,'XOTP');
   await ExportBooking_XOTP_With_JobPlan_Savesubmit(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await gateInNewVehicleXITF(loginPage); 
   SwitchModule(loginPage, 'Yard Operations');
   await yardExecution2(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await gateOutWithCargoAndTruck1(loginPage);

});