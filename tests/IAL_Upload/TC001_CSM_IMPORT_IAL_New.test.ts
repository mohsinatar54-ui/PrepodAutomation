import { test,Page, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact,readTestArtifact, selectEntityAndSiteM } from '../../utils/test-helpers';
import { createExcelFile } from '../../utils/createExcelData';
import { CSMExport,CSMImport } from 'Locators/BookingLocators';
import { selectEntityAndSite } from '../../utils/test-helpers';
import { Common } from 'Locators/BookingLocators';
import { selectFutureDay } from '../../utils/test-helpers';
 
 
import fs from 'fs';
import { waitForDebugger } from 'inspector';
import { text } from 'stream/consumers';
 
const Move_Type = 'ENBLOCK';
const InputFormat = 'IAL1';
const OutputFormat = 'IGM';
const Manifest_Status = 'Transfer';
const DepotSizeType = '20 STD (20STD)';
const ISOSizeType = '20G1';
const TotalContainers = '5';
const Transport_Mode = 'Vessel';
const CHA_Name = 'MMJ LOGISTICS(MMJ001)';
const OperatorID = 'MAERSKLINE';
const Commodity = 'WHEAT';
const PortOfLoading = 'VAGE';
const PortOfArrival = 'BPCL';
const DECWeight = '1000';
const DECVolume = '1000';
const WeightUnit = 'Tonnes';
const VolumeUnit = 'Cubic Meter';
//const Packages = '100';
const PackageType = 'Bulk';
const FreightKind = 'FCL';
const JobCategory = 'Container Job';
const JobActivityPoint = 'Depot Gate Operation';
const JobDescription = "1078"; //'Container In By Truck From Factory Stuffing (XITF)';

 
export async function createImportBooking(page: Page,ContainerNumberFile:string,bookingNumberFile:string)

 {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
 // await login(page);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');
 
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
 
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');
 
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//button[normalize-space()="IAL Import Booking"]', 'Route to Import booking screen');
 
  await clickAndMeasureDynamic(page, '//button[normalize-space()="IAL Import Booking"]', '//button[normalize-space()="+ Add IAL Upload"]', 'Route to IAL screen');
 
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add IAL Upload"]', CSMExport.LoadingPort, 'Add Import Booking via IAL');
  // page.pause();
 
 
  //await page.locator('select[formcontrolname="CallCategoryID"]').selectOption(Transport_Mode);
  await page.locator(CSMExport.LoadingPort).fill(PortOfLoading);
     await page.locator('//div[text()="VAGE"]/parent::li')
    .filter({ hasText: PortOfLoading })
    .click();
  // await page.locator('select[formcontrolname="PortOfCallID"]').selectOption(PortOfArrival);
  await page.locator('select[formcontrolname="MoveTypeID"]').selectOption(Move_Type);

//   const checkbox = page.locator('//input[@formcontrolname="IsLCLBooking"]');

// if (!(await checkbox.isChecked())) {
//   await checkbox.check();
// }
 
  await page.locator('select[formcontrolname="InputFormatID"]').selectOption(InputFormat);
 
  // await page.locator('select[formcontrolname="InputFormatID"]').selectOption(OutputFormat);
  const { filePath, bl } = createExcelFile();

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

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', `//select[@formcontrolname="IGMStatus"]`, 'Route to IAL listing');

  await page.locator('//select[@formcontrolname="IGMStatus"]').selectOption(Manifest_Status)
  
  await page.waitForTimeout(10000);
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Save"]', '//button[normalize-space()="Back"]', 'Update IAL booking');

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

await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');

await page.locator('//input[@formcontrolname="search"]').fill(bl);

// await page.locator('//button[normalize-space()="Search"]').click();

await clickAndMeasureDynamic(
    page,
    '//a[contains(@class,"cursor-pointer") and starts-with(normalize-space(),"BL")]',
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

  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="Booking Details"]',
  //   '//input[@formcontrolname="CHAName"]',
  //   'Route to Booking Details tab'
  // );

  const chaDropdown = page.locator(
  "//app-searchable-dropdown[@formcontrolname='CHAID']"
);

await chaDropdown.locator(".dropdown-header").click();

// Enter the value you want to search
await chaDropdown.locator("input").fill(CHA_Name);

// Select the matching option
await page.getByText(CHA_Name, { exact: true }).click();

  // await page.locator('input[placeholder="Search Account Holder..."]').fill(CHA_Name);
  // await page.locator('li[role="option"]').first().click();

  // await page.locator('input[placeholder="Search CHA..."]').fill(CHA_Name);
  // await page.locator('li[role="option"]').first().click();

   await page.locator('select[formcontrolname="CommodityID"]').selectOption(Commodity);

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update"]',
    '//button[normalize-space()="Cargo"]',
    'Update booking details'
  );

 //   await page.locator(CSMImport.CargoTabButton).isVisible();
 //   await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.AddNewCargoButton, 'Add Cargo');
   // await clickAndMeasureDynamic(page, CSMImport.AddNewCargoButton, CSMImport.FreightAndPackagesDiv, 'Add Cargo');

  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="Cargo"]',
  //   `//button//i[@class="fas fa-pen"]`,
  //   'Validate uploaded cargo details'
  // );

  // await clickAndMeasureDynamic(
  //   page,
  //   `//button//i[@class="fas fa-pen"]`,
  //   '//div[normalize-space()="Freight & Packages"]',
  //   'Open cargo details'
  // );

