import { test, expect,Page } from '@playwright/test';
import { login, clickAndMeasureDynamic,getNextDateTimeFormatted,getRandomNumberString, readTestArtifact,writeTestArtifact,SwitchModule, XOTP, ImportTally, EO9FTally, ClickonModule } from '../../utils/test-helpers';
import { selectEntityAndSite} from '../../utils/test-helpers';
// import { Gate_Import } from '../../Flows/ImportFlow';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport, } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators'; 
import { yardExecution2 } from '@tests/Export_XITF/TC003_GATE_EXPORT_XITF1.test';

 const containerNo = await readTestArtifact('ImportFactory_Container.txt')
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



export async function gateInNewVehicleMOTL (page: Page) {
   await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  //await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');

  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // Generate new vehicle number
  const MOTLvehicleNo1 = `MOTL${getRandomNumberString(6)}`;

  // Store vehicle number in artifact
  await writeTestArtifact('MOTLvehicle1.txt', MOTLvehicleNo1);

  console.log(`Vehicle Number stored: ${MOTLvehicleNo1}`);

  // Enter vehicle number
  await page.locator(GateEmpty.VehicleNoInput).fill(MOTLvehicleNo1);

    await page.locator(GateImport.TransportDropdown).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
      await page.locator(GateImport.TransportDropdown).click();
    }
    await page.locator(GateImport.TransportDropdownFirst).click();

  // await page.locator(GateEmpty.TransportDropdown).click();

  // await page.locator(GateEmpty.TransportDropdownFirst).click();

  await page.locator(GateImport.DamageDetailsInput).fill('testdamage');

  // Fill Custom / Actual Seal
  
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');

 // await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');
  //  await page.waitForTimeout(1000);
  //  await page.locator(GateImport.DepotQualityCode).click();
  //  await page.locator(GateImport.DepotQCFirstOption).click();


// await DepotQC.locator(GateEmpty.PortNameInput).fill('AQUABA');

// await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

const DepotQC = page.locator(GateImport.DepotQualityCODE);
await DepotQC.click({ force: true });
await DepotQC.locator('input').fill('AQUABA');
await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

// const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);
// await PortNameDropdown_TH.click({ force: true });
// await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');
// await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

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
  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${MOTLvehicleNo1}"]]//button[normalize-space()="Validate"]`);

  // Execute
  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${MOTLvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');
}

export async function gateOutWithCargoAndTruck1(page: Page) {

 // const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');

 const MOTLvehicle1 = await readTestArtifact('MOTLvehicle1.txt');

  console.log(`Using container number: ${containerNo}`);
  console.log(`Using vehicle number: ${MOTLvehicle1}`);

  //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

 // await clickAndMeasureDynamic(page,GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

  await gateToggleLabel1.click();

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${MOTLvehicle1}"]]//button[normalize-space()="Validate"]`);
}
function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
export async function yardExecutionMOTL2(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await page.locator(YardPlanner.SearchInput).fill(containerNo);

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

  await page.locator(YardPlanner.CraneDropdown).click();

  await page.locator(YardPlanner.FirstOptionItem).click();

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

  await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');
}
export async function JobOrderapproval(page: Page) {
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
  CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen'
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
    
    await PortNameDropdown_TH.click({ force: true });
    
    await PortNameDropdown_TH.locator('input').click({ force: true });
    
    await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');
    
    await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });
    
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


test('TC002_GATE_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(160_000); // 2 minutes timeout for this test
  // await login(page);
 // await login(page);
 const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await gateInNewVehicleMOTL(loginPage);
  SwitchModule(loginPage, 'Yard Operations');
  await yardExecutionMOTL2(loginPage);
  SwitchModule(loginPage, 'Gate Operations');
  await gateOutWithCargoAndTruck1(loginPage);
}
)
