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
import { ExportBooking_XITC_With_JobPlan_Savesubmit, ExportBooking_XOTP_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';

// import { Gate_Import } from 'Flows/ImportFlow';
import { GateEmptyBookingLocators } from 'Locators/All locators/GateEmptyIn_Out';

const containerNo = await readTestArtifact('ImportMO9F_Container.txt');
const ImportDirectBooking_No = await readTestArtifact('ImportDirect_BookingNumber.txt');

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

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo);

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
  await page.locator(CSMExport.JobConId).selectOption(containerNo);
 // await page.locator(CSMExport.JobConId).selectOption({ index: 0 });
} else if (job.jobCategory === 'Cargo Job') {
  await page.locator(CSMExport.CargoNO).selectOption({ index: 0 });
}


  // Add Job Order
  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
}
export async function newJobOrderXOTP(page: Page) {

 // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service'); // Start Final code

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

  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
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

const MO9FvehicleNo1 = await readTestArtifact('MF_Vehicle1.txt')


  console.log(`Using vehicle number: ${MO9FvehicleNo1}`);

//    await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

   await clickAndMeasureDynamic(page, GateExport.CargoButton, GateExport.SearchByBookingInput, 'Route to Export Cargo');

//  await clickAndMeasureDynamic(page,GateImport.ImportContainerTab, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel1.click();

  await page.locator(GateImport.SearchbybookingNo).fill(ImportDirectBooking_No);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${MO9FvehicleNo1}"]]//button[normalize-space()="Validate"]`);

}
function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}

export async function ImportDirectCargoTally(
  page: Page
): Promise<void> {

//  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

//   const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');
//   console.log('Using container number:', containerNo);


 // await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp code

  await clickAndMeasureDynamic(page, Cargo.CargoVerificationButton, Cargo.ExportCargoVerificationButton, 'Route to Export cargo verification tab '); //new code 


 // await clickAndMeasureDynamic(page, Cargo.CargoStorage, Cargo.Export_Cargo_Storage_Stuffing, 'Route to Export cargo cart tab '); //new code 
  
 // await clickAndMeasureDynamic(page, Cargo.Export_Cargo_Storage_Stuffing, Cargo.SearchInput, 'Click on Export cargo cart Execution tab '); //new code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
//  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

 // await page.locator('//button[normalize-space()="Search"]').click(); //old code

  await page.locator(Cargo.SearchInput).fill(ImportDirectBooking_No);

  // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

  await page.locator(Cargo.FirstTallyNumber).click();

  await page.locator(Cargo.AddTallyButton).click();

 await page.locator(Cargo.ContainerNoDropdown).selectOption({ label: containerNo }); // Tally Type : Full

 await page.locator(Cargo.PlanDateInput).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

// await page.keyboard.press('ArrowRight');

 await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');  

 await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

  await page.keyboard.press('ArrowRight'); //need when full code run

  console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });

  // // await page.keyboard.press('ArrowDown');

  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.AddTallyButton, 'Update Tally');

 //  await page.locator(Cargo.ContainerRowLink(containerNo)).click();
  // await page.locator(Cargo.YesSubmitButton).click();

 await page.locator(Cargo.FirstTallyNumber).click();

//  await page.locator(`//a[@class="hover:opacity-70"]`).click(); // temp code need to remove for runn full code 
// await page.locator("//a[text()='18082026121310694']").click(); //temp code need to remove for full run code 
// await page.waitForTimeout(10000);

 await page.locator(Cargo.AddCargoButton).click();

const declaredPackages ='100';
//  const declaredPackages = await page
 await page .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
    .inputValue();//old

 await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);//old

await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);//old

 const declaredPackage1 = '100';

 await page.waitForTimeout(2000);

 await page.locator(Cargo.TallyPackagesInput).fill(declaredPackage1);

   await page.waitForTimeout(2000);

  await page.locator(Cargo.NoOfGoodPackagesInput).fill(declaredPackage1);

 await page.locator(Cargo.NoOfDamagedPackagesInput).fill('0');

  await clickAndMeasureDynamic(page, Cargo.UpdateButton, Cargo.SubmitButton, 'Update Tally');

 await page.locator(Cargo.SubmitButton).click(); ////***old code */

  await page.locator(Cargo.YesSubmitButton).click();

  // await clickAndMeasureDynamic(page, Cargo.Complete_stuffing, Cargo.YescompleteButton, 'Complete carting');

  // await page.locator(Cargo.YescompleteButton).click();

 //await clickAndMeasureDynamic(page, Cargo.CargoCompleteTransportCargoUnloadButton, Cargo.YesButton, 'Complete Transport Cargo Unload');
 await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoLoadButton, Cargo.YesButton, 'Complete Transport Cargo Unload');

  await page.locator(Cargo.YesButton).click();

