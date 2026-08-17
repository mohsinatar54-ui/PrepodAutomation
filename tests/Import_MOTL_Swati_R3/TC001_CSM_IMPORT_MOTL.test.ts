import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact} from '../../utils/test-helpers';
import fs from 'fs';
import {selectFutureDay}  from '../../utils/createExcelData';
import { text } from 'stream/consumers';
import {CSMImport} from '../../Locators/CSMImportL'

const DepotSizeType = '20 STD (20STD)';
const ISOSizeType = '22G1';
const TotalContainers = '5';
const Transport_Mode = 'Vessel';
const CHA_Name = 'MMJ LOGISTICS';
const OperatorID = 'MAERSKLINE';
const Commodity = 'WHEAT';
const PortOfLoading = 'JNPT';
const PortOfArrival = 'BPCL';
const DECWeight = '1000';
const DECVolume = '1000';
const WeightUnit = 'Tonnes';
const VolumeUnit = 'Cubic Meter';
const Packages = '100';
const PackageType = 'Bulk';
const FreightKind = 'FCL';
const JobCategory = 'Container Job';
const JobActivityPoint = 'Depot Gate Operation';
const JobDescription = "1078" //'Container In By Truck From Factory Stuffing (XITF)';
const POD = "Port den";
const blnNumber = 'BLN' + getRandomNumberString(10);
 const ContainerNo = 'IMPU' + getRandomNumberString(7);

