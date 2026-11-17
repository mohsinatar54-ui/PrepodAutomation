import { test, expect, Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite, readTestArtifact } from '../utils/test-helpers';
// import { EmptyBookingLocators, Import } from 'Locators/BookingLocators';
import {CSMEmpty, Common, CSMImport, CSMExport} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { GateCommon,GateImport, GateEmpty } from 'Locators/GateLocators';
import { createExcelFile, createPreAdviceExcel } from '../utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { SwitchModule } from '../utils/test-helpers';
import { asyncWrapProviders } from 'async_hooks';


// const BookingReferenceNo = 'BK' + getRandomNumberString(6);
// const ContainerNo = 'CNTU' + getRandomNumberString(7);

export async function CSM_Empty_IN_Flow(
  page: Page,
  data: any,
  bookingRefNoFile: string,
  bookingNumberFile: string,
  containerNumberFile: string,
  // BookingReferenceNo: string,
  // ContainerNo: string
  ) {
  // test.setTimeout(120_000); // 3 minutes timeout for this test
  // const BookingReferenceNo = 'BK' + getRandomNumberString(6);
  await test.step('Login and navigate to Import Booking screen', async () => {
        // // await login(page);
        // await selectEntityAndSite(page);
      await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
      await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');
      await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');
    });
  
    await test.step('Step 3: Add Booking - Create new CSM` Empty_In Booking ', async () => {
     // await clickAndMeasureDynamic(page, CSMEmpty.AddBooking, CSMEmpty.searchOperatorClick, 'Route to Empty booking screen');
      await page.locator(CSMEmpty.AddBooking).click();
      await page.waitForTimeout(9000)
      await page.locator(CSMEmpty.searchOperatorClick).click();
      await page.locator(CSMEmpty.searchOperatorInput).fill(data.Operator);
      // await page.locator(CSMEmpty.SelectOperator(data.Operator)).click();
      await page.locator("div.dropdown-item").first().click();
     // Select the option by its value attribute ("1061") for "Empty Container In from Port (EITP)"
      await page.locator(CSMEmpty.JobActID).selectOption(data.JobActivity);
      await page.locator(CSMEmpty.JobWID).selectOption(data.JobWorkType);
      await page.locator(CSMEmpty.PDate).click();
      await selectFutureDay(page, 2);
      
      // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);
      await page.locator(CSMEmpty.BookingRef).fill(data.BookingReferenceNo);
      // writeTestArtifact(bookingRefNoFile, BookingReferenceNo)
      // console.log(`Booking Reference Number stored: ${BookingReferenceNo}`);
      writeTestArtifact(bookingRefNoFile, data.BookingReferenceNo)
      console.log(`Booking Reference Number stored: ${data.BookingReferenceNo}`);
      // fs.appendFileSync(`${artifactsDir}/TC001_CS_EmptyBooking.txt`, `Booking Reference No: ${BookingReferenceNo}\n`);
    });
  
    await test.step('Step 4: Inhancement Points POL and POD ', async () => {
      // await page.waitForTimeout(1000);
      // await page.locator(CSMEmpty.PortofLoading).selectOption(data.POL);
      // await page.waitForTimeout(1000);
      // await page.locator(CSMEmpty.PortofDisc).selectOption(data.POD);
      // await page.waitForTimeout(1000);
      await clickAndMeasureDynamic(page, CSMEmpty.submit, CSMEmpty.UpdateD, 'Submit booking details');
      const EmptyBookingNumberRaw = await page.locator(CSMEmpty.GetBookingNumber).innerText();
  
      console.log(EmptyBookingNumberRaw.trim());
      const EmptyBookingNumber = EmptyBookingNumberRaw.replace(/\s+/g, '');
  
      writeTestArtifact(bookingNumberFile, EmptyBookingNumber)
      await clickAndMeasureDynamic(page, CSMEmpty.UpdateD, CSMEmpty.AddsubBooking, 'Update details');
      console.log('Booking details filled and submitted successfully');
    });
  
    await test.step('Step 5 : Edit Booking and Add subBoooking', async () => {
      await clickAndMeasureDynamic(page, CSMEmpty.AddsubBooking, CSMEmpty.DepID, 'Click Add Sub Booking');
      await page.locator(CSMEmpty.DepID).selectOption(data.DepotSizeType);
      await page.locator(CSMEmpty.TotalContainer).fill(data.TotalContainerCount);
      await expect(page.locator(CSMEmpty.ResetButton)).toBeVisible();
      await expect(page.locator(CSMEmpty.CancelButton)).toBeVisible();
      await clickAndMeasureDynamic(page, CSMEmpty.submit, CSMEmpty.AddsubBooking, 'Add Sub Booking');
      console.log('Sub Booking added successfully');
    });
  
    await test.step('Step 7: Add container and Update Sub Booking with sale check and Hold', async () => {
      await clickAndMeasureDynamic(page, CSMEmpty.container, CSMEmpty.Addcontainer, 'Route to Empty booking screen');
      await clickAndMeasureDynamic(page, CSMEmpty.Addcontainer, CSMEmpty.DepID, 'Cick Add Container');
      await page.locator(CSMEmpty.DepID).selectOption(data.DepotSizeType);
      await page.locator(CSMEmpty.ISOType).selectOption(data.ISOSizeType);
      await expect(page.locator(CSMEmpty.TareWeight)).not.toBeEmpty();
      await expect(page.locator(CSMEmpty.CDate)).not.toBeEmpty();
      //await page.locator(CSMEmpty.ReferenceNo).fill(`${BookingReferenceNo}`);
      
      // fs.appendFileSync('test-artifacts/TC008_CS_EmptyAppointment.txt', `Container No: ${ContainerNo}\n`);
      // console.log(`Container Number stored: ${ContainerNo}`);
      // // await page.locator(CSMEmpty.AutoConNo).fill(ContainerNo);
      // await page.locator(CSMEmpty.ContainerNoField).fill(ContainerNo);
      // await writeTestArtifact(containerNumberFile, ContainerNo);
      console.log(`Container Number stored: ${data.ContainerNo}`);
      // await page.locator(CSMEmpty.AutoConNo).fill(ContainerNo);
      await page.locator(CSMEmpty.ContainerNoField).fill(data.ContainerNo);
      await writeTestArtifact(containerNumberFile, data.ContainerNo);
      await page.locator(CSMEmpty.DeliveryOrderNo).fill('1234456');
      // await page.locator(CSMEmpty.SelectPOD).selectOption({ label: data.POD });
      // await page.waitForTimeout(1000);
    });
  
    // await test.step('Step 8: Enhancement - sale,remark, Hold and Hold type ', async () => {
    //   //await page.locator("//input[@id='containerSale']").click();
    //   // await page.locator(CSMEmpty.Remark).fill("QA Test By Automation");
    //   /*-------------------Hold and Hold Type ----------------- */
    //   await page.locator(CSMEmpty.IsHoldCheckbox).click();
    //   await page.waitForTimeout(1000);
    //   await page.locator(CSMEmpty.HOldType).selectOption({ label: data.HoldType });
    // });
  
  
    await test.step('Step 9: add container ', async () => {
      await expect(page.locator(CSMEmpty.ReferenceNo)).not.toBeEmpty();
      await expect(page.locator(CSMEmpty.ResetButton)).toBeVisible();
      await expect(page.locator(CSMEmpty.CancelButton)).toBeVisible();
      // await clickAndMeasureDynamic(page, CSMEmpty.Add, CSMEmpty.Addcontainer, 'Add Container');
      await page.locator(CSMEmpty.Add).click();
      
      const invalidContainerNumberMessage = page.locator(CSMImport.InvalidContainerNumberMessage);
          if (await invalidContainerNumberMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(invalidContainerNumberMessage).toBeVisible();
            await page.locator(CSMImport.ProceedButton).click();
          }
      console.log('Container added successfully');
    });
  
    
    await test.step('Step 10: Create new job Order record ', async () => {
      await clickAndMeasureDynamic(page, CSMEmpty.JobOrder, '//td//a', 'Validate job order exsit under Job Order tab');
      // Get and log the text content of the target div row (first job order row)
      const jobOrderRow = page.locator(CSMEmpty.SelectJob).first();
      await jobOrderRow.waitFor({ state: 'visible' });
      const jobOrderText = await jobOrderRow.innerText();
      console.log('Job Order Row Text:', jobOrderText);
      // fs.appendFileSync('test-artifacts/TC008_Joborder.txt', `Job Order Row Text: ${jobOrderText}\n`);
      await page.close();
      console.log('TC001_CS_EmptyBooking completed successfully');
    });

}

