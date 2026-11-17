
import { Page, expect } from '@playwright/test';

import { clickAndMeasureDynamic, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact, writeTestArtifact } from '../utils/test-helpers';

import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';

import { selectFutureDay } from 'utils/createExcelData';

import { YardPlanner } from 'Locators/YardLocators';

import { CSMEmpty } from 'Locators/BookingLocators';

import { GateCommon, GateExport } from 'Locators/GateLocators';

import { GateEmpty } from 'Locators/GateLocators';

import { Cargo } from 'Locators/CargoLocators';

import { GateImport } from 'Locators/GateLocators';


// ========================================
// Global Export XITF Direct Test Data
// ========================================

let containerNo: string;

let containerNo1: string;

let EO9FvehicleNo1: string;

let bookingNumber1: string;


// ========================================
// Export XITF Page
// ========================================

export class ExportXITFPage {


  // ========================================
  // Load Test Data
  // ========================================

  static async loadTestData() {

   // containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

    containerNo1 = await readTestArtifact('XITF_Container.txt');

    bookingNumber1 = await readTestArtifact('XITF_BookingNumber.txt');

    console.log('Using container number:', containerNo1);

    console.log('Using booking number:', bookingNumber1);
  }


  // ========================================
  // Job Order Configuration
  // ========================================

  static readonly jobOrderConfig = {
    XITC: {
      jobCategory: 'Cargo Job',
      activityPoint: 'Cargo Warehouse',
      jobName: 'EXPORT CARGO IN AT WAREHOUSE BY TRUCK (XICT)',
    },
    EO91: {
      jobCategory: 'Container Job',
      activityPoint: 'Container Warehouse',
      jobName: 'CFS Stuffing-Empty Container Depot Stuffed (EO91)',
    },
    XOTP: {
      jobCategory: 'Container Job',
      activityPoint: 'Depot Gate Operation',
      jobName: 'Export Container Out By Truck To Port (XOTP)',
    },
  };

  // ========================================
  // New Job Order
  // ========================================

  static async newJobOrder(
    page: Page,
    data: any,
    jobOrderType: keyof typeof ExportXITFPage.jobOrderConfig
  ) {

    const job = ExportXITFPage.jobOrderConfig[jobOrderType];

    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

    await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

    await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

    await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

    await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo1);

    await page.waitForTimeout(2000);

    await page.locator(CSMExport.firstBookingLink).click();

    await page.waitForTimeout(2000);

    await page.locator(CSMExport.UpdateDetails).click();

    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');

    await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');

    // Select Job Category

    await page.locator(CSMExport.JobCatId).selectOption(job.jobCategory);

    // Select Activity Point

    await page.locator(CSMExport.JobActId).selectOption(job.activityPoint);

    // Select Job Description

    const dropdown = page.locator(CSMExport.JobDescription);

    const option = dropdown.locator('option').filter({
      hasText: job.jobName,
    });

    const optionValue = await option.getAttribute('value');

    if (!optionValue) {
      throw new Error(`Job Description not found: ${job.jobName}`);
    }

    await dropdown.selectOption(optionValue);

    // // Select Container or Cargo
    // if (job.jobCategory === 'Container Job') {
    //   await page.locator(CSMExport.JobConId).selectOption(data.containerNo);
    // } else if (job.jobCategory === 'Cargo Job') {
    //   await page.locator(CSMExport.CargoNO).selectOption(data.CargoNo);
    // }

    // Select Container or Cargo

    if (job.jobCategory === 'Container Job') {

      await page.locator(CSMExport.JobConId).selectOption(containerNo1);

      // await page.locator(CSMExport.JobConId).selectOption({ index: 0 });

    } else if (job.jobCategory === 'Cargo Job') {

      await page.locator(CSMExport.CargoNO).selectOption({ index: 0 });

    }


    // Add Job Order

    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