test('TC001_CSM_Import_MOTL', async ({ page }) => {
   // test.setTimeout(120_000); // 2 minutes timeout for this test
  await test.step('Step 1: login Login to CSM Application', async () => {
  await login(page);
  });


 await test.step('Step 2:Navigate to CSM Emport Booking Page', async () => {
  await clickAndMeasureDynamic(page, CSMImport.Logo,CSMImport.Booking, 'Route to Customer Service');
  await clickAndMeasureDynamic(page,CSMImport.Booking, CSMImport.Import, 'Route to Booking tab');
  await clickAndMeasureDynamic(page,CSMImport.Import,CSMImport.AddBooking, 'Route to Import booking screen');
 });


  await test.step('Step 3 : Add new record of Import Booking ', async () => {
  await clickAndMeasureDynamic(page, CSMImport.AddBooking,CSMImport.LIG, 'Add Import Booking');
  // page.pause();
  // const LIGM_No = getRandomNumberString(15);
  await page.locator(CSMImport.LIG).fill(getRandomNumberString(15));
  await page.waitForTimeout(1000);
//   const nextDate = getNextDateTimeFormatted(1).date;

// const input = page.locator(CSMImport.LIGDate);
// await input.click();
// await input.fill(nextDate);
 // page.locator(CSMImport.LIGDate).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 })
  await page.locator(CSMImport.LIGDate).click();
   await selectFutureDay(page, 1);
  await page.locator(CSMImport.LIGNum).type(getRandomNumberString(5));
   console.log (blnNumber);
  await page.locator(CSMImport.BLNum).type(blnNumber);
   await page.locator(CSMImport.BLDate).click();
  await selectFutureDay(page, 1);
  await page.waitForTimeout(1000);
  //await page.locator(CSMImport.BLDate).click();
  page.locator('//input[@formcontrolname="BLDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.GIGNum).type(getRandomNumberString(7));
  await page.waitForTimeout(1000);
  //await page.pause();
 // page.locator('//input[@formcontrolname="GIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.GIGDate).click();
  await selectFutureDay(page, 1);
  await page.locator(CSMImport.SMTPNum).type('SMTP' + getRandomNumberString(7));
   await page.locator(CSMImport.SMPTDate).click();
  await selectFutureDay(page, 1);
  // await page.waitForTimeout(1000);
  // await page.locator('//input[@formcontrolname="SMTPDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.TModId).selectOption(Transport_Mode);
  await page.locator(CSMImport.TModAgent).fill('Mode Agent');
  await page.locator(CSMImport.LoadingPort).selectOption("VAGE");
  await page.locator(CSMImport.ArrivalPort).selectOption("Port den");
    await page.locator(CSMImport.ArrivalDate).click();
  await selectFutureDay(page, 1);
 // await page.locator('input[formcontrolname="ArrivalDate"]').fill(`${getNextDateTimeFormatted(1).date}`);
  await page.locator(CSMImport.Textarea).fill('This is an automation test for Import Booking');
  await clickAndMeasureDynamic(page,CSMImport.Submit ,CSMImport.UpdateDetail, 'Submit booking details');
  });

   await test.step('Step 4 :Update Import Booking record ', async () => {
   //const blnNumber ='BLN2572546603';
   //await page.locator(`//a[normalize-space()="${blnNumber}"]`).click();
  // Minimized script: get booking number, log to console and file
  // Extract the booking number (IMP number) from the corresponding <strong> tag
  const bookingNumber = await page.locator(CSMImport.BookingNum).textContent();
  console.log('Booking Number:', bookingNumber);
  // Extract and log the BLN number as shown on the screen to the same file as booking number
  console.log('BLN Number:', blnNumber);
  const fs = require('fs');
  const path = require('path');
  const outputFile = path.resolve(__dirname, '../output/Importbookingnumbers.txt');
  if (!fs.existsSync(outputFile)) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, ''); // create an empty file
  }
  fs.appendFileSync(outputFile, blnNumber + '\n');
  fs.appendFileSync(outputFile, bookingNumber + '\n');
  await clickAndMeasureDynamic(page,CSMImport.UpdateDetail,CSMImport.BookingDetails, 'Update booking details');
  await page.locator(CSMImport.ACHName).fill(CHA_Name);
  await page.locator(CSMImport.list).first().click();
  await page.locator(CSMImport.OpID).fill(OperatorID);
  await page.locator(CSMImport.list).first().click();
  await page.locator(CSMImport.SearchCHA).fill(CHA_Name);
  await page.locator(CSMImport.list).first().click();
  await page.locator(CSMImport.ComId).selectOption(Commodity);
  //await page.pause();
  await page.locator(CSMImport.Update).click();
  //await page.locator(CSMImport.Update).isVisible();
  await clickAndMeasureDynamic(page,CSMImport.Update,CSMImport.Cargo, 'Update booking details');

});


 await test.step('Step 5 :add cargo details to an already created Import Booking record', async () => {
  await page.locator(CSMImport.Cargo).isVisible();
  await clickAndMeasureDynamic(page,CSMImport.Cargo,CSMImport.AddCargo, 'Add Cargo');
  await clickAndMeasureDynamic(page,CSMImport.AddCargo,CSMImport.packages, 'Add Cargo');
  await page.click(CSMImport.packages);
  await page.locator(CSMImport.DecWeight).fill(DECWeight);
  await page.locator(CSMImport.UnitID).selectOption({ label: `${WeightUnit}` });
  // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
  // await page.waitForTimeout(1000);
  await page.locator(CSMImport.DecVolume).fill(DECVolume);
  // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
  await page.locator(CSMImport.VolUnit).selectOption({ label: `${VolumeUnit}` });
  await page.waitForTimeout(1000);
  await page.locator(CSMImport.CANPkg).fill(Packages);
  await page.locator(CSMImport.CANID).selectOption(PackageType);
  await clickAndMeasureDynamic(page,CSMImport.Add, CSMImport.AddCargo, 'Submit Add Cargo');
  console.log('Cargo added successfully');

 });


 await test.step('Step 6 :add Container details to an already created Import Booking record', async () => {
  
  await clickAndMeasureDynamic(page,CSMImport.Container,CSMImport.AddContainer, 'Route to Container tab');
  await clickAndMeasureDynamic(page,CSMImport.AddContainer,CSMImport.AddDetails, 'Click Add Container');
  await page.click(CSMImport.AddDetails);
  // const artifactsDir =
  //   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts';
  // const containerFilePath = `${artifactsDir}/Import_Container_Number.txt`;
 
  // // Ensure artifacts directory exists
  // if (!fs.existsSync(artifactsDir)) {
  //   fs.mkdirSync(artifactsDir, { recursive: true });
  // }

  // // Append container number to file
  // fs.writeFileSync(
  //   containerFilePath,
  //   ContainerNo,
  //   { encoding: 'utf-8' }
  // );

  // console.log(`Container Number stored: ${ContainerNo}`);
  writeTestArtifact('MOTL_Container.txt', ContainerNo)
    await page.locator(CSMImport.ContainerNum).fill(ContainerNo);
  await page.locator(CSMImport.DepoSize).selectOption({ label: `${DepotSizeType}` });
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').click();
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
  await page.locator(CSMImport.ISOSize).selectOption({ label: `${ISOSizeType}` });
  // await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
  await page.locator(CSMImport.SelectLFCL).selectOption({ label: `${FreightKind}` });
  // await page.locator('//select[@formcontrolname="LFCL"]').clivrmalize-space()="${FreightKind}"]`).click();
  await page.locator(CSMImport.SelectDon).fill('DON' + getRandomNumberString(7));
  const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  await page.locator(CSMImport.DODate).fill(deliveryOrderDate);
  await page.locator(CSMImport.DeliveryDate).fill(deliveryValidtyDate);
  await expect(page.locator(CSMImport.Reset)).toBeVisible();
  await expect(page.locator(CSMImport.Cancel)).toBeVisible();
  /*-------------------Enhancement -----------------------*/
await page.locator(CSMImport.DeliveryPort).selectOption(POD);
await page.locator(CSMImport.Remark).fill("QA Test- By Automation");
await page.locator(CSMImport.Otherdetails).click();
await page.locator(CSMImport.HOld).click();
await page.locator(CSMImport.HOldType).selectOption("Hold From Management");
  await clickAndMeasureDynamic(page,CSMImport.Update,CSMImport.AddContainer, 'Update Container');
  console.log('Container added successfully');

 });
 await test.step('Step 7 :add BOE details to an already created Import Booking record', async () => {
  // const blnNumber =  'BLN2572546603';
  // await page.locator(`//a[normalize-space()="${blnNumber}"]`).click();
  // await page.locator(CSMImport.UpdateDetail).click();
  // await clickAndMeasureDynamic(page,CSMImport.Cargo,CSMImport.ActionClick, 'BOE');
  await page.locator(CSMImport.ActionClick).click();
  await clickAndMeasureDynamic(page,CSMImport.BOE, CSMImport.BENumber, 'Route to BOE Screen');
  await page.locator(CSMImport.BENumber).fill(getRandomNumberString(7));
  await page.locator(CSMImport.BEDate).type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });
  await clickAndMeasureDynamic(page,CSMImport.Update, CSMImport.Cargo, 'Update BOE');
  await page.locator(CSMImport.ActionClick).isVisible();
  await page.locator(CSMImport.ActionClick).click();
 });

 await test.step('Step 8 :Mapping of creaded Import Booking record', async () => {
  await clickAndMeasureDynamic(page,CSMImport.Map, CSMImport.MapPkg, 'Route to Mapping Screen');
  await page.locator(CSMImport.Select).check();
  await page.locator(CSMImport.MapPkg).fill(Packages);
  await clickAndMeasureDynamic(page,CSMImport.Update,CSMImport.Cargo, 'Map Cargo');
 });

  await test.step('Step 9 :Add MOTL Job Order already created Import Booking record', async () => {
  await clickAndMeasureDynamic(page, CSMImport.WorkOrder, `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
  expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
  // Click the edit icon (pen) which is a sibling of the container number
  await clickAndMeasureDynamic(page,CSMImport.WorkOrd(ContainerNo),CSMImport.Submit, 'Edit Container');
  const WO_Description = await page.locator(CSMImport.JODid).textContent();
  await expect(WO_Description).not.toBe('');
  await expect(CSMImport.AllocationId).not.toBe('');
  await clickAndMeasureDynamic(page,CSMImport.Submit,CSMImport.WorkOrdT, 'Update Container');
  await page.close();
  console.log('TC002_CSM_ImportBooking_MOTL completed successfully');
  });

});


 // Job Order Patch

  
//   await clickAndMeasureDynamic(page,CSMImport.JobOrd,CSMImport.NewJobOrd, 'Route to Job Orders tab');

//  await clickAndMeasureDynamic(page,CSMImport.NewJobOrd,CSMImport.JCatid, 'Add Job Order');

//   await page.locator(CSMImport.JCatid).selectOption(JobCategory);

//   await page.locator(CSMImport.JACatid).selectOption(JobActivityPoint);

//   await page.locator(CSMImport.JODid).selectOption({ value: JobDescription });

//   await page.locator(CSMImport.JobConID).selectOption(ContainerNo);

//   await clickAndMeasureDynamic(page,CSMImport.Add,CSMImport.JobPlan, 'Add Job Order');

//   await page.click();

//   await clickAndMeasureDynamic(page,CSMImport.Submit, '//div[text()="Add JobOrder"]', 'Submit Export Booking');

//   console.log('Export Booking created successfully');


//   // Tally Patch

//   await clickAndMeasureDynamic(page,CSMImport.Tally,CSMImport.LineNo, 'Route to Tally tab');

//   await page.locator(CSMImport.LineNo).fill(Vehicle_No);
//   await page.locator(CSMImport.Search).click();

//   await page.locator(CSMImport.Link).first().click();
//   await clickAndMeasureDynamic(page, CSMImport.Vehicle(Vehicle_No),CSMImport.LinkCon(ContainerNo), 'Open Tally Details');

//   await page.locator(CSMImport.LinkCon(ContainerNo)).click();


  
//   // Import Warehouse Destuffing Execution Patch

//   await clickAndMeasureDynamic(page,CSMImport.WareHouse,CSMImport.ContainerNum, 'Route to Warehouse tab');

//   await page.locator(CSMImport.ContainerNum).fill(ContainerNo);
//   await page.locator(CSMImport.Search).click();

//   await page.locator(CSMImport.Link).first().click();
//   await clickAndMeasureDynamic(page,CSMImport.ContainerC(ContainerNo),CSMImport.AddTally, 'Open Warehouse Details');

//   await page.locator(CSMImport.AddTally).click();
//   await page.locator(CSMImport.Date).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');  
//   await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 }); 
//   await page.keyboard.press('ArrowRight');
//   console.log(`Filling Plan Date Time: ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
//   await page.keyboard.press('ArrowDown');


//   //  Import Cargo Carting Execution Patch

//   await clickAndMeasureDynamic(page,CSMImport.WareHouse,CSMImport.CargoEX, 'Route to Warehouse tab');

//   await page.locator(CSMImport.LineNo).fill(Vehicle_No);
//   await page.locator(CSMImport.Search).click();

//   await page.locator('//a[@class="booking-link"]').first().click();
//   await clickAndMeasureDynamic(page,CSMImport.Vehicle(Vehicle_No)),CSMImport.LinkCon(ContainerNo), 'Open Tally Details');

//   await page.locator(CSMImport.LinkCon(ContainerNo)).click();


