import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { createExcelFile, createPreAdviceExcel } from '../../utils/createExcelData';


// import fs from 'fs';
// import { waitForDebugger } from 'inspector';
// import { text } from 'stream/consumers';



test('TC001_CSM_Import_MOTL', async ({ page }) => {

  const { filePath, referenceNo, containerNumbers } = createPreAdviceExcel();

  console.log('Generated file:', filePath);
  console.log('Reference No:', referenceNo);
  console.log('Container Numbers:', containerNumbers);

  // Access individually
  const preContainer1 = containerNumbers[0];
  const preContainer2 = containerNumbers[1];

  await login(page);

  selectEntityAndSite(page);

  await clickAndMeasureDynamic(page, '(//img[@alt="Gate Operations Logo"])[1]', '//button[normalize-space()="Express Services"]', 'Route to Gate Operations');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Express Services"]', '//button[normalize-space()="Pre-Advice Empty Booking"]', 'Route to Pre-Advice Empty Booking tab');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Pre-Advice Empty Booking"]', `//button[normalize-space()="Upload"]`, 'Route to Pre-Advice Empty Booking');
  await page.locator('//button[normalize-space()="Upload"]').isVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Upload"]', '//label[normalize-space()="Choose file"]', 'Route to Add Pre-Advice Empty Booking');

  // Upload file
  await page.locator('#upload-file-input').setInputFiles(filePath);

  // Click Upload button
  await page.locator('//button[normalize-space()="Upload"]').click();

  await page.pause();

  await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).waitFor();
  await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).fill(preContainer1);
  await page.locator('//button[normalize-space()="Search"]').click();

  // Verify first container appears in search results
  const firstContainerLocator = page.locator(`//tr[td[contains(., "${preContainer1}")]]`);

  writeTestArtifact('PreContainer1.txt', preContainer1);
  const firstVisible = await firstContainerLocator.isVisible();

  await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).waitFor();
  await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).fill(preContainer2);
  await page.locator('//button[normalize-space()="Search"]').click();

  // Verify second container appears in search results
  const secondContainerLocator = page.locator(`//tr[td[contains(., "${preContainer2}")]]`);

  writeTestArtifact('PreContainer2.txt', preContainer2);
  const secondVisible = await secondContainerLocator.isVisible();

  // If both containers are visible
   
  if (firstVisible && secondVisible) {
    console.log("both containers have been added successfully for Pre Advice in");
  }

});
