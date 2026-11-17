import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, selectEntityAndSite } from '../../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport } from 'Locators/GateLocators';
// import { GateCommon, GateExport } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators'; 


//import { Common,CSME } from 'Locators/BookingLocators';
// import { selectFutureDay } from 'utils/createExcelData';
import fs from 'fs';
import { ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';

//import { Gate_Import } from 'Flows/ImportFlow';
import { GateEmptyBookingLocators } from 'Locators/All locators/GateEmptyIn_Out';

const containerNo = await readTestArtifact('ImportIndirect_Container.txt')
const IndirectImportbookingNumber = await readTestArtifact('ImportINDirect_BookingNumber.txt')
//const IndirectimportcargoNo = await readTestArtifact('IndirectimportCargoNumber.txt')
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
   MOCT: {
    jobCategory: 'Cargo Job',
    activityPoint: 'Cargo Warehouse',
    jobName: 'Import Carting From Warehouse  (MOCT)',
  },
};

export async function newJobOrder(
  page: Page,
  data: any,
  jobOrderType: keyof typeof jobOrderConfig
) {
  const job = jobOrderConfig[jobOrderType];

 // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMEmpty.AddBooking, 'Route to Empty booking screen');

 // await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo);

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.firstBookingLink).click();

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.UpdateDetails).click();

  await clickAndMeasureDynamic(page, CSMExport.Container, CSMExport.AddContainer, 'Route to Container tab');

  await page.locator(CSMImport.OpenActions).isVisible();
  await page.locator(CSMImport.OpenActions).click(); 
  await page.locator(CSMImport.MapListItem).click();


  const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
  writeTestArtifact('ImportInDirectCargo.txt',cargoNo1);
    console.log(`Cargo Number stored: ${cargoNo1}`);

  await clickAndMeasureDynamic(page,'//button[normalize-space()="Back"]' , CSMExport.Container, 'Route to Container tab');

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
  await page.locator(CSMExport.JobConId).selectOption(containerNo);
 // await page.locator(CSMExport.JobConId).selectOption({ index: 0 });
} else if (job.jobCategory === 'Cargo Job') {
  await page.locator(CSMExport.CargoNO).selectOption(cargoNo1);
}

 await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="EstDateTime"]').click();

 await selectFutureDay(page, 1);
  // Add Job Order
  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
}


export async function gateInCargoImportIndirect(page: Page) {

    const ImportIndirectvehicle = await readTestArtifact('IndirectImportvehicle1.txt');

// await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateExport.CargoButton, 'Route to Cargo');

await clickAndMeasureDynamic(page, GateExport.CargoButton, GateExport.ExportCargoLink, 'Route to Export Cargo');

//await clickAndMeasureDynamic(page, GateExport.ExportCargoLink, GateExport.SearchByBookingInput, 'Route to Export Cargo');

await page.locator(GateExport.SearchByBookingInput).fill(IndirectImportbookingNumber);

await page.locator(GateExport.SearchButton).click();

await page.click(GateExport.ValidateButtonE(ImportIndirectvehicle));

await clickAndMeasureDynamic(page, GateExport.ExecuteButtonE(ImportIndirectvehicle), GateExport.ContainerButton, 'Execute Button');
}
export async function gateInNewVehicle(page: Page) {
 // await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');

  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // Generate new vehicle number
  const EO91FvehicleNo1 = `EO91${getRandomNumberString(6)}`;

  // Store vehicle number in artifact
 await writeTestArtifact( 'vehicleartifact.txt', EO91FvehicleNo1);

  console.log(`Vehicle Number stored: ${EO91FvehicleNo1}`);

  // Enter vehicle number
  await page.locator(GateEmpty.VehicleNoInput).fill(EO91FvehicleNo1);

  await page.locator(GateEmpty.TransportDropdown).click();

  await page.locator(GateEmpty.TransportDropdownFirst).click();

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

const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);

await plannedOutDropdown.click({ force: true });
// await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).click();
// await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).fill(' Weighbridge 2 ');
await plannedOutDropdown.locator('input').click();
await plannedOutDropdown.locator('input').fill('Weighbridge 2');
await plannedOutDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });


// Weighbridge_input

const plannedInDropdown = page.locator(GateEmpty.Planned_in_Weighbridgenew);

await plannedInDropdown.click({ force: true });
// await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).click();
// await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).fill(' Weighbridge 2 ');
await plannedInDropdown.locator('input').click();
await plannedInDropdown.locator('input').fill('Weighbridge 2');
await plannedInDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });
  // Save

