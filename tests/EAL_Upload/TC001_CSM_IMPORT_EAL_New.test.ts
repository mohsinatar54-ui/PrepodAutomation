import { test,Page, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact,readTestArtifact } from '../../utils/test-helpers';
import { createExcelFile, createExcelFileForEAL } from '../../utils/createExcelData';
import { CSMExport,CSMImport } from 'Locators/BookingLocators';
import { selectEntityAndSite } from '../../utils/test-helpers';
import { Common } from 'Locators/BookingLocators';
import { selectFutureDay } from '../../utils/test-helpers';
 
 
import fs from 'fs';
import { waitForDebugger } from 'inspector';
import { text } from 'stream/consumers';
import { ExportBooking_XITF_With_JobPlan_Savesubmit1 } from 'Flows/ExportFlow';
 const EALExportData = {
 Move_Type : 'ENBLOCK',
 InputFormat : 'EAL1',
 OutputFormat : 'IGM',
 Manifest_Status : 'Transfer',
 DepotSizeType : '20 STD (20STD)',
 ISOSizeType :'20G1',
 TotalContainers :'5',
 Transport_Mode : 'Vessel',
 CHA_Name :'MMJ LOGISTICS(MMJ001)',
 OperatorID :'MAERSKLINE',
 Commodity : 'WHEAT',
 PortOfLoading : 'DUBAI1',
 PortOfArrival : 'BPCL',
 DECWeight : '1000',
 DECVolume : '1000',
 WeightUnit : 'Tonnes',
 VolumeUnit :'Cubic Meter',
//const Packages = '100';
 PackageType : 'Bulk',
 FreightKind : 'FCL',
 JobCategory : 'Container Job',
 JobActivityPoint : 'Depot Gate Operation',
 JobDescription: "3: 1078",
 CargoPackages: '100'

 };

export async function createEALImportBooking(page: Page,data:any,ContainerNumberFile:string,bookingNumberFile:string)
 {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
 // await login(page);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');
 
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
 
  await clickAndMeasureDynamic(page, Common.BookingTab,CSMExport.ClickonBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.EALupload, 'Route to Export booking screen');
  
  await clickAndMeasureDynamic(page,CSMExport.EALupload,CSMExport.ADD_EaL_upload, 'Route to IAL screen');

 
  await clickAndMeasureDynamic(page,CSMExport.ADD_EaL_upload,CSMExport.New_EAl_bookingScreen, 'Add Import Booking via IAL');
  // page.pause();
 
   await page.locator(CSMExport.LoadingPort).fill(data.PortOfLoading);
     await page.locator('//div[text()="DUBAI1"]/parent::li')
    .filter({ hasText: data.PortOfLoading })
    .click();
    await page.locator(CSMExport.DischargePort).fill(data.PortOfArrival);
      await page.locator('//div[text()="BPCL"]/parent::li')
    .filter({ hasText: data.PortOfArrival })
    .click();
  // await page.locator('select[formcontrolname="PortOfCallID"]').selectOption(PortOfArrival);
 // await page.locator('select[formcontrolname="MoveTypeID"]').selectOption(data.Move_Type);

//   const checkbox = page.locator('//input[@formcontrolname="IsLCLBooking"]');

// if (!(await checkbox.isChecked())) {
//   await checkbox.check();
// }
 
  await page.locator('select[formcontrolname="InputFormatID"]').selectOption(data.InputFormat);
 
  
  // await page.locator('select[formcontrolname="InputFormatID"]').selectOption(OutputFormat);
  const { filePath } = createExcelFileForEAL();

  const fileChooserPromise = page.waitForEvent('filechooser');

await page.locator('//input[@placeholder="Select File"]').click();

const fileChooser = await fileChooserPromise;

await fileChooser.setFiles(filePath);
 
 // await page.locator('//input[@placeholder="Select File"]').setInputFiles(filePath);
 
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Save"]', '//app-confirm-box[.//span[contains(normalize-space(), "Invalid ISO container number")]]', 'Submit IAL booking');
   const confirmBox = page.locator(
  "//app-confirm-box[.//span[contains(normalize-space(), 'Invalid ISO container number')]]"
);

if (await confirmBox.isVisible({ timeout: 3000 }).catch(() => false)) {
  await confirmBox.locator("//button[text()='Yes']").click();
}

 await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update"]',
    '//button[normalize-space()="Cargo"]',
    'Update booking details'
  );
  
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', `//select[@formcontrolname="IGMStatus"]`, 'Route to IAL listing');

  await page.locator('//select[@formcontrolname="IGMStatus"]').selectOption(data.Manifest_Status)

  await page.waitForTimeout(10000);
  
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Save"]', '//button[normalize-space()="Back"]', 'Update IAL booking');
   await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update"]',
    '//button[normalize-space()="Cargo"]',
    'Update booking details'
  );

   await page.locator(CSMImport.ContainerTabButton).click();
    await page.waitForTimeout(2000);
    const containerNo = await page.locator('//td[1]').innerText();
    console.log(containerNo);
    writeTestArtifact(ContainerNumberFile, containerNo);
  const backButton = page.locator('//button[normalize-space()="Back"]');
  const manualBookingButton = page.locator('//button[normalize-space()="Manual Booking"]');

