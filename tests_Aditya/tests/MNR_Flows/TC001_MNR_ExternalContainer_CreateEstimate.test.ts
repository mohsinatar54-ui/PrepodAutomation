import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';

// ===== Test Data =====
const Operator_Value = 'MSK/MAERSKLINE';
const Depot_Size_Value = '20DV';
const ISO_Size_Value = '22G1';
const Type_Size_Value = '20';
const Type_Code_Value = 'DV';
const Quality_Code_Value = 'Damage';
const Condition_Code_Value = 'I';
// const Short_Code = 'SC01';
const Responsible = 'Owner';
const Contract_Applicable = 'MSK/MAERSKLINE';
const Responsible_Party = 'MSK/MAERSKLINE';
const Component_Code = 'AAA';
const Repair_Mode = 'RM1';
const Material_Code = 'AP';
const Location_Code = 'TL0N';
const Damage_Code = 'BT';
const Labour_Rate = '100';
const Qty = '1';
const Estimate_Done_By_Value = '2155';
const Send_Responsible_Party_Value = '2';

test('TC001_MNR_ExternalContainer_CreateEstimate', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);

  // Step 2: Login flow + MNR visibility selection
  await clickAndMeasureDynamic(page, '//div//img[@alt="MNR Logo"]', '//button[normalize-space()="Container"]', 'Click MNR Logo');

  // Step 3: Navigate to external estimate creation
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="External Containers"]', 'Click Container button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="External Containers"]', '//button[normalize-space()="+ New Container"]', 'Click External Containers button');

  // Step 4: New container creation
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//select[@formcontrolname="OperatorId"]', 'Click + New Container button');

  // ===== Select Mandatory Dropdowns =====
  await page.locator('//select[@formcontrolname="OperatorId"]').selectOption(Operator_Value);

  await page.locator('//app-searchable-dropdown[@formcontrolname="OPSSizeType"]').click();
  await page.fill('//input[@placeholder="Select Depot Size/Type"]', Depot_Size_Value);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Depot_Size_Value}"]`);

  await page.locator('//app-searchable-dropdown[@formcontrolname="SzTypeId"]').click();
  await page.fill('//input[@placeholder="Select ISO Size Type"]', ISO_Size_Value);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${ISO_Size_Value}"]`);



  // ===== Fill Container Number =====
  const prefix = 'CMAU';
  const numLength = 7;
  const random_number = getRandomNumberString(numLength);
  const container_number = `${prefix}${random_number}`;
  console.log('container_number', container_number);
  await page.locator('//input[@formcontrolname="ContainerNo"]').fill(container_number);

  // ===== Select Remaining Mandatory Dropdowns =====  
  await page.locator('//select[@formcontrolname="QualityId"]').selectOption(Quality_Code_Value);

  // await page.locator('//select[@formcontrolname="ConditionCode"]').selectOption(Condition_Code_Value);


  // Scroll into view for "Add" button using keyboard (and arrow down)
  const addBtnLocator = '//button[normalize-space()="Add"]';
  await page.locator(addBtnLocator).scrollIntoViewIfNeeded();

  // Submit Estimate
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//app-view-container-list', 'Click Add button');

  // const container_number = 'LDTU9927220';
  // Navigate to the created estimate
  await clickAndMeasureDynamic(page, `//a[normalize-space()="${container_number}"]`, '//button[normalize-space()="Add To Grid"]', 'Click Add To Grid button');

  // Scroll to repair item details & fill them
  // ===== Short Code =====
  // await page.locator('//app-searchable-dropdown[@formcontrolname="ShortCode"]').click();
  // await page.fill('//input[@placeholder="Select Short Code"]', Short_Code);
  // await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Short_Code}"]`);

  // ===== Responsible =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="Responsible"]').click();
  await page.fill('//input[@placeholder="Select Responsible"]', Responsible);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Responsible}"]`);

  // ===== Contract Applicable =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="ContractApplicable"]').click();
  await page.fill('//input[@placeholder="Select Contract Applicable"]', Contract_Applicable);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Contract_Applicable}"]`);

  // ===== Responsible Party =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="ResponsibleParty"]').click();
  await page.fill('//input[@placeholder="Select Responsible Party"]', Responsible_Party);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Responsible_Party}"]`);

  // ===== Component Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="CompCode"]').click();
  await page.fill('//input[@placeholder="Select Component Code"]', Component_Code);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Component_Code}"]`);

  // ===== Repair Mode =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]').click();
  await page.fill('//input[@placeholder="Select Repair Mode"]', Repair_Mode);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Repair_Mode}"]`);

  // ===== Material Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="MaterialCode"]').click();
  await page.fill('//input[@placeholder="Select Material Code"]', Material_Code);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Material_Code}"]`);

  // ===== Location Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="LocationCode"]').click();
  await page.fill('//input[@placeholder="Select Location Code"]', Location_Code);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Location_Code}"]`);

  // ===== Damage Code =====
  await page.locator('//app-searchable-dropdown[@formcontrolname="DamageCode"]').click();
  await page.fill('//input[@placeholder="Select Damage Code"]', Damage_Code);
  await page.click(`//div[@class="dropdown-list"]//div[normalize-space()="${Damage_Code}"]`);

  // ===== Fill Text Fields =====
  await page.fill('//input[@formcontrolname="LabourRate"]', Labour_Rate);

  await page.fill('//input[@formcontrolname="Qty"]', Qty);

  // ===== Click Add To Grid =====
  await page.click('//button[normalize-space()="Add To Grid"]');

  await page.locator('//select[@formcontrolname="EstimateDoneBy"]').selectOption({ value: Estimate_Done_By_Value });

  await page.locator('//select[@formcontrolname="sendResponsibleParty"]').selectOption({ value: Send_Responsible_Party_Value });

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Save"]', '//button[normalize-space()="Submit"]', 'Click Save button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', '//button[normalize-space()="Approve"]', 'Click Submit button');


  await page.waitForTimeout(1000);
  // Submit estimate for approval
  await page.locator('//button[text()=" Submit "]').scrollIntoViewIfNeeded();
  await clickAndMeasureDynamic(page, '//button[text()=" Submit "]', '//button[text()=" Approve "]', 'Click Submit button');

  // Approve estimate
  await page.locator('//button[text()=" Approve "]').scrollIntoViewIfNeeded();
  await clickAndMeasureDynamic(page, '//button[text()=" Approve "]', '//select[@formcontrolname="selectedForemanId"]', 'Click Approve button');

  // Scroll to update work order button
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.locator('//select[@formcontrolname="selectedForemanId"]').selectOption(Estimate_Done_By_Value);

  // Assign Work Order
  await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, '//button[text()=" Update Work Order "]', '//button[text()=" No "]', 'Click Update Work Order button');
  await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, '//button[text()=" No "]', '//button[normalize-space()="Insert"]', 'Click No button');
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

  await expect(row).toContainText('Approved');
  await expect(row).toContainText('Completed');
  page.close();
  console.log('TC001_MNR_ExternalContainer_CreateEstimate completed successfully');
});