//  await clickAndMeasureDynamic(page, Cargo.CargoCompleteContainerdeStuffingButton, Cargo.CargoStuffingYesButton, 'Complete Container Stuffing');
  await clickAndMeasureDynamic(page, Cargo.CargoCompleteContainerdeStuffingButton, Cargo.CargoStuffingYesButton, 'Complete Container Stuffing');

  await page.locator(Cargo.CargoStuffingYesButton).click();
 

//  await page.locator(Cargo.Arrived).click();

//  await page.locator(Cargo.Arrived).click();

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  //  await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoUnloadButton, Cargo.CompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

  //  await page.locator(Cargo.YesButton).click();
  
  //  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

  //  await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');

  
}

export async function gateInCargoIndirect(page: Page) {

  const MO9FvehicleNo = await readTestArtifact('MF_Vehicle1.txt')

//await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateExport.CargoButton, 'Route to Cargo');

await clickAndMeasureDynamic(page, GateExport.CargoButton, GateExport.SearchByBookingInput, 'Route to Export Cargo');

///await clickAndMeasureDynamic(page, GateExport.ExportCargoLink, GateExport.SearchByBookingInput, 'Route to Export Cargo');

await page.locator(GateExport.SearchByBookingInput).fill(ImportDirectBooking_No);

await page.locator(GateExport.SearchButton).click();

await page.click(GateExport.ValidateButtonE(MO9FvehicleNo));

await clickAndMeasureDynamic(page, GateExport.ExecuteButtonE(MO9FvehicleNo), GateExport.ContainerButton, 'Execute Button');

}
export async function cargoShift(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await clickAndMeasureDynamic(page, YardPlanner.Shiftingbutton, YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');

  await page.locator(YardPlanner.FirstContainerY).click();

  await page.locator(YardPlanner.Shiftbutton).click();

  await page.waitForTimeout(1000);

  // const shiftToStack = page.locator(YardPlanner.Shifttostack);

  // await shiftToStack.waitFor({ state: 'visible' });

  // await shiftToStack.scrollIntoViewIfNeeded();

  // await shiftToStack.click();

  // const search = page.locator(YardPlanner.Searchshift);

  // await search.waitFor({ state: 'visible' });

  // await search.fill('stuff-destuff');

  // const option = page.locator(YardPlanner.Stuff_destuff);

  // await option.waitFor({ state: 'visible', timeout: 30000 });

  // await option.click();

  await page.locator(YardPlanner.Shiftbutton).click();

  await page.waitForTimeout(20000);
}
export async function Import_Direct_Booking__With_JobPlan_Savesubmit(
  page: Page,) {
  test.setTimeout(200_000); // 2 minute timeout for this test
  
   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
    await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');
      await page.locator('//input[@placeholder="Search"]').fill(ImportDirectBooking_No);  // Temp 
     await page.waitForTimeout(2000);             // Temp      
     await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
     await page.waitForTimeout(2000); // Temp 
     await page.locator(CSMExport.UpdateDetails).click();// Temp 
  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
  
  await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 

  await test.step('Step 7:Create job order for new Booking Record', async () => {
    
//  await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Job Plan"]','//button[text()="Save"]',
//     'click on Job plan'
//   );


const cartingDoneBy = page.locator(
  '//label[text()="DestuffDoneBy*"]//following-sibling::select'
);

await cartingDoneBy.click({ force: true });

await cartingDoneBy.selectOption({ label: 'LBR' });


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


test('TC003_GATE_IMPORT_MO9F_.test.ts', async ({ page }) => {
  test.setTimeout(800000); // 2 minutes
  // await login(page);
   const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   console.log('Using container number:', containerNo);
   await Import_Direct_Booking__With_JobPlan_Savesubmit(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await gateInCargoIndirect(loginPage);
   SwitchModule(loginPage, 'Yard Operations');
   await cargoShift(loginPage);
   SwitchModule(loginPage, 'Cargo Warehouse Management');
   await ImportDirectCargoTally(loginPage);
   SwitchModule(loginPage, 'Gate Operations');
   await gateOutWithCargoAndTruck(loginPage);

});