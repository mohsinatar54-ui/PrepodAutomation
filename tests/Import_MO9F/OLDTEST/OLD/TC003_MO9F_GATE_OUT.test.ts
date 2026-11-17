// import { test, expect } from '@playwright/test';
// import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule } from '../../../../utils/test-helpers';


// // const Vehicle_No = 'MH18AT1235';
// // const surveyRemark = 'Condition OK';
// // const ExportCargoBkgNo = '45855BN20251230001EXP';
// // const Vehicle_No = 'MH5658';
// // const containerNo = 'VZXU5444558';
// // const stackType = 'Un-Marked Stack';
// // const stackName = 'Automation Stack 01';


// test('TC003_MO9F_GATE_OUT', async ({ page }) => {
//   test.setTimeout(120_000); // 2 minutes timeout for this test

//   const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt')
//   await login(page);
//   await clickAndMeasureDynamic(page, '(//img[@alt="Gate & Weighbridge Operations Logo"])[1]', '//button[normalize-space()="Standard Services"]', 'Route to Gate Microservice');


//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//button[normalize-space()="Cargo"]', 'Route to Cargo tab');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//a[@placeholder="Import Cargo"]', 'Route to Import Cargo screen');
//   await clickAndMeasureDynamic(page, '//a[normalize-space()="Import Cargo"]', '//input[@placeholder="Search by booking no"]', 'Route to Search screen');


//   // Toggle (Gate In/Out)
//   const gateToggleLabel = page.locator(
//     '//span[normalize-space()="Gate In"]/following-sibling::label'
//   );

//   await gateToggleLabel.click();

//   const bookingNumber = await readTestArtifact('Import_MO9F_Booking_Number.txt');

//   console.log(`Booking No : ${bookingNumber}`)

//   await page.locator('//input[@placeholder="Search by booking no"]').fill(bookingNumber);
//   await page.locator('//button[normalize-space()="Search"]').click();

//   const Vehicle_No = await readTestArtifact('MO9F_Vehicle_Number.txt');
//   // Validate Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

//   //Execute Button
//   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);

//   // await page.pause();


// });
