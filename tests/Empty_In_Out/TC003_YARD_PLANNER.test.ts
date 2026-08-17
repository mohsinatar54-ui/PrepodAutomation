import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, generateVehicleNumber, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { YardPlannerFlow } from '../../Flows/YardFlow';

const YardPlannerData: any = {
  stackType: 'Un-Marked Stack',
  stackName: 'Automation Stack 01',

};


test('TC006_Yard_YardPlanner_Gate', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
  await selectEntityAndSite(page);
  await YardPlannerFlow(page, YardPlannerData, 'EmptyIn_Container.txt');

});

