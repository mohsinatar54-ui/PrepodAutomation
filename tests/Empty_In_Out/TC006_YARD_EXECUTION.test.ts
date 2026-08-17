import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule, selectEntityAndSite } from '../../utils/test-helpers';
import {Common} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { YardPlanner } from 'Locators/YardLocators';
import { GateCommon, GateEmpty } from 'Locators/GateLocators';

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
  await selectEntityAndSite(page);
  await clickAndMeasureDynamic(page, Common.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Yard Microservice');

  const containerNo = await readTestArtifact('EmptyIn_Container.txt')

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution - Gate tab');

  await page.locator(YardPlanner.SearchInput).fill(containerNo);

  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).toBeVisible();

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Click on container number in Yard Execution');
  
  await page.locator(YardPlanner.CraneDropdown).click();
  await page.locator(YardPlanner.FirstOptionItem).click();
  
  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Execute the planned move');

  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');

  await SwitchModule(page, 'Gate Operations');

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container screen');

  await page.locator(GateCommon.GateToggle).click();

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);
  await page.locator(GateEmpty.SearchButton).click();

  const Vehicle_No = await readTestArtifact('Empty_Out_Vehicle_No.txt');
  // Validate Button
  await page.click(GateEmpty.ValidateButton(Vehicle_No));

  //Execute Button
  await page.click(GateEmpty.ExecuteButton(Vehicle_No));

  await expect(page.locator('//span[contains(text(),"Validation failed: Invoice Not Generated")]')).toBeVisible();

});