export async function CSM_Empty_Preadvice(
  page: Page,
  data: any,
  bookingRefNoFile: string,
  bookingNumberFile: string,
  containerNumberFile: string,
  // BookingReferenceNo: string,
  // ContainerNo: string
  ) {
  const { filePath, referenceNo, containerNumbers } = createPreAdviceExcel();
 
   console.log('Generated file:', filePath);
   console.log('Reference No:', referenceNo);
   console.log('Container Numbers:', containerNumbers);
 
   // Access individually
   const preContainer1 = containerNumbers[0];
   const preContainer2 = containerNumbers[1];
    
   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
   await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');
   await clickAndMeasureDynamic(page,CSMEmpty.PreAnnoucement, `//button[normalize-space()="Upload"]`, 'Route to Pre-Advice Empty Booking');
   await page.locator('//button[normalize-space()="Upload"]').isVisible();
   await clickAndMeasureDynamic(page, '//button[normalize-space()="Upload"]', '//label[normalize-space()="Choose file"]', 'Route to Add Pre-Advice Empty Booking');
 
   // Upload file
   await page.locator('#upload-file-input').setInputFiles(filePath);
 
   // Click Upload button
   await page.locator('//button[normalize-space()="Upload"]').click();
 
   await page.pause();
 
   await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).waitFor();
   await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).fill(preContainer1);
   await page.locator('//button[normalize-space()="Search"]').click();
 
   // Verify first container appears in search results
   const firstContainerLocator = page.locator(`//tr[td[contains(., "${preContainer1}")]]`);
 
   writeTestArtifact('PreContainer1.txt', preContainer1);
   const firstVisible = await firstContainerLocator.isVisible();
 
   await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).waitFor();
   await page.locator(`//input[contains(@placeholder, "Search by Container No")]`).fill(preContainer2);
   await page.locator('//button[normalize-space()="Search"]').click();
 
   // Verify second container appears in search results
   const secondContainerLocator = page.locator(`//tr[td[contains(., "${preContainer2}")]]`);
 
   writeTestArtifact('PreContainer2.txt', preContainer2);
   const secondVisible = await secondContainerLocator.isVisible();
 
   // If both containers are visible
    
   if (firstVisible && secondVisible) {
     console.log("both containers have been added successfully for Pre Advice in");
   }
}
export async function Gate_EmptyIN_Flow(
  page: Page,
  data: any,
  ReadcontainerNumberFile: string
) {
  const Vehicle_No = 'MH' + getRandomNumberString(5);
  const ContainerNo = await readTestArtifact(ReadcontainerNumberFile)
  await clickAndMeasureDynamic(page, Common.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(ContainerNo);
  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(ContainerNo), GateEmpty.EditButton, 'Open Import Container details');
  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  // await page.locator('//label[contains(., "Vehicle No")]/following-sibling::input').fill(Vehicle_No);

  // Fill Vehicle No
  await page.locator(GateEmpty.VehicleNoInput).fill(Vehicle_No);

  await page.locator(GateImport.TransportDropdown).click();
    await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
      await page.locator(GateImport.TransportDropdown).click();
    }
    await page.locator(GateImport.TransportDropdownFirst).click();
  // await page.locator(GateEmpty.TransportDropdown).click();
  // await page.locator(GateEmpty.TransportDropdownFirst).click();

  // Fill Tare Weight
  await page.locator(GateEmpty.TareWeightInput).fill(data.TareWeight);

  // Fill Damage Details
  await page.locator(GateEmpty.DamageDetailsInput).fill(data.DamageDetails);

  // Fill Max Permissible Weight(Kgs.)
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill(data.MaxPermissibleWeight);

  // Fill Custom / Actual Seal
  // await page.locator("//div[label[contains(., 'Custom / Actual Seal')]]//input").fill('100');

  //await page.pause();

  // Fill IGM Seal No.
  // await page.locator("//div[label[contains(., 'IGM Seal No.')]]//input").fill('IGM98765');

  // Fill Truck RFID No.
  await page.locator(GateEmpty.TruckRFIDInput).fill(data.TruckRFID);

  await page.locator(GateEmpty.SurveyRemarkDropdown).click();
 // await page.locator(GateEmpty.SurveyRemarkOption(data.surveyRemark)).click();

 await page.locator(GateImport.SurveyRemarkDropdown).click();
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
      await page.locator(GateImport.SurveyRemarkDropdown).click();
    }
    await page.locator(GateImport.ServeyRemarkoption1).click();



  // Fill EIR No.
 // await page.locator(GateEmpty.EIRNoInput).fill(data.EIRNo);

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
  // await page.locator(GateEmpty.HoldComments).fill("Automation Hold Comments");
 // await page.locator(GateImport.OperatorConditionCode).click();
    // await page.waitForTimeout(1000);
    // if (!(await page.locator(GateImport.OperatorCCFirstOption).isVisible())) {
    //   await page.locator(GateImport.OperatorConditionCode).click();
    // }
    // await page.locator(GateImport.OperatorCCFirstOption).click();

    // await page.locator(GateImport.DepotConditionCode).click();
    // await page.waitForTimeout(1000);
    // if (!(await page.locator(GateImport.DepotCCFirstOption).isVisible())) {
    //   await page.locator(GateImport.DepotConditionCode).click();
    // }
    // await page.locator(GateImport.DepotCCFirstOption).click();

    const DepotCC = page.locator(GateImport.DepotConditionCode);

  await DepotCC.click({ force: true });

  await DepotCC.locator('input').fill('Available');

  await DepotCC.getByText('Available', { exact: true }).click({ force: true });




    // await page.locator(GateImport.DepotQualityCode).click();
    // // await page.waitForTimeout(1000);
    // if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
    //   await page.locator(GateImport.DepotQualityCode).click();
    // }
    // await page.locator(GateImport.DepotQCFirstOption).click();
