import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';
import { waitForDebugger } from 'inspector';
import { text } from 'stream/consumers';


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

test('TC001_CSM_CONTAINER_HOLD', async ({ page }) => {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
  await login(page);
  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//button[normalize-space()="+ Add Booking"]', 'Route to Import booking screen');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Booking"]', '//input[@formcontrolname="LIGMNumber"]', 'Add Import Booking');
  // page.pause();

  // const LIGM_No = getRandomNumberString(15);
  await page.locator('input[formcontrolname="LIGMNumber"]').fill(getRandomNumberString(15));
  await page.waitForTimeout(1000);
  await page.locator('//input[@formcontrolname="LIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator('input[formcontrolname="LineNumber"]').type(getRandomNumberString(5));
  const blnNumber = 'BLN' + getRandomNumberString(10);
  await page.locator('input[formcontrolname="BLNumber"]').type(blnNumber);
  await page.waitForTimeout(1000);
  await page.locator('//input[@formcontrolname="BLDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator('input[formcontrolname="GIGMNumber"]').type(getRandomNumberString(7));
  await page.waitForTimeout(1000);

  //await page.pause();

  await page.locator('//input[@formcontrolname="GIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator('input[formcontrolname="SMTPNumber"]').type('SMTP' + getRandomNumberString(7));
  // await page.waitForTimeout(1000);
  // await page.locator('//input[@formcontrolname="SMTPDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator('select[formcontrolname="TModeTypeID"]').selectOption(Transport_Mode);
  await page.locator('input[formcontrolname="TModeAgent"]').type('Transport Mode Agent');
  // await page.getByRole('combobox').nth(1).selectOption(PortOfLoading);
  // await page.getByRole('combobox').nth(2).selectOption(PortOfArrival);
  await page.getByRole('combobox').nth(1).selectOption('DUBAI5');
  await page.getByRole('combobox').nth(2).selectOption('P002');
  // await page.locator('input[formcontrolname="ArrivalDate"]').fill(`${getNextDateTimeFormatted(1).date}`);
  await page.locator('textarea[formcontrolname="BreifCargoDescription"]').fill('This is an automation test for Import Booking');

  await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//button[normalize-space()="Update Details"]', 'Submit booking details');

  // const blnNumber =  'BLN6091551403';
  // await page.locator(`//a[normalize-space()="${blnNumber}"]`).click();
  // Minimized script: get booking number, log to console and file
  // Extract the booking number (IMP number) from the corresponding <strong> tag
  const bookingNumber = (await page.locator('//label[contains(text(),"Booking No.")]/following-sibling::strong').textContent())?.replace(/\s+/g, '');
  console.log('Booking Number:', bookingNumber);
  // Extract and log the BLN number as shown on the screen to the same file as booking number
  console.log('BLN Number:', blnNumber);
  // const fs = require('fs');
  // const path = require('path');
  // const outputFile = path.resolve(__dirname, '../output/Importbookingnumbers.txt');
  // if (!fs.existsSync(outputFile)) {
  //   fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  //   fs.writeFileSync(outputFile, ''); // create an empty file
  // }
  // fs.appendFileSync(outputFile, blnNumber + '\n');
  // fs.appendFileSync(outputFile, bookingNumber + '\n');

  // const artifactsDir =
  //   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts';

  // const BkgNumberFile = `${artifactsDir}/Container_Hold_Booking_Number.txt`;


  // // Ensure artifacts directory exists
  // if (!fs.existsSync(artifactsDir)) {
  //   fs.mkdirSync(artifactsDir, { recursive: true });
  // }

  // // Append container number to file
  // fs.writeFileSync(
  //   BkgNumberFile,
  //   bookingNumber,
  //   { encoding: 'utf-8' }
  // );

  // console.log(`Booking Number stored: ${bookingNumber}`);
  writeTestArtifact('ContainerHold_BookingNumber.txt', `${bookingNumber}`);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update Details"]', '//button[normalize-space()="Booking Details"]', 'Update booking details');

  await page.locator('//app-autocomplete-dropdown[@formcontrolname="AchID"]//input').fill(CHA_Name);
  await page.locator('li[role="option"]').first().click();

  await page.locator('//app-autocomplete-dropdown[@formcontrolname="OperatorID"]//input').fill(OperatorID);
  await page.locator('li[role="option"]').first().click();

  await page.locator('input[placeholder="Search CHA..."]').fill(CHA_Name);
  await page.locator('li[role="option"]').first().click();
  await page.locator('select[formcontrolname="CommodityID"]').selectOption(Commodity);

  //await page.pause();

  await page.locator('//button[normalize-space()="Update"]').isVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Update booking details');
  await page.locator('//button[normalize-space()="Cargo"]').isVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button[normalize-space()="+ New Cargo"]', 'Add Cargo');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Cargo"]', '//div[text()=" Freight & Packages "]', 'Add Cargo');

  await page.click('//div[text()=" Freight & Packages "]');
  await page.locator('input[formcontrolname="DECWeight"]').fill(DECWeight);
  await page.locator('select[formcontrolname="WtMeasUnitID"]').selectOption({ label: `${WeightUnit}` });
  // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
  // await page.waitForTimeout(1000);
  await page.locator('input[formcontrolname="DECVolume"]').fill(DECVolume);
  // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
  await page.locator('select[formcontrolname="VolMeasUnitID"]').selectOption({ label: `${VolumeUnit}` });
  await page.waitForTimeout(1000);
  await page.locator('input[formcontrolname="CANoOfPackage"]').fill(Packages);
  await page.locator('select[formcontrolname="CAPackageTypeID"]').selectOption(PackageType);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+ New Cargo"]', 'Submit Add Cargo');
  console.log('Cargo added successfully');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="+ New Container"]', 'Route to Container tab');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//div[text()=" IGM Details "]', 'Click Add Container');
  await page.click('//div[text()=" IGM Details "]');


  

  // const containerFilePath = `${artifactsDir}/Hold_Container_Number.txt`;

  const ContainerNo = 'IMPU' + getRandomNumberString(7);
  writeTestArtifact('ContainerHold_ContainerNumber.txt', `${ContainerNo}`);

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


  await page.locator('input[formcontrolname="ContainerNo"]').fill(ContainerNo);
  await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').click();
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
  await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
  // await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
  await page.locator('select[formcontrolname="LFCL"]').selectOption({ label: `${FreightKind}` });
  // await page.locator('//select[@formcontrolname="LFCL"]').clivrmalize-space()="${FreightKind}"]`).click();

  await page.locator('input[formcontrolname="DONumber"]').fill('DON' + getRandomNumberString(7));
  const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  await page.locator('input[formcontrolname="DODate"]').fill(deliveryOrderDate);
  await page.locator('input[formcontrolname="DOValidityDate"]').fill(deliveryValidtyDate);

  await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();
  await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="+ New Container"]', 'Update Container');
  console.log('Container added successfully');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button//i[@class="fas fa-ellipsis-v"]', 'BOE');

  await page.locator('//button//i[@class="fas fa-ellipsis-v"]').click();
  await clickAndMeasureDynamic(page, '//ul//li[normalize-space()="BOE"]', '//input[@formcontrolname="BENumber"]', 'Route to BOE Screen');

  await page.locator('//input[@formcontrolname="BENumber"]').fill(getRandomNumberString(7));
  await page.locator('//input[@formcontrolname="BEDate"]').type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Update BOE');

  await page.locator('//button//i[@class="fas fa-ellipsis-v"]').isVisible();
  await page.locator('//button//i[@class="fas fa-ellipsis-v"]').click();

  await clickAndMeasureDynamic(page, '//ul//li[normalize-space()="Map"]', '//input[@ng-reflect-name="Packages0"]', 'Route to Mapping Screen');

  await page.locator('//input[@ng-reflect-name="selected0"]').check();
  await page.locator('//input[@ng-reflect-name="Packages0"]').fill(Packages);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Cargo"]', 'Map Cargo');

  // const ContainerNo = 'ATCU4872261'
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Work Order"]', `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
  expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
  // Click the edit icon (pen) which is a sibling of the container number
  await clickAndMeasureDynamic(page, `//td[normalize-space()="${ContainerNo}"]/following-sibling::td//i[contains(@class,"fa-pen")]`, 'button[type="submit"]', 'Edit Container');
  const WO_Description = await page.locator('select[formcontrolname="JODID"]').textContent();
  await expect(WO_Description).not.toBe('');
  await expect('select[formcontrolname="AllocationUnitID"]').not.toBe('');
  await clickAndMeasureDynamic(page, 'button[type="submit"]', '//div[normalize-space()="Work Order(Transportation)"]', 'Update Container');
  await page.close();
  console.log('TC002_CS_ImportBooking_MOTL completed successfully');

});


  // // Job Order Patch

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Job Orders"]', '//button[normalize-space()="+ New Job Order"]', 'Route to Job Orders tab');

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Job Order"]', 'select[formcontrolname="JOBCatID"]', 'Add Job Order');

  // await page.locator('select[formcontrolname="JOBCatID"]').selectOption(JobCategory);

  // await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption(JobActivityPoint);

  // await page.locator('select[formcontrolname="JODID"]').selectOption({ value: JobDescription });

  // await page.locator('select[formcontrolname="JODContainerID"]').selectOption(ContainerNo);

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//div[normalize-space()="Job Plan Details"]', 'Add Job Order');

  // await page.click('//button[normalize-space()="Save"]');

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', '//div[text()="Add JobOrder"]', 'Submit Export Booking');

  // console.log('Export Booking created successfully');







  // // Tally Patch

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//input[@formcontrolname="LineNo"]', 'Route to Tally tab');

  // await page.locator('//input[@formcontrolname="LineNo"]').fill(Vehicle_No);
  // await page.locator('//button[normalize-space()="Search"]').click();

  // await page.locator('//a[@class="booking-link"]').first().click();
  // await clickAndMeasureDynamic(page, `//a[normalize-space()="${Vehicle_No}"]`, `//td[normalize-space(text())='${ContainerNo}']/preceding-sibling::td[1]//a`, 'Open Tally Details');

  // await page.locator(`//td[normalize-space(text())='${ContainerNo}']/preceding-sibling::td[1]//a`).click();


  
  // // Import Warehouse Destuffing Execution Patch

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Warehouse"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Warehouse tab');

  // await page.locator('//input[@formcontrolname="ContainerNo"]').fill(ContainerNo);
  // await page.locator('//button[normalize-space()="Search"]').click();

  // await page.locator('//a[@class="booking-link"]').first().click();
  // await clickAndMeasureDynamic(page, `//a[normalize-space()="${ContainerNo}"]`, '//button[normalize-space()="+ Add Tally"]', 'Open Warehouse Details');

  // await page.locator('//button[normalize-space()="+ Add Tally"]').click();
  // await page.locator('input[formcontrolname="PlanDateTime"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
  // // await page.keyboard.press('ArrowRight');

  // await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
  // // await page.keyboard.press('ArrowRight');  
  // await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 }); 
  // await page.keyboard.press('ArrowRight');
  // console.log(`Filling Plan Date Time: ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  // await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
  // await page.keyboard.press('ArrowDown');


  // //  Import Cargo Carting Execution Patch

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Warehouse"]', '//input[@formcontrolname="Import Cargo Carting Execution"]', 'Route to Warehouse tab');

  // await page.locator('//input[@formcontrolname="LineNo"]').fill(Vehicle_No);
  // await page.locator('//button[normalize-space()="Search"]').click();

  // await page.locator('//a[@class="booking-link"]').first().click();
  // await clickAndMeasureDynamic(page, `//a[normalize-space()="${Vehicle_No}"]`, `//td[normalize-space(text())='${ContainerNo}']/preceding-sibling::td[1]//a`, 'Open Tally Details');

  // await page.locator(`//td[normalize-space(text())='${ContainerNo}']/preceding-sibling::td[1]//a`).click();


