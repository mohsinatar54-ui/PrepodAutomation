import { test, expect } from '@playwright/test';
import { SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';
import { Master } from '../../Locators/All locators/VBSMasters';


test('TC005_VBS_Masters_Transporter', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await login(page);
  await selectEntityAndSite(page);    
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.TransporterTab, 'Click Vehicle Masters');
  await clickAndMeasureDynamic(page, Master.TransporterTab, Master.Header_Transporter, 'Route to Gate Operating Hours');

  // Get the first row of the transporter master table and print its cell texts
  const firstRow = await page.locator(Master.TableFirstRow_Transporter);
  const firstRowTexts = await firstRow.locator('td').allInnerTexts();
  console.log('First Row Details:', firstRowTexts);

  // Alternatively, fetch and log each cell with selector as per your sample row
  const transporterName = await page.locator(Master.NameCell_Transporter).innerText();
  const transporterCode = await page.locator(Master.CodeCell_Transporter).innerText();
  const trans_app_per_day = await page.locator(Master.AppointmentsPerDayCell_Transporter).innerText();
  console.log('Transporter Name:', transporterName);
  console.log('Transporter Code:', transporterCode);
  console.log('Transporter Appointment Per Day:', trans_app_per_day);
  await page.getByPlaceholder('Transporter Name').fill(`${transporterName}`);
  
  // Get row count from transporter master table (excluding header)
  const rowCount = await page.locator(Master.TableRows_Transporter).count();
  console.log('Number of rows in Transporter table:', rowCount);

  // Click the edit (pen) icon in the first row of the transporter master table
  await page.locator(Master.EditIconFirstRow_Transporter).click();
  await page.locator(Master.AppointmentsPerDayInput_Transporter ).clear();
  await page.locator(Master.AppointmentsPerDayInput_Transporter).fill(`${Number(trans_app_per_day) + 1}`);
  // await clickAndMeasureDynamic(page, Master.TransporterSaveIcon, Master.TransporterYesButton, 'Click Save button');
  // await clickAndMeasureDynamic(page, Master.TransporterYesButton, Master.TransporterAppPerDayCell, 'Click Yes button');
  
  await clickAndMeasureDynamic(page, Master.Save_Transporter, Master.EditIconFirstRow_Transporter, 'Click Save button');
  await expect(page.locator(Master.AppointmentsPerDayCell_Transporter)).toHaveText(`${Number(trans_app_per_day) + 1}`);

  page.close();
  console.log('TC005_VBS_Masters_Transporter completed successfully');



  // await login(page);
  // await clickAndMeasureDynamic(page, '//img[@alt="Vehicle Booking System Logo"]', '//button[normalize-space()="Masters"]', 'Click VBS tile');

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//a[@href="/vbs/master/Transporter"]', 'Route to Transporter Masters');
  
  // await clickAndMeasureDynamic(page, '//a[@href="/vbs/master/Transporter"]', '//h2[normalize-space()="Transporter"]', 'Route to Gate Operating Hours');

  // // Get the first row of the transporter master table and print its cell texts
  // const firstRow = await page.locator('//table//tr[1]');
  // const firstRowTexts = await firstRow.locator('td').allInnerTexts();
  // console.log('First Row Details:', firstRowTexts);

  // // Alternatively, fetch and log each cell with selector as per your sample row
  // const transporterName = await page.locator('//table//tr[1]/td[1]/span').innerText();
  // const transporterCode = await page.locator('//table//tr[1]/td[2]/span').innerText();
  // const trans_app_per_day = await page.locator('//table//tr[1]/td[3]/div/span').innerText();
  // console.log('Transporter Name:', transporterName);
  // console.log('Transporter Code:', transporterCode);
  // console.log('Transporter Appointment Per Day:', trans_app_per_day);
  // await page.getByPlaceholder('Transporter Name').fill(`${transporterName}`);
  
  // // Get row count from transporter master table (excluding header)
  // const rowCount = await page.locator('//table//tbody/tr').count();
  // console.log('Number of rows in Transporter table:', rowCount);

  // // Click the edit (pen) icon in the first row of the transporter master table
  // await page.locator('//table//tr[1]//i[contains(@class,"fa-pen-to-square")]').click();
  // await page.locator('//table//tr[1]/td[3]/div/input').clear();
  // await page.locator('//table//tr[1]/td[3]/div/input').fill(`${Number(trans_app_per_day) + 1}`);
  // // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Save"]]', '//button[normalize-space()="Yes"]', 'Click Save button');
  // // await clickAndMeasureDynamic(page, '//button[normalize-space()="Yes"]', '//table//tr[1]/td[3]/div/span', 'Click Yes button');
  
  // await clickAndMeasureDynamic(page, '//i[following-sibling::span[normalize-space()="Save"]]', '//table//tr[1]//i[contains(@class,"fa-pen-to-square")]', 'Click Save button');
  // await expect(page.locator('//table//tr[1]/td[3]/div/span')).toHaveText(`${Number(trans_app_per_day) + 1}`);

  // page.close();
  // console.log('TC005_VBS_Masters_Transporter completed successfully');

});
