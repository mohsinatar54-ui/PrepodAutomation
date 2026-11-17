import { Page } from '@playwright/test';

import { clickAndMeasureDynamic,getNextDateTimeFormatted,readTestArtifact } from '../utils/test-helpers';

import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';


import { Cargo } from 'Locators/CargoLocators';


// ========================================
// Global Export Direct Test Data
// ========================================

let containerNo: string;
let EO9FvehicleNo: string;
let DirectBookingNumber: string;
let EO9FvehicleNo1: string;
let EO9FvehicleNo2:string;


// ========================================
// Export Direct Page
// ========================================

export class ExportDirectPage {

  static async loadTestData() {

      containerNo = await readTestArtifact(
      'ExportDirectEO9F_Container.txt'
    );

    EO9FvehicleNo = await readTestArtifact(
      'ExportDirect_EO9F_Vehicle.txt'
    );

    DirectBookingNumber = await readTestArtifact(
      'ExportDirectBookingNumber.txt'
    );
  }


  static async gateInCargo(page: Page) {

    await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateExport.CargoButton, 'Route to Cargo');

    await clickAndMeasureDynamic(page, GateExport.CargoButton, GateExport.ExportCargoLink, 'Route to Export Cargo');

    await clickAndMeasureDynamic(page, GateExport.ExportCargoLink, GateExport.SearchByBookingInput, 'Route to Export Cargo');

    await page.locator(GateExport.SearchByBookingInput).fill(DirectBookingNumber);

    await page.locator(GateExport.SearchButton).click();

    await page.click(GateExport.ValidateButtonE(EO9FvehicleNo));

    await clickAndMeasureDynamic(page, GateExport.ExecuteButtonE(EO9FvehicleNo), GateExport.ContainerButton, 'Execute Button');
  }


  static async cargoShift(page: Page) {

    await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

    await clickAndMeasureDynamic(page, YardPlanner.Shiftingbutton, YardPlanner.Shiftingbuttonverify, 'Route to Lift of container');

    await page.locator(YardPlanner.FirstContainerY).click();

    await page.locator(YardPlanner.Shiftbutton).click();

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

    await page.locator(YardPlanner.Shiftbutton).click();

    await page.waitForTimeout(20000);
  }


  static async markLeo(page: Page) {

    await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');

    await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

    await page.locator(Cargo.SearchInput).fill(DirectBookingNumber);

    await page.waitForTimeout(10000);

    await page.locator(CSMExport.Bookinglink).click();

    await page.locator(CSMExport.UpdateDetails).click();

    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');

    await page.locator(CSMExport.button).click();

    await page.locator(CSMExport.Arrived).click();

    await page.waitForTimeout(1000);

    await clickAndMeasureDynamic(page, CSMExport.Arrivedbutton, CSMExport.Cargo, 'Route to cargo and mark leo');

    await page.locator(CSMExport.button).click();

    await page.locator(CSMExport.Leo).click();

    await page.waitForTimeout(1000);

    await page.locator(CSMExport.LeoNumberfield).fill('83737345');

    await page.locator(CSMExport.LeoDate).type(
      `${getNextDateTimeFormatted(1).day}`,
      { delay: 200 }
    );

    await page.keyboard.type(
      `${getNextDateTimeFormatted(1).month}`,
      { delay: 200 }
    );

    await page.keyboard.type(
      `${getNextDateTimeFormatted(1).year}`,
      { delay: 200 }
    );

    await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.Cargo, 'Route to cargo and mark leo');
  }


  static async completeStuffing(page: Page) {

    await clickAndMeasureDynamic(page, Cargo.CargoVerificationButton, Cargo.ExportCargoVerificationButton, 'Route to Export cargo verification tab');

    await clickAndMeasureDynamic(page, Cargo.ExportCargoVerificationButton, Cargo.ExportCargoVerificationSpan, 'Click on Export cargo verification tab');

    await page.locator(Cargo.FirstCargoTableRowSpan).first().click();

    await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();

    await clickAndMeasureDynamic(page, Cargo.CargoCompleteContainerStuffingButton, Cargo.CargoStuffingYesButton, 'Complete Container Stuffing');

    await page.locator(Cargo.CargoStuffingYesButton).click();
  }


  static async gateOutCargoemptytruck(page: Page) {

 //   await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.ExportCargo, 'Route to Export Cargo');

    await clickAndMeasureDynamic(page, CSMExport.ExportCargo, Cargo.SearchButton, 'Route to Export Cargo Search');

    await page.locator(GateExport.GateOuttoggle).waitFor({
      state: 'visible',
      timeout: 30000
    });

    await page.locator(GateExport.GateOuttoggle).click();

    await page.locator(GateExport.GateExportBNsearch).fill(DirectBookingNumber);

    await page.waitForTimeout(1000);

    await page.locator(Cargo.SearchButton).click();

    await page.click(
      `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Validate"]`
    );

    await page.waitForTimeout(10000);

    await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

    await page.waitForTimeout(10000);
  }

  static async DExportEO9FTally(page: Page) {

//  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

  const containerNo = await readTestArtifact('ExportDirectEO9F_Container.txt');
  console.log('Using container number:', containerNo);

 // await clickAndMeasureDynamic(page, '//img[@alt="Cargo Warehouse Management Logo"]', '//button[normalize-space()="Dashboard"]', 'Route to Cargo warehouse');  // tamp code

  await clickAndMeasureDynamic(page, Cargo.CargoVerificationButton, Cargo.ExportCargoVerificationButton, 'Route to Export cargo verification tab '); //new code 
  
  await clickAndMeasureDynamic(page, Cargo.ExportCargoVerificationButton, Cargo.ExportCargoVerificationSpan, 'Click on Export cargo verification tab '); //new code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
//  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

 // await page.locator('//button[normalize-space()="Search"]').click(); //old code

  await page.locator(Cargo.SearchInput).fill(EO9FvehicleNo);

  // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

  await page.locator(Cargo.FirstCargoTableRowSpan).first().click(); // New CODE

  await page.locator(Cargo.VehicleLink(EO9FvehicleNo)).click();

  await page.locator(Cargo.AddTallyButton).click();

  await page.locator(Cargo.ContainerNoDropdown).selectOption({ label: containerNo }); // Tally Type : Full

  await page.locator(Cargo.PlanDateInput).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');

  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });

  // // // await page.keyboard.press('ArrowRight');  

  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });

  await page.keyboard.press('ArrowRight'); //need when full code run

  console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });

  // // await page.keyboard.press('ArrowDown');

  await clickAndMeasureDynamic(page, Cargo.SaveButton, Cargo.ContainerRowLink(containerNo), 'Update Tally');

  await page.locator(Cargo.ContainerRowLink(containerNo)).click();

