import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, generateVehicleNumber, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { YardPlannerFlow } from '../../Flows/YardFlow';

const YardPlannerData: any = {
  stackType: 'Un-Marked Stack',
  stackName: 'Automation Stack 01',
  Shiftstack:'stuff-destuff',
  Crane:'CRANE1'
  
};


test('TC003_ExportDirect_Yard_YardPlanner', async ({ page }) => {
  test.setTimeout(600000); // 2 minutes timeout for this test
  //await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await YardPlannerFlow(loginPage, YardPlannerData, 'ExportDirect_EmptyIn_Container.txt');

});



// import { test, expect } from '@playwright/test';
// import { login, clickAndMeasureDynamic, readTestArtifact } from '../../utils/test-helpers';


// // const Vehicle_No = 'MH18AT1235';
// // const surveyRemark = 'Condition OK';
// // const ExportCargoBkgNo = '45855BN20251230001EXP';
// // const Vehicle_No = 'MH5658';
// // const containerNo = 'VZXU5444558';
// const stackType = 'Un-Marked Stack';
// const stackName = 'Automation Stack 01';


// test('TC006_Yard_YardPlanner_Gate', async ({ page }) => {
//   test.setTimeout(120_000); // 2 minutes timeout for this test
//   await login(page);
//   await clickAndMeasureDynamic(page, '(//img[@alt="Yard Management Logo"])[1]', '//button[normalize-space()="Yard Planner"]', 'Route to Yard Microservice');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Planner"]', '//div[normalize-space()="Yard Planning - Gate"]', 'Route to Yard Planner');

//   //   await page.locator(
//   //   "//tr[td//a[normalize-space()='ASDU0002026']]//button[normalize-space()='Plan']"
//   // ).click();

//   const containerNo = await readTestArtifact('EO9F_Container.txt')

//   await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

//   await clickAndMeasureDynamic(page, `(//td//a[normalize-space()='${containerNo}'])[1]`, '//p[text()="Planned Container No"]/following-sibling::p', 'Click on container number');


//   await expect(page.locator('//p[text()="Planned Container No"]/following-sibling::p')).toHaveText(containerNo);
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Plan"]', `//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`, 'Click on Plan button');
//   // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`).click();
//   // await page.locator('//div[@class="options-list"]//div[2]').click();

//   await page.locator(`//app-custom-dropdown[@formcontrolname="StackTypeID"]`).click();
//   await page.locator(`//div[@class="options-list"]//span[normalize-space()="${stackType}"]`).click();

//   await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`).click();
//   await page.locator('//input[@placeholder="Search options..."]').fill(stackName);
//   await page.locator(`//div[@class="option-item"]`).first().click();

//   // await expect(page.locator('//app-custom-dropdown[@formcontrolname="PlannedCraneID"]//span')).not.toBeEmpty();

//   // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedNextCraneID"]`).click();
//   // await page.locator(`(//div[@class="option-item"])[1]`).click();

//   await page.locator('textarea[formcontrolname="PlannerComments"]').fill('Planned via Automation Script');

//   // await page.locator('//button[normalize-space()="Submit"]').click();
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', `//div[normalize-space()="Yard Planning - Gate"]`, 'Submit Yard Planning');

//   await clickAndMeasureDynamic(page, `//button[normalize-space()="Yard Execution"]`, '//div[normalize-space()="Gate"]', 'Open Yard Execution - Gate tab');

//   await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

//   await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`, '//button[normalize-space()="Execute"]', 'Click on container number in Yard Execution');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', '//input[@formcontrolname="search"]', 'Execute the planned move');

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

//   console.log('Yard Operations for container number ' + containerNo + ' completed successfully');


// });