const DepotQC = page.locator(GateImport.DepotQualityCODE);

  await DepotQC.click({ force: true });

  await DepotQC.locator('input').fill('AQUABA');

  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });
    
    if (await page.locator(GateEmpty.EmptyYard).isVisible()) {
      await page.locator(GateEmpty.EmptyYard).click();
      if (!(await page.locator(GateEmpty.EmptyYardFirstOption).isVisible())) {
        await page.locator(GateEmpty.EmptyYard).click();
      }
      await page.locator(GateEmpty.EmptyYardFirstOption).click();
    }

  // Fill Port Exit Pass No.
  await page.locator(GateEmpty.PortExitPassInput).fill(data.PortExitPassNo);

  // Fill Port Out Date Time
  await page.locator(GateEmpty.PortOutDateTimeInput).fill(data.PortOutDateTime);

  // Fill CFS Gate In Date Time
  await page.locator(GateEmpty.CFSGateInDateTimeInput).fill(data.CFSGateInDateTime);


  // await page.locator(GateEmpty.PortNameDropdown).click();
  // await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
  // await page.locator(GateEmpty.PortNameFirstOption).first().click();

  const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

await PortNameDropdown_TH.click({ force: true });

await PortNameDropdown_TH.locator('input').click({ force: true });

await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

  const today = new Date();
  const formattedDate =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  await page.locator(GateEmpty.ManufactureDate).fill(formattedDate);
  // Save
  await page.locator(GateEmpty.SaveButton).click();

  // Validate Button
  await clickAndMeasureDynamic(page, GateEmpty.ValidateButton(Vehicle_No), GateEmpty.ExecuteButton(Vehicle_No), 'Validate Vehicle');

  //Execute Button
  await clickAndMeasureDynamic(page, GateEmpty.ExecuteButton(Vehicle_No), GateEmpty.SearchButton, 'Execute Vehicle');

}

