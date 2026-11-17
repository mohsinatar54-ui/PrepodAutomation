import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, ClickonModule, clickAndMeasureDynamic1 } from '../../utils/test-helpers';
import { selectEntityAndSite} from '../../utils/test-helpers';
// import { Gate_Import } from '../../Flows/ImportFlow';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport, } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators'; 
import { Import_Direct_Booking__With_JobPlan_Savesubmit } from 'Flows/ExportFlow';

 const containerNo = await readTestArtifact('ImportMO9F_Container.txt')
// const containerNo1 = await readTestArtifact('XITF_Container.txt')
//const EO9FvehicleNo = await readTestArtifact('ExportDirect_EO9F_Vehicle.txt')
// const vehicleArtifactFile1 = await readTestArtifact('ExportDirect_EO9F_Vehicle1.txt');

const cargoHoldGateData = 

{
  
  tareWeight: '2500',
  damageDetails: 'No visible damage',
  maxPermissibleWeight: '30000',
  customSeal: '100',
  igmSealNo: 'IGM98765',
  truckRFID: 'RFID0001',
  surveyRemark: 'Condition OK',
  EIRNo: 'EIR20260109',
  portName: 'BPCL',
  portExitPassNo: 'PEP123456',
  portOutDateTime: '2026-01-09T11:10',
  cfsGateInDateTime: '2026-01-09T11:15',
  portTransNo: 'PTN20260109',

};

const jobOrderConfig = {
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
  MOTL: {
    jobCategory: 'Container Job',
    activityPoint: 'Depot Gate Operation',
    jobName: 'Factory De Stuffing - Container Out For Delivery  (MOTL)',
  },
  MO9F: {
    jobCategory: 'Container Job',
    activityPoint: 'Container Operation',
    jobName: 'Direct De-Stuffing/ Destuff Delivery  (MO9F)',
  },
};


export async function newJobOrder(
  page: Page,
  data: any,
  jobOrderType: keyof typeof jobOrderConfig
) {
  const job = jobOrderConfig[jobOrderType];

 // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMEmpty.AddBooking, 'Route to Empty booking screen');

 // await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo);

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
  await page.locator(CSMExport.JobConId).selectOption(containerNo);
 // await page.locator(CSMExport.JobConId).selectOption({ index: 0 });
} else if (job.jobCategory === 'Cargo Job') {
  await page.locator(CSMExport.CargoNO).selectOption({ index: 0 });
}

 await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="EstDateTime"]').click();

 await selectFutureDay(page, 3);
  // Add Job Order
  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.click(CSMExport.Save);
}

export async function yardExecution1(page: Page) {

//  await clickAndMeasureDynamic(page, YardPlanner.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Masters');

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
  
}


export async function gateOutWithCargoAndTruck1(page: Page) {

 // const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

 const  MO9Fvehicle = await readTestArtifact('MFvehicle.txt');

  console.log(`Using container number: ${containerNo}`);
  console.log(`Using vehicle number: ${MO9Fvehicle}`);

  //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page,GateImport.ImportContainerTab, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel1.click();

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${MO9Fvehicle}"]]//button[normalize-space()="Validate"]`);
}
function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
export async function ImportBooking_MO9F_Add_Transport(
  page: Page,
  vehicleArtifactFile: string = 'MF_Vehicle1.txt'
) {

   await clickAndMeasureDynamic1(page,'//button[normalize-space()="Cargo Transport"]', '//button[normalize-space()="+ Add Transport"]', 'Route to Cargo Transport');

  await clickAndMeasureDynamic1(
    page,
    '//button[normalize-space()="+ Add Transport"]',
    '//input[@formcontrolname="NoOfTransports"]',
    'Add Transport Details'
  );

//  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
//  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();

  const MFvehicleNo = `EO9F${getRandomNumberString(6)}`;
  writeTestArtifact(vehicleArtifactFile, MFvehicleNo);
  console.log(`Vehicle Number stored: ${MFvehicleNo}`);

 // await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);
  await page.locator('//label[text()="Transport Mode Number"]/parent::div/input').fill(MFvehicleNo);
  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  await page.locator('//button[normalize-space( )="Select All Containers"]').click();
  await page.locator('//button[text()="Add"]').click();
 // await clickAndMeasureDynamic1(page,'//button[text()="Add"]','//button[normalize-space()="Job Plan"]', 'Route to Cargo Transport');

//   await clickAndMeasureDynamic1(page,'//button[normalize-space()="Cargo Transport"]', '//button[normalize-space()="+ Add Transport"]', 'Route to Cargo Transport');

//   await clickAndMeasureDynamic1(
//     page,
//     '//button[normalize-space()="+ Add Transport"]',
//     '//input[@formcontrolname="NoOfTransports"]',
//     'Add Transport Details'
//   );

// //  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
// //  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();

//   const MFvehicleNo = `EO9F${getRandomNumberString(6)}`;
//   writeTestArtifact(vehicleArtifactFile, MFvehicleNo);
//   console.log(`Vehicle Number stored: ${MFvehicleNo}`);

//  // await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);
//   await page.locator('//label[text()="Transport Mode Number"]/parent::div/input').fill(MFvehicleNo);
//   await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
//   await page.locator('//button[text()="Add"]').click();
   
}

