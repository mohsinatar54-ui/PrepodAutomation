import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';
import { PassThrough } from 'stream';

const Transporter = 'ADITYA LOGISTICS';
const   Activity = 'EITP';
const   Driver = 'MJ';
const   Driver_Licence_No = 'MJ420';
const   Operator = 'MAERSKLINE';
const   Depot_Size = '20 STD'
const   ISO_Size = '22G1'
const   Primary_AC_Holder = 'MMJ LOGISTICS'
const   Depot_Condition_Code = 'Damage'
// const   Depot_Quality_Code = 'Available'



function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
const surveyRemark = 'Condition OK';
const Vehical_No = generateVehicleNumber();

// Container number artifact file
const containerFilePath =
  'D:/OneDrive - Envecon/Desktop/Playwright_CS_Microservice/tests/test-artifacts/Dummy_Container_Number.txt';

test('Express_Gate_in', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes

  await login(page);

  // ================================
  // Navigation
  // ================================
  await clickAndMeasureDynamic(
    page,
    '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]',
    '//button[normalize-space()="Express Services"]',
    'Route to Gate & Weighbridge Operations'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Express Services"]',
    '//button[normalize-space()="Express Empty"]',
    'Route to  Express Services'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Express Empty"]',
    '//button[normalize-space()="Truck In"]',
    'Route to  Express Empty'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Truck In"]',
    '//input[@placeholder="Enter vehicle number"]',
    'Route to  Truck In'
  );

    //Vehicle No
    await page.locator('//input[@placeholder="Enter vehicle number"]').click();
    await page.locator('//input[@placeholder="Enter vehicle number"]').fill(Vehical_No);

    //Transporter
    await page.locator('//div[text()=" Select transporter "]').first().click();
    await page.locator('//input[@placeholder="Select transporter"]').fill(Transporter);
    await page.locator('//div[@class="dropdown-item"]').first().click();

    //Activity
    await page.locator('//div[text()=" Select activity "]').first().click();
    await page.locator('//input[@placeholder="Select activity"]').fill(Activity);
    await page.locator('//div[@class="dropdown-item"]').first().click();

    //Driver
    await page.locator('//input[@placeholder="Enter driver name"]').click();
    await page.locator('//input[@placeholder="Enter driver name"]').fill(Driver);

    //Driver Licence No
    await page.locator('//input[@placeholder="Enter driver licence number"]').click();
    await page.locator('//input[@placeholder="Enter driver licence number"]').fill(Driver_Licence_No);
    

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="GO"]',
    '//input[@placeholder="Enter container number"]',
    'Route to  Go'
  );

  //Container No
    const ContainerNo = 'PWTU' + getRandomNumberString(7);

    writeTestArtifact('Express_ContainerNumber.txt', ContainerNo);
  //Add Container
    await page.locator('//input[@placeholder="Enter container number"]').fill(ContainerNo);

  //Operator
    await page.locator('//input[@placeholder="Type to search operator (use %%% for all)"]').first().click();
    await page.locator('//input[@placeholder="Type to search operator (use %%% for all)"]').fill(Operator);
    await page.locator(`//div[normalize-space()="${Operator}"]`).first().click();

  //Depot Size
    await page.locator('//div[normalize-space()="Select depot size"]').first().click();
    await page.locator('//input[@placeholder="Select depot size"]').fill(Depot_Size);
    await page.locator('//div[@class="dropdown-item"]').first().click();

  //ISO Size
    await page.locator('//div[normalize-space()="Select ISO size"]').first().click();
    await page.locator('//input[@placeholder="Select ISO size"]').fill(ISO_Size);
    await page.locator(`//div[normalize-space()="${ISO_Size}"]`).first().click();

  //Primary A/c Holder
    await page.locator('//input[@placeholder="Type to search account holder"]').first().click();
    await page.locator('//input[@placeholder="Type to search account holder"]').fill(Primary_AC_Holder);

  //Depot Condition Code
    await page.locator('//div[normalize-space()="Select depot condition code"]').first().click();
    await page.locator('//input[@placeholder="Select depot condition code"]').fill(Depot_Condition_Code);
    await page.locator(`//div[normalize-space()="${Depot_Condition_Code}"]`).first().click();

  //Depot Quality Code
    await page.locator('//div[normalize-space()="Select depot quality code"]').first().click();
    await page.locator('//div[@class="dropdown-item"]').first().click();

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//button[normalize-space()="Execute"]',
    'Route to  Add'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Execute"]',
    '//button[normalize-space()="Truck In"]',
    'Route to  Execute'
  );

    
   }
)