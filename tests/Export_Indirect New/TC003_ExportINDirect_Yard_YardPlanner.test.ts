import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, generateVehicleNumber, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { YardPlannerFlow } from '../../Flows/YardFlow';

const YardPlannerData: any = {
  stackType: 'Un-Marked Stack',
  stackName: 'Automation Stack 01',
  Shiftstack:'stuff-destuff',
  Crane:'CRANE1'
  
};


test('TC003_ExportINDirect_Yard_YardPlanner', async ({ page }) => {
  test.setTimeout(600000); // 2 minutes timeout for this test
 // await login(page);
 const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await YardPlannerFlow(loginPage, YardPlannerData, 'ExportINDirect_EmptyIn_Container.txt');

});