export async function Gate_EmptyOUT_Flow(page: Page, data: any) {
  test.setTimeout(120_000);
 const Vehicle_No = 'MH' + getRandomNumberString(5);
  const ContainerNo = await readTestArtifact('EmptyIn_Container.txt');

  await clickAndMeasureDynamic(page, Common.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(ContainerNo);
  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(ContainerNo), GateEmpty.EditButton, 'Open Import Container details');
  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  await page.locator(GateEmpty.VehicleNoInput).fill(Vehicle_No);
  await writeTestArtifact('Empty_Out_Vehicle_No.txt', Vehicle_No);
  console.log('Vehicle No: ' + Vehicle_No);

  await page.locator(GateImport.TransportDropdown).click();
  await page.waitForTimeout(1000);
  if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
    await page.locator(GateImport.TransportDropdown).click();
  }
  await page.locator(GateImport.TransportDropdownFirst).click();

  await page.locator(GateEmpty.TareWeightInput).fill(data.TareWeight);
  await page.locator(GateEmpty.DamageDetailsInput).fill(data.DamageDetails);
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill(data.MaxPermissibleWeight);
  await page.locator(GateEmpty.TruckRFIDInput).fill(data.TruckRFID);

  await page.locator(GateImport.SurveyRemarkDropdown).click();
  if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
    await page.locator(GateImport.SurveyRemarkDropdown).click();
  }
  await page.locator(GateImport.ServeyRemarkoption1).click();

  await page.locator(GateEmpty.EIRNoInput).fill(data.EIRNo);

  // const DepotCC = page.locator(GateImport.DepotConditionCode);
  // await DepotCC.click({ force: true });
  // await DepotCC.locator('input').fill('Available');
  // await DepotCC.getByText('Available', { exact: true }).click({ force: true });

  const DepotQC = page.locator(GateImport.DepotQualityCODE);
  await DepotQC.click({ force: true });
  await DepotQC.locator('input').fill('AQUABA');
  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

  if (await page.locator(GateEmpty.EmptyYard).isVisible()) {
    await page.locator(GateEmpty.EmptyYard).click();
    if (!(await page.locator(GateEmpty.EmptyYardFirstOption).isVisible())) {
      await page.locator(GateEmpty.EmptyYard).click();
    }
    await page.locator(GateEmpty.EmptyYardFirstOption).click();
  }

  //await page.locator(GateEmpty.PortExitPassInput).fill(data.PortExitPassNo);

  // await page.locator(GateEmpty.PortNameDropdown).click();
  // await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
  // await page.locator(GateEmpty.PortNameFirstOption).first().click();

   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

