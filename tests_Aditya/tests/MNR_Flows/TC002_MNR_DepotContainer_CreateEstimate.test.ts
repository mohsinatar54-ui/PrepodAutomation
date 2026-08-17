import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { APIRequestContext } from '@playwright/test';

// // const URL = 'https://ueapp.logstarerp.com/login';
// const Username = 'sagar.patil';
// const Password = 'Pass@123';

// const Entity = 'CMA';
// const Site = 'Jeddah';

const Operator_Value = '1';
const Estimate_Type_Value = '955';

const DepotSizeType = '20STD';
const ISOSizeType = '22G1';

const Quality_Value = '943';
const Condition_Value = '932';

const Location_Code = 'LT5N';
const Repair_Mode_Code = "03-5121/Door Panel - Replace - 1954x943x2.0 mm (For 8'6'' containers)";
const Comp_Code = 'Roof bow pin';
const Damage_Type = 'WB - Bald';
const Qty = '1';
const Repair_Type = 'AB - Abrasive clean and paint';
const Responsible = 'Owner';
const Estimate_Done_Value = '43';
const Estimate_Type = 'Box';
const container_number = 'MSKU9595201';

/**
 * Fetches the MNR container list from the API.
 * @param request Playwright APIRequestContext
 * @returns Promise<any[]> List of containers
 */
export async function fetchMNRContainerList(request: APIRequestContext): Promise<any[]> {
  const url = 'https://prepacgateapi.logstarerp.com/MNRIntegration/MNR-container-list?GeoId=1';
  const response = await request.get(url, { ignoreHTTPSErrors: true });
  expect(response.status()).toBe(200);
  const json = await response.json();
  console.log('API Response:', json);
  return json;
}

/**
 * Gets the first container with ISOSizeType '22G1' from the MNR container list.
 * @param request Playwright APIRequestContext
 * @returns Promise<string> Container number
 */
export async function getFirst22G1Container(request: APIRequestContext): Promise<string> {
  const list = await fetchMNRContainerList(request);
  const selected = list.find((item: any) => item.ISOSizeType === '22G1');
  expect(selected).toBeTruthy();
  const container = selected.ContainerNo;
  console.log('Selected 22G1 Container =', container);
  return container;
}