if (await backButton.isVisible()) {

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Back"]',
    '//select[@formcontrolname="IGMStatus"]',
    'Route to IAL listing'
  );

} else if (await manualBookingButton.isVisible()) {

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Manual Booking"]',
    '//input[@formcontrolname="BLNumber"]',
    'Route to IAL screen'
  );

}

await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMImport.AddBookingButton, 'Route to Import booking screen');

const ContainerNo = await readTestArtifact(ContainerNumberFile);

await page.locator('//input[@formcontrolname="ContainerNo"]').fill(ContainerNo);

// await page.locator('//button[normalize-space()="Search"]').click();

await clickAndMeasureDynamic(
    page,
    '//table//tbody/tr[1]/td[1]//a',
    '//button[normalize-space()="Update Details"]',
    'Open Import Booking details'
  );
await page.locator(CSMImport.UpdateDetailsButton).isVisible();
    await expect(page.locator(CSMImport.BookingNumberLabel)).toBeVisible();
    // const bookingNumber = (await page.locator(CSMImport.BookingNumberLabel).textContent())?.replace(/\s+/g, '');
    await page.waitForTimeout(3000);
    const bookingNumber = await page.locator(CSMImport.BookingNumberLabel).textContent();
    console.log('Booking Number:', bookingNumber);
   // console.log('BLN Number:', data.blnNumber);

    writeTestArtifact(bookingNumberFile, `${bookingNumber}`);
  //  writeTestArtifact(blnNumberFile, data.blnNumber);
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update Details"]',
    '//button[normalize-space()="Booking Details"]',
    'Route to Update Details page'
  );


  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update"]',
    '//button[normalize-space()="Cargo"]',
    'Update booking details'
  );

  await test.step('Step 7:Create job order for new Booking Record', async () => {
       await page.locator(CSMImport.ContainerTabButton).click();
       await page.locator(CSMExport.button).click();
    await page.locator(CSMExport.Map).click();
    const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
   // writeTestArtifact(cargoNumberFile, cargoNo1);
  //  console.log(`Cargo Number stored: ${cargoNo1}`);
    //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
   // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
     await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages); //temp code**
     await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.JobOrder, 'Map Cargo to Container'); //temp code**
        //  await page.locator('//a[text()="71684BN20260827001EXP"]').click();//temp code
        //  await page.locator(CSMExport.UpdateDetails).click(); // temp code
        //  await page.locator(CSMExport.Container).click(); // temp code but usable 
        //   await page.locator(CSMExport.button).click(); // temp code but usable
        //   await page.locator(CSMExport.Map).click(); // temp code but usable
      //    const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
      //    writeTestArtifact(containerNumberFile, cargoNo1);
        //  console.log(`Cargo Number stored: ${cargoNo1}`);
      //    await page.locator('//button[normalize-space()="Back"]').click();
        //  await page.locator().click();
    // await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    // await page.locator(CSMExport.button).click();
    // await page.locator(CSMExport.Map).click();
    //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
   // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
    // await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages);
    // await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
    //  await page.locator('//input[@placeholder="Container No."]').fill(data.ContainerNo);  // Temp 
    //  await page.waitForTimeout(2000);             // Temp      
    //  await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
    //  await page.waitForTimeout(2000); // Temp 
   //   await page.locator(CSMExport.UpdateDetails).click();// Temp 
   //   await page.locator(CSMExport.Update).click();
    //  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');// Temp 
    await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
    await page.locator(CSMExport.JobCatId).selectOption(data.JobCategory);
    await page.locator(CSMExport.JobActId).selectOption(data.JobActivityPoint);
          if (`${data.JobDescription}`=== '2: 1063') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.JobConId).selectOption(containerNo);
      }
         
          if (`${data.JobDescription}`=== '1: 1086') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.CargoNO).selectOption(cargoNo1);
      }
         if (`${data.JobDescription}`=== '3: 1078') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.JobConId).selectOption(containerNo);
      }

 //   await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
//   //  await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' }); * temp code
 //  await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo); // temp*
   //  await page.locator(CSMExport.JobConId).selectOption({ index: 0 }); // temp *
      await page.locator(CSMExport.EstDtTime).click();
        await selectFutureDay(page, 3);
     await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
     await page.click(CSMExport.Save);
    // await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
    // console.log('Export Booking created successfully');
    // await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// newly temp added 
    // await page.waitForTimeout(2000);//temp added
 
  });
  
  

}

test('TC001_CSM_IMPORT_EAL_New.test.ts', async ({ page }) => {
  await test.setTimeout(700000);

  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await createEALImportBooking(loginPage,EALExportData,'EAL_Container_Number.txt','EAL_Booking_No.txt');
  await ExportBooking_XITF_With_JobPlan_Savesubmit1(loginPage);

});