    await page.click(CSMExport.Save);
  }


  // ========================================
  // Gate In New Vehicle XITF
  // ========================================

  static async gateInNewVehicleXITF1(page: Page) {

    await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations');

    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

    await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

    await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

    await page.locator(GateEmpty.SearchButton).click();

    await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo1), GateEmpty.EditButton, 'Open Import Container details');

    await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

    // // Generate new vehicle number

    // const generatedVehicleNo = `EO9F${getRandomNumberString(6)}`;

    // EO9FvehicleNo1 = generatedVehicleNo;

    // // Store vehicle number in artifact

    

    // await writeTestArtifact('vehicleArtifactFile2.txt', EO9FvehicleNo1);

   // Generate new vehicle number
  const XITFvehicleNo1 = `XITF${getRandomNumberString(6)}`;

  // Store vehicle number in artifact
  await writeTestArtifact('XITFvehicle1.txt', XITFvehicleNo1);

  console.log(`Vehicle Number stored: ${XITFvehicleNo1}`);



    // Enter vehicle number

    await page.locator(GateEmpty.VehicleNoInput).fill(XITFvehicleNo1);

    await page.locator(GateImport.TransportDropdown).click();

    await page.waitForTimeout(1000);

    if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {

      await page.locator(GateImport.TransportDropdown).click();

    }

    await page.locator(GateImport.TransportDropdownFirst).click();

    // await page.locator(GateEmpty.TransportDropdown).click();

    // await page.locator(GateEmpty.TransportDropdownFirst).click();

    // Fill Custom / Actual Seal

    await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');

    await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');

     await page.locator(GateImport.SurveyRemarkDropdown).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
      await page.locator(GateImport.SurveyRemarkDropdown).click();
    }
    await page.locator(GateImport.ServeyRemarkoption1).click();

    // await page.locator(GateImport.OperatorConditionCode).click();

    // await page.waitForTimeout(1000);

    // if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {

    //   await page.locator(GateImport.OperatorConditionCode).click();

    // }

    // await page.locator(GateImport.OperatorCCFirstOption).click();

    // await page.locator(GateImport.DepotConditionCode).click();

    // if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {

    //   await page.locator(GateImport.DepotConditionCode).click();

    // }

    // await page.locator(GateImport.DepotCCFirstOption).click();

  //  await page.locator(GateImport.DepotConditionCode).click();

// const option1 = page.locator(GateImport.DepotCCFirstOption);

// await option1.waitFor({ state: 'visible' });
// await option1.scrollIntoViewIfNeeded();
// await option1.click();

   const option1 = page.locator(GateImport.DepotConditionCode);

    await option1.click({ force: true });

    await option1.locator('input').click({ force: true });

    await option1.locator('input').fill('Available');

    await option1.getByText('Available', { exact: true }).click({ force: true });
    // await page.locator(GateImport.DepotQualityCode).click();

    // if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {

    //   await page.locator(GateImport.DepotQualityCode).click();

    // }

    // await page.locator(GateImport.DepotQCFirstOption).click();

  
//await page.locator(GateImport.DepotQualityCode).click();

// const option = page.locator(GateImport.DepotQCFirstOption);

// await option.waitFor({ state: 'visible' });
// await option.scrollIntoViewIfNeeded();
// await option.click();

