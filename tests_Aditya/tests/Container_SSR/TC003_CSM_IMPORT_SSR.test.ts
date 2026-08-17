
import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact, SealCuttingSSR } from '../../utils/test-helpers';
import fs from 'fs';
import { waitForDebugger } from 'inspector';
import { text } from 'stream/consumers';

const Remarks = 'Test remark for Seal Cutting';


test('TC003_CSM_IMPORT_SSR', async ({ page }) => {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
  await login(page);

  const containerNo = readTestArtifact('Container_SSR_Number.txt')

  console.log('Using container number:', containerNo);

  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="SSR"]', 'Route to Customer Service');

  await SealCuttingSSR(page);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="SSR"]', '//input[@formcontrolname="ContainerNo"]', 'Route to SSR Screen');

  await page.locator('input[formcontrolname="ContainerNo"]').fill(containerNo)
  await page.locator('//button[normalize-space()="Search"]').click();

  await page.locator('//a[@class="booking-link"]').first().click();
  await page.locator(`//a[normalize-space()="${containerNo}"]`).click();

  await page.locator('//label[normalize-space()="Job Remark*"]/following::textarea[1]').fill(Remarks);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Execute"]', 'Update Job');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', 'input[formcontrolname="ContainerNo"]', 'Execute Job');

});