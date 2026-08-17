import { test, expect, Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectEntityAndSite, readTestArtifact } from '../utils/test-helpers';
// import { EmptyBookingLocators, Import } from 'Locators/BookingLocators';
import {CSMEmpty, Common, CSMImport, CSMExport} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { GateCommon,GateImport, GateEmpty } from 'Locators/GateLocators';


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
      await clickAndMeasureDynamic(page, CSMEmpty.AddBooking, CSMEmpty.searchOperatorClick, 'Route to Empty booking screen');
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

  await page.locator(GateEmpty.TransportDropdown).click();
  await page.locator(GateEmpty.TransportDropdownFirst).click();

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

  // await page.locator(GateEmpty.SurveyRemarkDropdown).click();
  // await page.locator(GateEmpty.SurveyRemarkOption(data.surveyRemark)).click();

  // Fill EIR No.
  await page.locator(GateEmpty.EIRNoInput).fill(data.EIRNo);

  // await page.locator('app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]').click();
  // await page.locator(`//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`).click();
  // await page.locator(GateEmpty.HoldComments).fill("Automation Hold Comments");
  await page.locator(GateImport.OperatorConditionCode).click();
    // await page.waitForTimeout(1000);
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
    // await page.waitForTimeout(1000);
    if (!(await page.locator(GateImport.DepotQCFirstOption).isVisible())) {
      await page.locator(GateImport.DepotQualityCode).click();
    }
    await page.locator(GateImport.DepotQCFirstOption).click();

    
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


  await page.locator(GateEmpty.PortNameDropdown).click();
  await page.locator(GateEmpty.PortNameInput).fill(data.PortName);
  await page.locator(GateEmpty.PortNameFirstOption).first().click();

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
  await page.locator(CSMEmpty.JobActID).selectOption({ value: data.JobActivity });
  // await page.locator(CSMEmpty.JobActID).click();
  // await page.locator(`//select//option[contains(text(), 'EOTP')]`).click();
  await page.locator(CSMEmpty.JobWID).selectOption(data.JobWorkType);
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

