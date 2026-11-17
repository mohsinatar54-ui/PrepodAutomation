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
	await page.locator(YardPlanner.Master).click();
	
	await page.waitForTimeout(2000);
	
	if (!(await page.locator(YardPlanner.YardRuleConfig).isVisible())) {
	  await page.locator(YardPlanner.Master).click();
	
	  await page.waitForTimeout(2000);
	}
	
	await page.locator(YardPlanner.YardRuleConfig).waitFor({
	  state: 'visible',
	  timeout: 30000
	});
	
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
	
		 await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.Stacktype, 'Open planner');
	
		const shiftToStack = page.locator(YardPlanner.Stacktype);
	
	  await shiftToStack.waitFor({ state: 'visible' });
	
	  await shiftToStack.scrollIntoViewIfNeeded();
	
	  await shiftToStack.click();
	
	  const search = page.locator(YardPlanner.Searchshift);
	
	  await search.waitFor({ state: 'visible' });
	
	  await search.fill('Un-Marked Stack');
	
	  const option = page.locator(YardPlanner.Unmarked_Stack);
	
	  await option.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option.click();
	
	/////////-----//////////////
	
	const Plannedstack = page.locator(YardPlanner.Planned_Stack);
	
	  await Plannedstack.waitFor({ state: 'visible' });
	
	  await Plannedstack.scrollIntoViewIfNeeded();
	
	  await Plannedstack.click();
	
	  const search1 = page.locator(YardPlanner.Searchshift);
	
	  await search1.waitFor({ state: 'visible' });
	
	  await search1.fill('stuff-destuff');
	
	  const option1 = page.locator(YardPlanner.planned_stackdropdown);
	
	  await option1.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option1.click();
	
	 await clickAndMeasureDynamic(page, YardPlanner.Submitbutton, YardPlanner.Containerlist, 'yard planed');
	
			// await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');
		//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);
	
			// planner logic continues
		} else {
			console.log('AutoPlan enabled → skipping Yard Planner');
		}
	 
		await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
	
		await page.locator(YardPlanner.SearchInput).fill(containerNo);
		
	   
	
	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');
	
	  await page.waitForTimeout(10000);
	
	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');
	
	  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();
	
	  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');





	  
// 	await clickAndMeasureDynamic(page, YardPlanner.Master, YardPlanner.YardRuleConfig, 'Route to Masters');
// 	await clickAndMeasureDynamic(page, YardPlanner.YardRuleConfig, YardPlanner.AutoPlanForYardPositionLabel, 'Route to Yard Rule Config');

// 	await page.locator(YardPlanner.YardRuleConfigurationHeader).click();
	
// 	const autoPlanEnabled = await page.locator(YardPlanner.IsAutoPlanCheckbox).isChecked();

// 	console.log('AutoPlan enabled:', autoPlanEnabled);

// 	if (!autoPlanEnabled) {
// 		console.log('AutoPlan disabled → running Yard Planner');

// 		await clickAndMeasureDynamic(page, YardPlanner.YardPlannerButton, YardPlanner.SearchInput, 'Open Yard Planner');

// 		await page.locator(YardPlanner.SearchInput).fill(containerNo);

// 		await expect(page.locator(YardPlanner.ContainerLink(containerNo))).toBeVisible();

// 		await clickAndMeasureDynamic(page, YardPlanner.FirstContainerLink(containerNo), YardPlanner.PlannedContainerNoText, 'Click container');

// 		await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.PlannedITVDropdown, 'Open planner');

// 		await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');


		
// 	//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);

// 		// planner logic continues
// 	} else {
// 		console.log('AutoPlan enabled → skipping Yard Planner');
// 	}

// 	await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

// 	await page.locator(YardPlanner.SearchInput).fill(containerNo);

// 	await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

// 	// await page.locator(YardPlanner.CraneDropdown).click();
// 	// await page.locator(YardPlanner.FirstOptionItem).click();

// 	const shiftToStack = page.locator(YardPlanner.CraneDropdown);

//   await shiftToStack.waitFor({ state: 'visible' });

//   await shiftToStack.scrollIntoViewIfNeeded();