await PortNameDropdown_TH.click({ force: true });

await PortNameDropdown_TH.locator('input').click({ force: true });

await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

  await page.locator(GateEmpty.SaveButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.ValidateButton(Vehicle_No), GateEmpty.ExecuteButton(Vehicle_No), 'Validate Vehicle');
  await clickAndMeasureDynamic(page, GateEmpty.ExecuteButton(Vehicle_No), GateEmpty.SearchButton, 'Execute Vehicle');
}
export async function Gate_EmptyOUT_Flow_PreAnnoucement(page: Page, data: any) {
  test.setTimeout(120_000);
 const Vehicle_No = 'MH' + getRandomNumberString(5);
  const ContainerNo = await readTestArtifact('PreContainer1.txt');

  await clickAndMeasureDynamic(page, Common.GateWeighbridgeLogo, GateCommon.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
  await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateEmpty.EmptyContainerTab, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.EmptyContainerTab, GateEmpty.SearchByContainerInput, 'Route to Empty Container tab');
  await clickAndMeasureDynamic(page, GateEmpty.SearchByContainerInput, GateEmpty.SearchButton, 'Route to Empty Container screen');

  await page.locator(GateEmpty.SearchByContainerInput).fill(ContainerNo);
  await page.locator(GateEmpty.SearchButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.TBAButton(ContainerNo), GateEmpty.EditButton, 'Open Import Container details');
  await clickAndMeasureDynamic(page, GateEmpty.EditButton, GateEmpty.VehicleNoEditInput, 'Route to Edit page');

  await page.locator(GateEmpty.VehicleNoInput).fill(Vehicle_No);
  await writeTestArtifact('Empty_Out_Vehicle_No.txt', Vehicle_No);
  console.log('Vehicle No: ' + Vehicle_No);

  await page.locator(GateImport.TransportDropdown).click();
  await page.waitForTimeout(1000);
  if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
    await page.locator(GateImport.TransportDropdown).click();
  }
  await page.locator(GateImport.TransportDropdownFirst).click();

  await page.locator(GateEmpty.TareWeightInput).fill(data.TareWeight);
  await page.locator(GateEmpty.DamageDetailsInput).fill(data.DamageDetails);
  await page.locator(GateEmpty.MaxPermissibleWeightInput).fill(data.MaxPermissibleWeight);
  await page.locator(GateEmpty.TruckRFIDInput).fill(data.TruckRFID);

  await page.locator(GateImport.SurveyRemarkDropdown).click();
  if (!(await page.locator(GateImport.ServeyRemarkoption1).isVisible())) {
    await page.locator(GateImport.SurveyRemarkDropdown).click();
  }
  await page.locator(GateImport.ServeyRemarkoption1).click();

  await page.locator(GateEmpty.EIRNoInput).fill(data.EIRNo);

  // const DepotCC = page.locator(GateImport.DepotConditionCode);
  // await DepotCC.click({ force: true });
  // await DepotCC.locator('input').fill('Available');
  // await DepotCC.getByText('Available', { exact: true }).click({ force: true });

  const DepotQC = page.locator(GateImport.DepotQualityCODE);
  await DepotQC.click({ force: true });
  await DepotQC.locator('input').fill('AQUABA');
  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

  if (await page.locator(GateEmpty.EmptyYard).isVisible()) {
    await page.locator(GateEmpty.EmptyYard).click();
    if (!(await page.locator(GateEmpty.EmptyYardFirstOption).isVisible())) {
      await page.locator(GateEmpty.EmptyYard).click();
    }
    await page.locator(GateEmpty.EmptyYardFirstOption).click();
  }

  //await page.locator(GateEmpty.PortExitPassInput).fill(data.PortExitPassNo);

  // await page.locator(GateEmpty.PortNameDropdown).click();
  // await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
  // await page.locator(GateEmpty.PortNameFirstOption).first().click();

   const PortNameDropdown_TH = page.locator(GateEmpty.PortNameDropdown);