const option = page.locator(GateImport.DepotQualityCode);

    await option.click({ force: true });

    await option.locator('input').click({ force: true });

    await option.locator('input').fill('AQUABA');

    await option.getByText('AQUABA', { exact: true }).click({ force: true });


    //   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

    // await PortNameDropdown_TH.click({ force: true });
    // await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).click();
    // await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).fill(' Automation Testing Script ');
    // await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

    const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

    await PortNameDropdown_TH.click({ force: true });

    await PortNameDropdown_TH.locator('input').click({ force: true });

    await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

    await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });


    // await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');

    // await page
    //   .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']")
    //   .fill('2026-01-09T11:15');

    const gateInInput = page.locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']");

    if (await gateInInput.count() > 0) {

      await gateInInput.fill('2026-01-09T11:15');

    }

    const checkbox = page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']");

    if (await checkbox.count() > 0 && await checkbox.isChecked()) {

      await checkbox.uncheck();

    }


    // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');

    // Is Weighment?

    // await page
    //   .locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']")
    //   .uncheck();

    // const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);

    // await plannedOutDropdown.click({ force: true });
    // // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).click();
    // // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).fill(' Weighbridge 2 ');
    // await plannedOutDropdown.locator('input').click();
    // await plannedOutDropdown.locator('input').fill('Weighbridge 2');
    // await plannedOutDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });


    // Weighbridge_input

    // const plannedInDropdown = page.locator(GateEmpty.Planned_in_Weighbridgenew);

    // await plannedInDropdown.click({ force: true });
    // // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).click();
    // // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).fill(' Weighbridge 2 ');
    // await plannedInDropdown.locator('input').click();
    // await plannedInDropdown.locator('input').fill('Weighbridge 2');
    // await plannedInDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });

    // Save

    await page.locator(GateEmpty.SaveButton).click();

    await page.waitForTimeout(20000);

    // Search again

    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

    await page.locator(GateEmpty.SearchButton).click();

    // Validate

    await page.click(`//tr[td//a[normalize-space()="${XITFvehicleNo1}"]]//button[normalize-space()="Validate"]`);

    // Execute

    await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${XITFvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
  }

  static async gateInNewVehicleXITF2 (page: Page) 
  {
    //await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code
  
    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  
    await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
  
    await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');
  
    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);
  
    await page.locator(GateEmpty.SearchButton).click();
  
    await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo1), GateEmpty.EditButton, 'Open Import Container details');
  
    await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');
  
    // Generate new vehicle number
    const XITFvehicleNo2 = `XITF${getRandomNumberString(6)}`;
  
    // Store vehicle number in artifact
    await writeTestArtifact('XITFvehicle2.txt', XITFvehicleNo2);
  
    console.log(`Vehicle Number stored: ${XITFvehicleNo2}`);
  
    // Enter vehicle number
    await page.locator(GateEmpty.VehicleNoInput).fill(XITFvehicleNo2);
  
      await page.locator(GateImport.TransportDropdown).click();
      await page.waitForTimeout(1000);
      if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
        await page.locator(GateImport.TransportDropdown).click();
      }
      await page.locator(GateImport.TransportDropdownFirst).click();
  
    // await page.locator(GateEmpty.TransportDropdown).click();
  
    // await page.locator(GateEmpty.TransportDropdownFirst).click();
  
    // Fill Custom / Actual Seal
    
    await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');
  
    await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');

       await page.locator(GateImport.SurveyRemarkDropdown).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
      await page.locator(GateImport.SurveyRemarkDropdown).click();
    }
    await page.locator(GateImport.ServeyRemarkoption1).click();

    const option = page.locator(GateImport.DepotQualityCode);

    await option.click({ force: true });

    await option.locator('input').click({ force: true });

    await option.locator('input').fill('AQUABA');

    await option.getByText('AQUABA', { exact: true }).click({ force: true });
  
    // await page.locator(GateImport.OperatorConditionCode).click();
    //     await page.waitForTimeout(1000);
    //     if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {
    //       await page.locator(GateImport.OperatorConditionCode).click();
    //     }
    //     await page.locator(GateImport.OperatorCCFirstOption).click();
    
    //     await page.locator(GateImport.DepotConditionCode).click();
    //     await page.waitForTimeout(1000);
    //     if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {
    //       await page.locator(GateImport.DepotConditionCode).click();
    //     }
    //     await page.locator(GateImport.DepotCCFirstOption).click();
    
        // await page.locator(GateImport.DepotQualityCode).click();
        // if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
        //   await page.locator(GateImport.DepotQualityCode).click();
        // }
        // await page.locator(GateImport.DepotQCFirstOption).click();
  
  
  //   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);
  
  // await PortNameDropdown_TH.click({ force: true });
  // await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).click();
  // await PortNameDropdown_TH.locator(GateEmpty.PortNameInput).fill(' Automation Testing Script ');
  // await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });
  
   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);
  
  await PortNameDropdown_TH.click({ force: true });
  
  await PortNameDropdown_TH.locator('input').click({ force: true });
  
  await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');
  
  await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });
  
  // await page.locator("//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']").fill('2026-01-09T11:10');
  
    // await page
    //   .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']")
    //   .fill('2026-01-09T11:15');
  
    const gateInInput = page.locator(
    "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']"
  );
  
  if (await gateInInput.count() > 0) {
    await gateInInput.fill('2026-01-09T11:15');
  }
  const checkbox = page.locator(
    "//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']"
  );
  
  if (await checkbox.count() > 0 && await checkbox.isChecked()) {
    await checkbox.uncheck();
  }
  
  
    // await page.locator("//div[label[contains(., 'Port Trans No')]]//input").fill('PTN20260109');
  
    // Is Weighment?
    // await page
    //   .locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']")
    //   .uncheck();
  
  // const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);
  
  // await plannedOutDropdown.click({ force: true });
  // // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).click();
  // // await plannedOutDropdown.locator(GateEmpty.Planned_out_Weighbridge_input).fill(' Weighbridge 2 ');
  // await plannedOutDropdown.locator('input').click();
  // await plannedOutDropdown.locator('input').fill('Weighbridge 2');
  // await plannedOutDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });
  
  
  // Weighbridge_input
  
  // const plannedInDropdown = page.locator(GateEmpty.Planned_in_Weighbridgenew);
  
  // await plannedInDropdown.click({ force: true });
  // // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).click();
  // // await plannedInDropdown.locator(GateEmpty.Planned_In_Weighbridge_input).fill(' Weighbridge 2 ');
  // await plannedInDropdown.locator('input').click();
  // await plannedInDropdown.locator('input').fill('Weighbridge 2');
  // await plannedInDropdown.getByText('Weighbridge 2', { exact: true }).click({ force: true });
    // Save
    await page.locator(GateEmpty.SaveButton).click();
  
    await page.waitForTimeout(20000);
  
    // Search again
    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);
  
    await page.locator(GateEmpty.SearchButton).click();
  
    // Validate
    await page.click(`//tr[td//a[normalize-space()="${XITFvehicleNo2}"]]//button[normalize-space()="Validate"]`);
  
    // Execute
    await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${XITFvehicleNo2}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
  }

  // ========================================
  // Yard Execution
  // ========================================

  static async yardExecution1(page: Page) {

    //  await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Masters');
    //    await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

    // await page.locator(YardPlanner.Master).click();

    // await page.waitForTimeout(1000);

    // await clickAndMeasureDynamic(page, YardPlanner.YardRuleConfig, YardPlanner.AutoPlanForYardPositionLabel, 'Route to Yard Rule Config');

    await page.locator(YardPlanner.Master).click();

    await page.waitForTimeout(2000);

    if (!(await page.locator(YardPlanner.YardRuleConfig).isVisible())) {

      await page.locator(YardPlanner.Master).click();

      await page.waitForTimeout(2000);

    }

    await page.locator(YardPlanner.YardRuleConfig).waitFor({ state: 'visible', timeout: 30000 });

    await clickAndMeasureDynamic(page, YardPlanner.YardRuleConfig, YardPlanner.AutoPlanForYardPositionLabel, 'Route to Yard Rule Config');

    await page.locator(YardPlanner.YardRuleConfigurationHeader).click();

    const autoPlanEnabled = await page.locator(YardPlanner.IsAutoPlanCheckbox).isChecked();

    console.log('AutoPlan enabled:', autoPlanEnabled);

    if (!autoPlanEnabled) {

      console.log('AutoPlan disabled → running Yard Planner');

      await clickAndMeasureDynamic(page, YardPlanner.YardPlannerButton, YardPlanner.SearchInput, 'Open Yard Planner');

      await page.locator(YardPlanner.SearchInput).fill(containerNo1);

      await expect(page.locator(YardPlanner.ContainerLink(containerNo1))).toBeVisible();

      await clickAndMeasureDynamic(page, YardPlanner.FirstContainerLink(containerNo1), YardPlanner.PlannedContainerNoText, 'Click container');

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

    await page.locator(YardPlanner.SearchInput).fill(containerNo1);

    await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo1), YardPlanner.ExecuteButton, 'Execute move');

    await page.waitForTimeout(10000);

    await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

    await expect(page.locator(YardPlanner.ContainerLink(containerNo1))).not.toBeVisible();

    console.log('Yard Operations for container number ' + containerNo1 + ' completed successfully');
  }

