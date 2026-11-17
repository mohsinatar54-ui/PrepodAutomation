import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, SwitchModule, selectEntityAndSite } from '../../utils/test-helpers';
import {Common} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { YardPlanner } from 'Locators/YardLocators';
import { GateCommon, GateEmpty } from 'Locators/GateLocators';
import { Yard_YardPlanner_Gate_Flow,Yard_YardPlanner_Gate_Flow_Preadvice } from 'Flows/EmptyFlow';
import { YardPlannerFlowPreannoucement } from 'Flows/YardFlow';

// const Vehicle_No = 'MH18AT1235';
// const surveyRemark = 'Condition OK';
// const ExportCargoBkgNo = '45855BN20251230001EXP';
// const Vehicle_No = 'MH5658';
// const containerNo = 'VZXU5444558';
const stackType = 'Un-Marked Stack';
const stackName = 'Automation Stack 01';


test('TC006_Yard_YardPlanner_Gate', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  
  await Yard_YardPlanner_Gate_Flow_Preadvice(loginPage);

});