await PortNameDropdown_TH.click({ force: true });

await PortNameDropdown_TH.locator('input').click({ force: true });

await PortNameDropdown_TH.locator('input').fill('Automation Testing Script');

await PortNameDropdown_TH.getByText('Automation Testing Script', { exact: true }).click({ force: true });

  await page.locator(GateEmpty.SaveButton).click();

  await clickAndMeasureDynamic(page, GateEmpty.ValidateButton(Vehicle_No), GateEmpty.ExecuteButton(Vehicle_No), 'Validate Vehicle');
  await clickAndMeasureDynamic(page, GateEmpty.ExecuteButton(Vehicle_No), GateEmpty.SearchButton, 'Execute Vehicle');
}

export async function Yard_YardPlanner_Gate_Flow(page: Page) {
  test.setTimeout(120_000);

  await clickAndMeasureDynamic(page, Common.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Yard Microservice');

  const containerNo = await readTestArtifact('EmptyIn_Container.txt');

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

  await page.click(GateEmpty.ValidateButton(Vehicle_No));
 //await page.click(GateEmpty.ExecuteButton(Vehicle_No));

//  await expect(page.locator('//span[contains(text(),"Validation failed: Invoice Not Generated")]')).toBeVisible();
}
export async function CSM_Empty_Out_Flow(
  page: Page,
  data: any,
  ContainerNoFile: string,
  bookingRefNoFile: string,
  // BookingReferenceNo: string,
) {
  const containerNo = await readTestArtifact(ContainerNoFile)
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, CSMEmpty.AddBooking, CSMEmpty.searchOperatorClick, 'Route to Empty booking screen');

  await page.locator(CSMEmpty.searchOperatorClick).click();
  await page.locator(CSMEmpty.searchOperatorInput).fill(data.Operator);
  // await page.locator(CSMEmpty.SelectOperator(data.Operator)).click();
  await page.locator("div.dropdown-item").first().click();
  // Select the option by its value attribute ("1061") for "Empty Container In from Port (EITP)"
  // await page.locator(CSMEmpty.JobActID).selectOption(data.JobActivity1);
  await page.locator(CSMEmpty.JobActID).selectOption('1064');
  // await page.locator(CSMEmpty.JobActID).click();
  // await page.locator(`//select//option[contains(text(), 'EOTP')]`).click();
  await page.locator(CSMEmpty.JobWID).selectOption(data.JobWorkType1);
  await page.locator(CSMEmpty.PDate).click();
  await selectFutureDay(page, 2);
  // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);
  // await writeTestArtifact(bookingRefNoFile, BookingReferenceNo)
  // console.log(`Booking Reference Number stored: ${BookingReferenceNo}`);
  await page.locator(CSMEmpty.BookingRef).fill(data.BookingReferenceNo);
  // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);
  await writeTestArtifact(bookingRefNoFile, data.BookingReferenceNo)
  console.log(`Booking Reference Number stored: ${data.BookingReferenceNo}`);
  
  // await page.locator(CSMEmpty.PDate).click();

  // await selectFutureDay(page, 1);

  // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);

  // writeTestArtifact('Booking_Ref.txt', BookingReferenceNo)

  // await page.locator(CSMEmpty.BookingRef).fill(BookingReferenceNo);
  // await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, CSMEmpty.submit, CSMEmpty.UpdateD, 'Submit booking details');
  await clickAndMeasureDynamic(page, CSMEmpty.UpdateD, CSMEmpty.AddsubBooking, 'Update details');
  console.log('Booking details filled and submitted successfully');

  await clickAndMeasureDynamic(page, CSMEmpty.AddsubBooking, CSMEmpty.DepID, 'Cick Add Sub Booking');
  await page.locator(CSMEmpty.DepID).selectOption(data.DepotSizeType);
  await page.locator(CSMEmpty.TotalContainer).fill('5');
  await expect(page.locator(CSMEmpty.ResetButton)).toBeVisible();
  await expect(page.locator(CSMEmpty.CancelButton)).toBeVisible();
  await clickAndMeasureDynamic(page, CSMEmpty.Add, CSMEmpty.AddsubBooking, 'Add Sub Booking');

  console.log('Sub Booking added successfully');

  await clickAndMeasureDynamic(page, CSMEmpty.container, CSMEmpty.Addcontainer, 'Route to Empty booking screen');
  await clickAndMeasureDynamic(page, CSMEmpty.Addcontainer, CSMEmpty.DepID, 'Cick Add Container');
  await page.locator(CSMEmpty.DepID).selectOption(data.DepotSizeType);
  await page.locator(CSMEmpty.ISOType).selectOption(data.ISOSizeType);
  await expect(page.locator(CSMEmpty.TareWeight)).not.toBeEmpty();
  await expect(page.locator(CSMEmpty.CDate)).not.toBeEmpty();

  // const containerNo = await readTestArtifact('EmptyIn_Container.txt')

  await page.locator(CSMEmpty.AddContainerOut).fill(containerNo);
  await page.locator('ul[role="listbox"]').first().click();
  await expect(page.locator(CSMEmpty.ReferenceNo)).not.toBeEmpty();
  await expect(page.locator(CSMEmpty.ResetButton)).toBeVisible();
  await expect(page.locator(CSMEmpty.CancelButton)).toBeVisible();
  await page.locator(CSMEmpty.Add).click();
      await page.waitForTimeout(2000);
      const invalidContainerNumberMessage = page.locator(CSMImport.InvalidContainerNumberMessage);
          if (await invalidContainerNumberMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(invalidContainerNumberMessage).toBeVisible();
            await page.locator(CSMImport.ProceedButton).click();
          }
  // await clickAndMeasureDynamic(page, CSMEmpty.Add, CSMEmpty.Addcontainer, 'Add Container');
  console.log('Container added successfully');

  await clickAndMeasureDynamic(page, CSMEmpty.JobOrder, '//td//a', 'Validate job order exsit under Job Order tab');
  const jobOrderRow = page.locator(CSMEmpty.SelectJob).first();
  const jobOrderText = await jobOrderRow.innerText();
  console.log('Job Order Row Text:', jobOrderText);
  await writeTestArtifact('EmptyOut_Joborder.txt', `Job Order Row Text: ${jobOrderText}`);
  await page.close();
  console.log('TC001_CS_EmptyBooking completed successfully');
}