test('TC002_MNR_DepotContainer_CreateEstimate', async ({ page }) => {
  test.setTimeout(160_000); // 2 minutes timeout for this test
  await login(page);

  await clickAndMeasureDynamic(page, '//div//img[@alt="MNR Logo"]', '//button[normalize-space()="Container"]', 'Click MNR Logo');
  // --- Go to Depot Estimate Creation ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="Depot Containers"]', 'Click Depot Containers button');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Depot Containers"]', '//button[normalize-space()="+ New Container"]', 'Click External Containers button');

  // --- Click New Container ---
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//input[@formcontrolname="ContainerNo"]', 'Click + New Container button');

  // --- Fill Estimate Details ---
  // const container_number = await getFirst22G1Container(page.request);
  // console.log('container_number', container_number);

  await page.fill('//input[@formcontrolname="ContainerNo"]', container_number);
  // await clickAndMeasureDynamic(page, `//li[normalize-space()="${container_number}"]`, '//select[@formcontrolname="EstimateType"]', `Select container number ${container_number}`);
  await page.locator('form div').filter({ hasText: 'Container Number *' }).getByRole('textbox').fill(container_number);
  await page.getByRole('listitem').click();
  // await page.locator('select[formcontrolname="EstimateType"]').click();
  // await page.selectOption('//select[@formcontrolname="EstimateType"]', Estimate_Type_Value);  
  // await page.waitForTimeout(3000);
  // await page.getByLabel('Quality Code').click();
  // await page.selectOption('//select[@formcontrolname="QualityId"]', Quality_Value);
  // await page.waitForTimeout(3000);
  // await page.selectOption('//select[@formcontrolname="DamageId"]', Condition_Value);
  // // await page.click('//h2[text()="Add Container"]');
  // await page.waitForTimeout(3000);
  // --- Submit Estimate ---
  await page.waitForTimeout(3000);
  await page.selectOption('select[formcontrolname="EstimateType"]', Estimate_Type);
  await page.locator('form div').filter({ hasText: 'Estimate Type *Select Box' }).getByRole('combobox').selectOption('Box');
  // await page.locator('select[formcontrolname="EstimateType"]').click();
  await page.locator('form div').filter({ hasText: 'Quality Code *Select' }).getByRole('combobox').selectOption('Available');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="Depot Containers"]', 'Click Add button');
  await page.screenshot({ path: 'mnr_depot.png' });
  // await page.getByPlaceholder('Search').fill(container_number[0].ContainerNo);
  await page.locator('input[formcontrolname="search"]').fill(container_number);
  // Find the row with container number 'MSKU9595201' and status 'New'
  // await page.locator(`//tr[td[normalize-space()='New']]//a[normalize-space()='${container_number}']`).click();
  // await expect(rowLocator).toHaveCount(1); // Ensure the row exists
  // await page.getByPlaceholder('Search').press('Enter');
  // await page.click('//button[text()=" Depot Containers "]');
  console.log(`✅ MNR Estimate created successfully with Container Number: ${container_number}`);

  // --- Navigate to Created Estimate ---
  await clickAndMeasureDynamic(page, `//tr[td[normalize-space()='New']]//a[normalize-space()='${container_number}']`, '//app-searchable-dropdown[@formcontrolname="LocationCode"]', 'Click and open container number');

  // Scroll to repair item details & fill them
    await page.locator('//app-searchable-dropdown[@formcontrolname="LocationCode"]').click();
    await page.fill('//input[@placeholder="Select Location Code"]', Location_Code);
    await page.click(`//div[@class="dropdown-list"]//div[text()=" ${Location_Code} "]`);
  
    await page.click('//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]');
    // Select first value in list
    await page.click('//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]//*[@class="dropdown-list"]//div[1]');
  
    // Component code
    await page.click('//app-searchable-dropdown[@formcontrolname="CompCode"]');
    await page.fill('//input[@placeholder="Select Component Code"]', Comp_Code);
    await page.click(`//div[@class="dropdown-list"]//div[text()=" ${Comp_Code} "]`);
  
    // Damage Type
    await page.click('//app-searchable-dropdown[@formcontrolname="RP1"]');
    await page.fill('//input[@placeholder="Select Damage Type"]', Damage_Type);
    await page.click(`//div[@class="dropdown-list"]//div[text()=" ${Damage_Type} "]`);
  
    // Qty
    await page.fill('//input[@formcontrolname="Qty"]', Qty);
  
  
    // Repair Type
    await page.click('//app-searchable-dropdown[@formcontrolname="RP2"]');
  
    await page.fill('//input[@placeholder="Select Repair Type"]', Repair_Type);
  
    await page.click(`//div[@class="dropdown-list"]//div[text()=" ${Repair_Type} "]`);
  
    // Responsible
    await page.click('//app-searchable-dropdown[@formcontrolname="Responsible"]');
  
    await page.fill('//input[@placeholder="Select Responsible"]', Responsible);
  
    await page.click(`//div[@class="dropdown-list"]//div[text()=" ${Responsible} "]`);
  
    await page.waitForTimeout(1000);
  
    // Add to grid
    await page.locator('//button[text()=" Add To Grid "]').scrollIntoViewIfNeeded();
    await clickAndMeasureDynamic(page, '//button[text()=" Add To Grid "]', '//select[@formcontrolname="EstimateDoneBy"]', 'Click Add To Grid button');
    await page.locator('//select[@formcontrolname="EstimateDoneBy"]').scrollIntoViewIfNeeded();
    await page.locator('//select[@formcontrolname="EstimateDoneBy"]').selectOption(Estimate_Done_Value);
  
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
    await page.locator('//select[@formcontrolname="selectedForemanId"]').selectOption(Estimate_Done_Value);
  
    // Assign Work Order
    await page.waitForTimeout(1000);
    await clickAndMeasureDynamic(page, '//button[text()=" Update Work Order "]', '//button[text()=" No "]', 'Click Update Work Order button');
    await page.waitForTimeout(1000);
    await clickAndMeasureDynamic(page, '//button[text()=" No "]', '//button[normalize-space()="Insert"]', 'Click No button');

    // Fill Timesheet
    // await page.locator(`//a[normalize-space()="${container_number}"]`).click();
    await page.locator('//button[normalize-space()="Insert"]').isEnabled({timeout: 160000});
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
});