//   await shiftToStack.click();

//   const search = page.locator(YardPlanner.Searchshift);

//   await search.waitFor({ state: 'visible' });

//   await search.fill('CRANE1');

//   const option = page.locator(YardPlanner.Cranedropdown1);

//   await option.waitFor({ state: 'visible', timeout: 30000 });

//   await option.click();

// 	await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

// 	await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

// 	console.log('Yard Operations for container number ' + containerNo + ' completed successfully');




	
}
export async function YardPlannerFlow_Hold( page: Page ) {

    const containerNo = await readTestArtifact('ContainerHold_ContainerNumber.txt');
    console.log('Using container number:', containerNo);
	// await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice');
	await page.locator(YardPlanner.Master).click();
	
	await page.waitForTimeout(2000);
	
	if (!(await page.locator(YardPlanner.YardRuleConfig).isVisible())) {
	  await page.locator(YardPlanner.Master).click();
	
	  await page.waitForTimeout(2000);
	}
	
	await page.locator(YardPlanner.YardRuleConfig).waitFor({
	  state: 'visible',
	  timeout: 30000
	});
	
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
	
		 await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.Stacktype, 'Open planner');
	
		const shiftToStack = page.locator(YardPlanner.Stacktype);
	
	  await shiftToStack.waitFor({ state: 'visible' });
	
	  await shiftToStack.scrollIntoViewIfNeeded();
	
	  await shiftToStack.click();
	
	  const search = page.locator(YardPlanner.Searchshift);
	
	  await search.waitFor({ state: 'visible' });
	
	  await search.fill('Un-Marked Stack');
	
	  const option = page.locator(YardPlanner.Unmarked_Stack);
	
	  await option.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option.click();
	
	/////////-----//////////////
	
	const Plannedstack = page.locator(YardPlanner.Planned_Stack);
	
	  await Plannedstack.waitFor({ state: 'visible' });
	
	  await Plannedstack.scrollIntoViewIfNeeded();
	
	  await Plannedstack.click();
	
	  const search1 = page.locator(YardPlanner.Searchshift);
	
	  await search1.waitFor({ state: 'visible' });
	
	  await search1.fill('stuff-destuff');
	
	  const option1 = page.locator(YardPlanner.planned_stackdropdown);
	
	  await option1.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option1.click();
	
	 await clickAndMeasureDynamic(page, YardPlanner.Submitbutton, YardPlanner.Containerlist, 'yard planed');
	
			// await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');
		//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);
	
			// planner logic continues
		} else {
			console.log('AutoPlan enabled → skipping Yard Planner');
		}
	 
		await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
	
		await page.locator(YardPlanner.SearchInput).fill(containerNo);
		
	   
	
	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');
	
	  await page.waitForTimeout(10000);
	
//	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

//       const onHoldMessage = page.locator(
//   '//div[contains(@class,"bg-amber-50") and contains(@class,"border-amber-200")]'
// );

// await expect(onHoldMessage).toBeVisible();

// await expect(onHoldMessage).toContainText(
//   'On Hold'
// );

// await expect(onHoldMessage).toContainText(
//   'Execute is disabled for this container.'
// );