static async yardExecution2(page: Page) {

 // await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Masters');

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await page.locator(YardPlanner.SearchInput).fill(containerNo1);

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo1), YardPlanner.ExecuteButton, 'Execute move');

  await page.locator(YardPlanner.CraneDropdown).click();

  await page.locator(YardPlanner.FirstOptionItem).click();

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

  await expect(page.locator(YardPlanner.ContainerLink(containerNo1))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo1 + ' completed successfully');
}
  // ========================================
  // Gate Out With Cargo And Truck
  // ========================================

  static async gateOutWithCargoAndTruck1(page: Page) {

    // const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

    const XITFvehicle1 = await readTestArtifact('XITFvehicle1.txt');

    console.log(`Using container number: ${containerNo1}`);

    console.log(`Using vehicle number: ${XITFvehicle1}`);

    // await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

    await clickAndMeasureDynamic(page, GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');

    const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

    await gateToggleLabel1.waitFor({ state: 'visible', timeout: 30000 });

    await gateToggleLabel1.click();

    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);

    await page.locator(GateEmpty.SearchButton).click();

    // Validate

    await page.click(`//tr[td//a[normalize-space()="${XITFvehicle1}"]]//button[normalize-space()="Validate"]`);
  }

  
  static async gateOutWithCargoAndTruck2(page: Page) {
  
   // const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');
  const XITFvehicle2 = await readTestArtifact('XITFvehicle2.txt');
  
    console.log(`Using container number: ${containerNo1}`);
    console.log(`Using vehicle number: ${XITFvehicle2}`);
  
   //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code
  
     await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  
    await clickAndMeasureDynamic(page,GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');
  
    const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);
  
    await gateToggleLabel1.waitFor({
    state: 'visible',
    timeout: 30000
  });
    await gateToggleLabel1.click();
  
    await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo1);
  
    await page.locator(GateEmpty.SearchButton).click();
  
    // Validate
    await page.click(`//tr[td//a[normalize-space()="${XITFvehicle2}"]]//button[normalize-space()="Validate"]`);
  }

  // ========================================
  // Generate Vehicle Number
  // ========================================

  static generateVehicleNumber1(): string {

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    return `MH46${randomLetters}${randomDigits}`;
  }


  // ========================================
  // Indirect Mark LEO
  // ========================================

  static async IndirectmarkLeo(page: Page) {

    // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');// temp code

    await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');

    await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

    const bookingNumber1 = await readTestArtifact('XITF_BookingNumber.txt');

    await page.locator(Cargo.SearchInput).fill(bookingNumber1);

    await page.waitForTimeout(10000);

    await page.locator(CSMExport.Bookinglink).click();

    await page.locator(CSMExport.UpdateDetails).click();

    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');

    // await page.locator(CSMExport.button).click();

    // await page.locator(CSMExport.Arrived).click();

    await page.waitForTimeout(1000);

    // await clickAndMeasureDynamic(page, CSMExport.Arrivedbutton, CSMExport.Cargo, 'Route to cargo and mark leo');

    await page.locator(CSMExport.button).click();

    await page.locator(CSMExport.Leo).click();

    await page.waitForTimeout(1000);

    await page.locator(CSMExport.LeoNumberfield).fill('83737345');

    await page.locator(CSMExport.LeoDate).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

    await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

    await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

    await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
  }
 static generateVehicleNumber(): string {

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    return `MH46${randomLetters}${randomDigits}`;
  }

  
}

