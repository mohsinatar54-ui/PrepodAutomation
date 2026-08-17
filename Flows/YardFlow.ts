import { test, expect, Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite, readTestArtifact } from '../utils/test-helpers';
// import { EmptyBookingLocators, Import } from 'Locators/BookingLocators';
import {YardPlanner} from 'Locators/YardLocators';
import { selectFutureDay } from 'utils/test-helpers';
import { GateCommon,GateImport, GateEmpty } from 'Locators/GateLocators';

export async function YardPlannerFlow(
	page: Page,
    data: any,
    ContainerNoFile: string
) {
    const containerNo = await readTestArtifact(ContainerNoFile);
    console.log('Using container number:', containerNo);
	await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice');
	await clickAndMeasureDynamic(page, YardPlanner.Master, YardPlanner.YardRuleConfig, 'Route to Masters');
	await clickAndMeasureDynamic(page, YardPlanner.YardRuleConfig, YardPlanner.AutoPlanForYardPositionLabel, 'Route to Yard Rule Config');

	await page.locator(YardPlanner.YardRuleConfigurationHeader).click();
	
	const autoPlanEnabled = await page.locator(YardPlanner.IsAutoPlanCheckbox).isChecked();

	console.log('AutoPlan enabled:', autoPlanEnabled);

	if (!autoPlanEnabled) {
		console.log('AutoPlan disabled → running Yard Planner');

		await clickAndMeasureDynamic(page, YardPlanner.YardPlannerButton, YardPlanner.SearchInput, 'Open Yard Planner');

		await page.locator(YardPlanner.SearchInput).fill(containerNo);

		await expect(page.locator(YardPlanner.ContainerLink(containerNo))).toBeVisible();

		await clickAndMeasureDynamic(page, YardPlanner.FirstContainerLink(containerNo), YardPlanner.PlannedContainerNoText, 'Click container');

		await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.PlannedITVDropdown, 'Open planner');

		await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');
	//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);

		// planner logic continues
	} else {
		console.log('AutoPlan enabled → skipping Yard Planner');
	}

	await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

	await page.locator(YardPlanner.SearchInput).fill(containerNo);

	await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

	await page.locator(YardPlanner.CraneDropdown).click();
	await page.locator(YardPlanner.FirstOptionItem).click();
	

	await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

	await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

	console.log('Yard Operations for container number ' + containerNo + ' completed successfully');




	
}

