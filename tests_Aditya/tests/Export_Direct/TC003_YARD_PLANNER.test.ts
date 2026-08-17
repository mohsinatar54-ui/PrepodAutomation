import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact } from '../../utils/test-helpers';


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
  await clickAndMeasureDynamic(page, '(//img[@alt="Yard Operations Logo"])[1]', '//button[normalize-space()="Masters"]', 'Route to Yard Microservice');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Masters"]', '//button[normalize-space()="Yard Rule Config"]', 'Route to Masters');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Rule Config"]', '//label[normalize-space()="AutoPlan For Yard Position"]', 'Route to Yard Rule Config');

  await page.locator('//h2[normalize-space()="Yard Rule Configuration"]').click();

  const containerNo = await readTestArtifact('Export_Direct_Container.txt')
  console.log('Using container number:', containerNo);

  const autoPlanEnabled = await page
    .locator('//input[@id="isAutoPlan"]')
    .isChecked();

  console.log('AutoPlan enabled:', autoPlanEnabled);

  if (!autoPlanEnabled) {
    console.log('AutoPlan disabled → running Yard Planner');

    // ====================
    // YARD PLANNER PATCH
    // ====================

    await clickAndMeasureDynamic(
      page,
      `//button[normalize-space()="Yard Planner"]`,
      '//input[@formcontrolname="search"]',
      'Open Yard Planner'
    );

    await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

    await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

    await clickAndMeasureDynamic(
      page,
      `(//td//a[normalize-space()='${containerNo}'])[1]`,
      '//p[text()="Planned Container No"]/following-sibling::p',
      'Click container'
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Plan"]',
      `//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`,
      'Open planner'
    );

    await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="StackTypeID"]`,
      '//div[contains(@class, "options-list")]//span[normalize-space()="Un-Marked Stack"]',
      'Click Stack Type LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `//div[contains(@class, "options-list")]//span[normalize-space()="Un-Marked Stack"]`,
      '//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]',
      'Select Stack Type'
    );


    await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`,
      `//div[contains(@class, "options-list")]//span[normalize-space()="stuff-destuff"]`,
      'Click Planned Stack Name LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `//div[contains(@class, "options-list")]//span[normalize-space()="stuff-destuff"]`,
      '//button[normalize-space()="Submit"]',
      'Select Planned Stack Name'
    );


    await clickAndMeasureDynamic(
      page,
      `//button[normalize-space()="Submit"]`,
      `//button[normalize-space()="Yard Execution"]`,
      'Return to planner main screen'
    );

  }
  else {
    console.log('AutoPlan enabled → skipping Yard Planner');
  }


  // ====================
  // YARD EXECUTION PATCH
  // ====================

  await clickAndMeasureDynamic(
    page,
    `//button[normalize-space()="Yard Execution"]`,
    '//div[normalize-space()="Gate"]',
    'Open Yard Execution'
  );

  await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

  await clickAndMeasureDynamic(
    page,
    `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`,
    '//button[normalize-space()="Execute"]',
    'Execute move'
  );

  await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="StackTypeID"]`,
      '//div[contains(@class, "options-list")]//span[normalize-space()="Un-Marked Stack"]',
      'Click Stack Type LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `//div[contains(@class, "options-list")]//span[normalize-space()="Un-Marked Stack"]`,
      '//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]',
      'Select Stack Type'
    );


    await clickAndMeasureDynamic(
      page,
      `//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`,
      `//div[contains(@class, "options-list")]//span[normalize-space()="stuff-destuff"]`,
      'Click Planned Stack Name LOV'
    );

    await clickAndMeasureDynamic(
      page,
      `//div[contains(@class, "options-list")]//span[normalize-space()="stuff-destuff"]`,
      '//button[normalize-space()="Submit"]',
      'Select Planned Stack Name'
    );
    
  await page.locator(`//app-custom-dropdown[@formcontrolname="CraneID"]`).click();
  await page.locator(`(//div[contains(@class,"option-item")])[1]`).click();

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Execute"]',
    '//input[@formcontrolname="search"]',
    'Confirm execution'
  );


  await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');


});
