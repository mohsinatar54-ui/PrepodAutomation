import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule } from '../../utils/test-helpers';


// const Vehicle_No = 'MH18AT1235';
// const surveyRemark = 'Condition OK';
// const ExportCargoBkgNo = '45855BN20251230001EXP';
// const Vehicle_No = 'MH5658';
// const containerNo = 'VZXU5444558';
const stackType = 'Un-Marked Stack';
const stackName = 'Automation Stack 01';


test('TC006_Yard_YardPlanner_Gate', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
  await clickAndMeasureDynamic(page, '(//img[@alt="Yard Operations Logo"])[1]', '//button[normalize-space()="Yard Planner"]', 'Route to Yard Microservice');
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Planner"]', '//div[normalize-space()="Yard Planning - Gate"]', 'Route to Yard Planner');

  //   await page.locator(
  //   "//tr[td//a[normalize-space()='ASDU0002026']]//button[normalize-space()='Plan']"
  // ).click();

  const containerNo = await readTestArtifact('EmptyIn_Container.txt')

    await clickAndMeasureDynamic(page, `//button[normalize-space()="Yard Execution"]`, '//div[normalize-space()="Gate"]', 'Open Yard Execution - Gate tab');
  
    await page.locator('//input[@formcontrolname="search"]').fill(containerNo);
  
    await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();
  
    await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`, '//button[normalize-space()="Execute"]', 'Click on container number in Yard Execution');
    
    await page.locator(`//app-custom-dropdown[@formcontrolname="CraneID"]`).click();
    await page.locator(`(//div[contains(@class,"option-item")])[1]`).click();
    
    await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', '//input[@formcontrolname="search"]', 'Execute the planned move');
  
    await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();
  
    console.log('Yard Operations for container number ' + containerNo + ' completed successfully');
  
  SwitchModule(page, 'Gate Operations');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Standard Services"]', '//a[normalize-space()="Empty Container"]', 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, '//a[normalize-space()="Empty Container"]', '//input[@placeholder="Search by container no."]', 'Route to Empty Container screen');


  // Toggle (Gate In/Out)
  const gateToggleLabel = page.locator(
    '//span[normalize-space()="Gate In"]/following-sibling::label'
  );

  await gateToggleLabel.click();

  await page.locator('//input[@placeholder="Search by container no."]').fill(containerNo);
  await page.locator(`//button[normalize-space()="Search"]`).click();

  const Vehicle_No = await readTestArtifact('Empty_Out_Vehicle_No.txt');
  // Validate Button
  await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`);

  //Execute Button
  await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);

  // await page.pause();





});