export async function CSM_Empty_Out_Flow_With_Out_job_Order(
  page: Page,
  data: any,
  bookingRefNoFile: string,
  // BookingReferenceNo: string,
) {
  const containerNo = await readTestArtifact('PreContainer1.txt')
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMEmpty.EmptyBooking, CSMEmpty.AddBooking, 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, CSMEmpty.OutJobOrder, CSMEmpty.searchOperatorClick, 'Route to Empty booking screen');

  await page.locator(CSMEmpty.searchOperatorClick).click();
  await page.locator(CSMEmpty.searchOperatorInput).fill(data.Operator);
  // await page.locator(CSMEmpty.SelectOperator(data.Operator)).click();
  await page.locator("div.dropdown-item").first().click();
  // Select the option by its value attribute ("1061") for "Empty Container In from Port (EITP)"
  // await page.locator(CSMEmpty.JobActID).selectOption(data.JobActivity1);
  await page.locator(CSMEmpty.JobActID).selectOption('1064');
  // await page.locator(CSMEmpty.JobActID).click();
  // await page.locator(`//select//option[contains(text(), 'EOTP')]`).click();
  await page.locator(CSMEmpty.JobWID).selectOption(data.JobWorkType1);

   await page.locator(CSMEmpty.JOvalidityDate).type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
  
    // // // await page.keyboard.press('ArrowRight');
  
    await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
  
    // // // await page.keyboard.press('ArrowRight');  
  
    await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
  
    await page.keyboard.press('ArrowRight'); //need when full code run
  
    console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);
  
    await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
  // await page.locator(CSMEmpty.JOvalidityDate).click();
  // await selectFutureDay(page, 2);
  // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);
  // await writeTestArtifact(bookingRefNoFile, BookingReferenceNo)
  // console.log(`Booking Reference Number stored: ${BookingReferenceNo}`);

  await page.locator(CSMEmpty.ContainerNo).fill(containerNo)
  await page.waitForTimeout(10000);

  await page.locator(CSMEmpty.BookingRef1).fill(data.BookingReferenceNo);
  // await page.locator(CSMEmpty.BookingRef).fill(`${BookingReferenceNo}`);
  await writeTestArtifact(bookingRefNoFile, data.BookingReferenceNo)
  console.log(`Booking Reference Number stored: ${data.BookingReferenceNo}`);
  
  await page.waitForTimeout(10000);

  await clickAndMeasureDynamic(page, CSMEmpty.Updatebutton, CSMImport.UpdateDetailsButton, 'Route to Empty booking screen');

  console.log('TC001_CS_EmptyBooking completed successfully');

  await page.waitForTimeout(10000);

}
export async function Yard_YardPlanner_Gate_Flow_Preadvice(page: Page) {
  test.setTimeout(120_000);

  await clickAndMeasureDynamic(page, Common.YardManagementLogo, YardPlanner.YardPlannerButton, 'Route to Yard Microservice');

  const containerNo = await readTestArtifact('PreContainer1.txt');

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

 await clickAndMeasureDynamic(page, GateEmpty.ValidateButton(Vehicle_No), GateEmpty.ExecuteButton(Vehicle_No), 'Route to Validate the vehicle');
 await clickAndMeasureDynamic(page, GateEmpty.ExecuteButton(Vehicle_No), GateEmpty.SearchButton, 'Route to Validate the vehicle');

  // await page.click(GateEmpty.ValidateButton(Vehicle_No));
  // await page.click(GateEmpty.ExecuteButton(Vehicle_No));

 // await expect(page.locator('//span[contains(text(),"Validation failed: Invoice Not Generated")]')).toBeVisible();
}