await clickAndMeasureDynamic(page, GateEmpty.SaveButton, GateEmpty.SearchByContainerInput, 'Save vehicle');

  // await page.locator(GateEmpty.SaveButton).click();

  // await page.waitForTimeout(1000);

  // Search again
  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EO91FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

  // Execute
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO91FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
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



export async function gateOutWithImportIndirectCargoAndTruck(page: Page) {


 const IndirectImportvehicle1 = await readTestArtifact('IndirectImportvehicle1.txt');

  console.log(`Using container number: ${containerNo}`);
  console.log(`Using vehicle number: ${IndirectImportvehicle1}`);

  //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page,CSMExport.Cargo, GateEmpty.SearchButton, 'Route to import cargoi tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel1.click();

  await page.locator(GateImport.SearchbybookingNo).fill(IndirectImportbookingNumber);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${IndirectImportvehicle1}"]]//button[normalize-space()="Validate"]`);
}
function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
// export async function IndirectImportCargoTally(
//   page: Page,
//   INdirectIMvehicle: string
// ): Promise<void> {

// //  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

//   const containerNo =  readTestArtifact('ExportINDirect_EO91_Container.txt');
//   console.log('Using container number:', containerNo);

// //  await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp code

//   await clickAndMeasureDynamic(page, Cargo.CargoStorage, Cargo.Export_Cargo_Carting_Execution, 'Route to Export cargo cart tab '); //new code 
  
//   await clickAndMeasureDynamic(page, Cargo.Import_Cargo_Carting_Execution, Cargo.Import_Cargo_Carting, 'Click on Export cargo cart Execution tab '); //new code 

//  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

//  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
// //  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

//  // await page.locator('//button[normalize-space()="Search"]').click(); //old code

//   await page.locator(Cargo.SearchInput).fill(IndirectImportbookingNumber);

//   await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

//   await page.locator(Cargo.FirstTallyNumber).click();

//   await page.locator(Cargo.AddTallyButton).click();

//   // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

// //  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

//  // await page.locator(Cargo.VehicleLink(INdirectIMvehicle)).click();

// // await page.locator(Cargo.AddTallyButton).click(); //recent

//   //await page.locator(Cargo.ContainerNoDropdown).selectOption({ label: containerNo }); // Tally Type : Full

//   await page.locator(Cargo.PlanDateInput).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

//   // // // await page.keyboard.press('ArrowRight');

//  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

//   // // // await page.keyboard.press('ArrowRight');  

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

//   await page.keyboard.press('ArrowRight'); //need when full code run

//   console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });

//   // // await page.keyboard.press('ArrowDown');

//   await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');

//   await page.locator(Cargo.YesSubmitButton).click();

//   await page.locator(Cargo.FirstTallyNumber).click();

// //  await page.locator(`//a[@class="hover:opacity-70"]`).click(); // temp code need to remove for runn full code 
// // await page.locator("//a[text()='18082026121310694']").click(); //temp code need to remove for full run code 
// // await page.waitForTimeout(10000);

//   await page.locator(Cargo.AddCargoButton).click();

//  //const declaredPackages ='100';
// //  const declaredPackages = await page
//  //await page .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
//  //   .inputValue();//old

//  // await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);//old

//   //await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);//old

//   const declaredPackage1 = '100';

//   await page.waitForTimeout(1000);

//   await page.locator(Cargo.TallyPackagesInput1).fill(declaredPackage1);

//   await page.waitForTimeout(1000);

//   await page.locator(Cargo.NoOfGoodPackagesInput).fill(declaredPackage1);

//   await page.locator(Cargo.NoOfDamagedPackagesInput).fill('0');

//   await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');

//  // await page.locator(Cargo.SubmitButton).click(); ////***old code */

//   await page.locator(Cargo.YesSubmitButton).click();

//   await page.locator(Cargo.SubmitButton).click();

//   await page.locator(Cargo.YesSubmitButton).click();

//  await clickAndMeasureDynamic(page, Cargo.CompleteCarting, Cargo.YescompleteButton, 'Complete carting');

//  await page.locator(Cargo.YescompleteButton).click();

// //  await page.locator(Cargo.Arrived).click();

// //  await page.locator(Cargo.Arrived).click();

//   // await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

//   // await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoUnloadButton, Cargo.CompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

//   // await page.locator(Cargo.YesButton).click();
  
//   // await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

//   // await page.locator('//button[normalize-space()="Yes"]').click();

