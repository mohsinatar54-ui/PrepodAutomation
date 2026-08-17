import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact } from '../../utils/test-helpers';
import { APIRequestContext } from '@playwright/test';
import { read } from 'fs';

const MachineryMake = 'MTT';
const MachineryModel = 'MTT1';
const Responsible = 'Owner';
const Component_Code = 'ARR';
const Repair_Mode = 'FS';
const Material_Code = 'SG';
const Location_Code = 'MCNN';
const Damage_Code = 'DY';
const Qty = '1';
const Estimate_Done_By_Value = '103';

test('TC001_MNR_ExternalContainer_CreateEstimate', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);

  // Step 2: Login flow + MNR visibility selection
  await clickAndMeasureDynamic(page, '//div//img[@alt="Maintenance & Repair Logo"]', '//button[normalize-space()="Container"]', 'Click MNR Logo');

  // Step 3: Navigate to depot estimate creation
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="Depot Containers"]', 'Click Container button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Depot Containers"]', '//button[normalize-space()="+ New Container"]', 'Click Depot Containers button');

  // Step 4: New container creation
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//input[@formcontrolname="ContainerNo"]', 'Click + New Container button');

  // Step 5: Fill details
  const container_number = await readTestArtifact('EmptyIn_Container_MNR.txt');
  await page.fill('//input[@formcontrolname="ContainerNo"]', container_number);
  // await clickAndMeasureDynamic(page, `//li[normalize-space()="${container_number}"]`, '//select[@formcontrolname="EstimateType"]', `Select container number ${container_number}`);
  //   await page.locator('form div').filter({ hasText: 'Container Number *' }).getByRole('textbox').fill(container_number);
  //   await page.getByRole('listitem').click();
  await page.locator(`//ul//li[normalize-space()="${container_number}"]`).first().click();

  const expectedSurveyRemark = await readTestArtifact('Depot_Estimate_SurveyRemark.txt');

  const surveyRemarkField = page.locator(
    '//textarea[@formcontrolname="ContainerSurveyRemark"]'
  );

  await expect(surveyRemarkField).toHaveValue(expectedSurveyRemark);
  console.log('Verified that Survey Remark is pre-filled with:', expectedSurveyRemark);

  await page.locator('select[formcontrolname="MachineryMake"]').selectOption(MachineryMake);

  await page.locator('select[formcontrolname="MachineryModel"]').selectOption(MachineryModel);

  await clickAndMeasureDynamic(page, `//button[@class='btn-add' and normalize-space()='Add']`, '//input[@formcontrolname="search"]', 'Click on Add button to create container estimate');

  await page.locator('//input[@formcontrolname="search"]').fill(container_number);

  await clickAndMeasureDynamic(page, `//a[normalize-space()='${container_number}']`, '//app-searchable-dropdown[@formcontrolname="Responsible"]', 'Click and open container number');

  // ===== Responsible =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="Responsible"]').click();
  await page.fill('//input[@placeholder="Select Responsible"]', Responsible);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Responsible}"]`);

  // ===== Component Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="CompCode"]').click();
  await page.fill('//input[@placeholder="Select Component Code"]', Component_Code);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Component_Code}"]`);

  // ===== Repair Mode =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]').click();
  await page.fill('//input[@placeholder="Select Repair Mode"]', Repair_Mode);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Repair_Mode}"]`);

  // ===== Material Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="MaterialCode"]').click();
  await page.fill('//input[@placeholder="Select Material Code"]', Material_Code);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Material_Code}"]`);

  // ===== Location Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="LocationCode"]').click();
  await page.fill('//input[@placeholder="Select Location Code"]', Location_Code);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Location_Code}"]`);

  // ===== Quantity =====
  await page.locator('//input[@formcontrolname="Qty"]').fill(Qty)

  // ===== Damage Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="DamageCode"]').click();
  await page.fill('//input[@placeholder="Select Damage Code"]', Damage_Code);
  await page.click(`//div[contains(@class, "dropdown-list")]//div[normalize-space()="${Damage_Code}"]`);

  // ===== Click Add To Grid =====
  await page.click('//button[normalize-space()="Add To Grid"]');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Save"]', '//button[normalize-space()="Submit"]', 'Click Save button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', '//button[normalize-space()="Approve"]', 'Click Submit button');


  // Approve estimate
  await page.locator('//button[normalize-space()="Approve"]').scrollIntoViewIfNeeded();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Approve"]', '//select[@formcontrolname="selectedForemanId"]', 'Click Approve button');

  // Scroll to update work order button
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.locator('//select[@formcontrolname="selectedForemanId"]').selectOption(Estimate_Done_By_Value);

  // Assign Work Order
  await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update Work Order"]', '//button[normalize-space()="No"]', 'Click Update Work Order button');
  await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, '//button[normalize-space()="No"]', '//button[normalize-space()="Insert"]', 'Click No button');
  // await page.waitForTimeout(120000);
  // Fill Timesheet
  await page.locator('//button[normalize-space()="Insert"]').isEnabled({ timeout: 120000 });
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Insert"]', '//button[normalize-space()="Complete Job Order"]', 'Click Insert button');
  // await page.waitForTimeout(1000);
  // Complete Estimate
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Job Order"]', `//td//a[contains(text(),"${container_number}")]`, 'Click Complete Job Order button');

  console.log('container_number', container_number);
  // Assert Estimate created successfully
  expect(await page.locator(`//td//a[contains(text(),"${container_number}")]`).isVisible()).toBeTruthy();

  const row = page.locator('tr', { hasText: `${container_number}` });

  // await expect(row).toContainText('Approved');
  await expect(row).toContainText('Completed');
  page.close();
  console.log('TC001_MNR_DepotContainer1 completed successfully');

});