//   await clickAndMeasureDynamic(
//     page,
//     '(//div[normalize-space()="Freight & Packages"])[1]',
//     'input[formcontrolname="DECWeight"]',
//     'Validate cargo details'
//   );

//   await page.locator('input[formcontrolname="DECWeight"]').fill(DECWeight);
//   await page.locator('select[formcontrolname="WtMeasUnitID"]').selectOption({ label: `${WeightUnit}` });
//   await page.locator('input[formcontrolname="DECVolume"]').fill(DECVolume);
//   await page.locator('select[formcontrolname="VolMeasUnitID"]').selectOption({ label: `${VolumeUnit}` });
//   await page.locator('input[formcontrolname="CANoOfPackage"]').fill(Packages);
//   await page.locator('select[formcontrolname="CAPackageTypeID"]').selectOption(PackageType);

  
//   await clickAndMeasureDynamic(
//     page,
//     '(//div[normalize-space()="Cargo Owners Details"])[1]',
//     'input[formcontrolname="DECWeight"]',
//     'Validate cargo details'
//   );  

//   const accountHolderDropdown = page.locator(
//   "//app-searchable-dropdown[@formcontrolname='ACHID']"
// );

// // Open dropdown
// await accountHolderDropdown
//   .locator("xpath=.//div[contains(@class,'dropdown-header')]")
//   .click();

// // Select first option
// await page.locator(
//   '(//div[@class="dropdown-list ng-star-inserted"]//div)[1]'
// ).click();

// const commodityDropdown = page.locator(
//   '//select[@formcontrolname="CommodityID"]'
// );

// const firstValue = await commodityDropdown
//   .locator('option')
//   .nth(1)
//   .getAttribute('value');

// await commodityDropdown.selectOption(firstValue!);

// await clickAndMeasureDynamic(
//     page,
//     '(//div[normalize-space()="IGM Details"])[1]',
//     '//input[@formcontrolname="CAHBLNo"]',
//     'Validate cargo details'
//   );  

// await page.locator('//input[@formcontrolname="CAHBLNo"]').fill('433252');

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Add"]',
//     '//button[normalize-space()="Cargo"]',
//     'Update cargo details'
//   );

//   console.log('Cargo details validated successfully');