//   console.log('Tally completed successfully');

  
// }

export async function IndirectImportCargoTally(
  page: Page,
  INdirectIMvehicle: string
): Promise<void> {

//  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

  const containerNo =  readTestArtifact('ExportINDirect_EO91_Container.txt');
  console.log('Using container number:', containerNo);

//  await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp code

  await clickAndMeasureDynamic(page, Cargo.CargoStorage, Cargo.Export_Cargo_Carting_Execution, 'Route to Export cargo cart tab '); //new code 
  
  await clickAndMeasureDynamic(page, Cargo.Import_Cargo_Carting_Execution, Cargo.Import_Cargo_Carting, 'Click on Export cargo cart Execution tab '); //new code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
//  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

 // await page.locator('//button[normalize-space()="Search"]').click(); //old code


  // Wait until Search Input is ready
  await page.locator(Cargo.SearchInput).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.SearchInput).fill(IndirectImportbookingNumber);


  // Wait until cargo table result is available
  await page.locator(Cargo.FirstCargoTableRowSpan).first().waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE


  // Wait until tally number is available
  await page.locator(Cargo.FirstTallyNumber).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.FirstTallyNumber).click();


  // Wait until Add Tally button is available
  await page.locator(Cargo.AddTallyButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.AddTallyButton).click();

  // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

//  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

 // await page.locator(Cargo.VehicleLink(INdirectIMvehicle)).click();

// await page.locator(Cargo.AddTallyButton).click(); //recent

  //await page.locator(Cargo.ContainerNoDropdown).selectOption({ label: containerNo }); // Tally Type : Full


  // Get date/time only once so all fields use the same value
  const planDate = getNextDateTimeFormatted(1);

  // Wait until Plan Date input is ready
  await page.locator(Cargo.PlanDateInput).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.PlanDateInput).type(`${planDate.day}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');

 await page.keyboard.type(`${planDate.month}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');  

  await page.keyboard.type(`${planDate.year}`, { delay: 200 });

  await page.keyboard.press('ArrowRight'); //need when full code run

  console.log(`Filling Plan Date : ${planDate.month}/${planDate.day}/${planDate.year}`);

  await page.keyboard.type(`${planDate.hours}:${planDate.minutes}`, { delay: 200 });

  // // await page.keyboard.press('ArrowDown');


  // Save Tally
  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');


  // Wait for Yes Submit button before clicking
  await page.locator(Cargo.YesSubmitButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.YesSubmitButton).click();


  // Wait until first tally number is available again
  await page.locator(Cargo.FirstTallyNumber).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.FirstTallyNumber).click();

//  await page.locator(`//a[@class="hover:opacity-70"]`).click(); // temp code need to remove for runn full code 
// await page.locator("//a[text()='18082026121310694']").click(); //temp code need to remove for full run code 
// await page.waitForTimeout(10000);


  // Wait until Add Cargo button is available
  await page.locator(Cargo.AddCargoButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.AddCargoButton).click();

 //const declaredPackages ='100';
//  const declaredPackages = await page
 //await page .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
 //   .inputValue();//old

 // await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);//old

  //await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);//old

  const declaredPackage1 = '100';


  await page.waitForTimeout(1000);


  // Wait until Tally Packages input is ready
  await page.locator(Cargo.TallyPackagesInput1).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.TallyPackagesInput1).fill(declaredPackage1);


  await page.waitForTimeout(1000);


  // Wait until Good Packages input is ready
  await page.locator(Cargo.NoOfGoodPackagesInput).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.NoOfGoodPackagesInput).fill(declaredPackage1);


  // Wait until Damaged Packages input is ready
  await page.locator(Cargo.NoOfDamagedPackagesInput).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.NoOfDamagedPackagesInput).fill('0');


  // Save Tally
  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');

 // await page.locator(Cargo.SubmitButton).click(); ////***old code */


  await page.locator(Cargo.YesSubmitButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.YesSubmitButton).click();


  // Wait for Submit button
  await page.locator(Cargo.SubmitButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.SubmitButton).click();


  // Wait for confirmation
  await page.locator(Cargo.YesSubmitButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.locator(Cargo.YesSubmitButton).click();


  // Complete carting
 await clickAndMeasureDynamic(page, Cargo.CompleteCarting, Cargo.YescompleteButton, 'Complete carting');


  // Wait for Complete confirmation
  await page.locator(Cargo.YescompleteButton).waitFor({
    state: 'visible',
    timeout: 60000
  });

 await page.locator(Cargo.YescompleteButton).click();

//  await page.locator(Cargo.Arrived).click();

//  await page.locator(Cargo.Arrived).click();

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  // await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoUnloadButton, Cargo.CompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

  // await page.locator(Cargo.YesButton).click();
  
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

  // await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');

  
}

