import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, SwitchModule, login, MOTL, readTestArtifact, getRandomNumberString, writeTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';


const Transporter = 'ADITYA LOGISTICS';
const   Activity = 'EITP';
const   Driver = 'MJ';
const   Driver_Licence_No = 'MJ420';
const   Operator = 'MAERSKLINE';
const   Depot_Size = '20 STD'
const   ISO_Size = '22G1'
const   Primary_AC_Holder = 'MMJ LOGISTICS'
const   Depot_Condition_Code = 'Damage'

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
const Condition_Remark = 'Condition OK';
const Vehicle_No = generateVehicleNumber();

// Container number artifact file
test('Express_Gate_in', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes

  await login(page);
  
    // ================================
    // Navigation
    // ================================
    await clickAndMeasureDynamic(
      page,
      '(//img[@alt="Gate Operations Logo"])[1]',
      '//button[normalize-space()="Express Services"]',
      "Route to Gate Operations",
    );
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Express Services"]',
      '//button[normalize-space()="Express Empty"]',
      "Route to  Express Services",
    );
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Express Empty"]',
      '//button[normalize-space()="Truck In"]',
      "Route to  Express Empty",
    );
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Truck In"]',
      '//input[@placeholder="Enter vehicle number"]',
      "Route to  Truck In",
    );
  
    //Vehicle No
    await page.locator('//input[@placeholder="Enter vehicle number"]').click();
    await page
      .locator('//input[@placeholder="Enter vehicle number"]')
      .fill(Vehicle_No);
  
    //Transporter
    await page.locator('//div[text()=" Select transporter "]').first().click();
    await page
      .locator('//input[@placeholder="Select transporter"]')
      .fill(Transporter);
    await page.locator('//div[@class="dropdown-item"]').first().click();
  
    //Activity
    await page.locator('//div[text()=" Select activity "]').first().click();
    await page.locator('//input[@placeholder="Select activity"]').fill(Activity);
    await page.locator('//div[@class="dropdown-item"]').first().click();
  
    //Driver
    await page.locator('//input[@placeholder="Enter driver name"]').click();
    await page.locator('//input[@placeholder="Enter driver name"]').fill(Driver);
  
    //Driver Licence No
    await page
      .locator('//input[@placeholder="Enter driver licence number"]')
      .click();
    await page
      .locator('//input[@placeholder="Enter driver licence number"]')
      .fill(Driver_Licence_No);
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="GO"]',
      '//input[@placeholder="Enter container number"]',
      "Route to  Go",
    );
  
    //Container No
    // const ContainerNo = "PWTU" + getRandomNumberString(7);
  
    const ContainerNo = await readTestArtifact("PreContainer1.txt");
    //Add Container

    await page
      .locator('//input[@placeholder="Enter container number"]')
      .fill(ContainerNo);
  
    //  Locator for error popup
    const preAnnounceError = page.locator(
      '//div//span[contains(text(),"is not Pre-announced.")]',
    );
  
    // Wait briefly for message rendering
    await page.waitForTimeout(3000);
  
    //  Check if popup appeared
    if (await preAnnounceError.isVisible()) {
      const errorText = await preAnnounceError.textContent();
  
      console.log("❌ Error Popup Appeared:", errorText);
    } else {
      console.log("✅ Container : " + ContainerNo + " is pre-announced.");
    }
  
    //Operator
    await page
      .locator(
        '//input[@placeholder="Type to search operator (use %%% for all)"]',
      )
      .first()
      .click();
    await page
      .locator(
        '//input[@placeholder="Type to search operator (use %%% for all)"]',
      )
      .fill(Operator);
    await page.locator(`//div[normalize-space()="${Operator}"]`).first().click();
  
    //Depot Size
    await page
      .locator('//div[normalize-space()="Select depot size"]')
      .first()
      .click();
    await page
      .locator('//input[@placeholder="Select depot size"]')
      .fill(Depot_Size);
    await page.locator('//div[@class="dropdown-item"]').first().click();
  
    //ISO Size
    await page
      .locator('//div[normalize-space()="Select ISO size"]')
      .first()
      .click();
    await page.locator('//input[@placeholder="Select ISO size"]').fill(ISO_Size);
    await page.locator(`//div[normalize-space()="${ISO_Size}"]`).first().click();
  
    //Primary A/c Holder
    await page
      .locator('//input[@placeholder="Type to search account holder"]')
      .first()
      .click();
    await page
      .locator('//input[@placeholder="Type to search account holder"]')
      .fill(Primary_AC_Holder);
  
    //Depot Condition Code
    await page
      .locator('//div[normalize-space()="Select depot condition code"]')
      .first()
      .click();
    await page
      .locator('//input[@placeholder="Select depot condition code"]')
      .fill(Depot_Condition_Code);
    await page
      .locator(`//div[normalize-space()="${Depot_Condition_Code}"]`)
      .first()
      .click();
  
    //Depot Quality Code
    await page
      .locator('//div[normalize-space()="Select depot quality code"]')
      .first()
      .click();
    await page.locator('//div[@class="dropdown-item"]').first().click();
  
    //Condition Survey Remark
    await page
      .locator('//input[@formcontrolname="comment"]')
      .fill(Condition_Remark);
  
    writeTestArtifact("Depot_Estimate_SurveyRemark.txt", Condition_Remark);
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Add"]',
      '//button[normalize-space()="Execute"]',
      "Route to  Add",
    );
  
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Execute"]',
      '//button[normalize-space()="Truck In"]',
      "Route to  Execute",
    );
  });

  

