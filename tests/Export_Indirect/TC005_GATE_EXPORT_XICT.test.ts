import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule, XOTP, ImportTally, EO9FTally } from '../../utils/test-helpers';
import fs from 'fs';

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
const surveyRemark = 'Condition OK';

// Container number artifact file

test('TC002 GATE EXPORT XITF', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes

  await login(page);

  // ================================
  // Read container number from file
  // ================================
  const containerNo = await readTestArtifact('EO9F_Container.txt')
  const EO9FvehicleNo = await readTestArtifact('EO9F_Vehicle.txt')

  console.log('Using container number:', containerNo);

  await clickAndMeasureDynamic(page, '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//button[normalize-space()="Cargo"]', 'Route to Gate tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//a[normalize-space()="Export Cargo"]', 'Route to Cargo tab');

  await clickAndMeasureDynamic(page, '//a[normalize-space()="Export Cargo"]', '//input[@placeholder="Search by booking no"]', 'Route to Export Cargo');

  const bookingNumber = await readTestArtifact('Export_EO9F_Booking_Number.txt');

  console.log(`Booking No : ${bookingNumber}`)

  await page.locator('//input[@placeholder="Search by booking no"]').fill(bookingNumber);
  await page.locator('//button[normalize-space()="Search"]').click();



  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`);

  //Execute Button
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');


  // await page.pause();

  SwitchModule(page, 'Customer Service');

  await EO9FTally(page, `${EO9FvehicleNo}`);
});