export async function IndirectCargoTally1(
  page: Page
): Promise<void> {

//  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

  // const containerNo = await readTestArtifact('');
  // console.log('Using container number:', containerNo);


 // await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp code

  await clickAndMeasureDynamic(page, Cargo.CargoStorage, Cargo.Export_Cargo_Storage_Stuffing, 'Route to Export cargo cart tab '); //new code 
  
//  await clickAndMeasureDynamic(page, Cargo.Export_Cargo_Storage_Stuffing, Cargo.SearchInput, 'Click on Export cargo cart Execution tab '); //new code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
//  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

 // await page.locator('//button[normalize-space()="Search"]').click(); //old code

  await page.locator(Cargo.SearchInput).fill(IndirectImportbookingNumber);

  // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

  await page.locator(Cargo.FirstTallyNumber).click();

  await page.locator(Cargo.AddTallyButton).click();

  //await page.locator(Cargo.ContainerNoDropdown).selectOption({ label: containerNo }); // Tally Type : Full

  await page.locator(Cargo.PlanDateInput).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');

  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');  

  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

  await page.keyboard.press('ArrowRight'); //need when full code run

  console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });

  // // await page.keyboard.press('ArrowDown');

  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');

  await page.locator(Cargo.YesSubmitButton).click();



  await page.locator(Cargo.FirstTallyNumber).click();

//  await page.locator(`//a[@class="hover:opacity-70"]`).click(); // temp code need to remove for runn full code 
// await page.locator("//a[text()='18082026121310694']").click(); //temp code need to remove for full run code 
// await page.waitForTimeout(10000);

  await page.locator(Cargo.AddCargoButton).click();

 //const declaredPackages ='100';
//  const declaredPackages = await page
 //await page .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
 //   .inputValue();//old

 // await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);//old

  //await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);//old

  const declaredPackage1 = '100';

  await page.waitForTimeout(2000);

  await page.locator(Cargo.TallyPackagesInput1).fill(declaredPackage1);

  await page.locator('select[name="warehouseid"]').selectOption({
  label: 'NN4RQ5E7'
});
await page.locator('select[name="locationid"]').selectOption({
  label: '2N7NCLM5'
});


  await page.waitForTimeout(2000);

  await page.locator(Cargo.NoOfGoodPackagesInput).fill(declaredPackage1);

  await page.locator(Cargo.NoOfDamagedPackagesInput).fill('0');

  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.YesSubmitButton, 'Update Tally');

 // await page.locator(Cargo.SubmitButton).click(); ////***old code */

  await page.locator(Cargo.YesSubmitButton).click();

   await page.locator(Cargo.SubmitButton).click();

  await page.locator(Cargo.YesSubmitButton).click();

 await clickAndMeasureDynamic(page, Cargo.Complete_Destuffing, Cargo.YescompleteButton, 'Complete carting');

 await page.locator(Cargo.YescompleteButton).click();

//  await page.locator(Cargo.Arrived).click();

//  await page.locator(Cargo.Arrived).click();

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  // await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoUnloadButton, Cargo.CompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

  // await page.locator(Cargo.YesButton).click();
  
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

  // await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');

  
}
export async function ImportIndirectBooking_Add_Transport(
  page: Page,
  vehicleArtifactFile: string = 'IndirectImportvehicle1.txt'
) {
  await clickAndMeasureDynamic(page,'//button[normalize-space()="Cargo Transport"]', '//button[normalize-space()="+ Add Transport"]', 'Route to Cargo Transport');

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ Add Transport"]',
    '//input[@formcontrolname="NoOfTransports"]',
    'Add Transport Details'
  );