//  await page.locator(`//a[@class="hover:opacity-70"]`).click(); // temp code need to remove for runn full code 
// await page.locator("//a[text()='18082026121310694']").click(); //temp code need to remove for full run code 
// await page.waitForTimeout(10000);

  await page.locator(Cargo.AddCargoButton).click();

 //const declaredPackages ='100';
//  const declaredPackages = await page
 //await page .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
 //   .inputValue();//old

 // await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);//old

  //await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);//old

  const declaredPackage1 = '100';

  await page.waitForTimeout(10000);

  await page.locator(Cargo.TallyPackagesInput).fill(declaredPackage1);

  await page.waitForTimeout(10000);

  await page.locator(Cargo.NoOfGoodPackagesInput).fill(declaredPackage1);

  await page.locator(Cargo.NoOfDamagedPackagesInput).fill('0');

  await clickAndMeasureDynamic(page, Cargo.UpdateButton, Cargo.SubmitButton, 'Update Tally');

  await clickAndMeasureDynamic(page, Cargo.SubmitButton, Cargo.YesSubmitButton, 'Submit the cargo1');

  await clickAndMeasureDynamic(page, Cargo.YesSubmitButton, Cargo.CompleteTransportCargoUnloadButton, 'Submit the cargo2');

  // await page.locator(Cargo.SubmitButton).click();

  // await page.locator(Cargo.YesSubmitButton).click();

  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  await clickAndMeasureDynamic(page, Cargo.CompleteTransportCargoUnloadButton, Cargo.CompleteContainerStuffingButton, 'Complete Transport Cargo Unload');

  await page.locator(Cargo.YesButton).click();
  
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

  // await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');

  
}

static async newJobOrderXOTP(page: Page) {

  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');

  await page.locator(CSMExport.ContainerNosearchfield).fill(containerNo);

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.firstBookingLink).click();

  await page.waitForTimeout(2000);

  await page.locator(CSMExport.UpdateDetails).click();

  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');

  await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');

  await page.locator(CSMExport.JobCatId).selectOption('Container Job');

  await page.locator(CSMExport.JobActId).selectOption('Depot Gate Operation');

  const dropdown = page.locator(CSMExport.JobDescription);

  const option = dropdown.locator('option').filter({
    hasText: 'Export Container Out By Truck To Port  (XOTP)'
  });

  await dropdown.selectOption(await option.getAttribute('value')!);

  await page.locator(CSMExport.JobConId).selectOption(containerNo);

  await page.locator(CSMExport.EstDtTime).click();

  await selectFutureDay(page, 3);

  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');

  await page.locator(CSMExport.Save).click();
}

static generateVehicleNumber(digitCount: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];

  const min = Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;

  const randomDigits =
    Math.floor(min + Math.random() * (max - min + 1));

  return `MH46${randomLetters}${randomDigits}`;
}