await test.step('Add BOE and Map Cargo', async () => {
    await clickAndMeasureDynamic(page, CSMImport.ContainerTabButton, CSMImport.AddNewContainerButton, 'Route to Container tab');
    await page.waitForTimeout(2000);
    const containerNo = await page.locator('//td[1]').innerText();
    console.log(containerNo);
    writeTestArtifact(ContainerNumberFile, containerNo);
    await page.waitForTimeout(2000);
    await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.OpenActions, 'BOE');
    await page.locator(CSMImport.OpenActions).click();
    if (!(await page.locator(CSMImport.BOEListItem).isVisible())) {
      await page.locator(CSMImport.OpenActions).click();
    }
    await clickAndMeasureDynamic(page, CSMImport.BOEListItem, CSMImport.BENumberInput, 'Route to BOE Screen');

    const beNumber = getRandomNumberString(7);

await page.locator(CSMImport.BENumberInput).click();
await page.locator(CSMImport.BENumberInput).fill(beNumber);

await page.waitForTimeout(500);

await expect(page.locator(CSMImport.BENumberInput)).toHaveValue(beNumber);

    // await page.locator(CSMImport.BENumberInput).fill(getRandomNumberString(7));
    // await page.waitForTimeout(2000);
    // await page.locator(CSMImport.BEDateInput).type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });
    await page.locator(CSMImport.BEDateInput).click();
    await selectFutureDay(page, 0);

    await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.CargoTabButton, 'Update BOE');

    await page.locator(CSMImport.OpenActions).isVisible();
    await page.locator(CSMImport.OpenActions).click();
    if (!(await page.locator(CSMImport.MapListItem).isVisible())) {
      await page.locator(CSMImport.OpenActions).click();
    }
    // await page.locator(CSMImport.MapListItem).click();
    // await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesInput, 'Route to Mapping Screen');
    await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesCheckbox, 'Route to Mapping Screen');
    await page.locator(CSMImport.PackagesCheckbox).check();
    //await page.locator(CSMImport.PackagesInput).fill(Packages);

    await clickAndMeasureDynamic(page, CSMImport.MapButton, CSMImport.AddNewCargoButton, 'Map Cargo');
    
  //   const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
  //  writeTestArtifact(cargoNumberFile, cargoNo1);
  //  console.log(`Cargo Number stored: ${cargoNo1}`);

     await page.waitForTimeout(1000);
     
    // await page.locator(CSMExport.ope).click();

   await page.locator(CSMImport.OpenActions).isVisible();
    await page.locator(CSMImport.OpenActions).click(); 
    if (!(await page.locator(CSMImport.COE).isVisible())) {
      await page.locator(CSMImport.OpenActions).click();
    }
    await page.locator(CSMImport.COE).click();

  await page.waitForTimeout(500);

  await page.locator(CSMImport.CEOnumber).fill('8373734545');

  await page.locator(CSMImport.OOCDATE).click();

  await selectFutureDay(page,0);

  // await page.locator(CSMImport.OOCDATE).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

  // await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

  // await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

  // console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  //  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });

  await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
  });

  await test.step('Work Order tab and final assertions', async () => {
    // Retrieve ContainerNo from previous step
    // const ContainerNo = (page as any)._containerNo;
   


    const ContainerNo = await readTestArtifact(ContainerNumberFile);

    await clickAndMeasureDynamic(page, CSMImport.WorkOrderTabButton, `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
    expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
    await clickAndMeasureDynamic(page, CSMImport.EditContainerButton(ContainerNo), CSMImport.WorkOrderSubmitButton, 'Edit Container');
    const WO_Description = await page.locator('select[formcontrolname="JODID"]').textContent();
    await expect(WO_Description).not.toBe('');
    await expect('select[formcontrolname="AllocationUnitID"]').not.toBe('');
    await clickAndMeasureDynamic(page, CSMImport.WorkOrderSubmitButton, `//app-manage-containers//div[normalize-space()="${ContainerNo}"]`, 'Update Container');
    // await page.locator(CSMImport.WorkOrderSubmitButton).click();
    // await expect(page.locator(CSMImport.WorkOrderTransportation)).toBeVisible();
    await page.close();
    console.log('TC002_CS_ImportBooking_MOTL completed successfully');

//   // const LIGM_No = getRandomNumberString(15);
//   await page.locator('input[formcontrolname="LIGMNumber"]').fill(getRandomNumberString(15));
//   await page.waitForTimeout(1000);
//   await page.locator('//input[@formcontrolname="LIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//   await page.locator('input[formcontrolname="LineNumber"]').type(getRandomNumberString(5));
//   const blnNumber = 'BLN' + getRandomNumberString(10);
//   await page.locator('input[formcontrolname="BLNumber"]').type(blnNumber);
//   await page.waitForTimeout(1000);
//   await page.locator('//input[@formcontrolname="BLDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//   await page.locator('input[formcontrolname="GIGMNumber"]').type(getRandomNumberString(7));
//   await page.waitForTimeout(1000);
//   //await page.pause();
//   await page.locator('//input[@formcontrolname="GIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//   await page.locator('input[formcontrolname="SMTPNumber"]').type('SMTP' + getRandomNumberString(7));
//   // await page.waitForTimeout(1000);
//   // await page.locator('//input[@formcontrolname="SMTPDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//   await page.locator('select[formcontrolname="TModeTypeID"]').selectOption(Transport_Mode);
//   await page.locator('input[formcontrolname="TModeAgent"]').type('Transport Mode Agent');
//   await page.getByRole('combobox').nth(1).selectOption(PortOfLoading);
//   await page.getByRole('combobox').nth(2).selectOption(PortOfArrival);
//   // await page.locator('input[formcontrolname="ArrivalDate"]').fill(`${getNextDateTimeFormatted(1).date}`);
//   await page.locator('textarea[formcontrolname="BreifCargoDescription"]').fill('This is an automation test for Import Booking');

//   await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//button[normalize-space()="Update Details"]', 'Submit booking details');

//   // const blnNumber =  'BLN6091551403';
//   // await page.locator(`//a[normalize-space()="${blnNumber}"]`).click();
//   // Minimized script: get booking number, log to console and file
//   // Extract the booking number (IMP number) from the corresponding <strong> tag
//   const bookingNumber = await page.locator('//label[contains(text(),"Booking No.")]/following-sibling::strong').textContent();
//   console.log('Booking Number:', bookingNumber);
//   // Extract and log the BLN number as shown on the screen to the same file as booking number
//   console.log('BLN Number:', blnNumber);
//   const fs = require('fs');
//   const path = require('path');
//   const outputFile = path.resolve(__dirname, '../output/Importbookingnumbers.txt');
//   if (!fs.existsSync(outputFile)) {
//     fs.mkdirSync(path.dirname(outputFile), { recursive: true });
//     fs.writeFileSync(outputFile, ''); // create an empty file
//   }
//   fs.appendFileSync(outputFile, blnNumber + '\n');
//   fs.appendFileSync(outputFile, bookingNumber + '\n');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update Details"]', '//button[normalize-space()="Booking Details"]', 'Update booking details');

//   await page.locator('//app-autocomplete-dropdown[@formcontrolname="AchID"]//input').fill(CHA_Name);
//   await page.locator('li[role="option"]').first().click();

//   await page.locator('//app-autocomplete-dropdown[@formcontrolname="OperatorID"]//input').fill(OperatorID);
//   await page.locator('li[role="option"]').first().click();

//   await page.locator('input[placeholder="Search CHA..."]').fill(CHA_Name);
//   await page.locator('li[role="option"]').first().click();
//   await page.locator('select[formcontrolname="CommodityID"]').selectOption(Commodity);

//   //await page.pause();
//   await page.locator('//button[normalize-space()="Update"]').isVisible();
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Update booking details');
//   await page.locator('//button[normalize-space()="Cargo"]').isVisible();
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button[normalize-space()="+ New Cargo"]', 'Add Cargo');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Cargo"]', '//div[text()=" Freight & Packages "]', 'Add Cargo');

//   await page.click('//div[text()=" Freight & Packages "]');
//   await page.locator('input[formcontrolname="DECWeight"]').fill(DECWeight);
//   await page.locator('select[formcontrolname="WtMeasUnitID"]').selectOption({ label: `${WeightUnit}` });
//   // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
//   // await page.waitForTimeout(1000);
//   await page.locator('input[formcontrolname="DECVolume"]').fill(DECVolume);
//   // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
//   await page.locator('select[formcontrolname="VolMeasUnitID"]').selectOption({ label: `${VolumeUnit}` });
//   await page.waitForTimeout(1000);
//   await page.locator('input[formcontrolname="CANoOfPackage"]').fill(Packages);
//   await page.locator('select[formcontrolname="CAPackageTypeID"]').selectOption(PackageType);

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+ New Cargo"]', 'Submit Add Cargo');
//   console.log('Cargo added successfully');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="+ New Container"]', 'Route to Container tab');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//div[text()=" IGM Details "]', 'Click Add Container');
//   await page.click('//div[text()=" IGM Details "]');


//   // const artifactsDir =
//   //   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts';

//   // const containerFilePath = `${artifactsDir}/Import_Container_Number.txt`;

//   const ContainerNo = 'IMPU' + getRandomNumberString(7);


//   // // Ensure artifacts directory exists
//   // if (!fs.existsSync(artifactsDir)) {
//   //   fs.mkdirSync(artifactsDir, { recursive: true });
//   // }

//   // // Append container number to file
//   // fs.writeFileSync(
//   //   containerFilePath,
//   //   ContainerNo,
//   //   { encoding: 'utf-8' }
//   // );

//   // console.log(`Container Number stored: ${ContainerNo}`);

//   writeTestArtifact('MOTL_Container.txt', ContainerNo)
  
//   await page.locator('input[formcontrolname="ContainerNo"]').fill(ContainerNo);
//   await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
//   // await page.locator('//select[@formcontrolname="COSizeTypeID"]').click();
//   // await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
//   await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
//   // await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
//   await page.locator('select[formcontrolname="LFCL"]').selectOption({ label: `${FreightKind}` });
//   // await page.locator('//select[@formcontrolname="LFCL"]').clivrmalize-space()="${FreightKind}"]`).click();

//   await page.locator('input[formcontrolname="DONumber"]').fill('DON' + getRandomNumberString(7));
//   const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
//     .toISOString()
//     .slice(0, 16);
//   const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
//     .toISOString()
//     .slice(0, 16);
//   await page.locator('input[formcontrolname="DODate"]').fill(deliveryOrderDate);
//   await page.locator('input[formcontrolname="DOValidityDate"]').fill(deliveryValidtyDate);

//   await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();
//   await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="+ New Container"]', 'Update Container');
//   console.log('Container added successfully');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button//i[@class="fas fa-ellipsis-v"]', 'BOE');

//   await page.locator('//button//i[@class="fas fa-ellipsis-v"]').click();
//   await clickAndMeasureDynamic(page, '//ul//li[normalize-space()="BOE"]', '//input[@formcontrolname="BENumber"]', 'Route to BOE Screen');

//   await page.locator('//input[@formcontrolname="BENumber"]').fill(getRandomNumberString(7));
//   await page.locator('//input[@formcontrolname="BEDate"]').type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Update BOE');

//   await page.locator('//button//i[@class="fas fa-ellipsis-v"]').isVisible();
//   await page.locator('//button//i[@class="fas fa-ellipsis-v"]').click();

//   await clickAndMeasureDynamic(page, '//ul//li[normalize-space()="Map"]', '//input[@ng-reflect-name="Packages0"]', 'Route to Mapping Screen');

//   await page.locator('//input[@ng-reflect-name="selected0"]').check();
//   await page.locator('//input[@ng-reflect-name="Packages0"]').fill(Packages);

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Map Cargo');

//   // const ContainerNo = 'ATCU4872261'
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Work Order"]', `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
//   expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
//   // Click the edit icon (pen) which is a sibling of the container number
//   await clickAndMeasureDynamic(page, `//td[normalize-space()="${ContainerNo}"]/following-sibling::td//i[contains(@class,"fa-pen")]`, 'button[type="submit"]', 'Edit Container');
//   const WO_Description = await page.locator('select[formcontrolname="JODID"]').textContent();
//   await expect(WO_Description).not.toBe('');
//   await expect('select[formcontrolname="AllocationUnitID"]').not.toBe('');
//   await clickAndMeasureDynamic(page, 'button[type="submit"]', '//div[normalize-space()="Work Order(Transportation)"]', 'Update Container');
//   await page.close();
//   console.log('TC002_CSM_ImportBooking_MOTL completed successfully');
  });

}

test('TC001_CSM_IMPORT_IAL_New.test.ts', async ({ page }) => {
  await test.setTimeout(700000);

  const loginPage = await login(page);
  await selectEntityAndSiteM(loginPage);

  await createImportBooking(loginPage,'IAL_Container_Number.txt','IAL_Booking_No');

});



// test('TC001_CSM_IMPORT_IAL_New.test.ts', async ({ page }) => {
//   await test.setTimeout(700000); // 2 minutes timeout for this test
//  // await login(page);
//  const loginPage = await login(page);
//   await selectEntityAndSite(loginPage);
//   await createImportBooking(loginPage,'');
  
// });