// console.log('On Hold error verified successfully for container: ' + containerNo);
	  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();
	
	  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');


}
export async function YardPlannerFlowPreannoucement(
	page: Page) {
    const containerNo = await readTestArtifact('PreContainer1.txt');
    console.log('Using container number:', containerNo);
	await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.Master, 'Route to Yard Microservice');
	await page.locator(YardPlanner.Master).click();
	
	await page.waitForTimeout(2000);
	
	if (!(await page.locator(YardPlanner.YardRuleConfig).isVisible())) {
	  await page.locator(YardPlanner.Master).click();
	
	  await page.waitForTimeout(2000);
	}
	
	await page.locator(YardPlanner.YardRuleConfig).waitFor({
	  state: 'visible',
	  timeout: 30000
	});
	
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
	
		 await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.Stacktype, 'Open planner');
	
		const shiftToStack = page.locator(YardPlanner.Stacktype);
	
	  await shiftToStack.waitFor({ state: 'visible' });
	
	  await shiftToStack.scrollIntoViewIfNeeded();
	
	  await shiftToStack.click();
	
	  const search = page.locator(YardPlanner.Searchshift);
	
	  await search.waitFor({ state: 'visible' });
	
	  await search.fill('Un-Marked Stack');
	
	  const option = page.locator(YardPlanner.Unmarked_Stack);
	
	  await option.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option.click();
	
	/////////-----//////////////
	
	const Plannedstack = page.locator(YardPlanner.Planned_Stack);
	
	  await Plannedstack.waitFor({ state: 'visible' });
	
	  await Plannedstack.scrollIntoViewIfNeeded();
	
	  await Plannedstack.click();
	
	  const search1 = page.locator(YardPlanner.Searchshift);
	
	  await search1.waitFor({ state: 'visible' });
	
	  await search1.fill('stuff-destuff');
	
	  const option1 = page.locator(YardPlanner.planned_stackdropdown);
	
	  await option1.waitFor({ state: 'visible', timeout: 30000 });
	
	  await option1.click();
	
	 await clickAndMeasureDynamic(page, YardPlanner.Submitbutton, YardPlanner.Containerlist, 'yard planed');
	
			// await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');
		//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);
	
			// planner logic continues
		} else {
			console.log('AutoPlan enabled → skipping Yard Planner');
		}
	 
		await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');
	
		await page.locator(YardPlanner.SearchInput).fill(containerNo);
		
	   
	
	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');
	
	  await page.waitForTimeout(10000);
	
	  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');
	
	  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();
	
	  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');





	  
// 	await clickAndMeasureDynamic(page, YardPlanner.Master, YardPlanner.YardRuleConfig, 'Route to Masters');
// 	await clickAndMeasureDynamic(page, YardPlanner.YardRuleConfig, YardPlanner.AutoPlanForYardPositionLabel, 'Route to Yard Rule Config');

// 	await page.locator(YardPlanner.YardRuleConfigurationHeader).click();
	
// 	const autoPlanEnabled = await page.locator(YardPlanner.IsAutoPlanCheckbox).isChecked();

// 	console.log('AutoPlan enabled:', autoPlanEnabled);

// 	if (!autoPlanEnabled) {
// 		console.log('AutoPlan disabled → running Yard Planner');

// 		await clickAndMeasureDynamic(page, YardPlanner.YardPlannerButton, YardPlanner.SearchInput, 'Open Yard Planner');

// 		await page.locator(YardPlanner.SearchInput).fill(containerNo);

// 		await expect(page.locator(YardPlanner.ContainerLink(containerNo))).toBeVisible();

// 		await clickAndMeasureDynamic(page, YardPlanner.FirstContainerLink(containerNo), YardPlanner.PlannedContainerNoText, 'Click container');

// 		await clickAndMeasureDynamic(page, YardPlanner.PlanButton, YardPlanner.PlannedITVDropdown, 'Open planner');

// 		await clickAndMeasureDynamic(page, YardPlanner.PlannedITVDropdown, YardPlanner.OptionItem, 'ITV10');


		
// 	//	await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);

// 		// planner logic continues
// 	} else {
// 		console.log('AutoPlan enabled → skipping Yard Planner');
// 	}

// 	await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

// 	await page.locator(YardPlanner.SearchInput).fill(containerNo);

// 	await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

// 	// await page.locator(YardPlanner.CraneDropdown).click();
// 	// await page.locator(YardPlanner.FirstOptionItem).click();

// 	const shiftToStack = page.locator(YardPlanner.CraneDropdown);

//   await shiftToStack.waitFor({ state: 'visible' });

//   await shiftToStack.scrollIntoViewIfNeeded();

//   await shiftToStack.click();

//   const search = page.locator(YardPlanner.Searchshift);

//   await search.waitFor({ state: 'visible' });

//   await search.fill('CRANE1');

//   const option = page.locator(YardPlanner.Cranedropdown1);

//   await option.waitFor({ state: 'visible', timeout: 30000 });

//   await option.click();

// 	await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

// 	await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

// 	console.log('Yard Operations for container number ' + containerNo + ' completed successfully');




	
}