export async function JobOrderapproval(page: Page) {
  await clickAndMeasureDynamic(page,CSMImport.Yesbutton, CSMImport.Aprrovedbutton, 'Route to approved screes');
    await clickAndMeasureDynamic(page,CSMImport.Aprrovedbutton, CSMImport.JoborderApproval, 'Order Approved'); 
}
export async function Gate_Import(
  page: Page,
  data: any,
  MFvehicle: string,
  ReadblnNumberFile: string,
  ReadcontainerNumberFile: string
){
  const Vehicle_No = 'MH' + getRandomNumberString(5);
  writeTestArtifact(MFvehicle, Vehicle_No);
  // const containerNo1 = await readTestArtifact('ImportIndirect_Container.txt');
  // const containerNo2 = await readTestArtifact('ImportMO9F_Container.txt');
  // const containerNo = await readTestArtifact('ImportIndirect_Container.txt');

  await test.step('Navigate to Import Container edit screen', async () => {
    await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateImport.ImportContainerTab, 'Route to Import Container tab');
    await clickAndMeasureDynamic(page, GateImport.ImportContainerTab, GateImport.TBAButton(containerNo), 'Route to Import Container');
    await clickAndMeasureDynamic(page, GateImport.TBAButton(containerNo), GateCommon.EditButton, 'Open Import Container details');
    await clickAndMeasureDynamic(page, GateCommon.EditButton, GateImport.VehicleNoInput, 'Route to Edit page');
  });

  await test.step('Fill Import Container details and save', async () => {
    await page.locator(GateImport.VehicleNoInput).fill(Vehicle_No);

    await page.locator(GateImport.TransportDropdown).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
      await page.locator(GateImport.TransportDropdown).click();
    }
    await page.locator(GateImport.TransportDropdownFirst).click();

    await page.locator(GateImport.TareWeightInput).fill(data.tareWeight);
    await page.locator(GateImport.DamageDetailsInput).fill(data.damageDetails);
    await page.locator(GateImport.MaxPermissibleWeightInput).fill(data.maxPermissibleWeight);
    await page.locator(GateImport.CustomSealInput).fill(data.customSeal);
    await page.locator(GateImport.IGMSealInput).fill(data.igmSealNo);
    await page.locator(GateImport.TruckRFIDInput).fill(data.truckRFID);
   

    // await page.locator(GateImport.SurveyRemarkDropdown).click();
    // if (!(await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).isVisible())) {
    //   await page.locator(GateImport.SurveyRemarkDropdown).click();
    // }
    // await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).click();

    await page.locator(GateImport.EIRNoInput).fill(data.EIRNo);

   

const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

// Wait for dropdown component
await PortNameDropdown_TH.waitFor({
  state: 'visible',
  timeout: 15000
});

// Scroll it into view
await PortNameDropdown_TH.scrollIntoViewIfNeeded();

// Click the dropdown header specifically
const DropdownHeader = PortNameDropdown_TH.locator(
  '.dropdown-header'
);

await DropdownHeader.waitFor({
  state: 'visible',
  timeout: 15000
});

await DropdownHeader.click();

// Now locate the search input
const PortNameInput = PortNameDropdown_TH.locator(
  'input.search-input'
);

await PortNameInput.waitFor({
  state: 'visible',
  timeout: 15000
});

// Make sure input is ready
await PortNameInput.fill('Automation Testing Script');

// Locate the option inside this dropdown
const PortNameOption = PortNameDropdown_TH
  .locator('.dropdown-item')
  .filter({
    hasText: 'Automation Testing Script'
  });

await PortNameOption.waitFor({
  state: 'visible',
  timeout: 15000
});

// Select option
await PortNameOption.click();





    // const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);
    
    // await PortNameDropdown_TH.click({ force: true });
    
    // await PortNameDropdown_TH.locator('input').click({ force: true });

    // await PortNameDropdown_TH.waitFor({ state: 'visible', timeout: 10000 });
    
    // await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');
    
    // await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });
    
    // await page.locator(GateImport.PortNameDropdown).click();
    // if (!(await page.locator('.dropdown-item', { hasText: data.portName }).isVisible())) {
    //   await page.locator(GateImport.PortNameDropdown).click();
    // }
    // await page.locator('.dropdown-item', { hasText: data.portName }).click();

    await page.locator(GateImport.OperatorConditionCode).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {
      await page.locator(GateImport.OperatorConditionCode).click();
    }
    await page.locator(GateImport.OperatorCCFirstOption).click();

    await page.locator(GateImport.DepotConditionCode).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {
      await page.locator(GateImport.DepotConditionCode).click();
    }
    await page.locator(GateImport.DepotCCFirstOption).click();

    await page.locator(GateImport.DepotQualityCode).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
      await page.locator(GateImport.DepotQualityCode).click();
    }
    await page.locator(GateImport.DepotQCFirstOption).click();
    await page.locator(GateImport.PortExitPassInput).fill(data.portExitPassNo);
    await page.locator(GateImport.PortExitPassInput).fill(data.portExitPassNo);
    await page.locator(GateImport.PortOutDateTimeInput).fill(data.portOutDateTime);
    await page.locator(GateImport.CFSGateInDateTimeInput).fill(data.cfsGateInDateTime);
    // await page.locator(GateImport.CFSGateInDateTimeInput).click();
    // await selectFutureDay(page, 0);
    await page.locator(GateImport.PortTransNoInput).fill(data.portTransNo);
    await page.locator(GateImport.IsWeighmentCheckbox).uncheck();

    await clickAndMeasureDynamic(page, GateCommon.SaveButton, GateCommon.ValidateButton(Vehicle_No), 'Save Import Container details');
  });

  await test.step('Validate and execute Import Container', async () => {
    await page.click(GateCommon.ValidateButton(Vehicle_No));
    await expect(page.getByText('Validation successful')).toBeVisible();
    await page.click(GateCommon.ExecuteButton(Vehicle_No));
    // await expect(page.getByText('Execution successful')).toBeVisible();
    console.log(`Gate Ops for Cargo Hold executed successfully for Container No : ${containerNo} with Vehicle No : ${Vehicle_No}`);
  });

  // await test.step('Validate Container at Gatout Screen', async () => {
  //   await clickAndMeasureDynamic(page, GateCommon.ToggleButton, GateCommon.ValidateButton(Vehicle_No), 'Route to Gate Out screen');
  //   await expect(page.locator(`//tr[td[normalize-space()="${containerNo}"]]//button[normalize-space()="Validate"]`)).toBeVisible();
  //   await page.click(GateCommon.ValidateButton(Vehicle_No));
  //   await expect(
  // page.locator("span.font-medium")).toHaveText(
  // `Validation failed: ERROR! Container No. ${containerNo} CY3 operation is not completed for this container.`);
  // });
}


test('TC002_GATE_IMPORT_MO9F_.test.ts', async ({ page }) => {
  await test.setTimeout(700000); // 2 minutes timeout for this test
  // await login(page);
 // await login(page);
 const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await Gate_Import(loginPage, cargoHoldGateData, 'MFvehicle.txt', 'CargoHold_BLN_Number.txt', 'CargoHold_ContainerNumber.txt');
  SwitchModule(loginPage, 'Yard Operations');
  await yardExecution1(loginPage);
  SwitchModule(loginPage, 'Gate Operations');
  await gateOutWithCargoAndTruck1(loginPage);
  SwitchModule(loginPage, 'Customer Service Portal');
  await newJobOrder(loginPage,jobOrderConfig,'MO9F');
  await ImportBooking_MO9F_Add_Transport(loginPage,'MF_Vehicle1.txt');
  
}
)