//  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();

  const MFvehicleNo = `EO9F${getRandomNumberString(6)}`;
  writeTestArtifact(vehicleArtifactFile, MFvehicleNo);
  console.log(`Vehicle Number stored: ${MFvehicleNo}`);

 // await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);
  await page.locator('//label[text()="Transport Mode Number"]/parent::div/input').fill(MFvehicleNo);
  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  await page.locator('//button[text()="Add"]').click();
   
}
export async function ImportIndirectBookingMOCT_With_JobPlan_Savesubmit(
  page: Page,) {
  test.setTimeout(200_000); // 2 minute timeout for this test
  
  await test.step('Step 7:Create job order for new Booking Record', async () => {
     // Add Job Order
  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="Add"]',
  //   '//button[normalize-space()="Job Plan"]',
  //   'Add Job Order'
  // );
 await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Job Plan"]','//button[text()="Save"]',
    'click on Job plan'
  );


const LoadingType = page.locator(
  '//label[text()="LoadingType*"]/following-sibling::select'
);

await LoadingType.click({ force: true });

await LoadingType.selectOption({ label: 'Forklift and Labour' });


  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Submit Job Order'
  );

  });
}
export async function cargoShift(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.YardExecutionButton, 'Route Yard Operation');

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
export async function Import_Direct_Booking__With_JobPlan_Savesubmit(
  page: Page,) {
  test.setTimeout(200_000); // 2 minute timeout for this test
  
   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
    await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');
      await page.locator('//input[@placeholder="Search"]').fill(IndirectImportbookingNumber);  // Temp 
     await page.waitForTimeout(2000);             // Temp      
     await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
     await page.waitForTimeout(2000); // Temp 
     await page.locator(CSMExport.UpdateDetails).click();// Temp 
  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
  
  await page.locator('(//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"])[1]').click();// Temp 

  await test.step('Step 7:Create job order for new Booking Record', async () => {
    
//  await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Job Plan"]','//button[text()="Save"]',
//     'click on Job plan'
//   );


const LoadingType = page.locator(
  '//label[text()="LoadingType*"]/following-sibling::select'
);

await LoadingType.click({ force: true });

await LoadingType.selectOption({ label: 'Forklift and Labour' });


  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Submit Job Order'
  );

  });
}

// const surveyRemark = 'Condition OK';
// const containerNo = 'CNTU0795079';
// //const EO9FvehicleNo ='EO9F254257';
// const bookingNumber='11110BN20260818001EXP';

// Container number artifact file


// test('TC003_GATE_IMPORT_INDIRECT2.test.ts', async ({ page }) => {
//   test.setTimeout(800000); // 2 minutes
//    //await login(page);
//    const loginPage = await login(page);
//    await selectEntityAndSite(loginPage);
//    console.log('Using container number:', containerNo);
//    await cargoShift(loginPage);
//    await SwitchModule(loginPage, 'Cargo Warehouse Management');
//    await IndirectCargoTally1(loginPage);
//    await SwitchModule(loginPage, 'Customer Service Portal');
//    await newJobOrder(loginPage,jobOrderConfig,'MOCT');
//    await ImportIndirectBooking_Add_Transport(loginPage,'IndirectImportvehicle1.txt');
//    await ImportIndirectBookingMOCT_With_JobPlan_Savesubmit(loginPage);
//    await SwitchModule(loginPage, 'Gate Operations');
//    await gateInCargoImportIndirect(loginPage);
//    await SwitchModule(loginPage, 'Cargo Warehouse Management');
//    await IndirectImportCargoTally(loginPage,'IndirectImportvehicle1.txt');
//    await SwitchModule(loginPage, 'Gate Operations');
//    await gateOutWithImportIndirectCargoAndTruck(loginPage);

// });

test('TC004_GATE_IMPORT_INDIRECT3.test.ts', async ({ page }) => {
  test.setTimeout(800000);

  console.log('========== TC003 START ==========');

  const loginPage = await login(page);
  console.log('STEP 1: Login completed');

  await selectEntityAndSite(loginPage);
  console.log('STEP 2: Entity and Site selected');

  console.log('Container number:', containerNo);

  await Import_Direct_Booking__With_JobPlan_Savesubmit(loginPage);

  console.log('STEP 10: Starting gateInCargoImportIndirect');

  await gateInCargoImportIndirect(loginPage);

  console.log('STEP 10: gateInCargoImportIndirect completed');

  await SwitchModule(loginPage, 'Cargo Warehouse Management');

  console.log('STEP 13: Switched to Cargo Warehouse Management');

  await IndirectImportCargoTally( loginPage, 'IndirectImportvehicle1.txt');
  
  console.log('STEP 14: Import Cargo Tally completed');

  await SwitchModule(loginPage, 'Gate Operations');
  console.log('STEP 15: Switched to Gate Operations');

  await gateOutWithImportIndirectCargoAndTruck(loginPage);
  console.log('STEP 16: Gate Out completed');

  console.log('========== TC003 COMPLETED ==========');
});