static async gateInNewVehicle(page: Page) {

 // await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');

  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, '//a[text()=" Export Container "]', GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(containerNo), GateEmpty.EditButton, 'Open Import Container details');

  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

   EO9FvehicleNo1 = ExportDirectPage.generateVehicleNumber(6);

  //writeTestArtifact('vehicleArtifactFile1.txt', EO9FvehicleNo1);

  console.log(`Vehicle Number stored: ${EO9FvehicleNo1}`);

  await page.locator(GateEmpty.VehicleNoInput).fill(EO9FvehicleNo1);

  await page.locator(GateImport.TransportDropdown).click();

  await page.waitForTimeout(1000);

  if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
    await page.locator(GateImport.TransportDropdown).click();
  }

  await page.locator(GateImport.TransportDropdownFirst).click();

   await page.locator(GateEmpty.DamageDetailsInput).fill('Damage');

  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill('1000');

  await page.locator(GateImport.SurveyRemarkDropdown).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
      await page.locator(GateImport.SurveyRemarkDropdown).click();
    }
    await page.locator(GateImport.ServeyRemarkoption1).click();

  const DepotQC = page.locator(GateImport.DepotQualityCODE);

  await DepotQC.click({ force: true });

  await DepotQC.locator('input').fill('AQUABA');

  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

  await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('Seal');

  const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

  await PortNameDropdown_TH.click({ force: true });

  await PortNameDropdown_TH.locator('input').click({ force: true });

  await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

  await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

  const checkbox = page.locator("//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']");

    if (await checkbox.count() > 0 && await checkbox.isChecked()) {

      await checkbox.uncheck();

    }

  // const plannedOutDropdown = page.locator(GateEmpty.Planned_Out_Weighbridge);

  // const input = plannedOutDropdown.locator('input');

  // const option = page.getByText('Weighbridge 2', { exact: true });

  // await plannedOutDropdown.click({ force: true });

  // try {

  //   await input.waitFor({
  //     state: 'visible',
  //     timeout: 2000
  //   });

  // } catch {

  //   await plannedOutDropdown.click({ force: true });

  //   await input.waitFor({
  //     state: 'visible',
  //     timeout: 5000
  //   });
  // }

  // await input.click();

  // await input.fill('Weighbridge 2');

  // await option.waitFor({
  //   state: 'visible'
  // });

  // await option.click({
  //   force: true
  // });

  // const plannedInDropdown = page.locator(
  //   GateEmpty.Planned_In_Weighbridge_input
  // );

  // const input1 = plannedInDropdown.locator('input');

  // const option1 = plannedInDropdown.getByText(
  //   'Weighbridge 2',
  //   { exact: true }
  // );

  // await plannedInDropdown.click({
  //   force: true
  // });

  // try {

  //   await option1.waitFor({
  //     state: 'visible',
  //     timeout: 2000
  //   });

  // } catch {

  //   await plannedInDropdown.click({
  //     force: true
  //   });

  //   await option1.waitFor({
  //     state: 'visible',
  //     timeout: 5000
  //   });
  // }

  // await input1.waitFor({
  //   state: 'visible'
  // });

  // await input1.click();

  // await input1.fill('Weighbridge 2');

  // await option1.click({
  //   force: true
  // });

  await page.locator(GateEmpty.SaveButton).click();

  await page.waitForTimeout(10000);

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  await page.click(
    `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Validate"]` );

  await clickAndMeasureDynamic(page, `//tr[td//a[normalize-space()="${EO9FvehicleNo1}"]]//button[normalize-space()="Execute"]`, '//button[normalize-space()="Container"]', 'Execute Button');

}
static async yardExecution(page: Page) {

  await clickAndMeasureDynamic(page, YardPlanner.YardExecutionButton, YardPlanner.GateSection, 'Open Yard Execution');

  await page.locator(YardPlanner.SearchInput).fill(containerNo);

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteMoveButtonByContainer(containerNo), YardPlanner.ExecuteButton, 'Execute move');

  await page.locator(YardPlanner.CraneDropdown).click();

  await page.locator(YardPlanner.FirstOptionItem).click();
   

  await clickAndMeasureDynamic(page, YardPlanner.ExecuteButton, YardPlanner.SearchInput, 'Confirm execution');

  // await expect(page.locator(YardPlanner.ContainerLink(containerNo))).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');
}

static async gateOutWithCargoAndTruck(page: Page) {

 // const containerNo = await readTestArtifact('ExportDirect_EmptyIn_Container.txt');

  const EO9FvehicleNo2 = await readTestArtifact('vehicleArtifactFile1.txt');

  console.log(`Using container number: ${containerNo}`);
  console.log(`Using vehicle number: ${EO9FvehicleNo2}`);

  //  await clickAndMeasureDynamic(page, '//img[@alt="Gate Operations Logo"]', '//button[normalize-space()="Standard Services"]', 'Route to Gate & Weighbridge Operations'); // temp code

   await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');

  await clickAndMeasureDynamic(page,GateExport.Exportcontainerbutton, GateEmpty.SearchButton, 'Route to Export Container tab');

  const gateToggleLabel1 = page.locator(GateExport.GateOuttoggle);

    await gateToggleLabel1.waitFor({
  state: 'visible',
  timeout: 30000
});
  await gateToggleLabel1.click();

  await page.locator(GateEmpty.SearchByContainerInput).fill(containerNo);

  await page.locator(GateEmpty.SearchButton).click();

  // Validate
  await page.click(`//tr[td//a[normalize-space()="${EO9FvehicleNo2}"]]//button[normalize-space()="Validate"]`);
}
}