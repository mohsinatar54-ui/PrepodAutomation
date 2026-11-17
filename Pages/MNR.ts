import { Page,expect,Locator} from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../utils/test-helpers';
import { MNR_Xpath } from 'Locators/All locators/MNR_Xpath';

  const prefix = 'CMAU';
  const numLength = 7;
  const random_number = getRandomNumberString(numLength);
  const container_number = `${prefix}${random_number}`;
  console.log('container_number', container_number);

export class MNR {

static async Externalcontainer( page: Page,data: any )
    
   {
 await clickAndMeasureDynamic(page, MNR_Xpath.MNR_LOGO, MNR_Xpath.CONTAINER_BUTTON, 'Click MNR Logo');

await clickAndMeasureDynamic(page, MNR_Xpath.CONTAINER_BUTTON, MNR_Xpath.EXTERNAL_CONTAINERS_BUTTON, 'Click Container button');

await clickAndMeasureDynamic(page, MNR_Xpath.EXTERNAL_CONTAINERS_BUTTON, MNR_Xpath.NEW_CONTAINER_BUTTON, 'Click External Containers button');

await clickAndMeasureDynamic(page, MNR_Xpath.NEW_CONTAINER_BUTTON, MNR_Xpath.OPERATOR_DROPDOWN, 'Click + New Container button');

await page.locator(MNR_Xpath.OPERATOR_DROPDOWN).selectOption(data.Operator_Value);

await page.locator(MNR_Xpath.DEPOT_SIZE_DROPDOWN).click();
await page.fill(MNR_Xpath.DEPOT_SIZE_INPUT, data.Depot_Size_Value);
await page.locator(MNR_Xpath.DROPDOWN_OPTION(data.Depot_Size_Value)).click();

await page.locator(MNR_Xpath.ISO_SIZE_DROPDOWN).click();
await page.fill(MNR_Xpath.ISO_SIZE_INPUT, data.ISO_Size_Value);
await page.locator(MNR_Xpath.DROPDOWN_OPTION(data.ISO_Size_Value)).click();

await page.locator(MNR_Xpath.CONTAINER_NUMBER_INPUT).fill(container_number);

await page.locator(MNR_Xpath.QUALITY_DROPDOWN).selectOption(data.Quality_Code_Value);

await page.locator(MNR_Xpath.ADD_BUTTON).scrollIntoViewIfNeeded();
await clickAndMeasureDynamic(page, MNR_Xpath.ADD_BUTTON, MNR_Xpath.CONTAINER_LIST, 'Click Add button');

await page.locator(MNR_Xpath.CONTAINER_NUMBER_LINK(container_number)).waitFor({ state: 'visible', timeout: 15000 });
await clickAndMeasureDynamic(page, MNR_Xpath.CONTAINER_NUMBER_LINK(container_number), MNR_Xpath.ADD_TO_GRID_BUTTON, 'Click Container Number');

// await page.locator(MNR_Xpath.RESPONSIBLE_DROPDOWN).click();
// await page.fill(MNR_Xpath.RESPONSIBLE_INPUT, data.Responsible);
// await page.locator(MNR_Xpath.DROPDOWN_OPTION1).click();
await page.locator(MNR_Xpath.RESPONSIBLE_DROPDOWN1).click();
await page.locator(MNR_Xpath.DOPTION(data.Responsible)).click();

await page.locator(MNR_Xpath.CONTRACT_APPLICABLE_DROPDOWN).click();
// await page.fill(MNR_Xpath.CONTRACT_APPLICABLE_INPUT, data.Contract_Applicable);
await page.locator(MNR_Xpath.DOPTION(data.Contract_Applicable)).click();

await page.locator(MNR_Xpath.RESPONSIBLE_PARTY_DROPDOWN).click();
//await page.fill(MNR_Xpath.RESPONSIBLE_PARTY_INPUT, data.Responsible_Party);
await page.locator(MNR_Xpath.DOPTION(data.Responsible_Party)).click();

await page.locator(MNR_Xpath.COMPONENT_CODE_DROPDOWN).click();
//await page.fill(MNR_Xpath.COMPONENT_CODE_INPUT, data.Component_Code);
await page.locator(MNR_Xpath.DOPTION(data.Component_Code)).click();

await page.locator(MNR_Xpath.REPAIR_MODE_DROPDOWN).click();
//await page.fill(MNR_Xpath.REPAIR_MODE_INPUT, data.Repair_Mode);
await page.locator(MNR_Xpath.DOPTION(data.Repair_Mode)).click();

await page.locator(MNR_Xpath.MATERIAL_CODE_DROPDOWN).click();
//await page.fill(MNR_Xpath.MATERIAL_CODE_INPUT, data.Material_Code);
await page.locator(MNR_Xpath.DOPTION(data.Material_Code)).click();

await page.locator(MNR_Xpath.LOCATION_CODE_DROPDOWN).click();
//await page.fill(MNR_Xpath.LOCATION_CODE_INPUT, data.Location_Code);
await page.locator(MNR_Xpath.DOPTION(data.Location_Code)).click();

 await page.locator(MNR_Xpath.QTY_INPUT).fill(data.Qty);

await page.locator(MNR_Xpath.DAMAGE_CODE_DROPDOWN).click();
//await page.fill(MNR_Xpath.DAMAGE_CODE_INPUT, data.Damage_Code);
await page.locator(MNR_Xpath.DOPTION(data.Damage_Code)).click();
await page.locator(MNR_Xpath.LENGTH_DROPDOWN).selectOption('10');
await page.locator(MNR_Xpath.Width).selectOption('50');
//await page.fill(MNR_Xpath.LABOUR_RATE_INPUT, data.Labour_Rate);
// await page.locator(MNR_Xpath.PART_NUMBER_DROPDOWN).click();
// await page.locator(MNR_Xpath.DOPTION(data.PartNo)).click();
// await page.locator(MNR_Xpath.Length).click();
// //await page.fill(MNR_Xpath.DAMAGE_CODE_INPUT, data.Damage_Code);
// await page.locator(MNR_Xpath.DOPTION(data.Length)).click();
// await page.locator(MNR_Xpath.Width).click();
// //await page.fill(MNR_Xpath.DAMAGE_CODE_INPUT, data.Damage_Code);
// await page.locator(MNR_Xpath.DOPTION(data.Width)).click();

await page.locator(MNR_Xpath.ADD_TO_GRID_BUTTON).click();

await page.locator(MNR_Xpath.ESTIMATE_DONE_BY_DROPDOWN).selectOption(data.Estimate_Done_By_Value);
await page.locator(MNR_Xpath.SEND_RESPONSIBLE_PARTY_DROPDOWN).selectOption(data.Send_Responsible_Party_Value);

await clickAndMeasureDynamic(page, MNR_Xpath.SAVE_BUTTON, MNR_Xpath.SUBMIT_BUTTON, 'Click Save button');
await clickAndMeasureDynamic(page, MNR_Xpath.SUBMIT_BUTTON, MNR_Xpath.APPROVE_BUTTON, 'Click Submit button');


await page.locator(MNR_Xpath.APPROVE_BUTTON_SPACED).scrollIntoViewIfNeeded();
await clickAndMeasureDynamic(page, MNR_Xpath.APPROVE_BUTTON_SPACED, MNR_Xpath.SELECTED_FOREMAN_DROPDOWN, 'Click Approve button');

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.locator(MNR_Xpath.SELECTED_FOREMAN_DROPDOWN).selectOption(data.Estimate_Done_By_Value);

await clickAndMeasureDynamic(page, MNR_Xpath.UPDATE_WORK_ORDER_BUTTON, MNR_Xpath.NO_BUTTON, 'Click Update Work Order button');
await clickAndMeasureDynamic(page, MNR_Xpath.NO_BUTTON, MNR_Xpath.INSERT_BUTTON, 'Click No button');

// await page.locator(MNR_Xpath.INSERT_BUTTON).waitFor({ state: 'visible', timeout: 120000 });
// await clickAndMeasureDynamic(page, MNR_Xpath.INSERT_BUTTON, MNR_Xpath.COMPLETE_JOB_ORDER_BUTTON, 'Click Insert button');

await clickAndMeasureDynamic(page, MNR_Xpath.Startbutton, MNR_Xpath.Stopbutton, 'Start Work Order ');
await page.waitForTimeout(60000);

await page.locator(MNR_Xpath.Stopbutton).waitFor({ state: 'visible' });
await expect(page.locator(MNR_Xpath.Stopbutton)).toBeEnabled({ timeout: 30000 });

await clickAndMeasureDynamic(page, MNR_Xpath.Stopbutton, MNR_Xpath.COMPLETE_JOB_ORDER_BUTTON, 'Stop Work Order ');

//await clickAndMeasureDynamic(page, MNR_Xpath.COMPLETE_JOB_ORDER_BUTTON, MNR_Xpath.CREATED_CONTAINER_LINK(container_number), 'Click Complete Job Order button');
await clickAndMeasureDynamic(page, MNR_Xpath.COMPLETE_JOB_ORDER_BUTTON, MNR_Xpath.APPROVE_BUTTON_SPACED, 'Click Complete Job Order button');

await clickAndMeasureDynamic(page, MNR_Xpath.APPROVE_BUTTON_SPACED, MNR_Xpath.APPROVE_BUTTON1, 'Route to complete the w/o');

await clickAndMeasureDynamic(page, MNR_Xpath.APPROVE_BUTTON1, MNR_Xpath.Completed_tag, 'Route to complete the w/o');

// const createdContainer = page.locator(MNR_Xpath.CREATED_CONTAINER_LINK(container_number));
// await expect(createdContainer).toBeVisible();

// const row = page.locator(MNR_Xpath.CONTAINER_ROW(container_number));
// await expect(row).toContainText('Approved');
// await expect(row).toContainText('Completed');

console.log('TC001_MNR_ExternalContainer_CreateEstimate completed successfully');

   }

static async DepotContainer(page:Page,data:any)
{
// --- Navigate to MNR ---
await clickAndMeasureDynamic(page, MNR_Xpath.mnrLogo, MNR_Xpath.containerButton, 'Click MNR Logo');

// --- Go to Depot Estimate Creation ---
await clickAndMeasureDynamic(page, MNR_Xpath.containerButton, MNR_Xpath.depotContainersButton, 'Click Depot Containers button');
await clickAndMeasureDynamic(page, MNR_Xpath.depotContainersButton, MNR_Xpath.newContainerButton, 'Click External Containers button');

// --- Click New Container ---
await clickAndMeasureDynamic(page, MNR_Xpath.newContainerButton, MNR_Xpath.containerNumberInput, 'Click + New Container button');

// --- Fill Estimate Details ---
// const container_number = await getFirst22G1Container(page.request);
// console.log('container_number', container_number);

await page.fill(MNR_Xpath.containerNumberInput, data.container_number);
// await clickAndMeasureDynamic(page, `//li[normalize-space()="${data.container_number}"]`, MNR_Xpath.estimateTypeSelect, `Select container number ${data.container_number}`);
await page.locator('form div').filter({ hasText: 'Container Number *' }).getByRole('textbox').fill(data.container_number);
await page.getByRole('listitem').click();
// await page.locator('select[formcontrolname="EstimateType"]').click();
// await page.selectOption(MNR_Xpath.estimateTypeSelect, data.Estimate_Type);
// await page.waitForTimeout(3000);
// await page.getByLabel('Quality Code').click();
// await page.selectOption(MNR_Xpath.qualityIdSelect, data.Quality_Value);
// await page.waitForTimeout(3000);
// await page.selectOption(MNR_Xpath.damageIdSelect, data.Condition_Value);
// // await page.click('//h2[text()="Add Container"]');
// await page.waitForTimeout(3000);

// --- Submit Estimate ---
await page.waitForTimeout(3000);
await page.selectOption(MNR_Xpath.estimateTypeSelect, data.Estimate_Type);
await page.locator('form div').filter({ hasText: 'Estimate Type *Select Box' }).getByRole('combobox').selectOption('Box');
// await page.locator(MNR_Xpath.estimateTypeSelect).click();
await page.locator('form div').filter({ hasText: 'Quality Code *Select' }).getByRole('combobox').selectOption('Available');

await clickAndMeasureDynamic(page, MNR_Xpath.addButton, MNR_Xpath.depotContainersButton, 'Click Add button');
await page.screenshot({ path: 'mnr_depot.png' });
// await page.getByPlaceholder('Search').fill(data.container_number[0].ContainerNo);
await page.locator(MNR_Xpath.searchInput).fill(data.container_number);
// Find the row with container number 'MSKU9595201' and status 'New'
// await page.locator(`//tr[td[normalize-space()='New']]//a[normalize-space()='${data.container_number}']`).click();
// await expect(rowLocator).toHaveCount(1); // Ensure the row exists
// await page.getByPlaceholder('Search').press('Enter');
// await page.click('//button[text()=" Depot Containers "]');

console.log(`✅ MNR Estimate created successfully with Container Number: ${data.container_number}`);

// --- Navigate to Created Estimate ---
await clickAndMeasureDynamic(page, MNR_Xpath.containerRowLink(data.container_number), MNR_Xpath.locationCodeDropdown, 'Click and open container number');

// Scroll to repair item details & fill them
await page.locator(MNR_Xpath.locationCodeDropdown).click();
await page.fill(MNR_Xpath.locationCodeInput, data.Location_Code);
await page.click(MNR_Xpath.locationCodeOption(data.Location_Code));

await page.click(MNR_Xpath.repairModeDropdown);
// Select first value in list
await page.click(MNR_Xpath.repairModeFirstOption);

// Component code
await page.click(MNR_Xpath.componentCodeDropdown);
await page.fill(MNR_Xpath.componentCodeInput, data.Comp_Code);
await page.click(MNR_Xpath.componentCodeOption(data.Comp_Code));

// Damage Type
await page.click(MNR_Xpath.damageTypeDropdown);
await page.fill(MNR_Xpath.damageTypeInput, data.Damage_Type);
await page.click(MNR_Xpath.damageTypeOption(data.Damage_Type));

// Qty
await page.fill(MNR_Xpath.qtyInput, String(data.Qty));

// Repair Type
await page.click(MNR_Xpath.repairTypeDropdown);
await page.fill(MNR_Xpath.repairTypeInput, data.Repair_Type);
await page.click(MNR_Xpath.repairTypeOption(data.Repair_Type));

// Responsible
await page.click(MNR_Xpath.responsibleDropdown);
await page.fill(MNR_Xpath.responsibleInput, data.Responsible);
await page.click(MNR_Xpath.responsibleOption(data.Responsible));

await page.waitForTimeout(1000);

// Add to grid
await page.locator(MNR_Xpath.addToGridButton).scrollIntoViewIfNeeded();
await clickAndMeasureDynamic(page, MNR_Xpath.addToGridButton, MNR_Xpath.estimateDoneBySelect, 'Click Add To Grid button');
await page.locator(MNR_Xpath.estimateDoneBySelect).scrollIntoViewIfNeeded();
await page.locator(MNR_Xpath.estimateDoneBySelect).selectOption(data.Estimate_Done_Value);

await page.waitForTimeout(1000);

// Submit estimate for approval
await page.locator(MNR_Xpath.submitButton).scrollIntoViewIfNeeded();
await clickAndMeasureDynamic(page, MNR_Xpath.submitButton, MNR_Xpath.approveButton, 'Click Submit button');

// Approve estimate
await page.locator(MNR_Xpath.approveButton).scrollIntoViewIfNeeded();
await clickAndMeasureDynamic(page, MNR_Xpath.approveButton, MNR_Xpath.selectedForemanSelect, 'Click Approve button');

// Scroll to update work order button
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await page.locator(MNR_Xpath.selectedForemanSelect).selectOption(data.Estimate_Done_Value);

// Assign Work Order
await page.waitForTimeout(1000);
await clickAndMeasureDynamic(page, MNR_Xpath.updateWorkOrderButton, MNR_Xpath.noButton, 'Click Update Work Order button');
await page.waitForTimeout(1000);
await clickAndMeasureDynamic(page, MNR_Xpath.noButton, MNR_Xpath.insertButton, 'Click No button');

// Fill Timesheet
// await page.locator(`//a[normalize-space()="${data.container_number}"]`).click();
await page.locator(MNR_Xpath.insertButton).isEnabled({ timeout: 160000 });
await clickAndMeasureDynamic(page, MNR_Xpath.insertButton, MNR_Xpath.completeJobOrderButton, 'Click Insert button');
// await page.waitForTimeout(1000);

// Complete Estimate
await clickAndMeasureDynamic(page, MNR_Xpath.completeJobOrderButton, MNR_Xpath.completedContainerLink(data.container_number), 'Click Complete Job Order button');

console.log('container_number', data.container_number);

// Assert Estimate created successfully
expect(await page.locator(MNR_Xpath.completedContainerLink(data.container_number)).isVisible()).toBeTruthy();

const row = page.locator('tr', { hasText: `${data.container_number}` });

await expect(row).toContainText('Approved');
await expect(row).toContainText('Completed');
page.close();
    

}

}