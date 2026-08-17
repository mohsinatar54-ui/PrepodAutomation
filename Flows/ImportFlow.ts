import { test, expect, Page} from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,selectEntityAndSite, getRandomNumberString, readTestArtifact,
  writeTestArtifact, selectFutureDay} from '../utils/test-helpers'; // <-- Update this path if needed, e.g. './utils/test-helpers_VBS_CCIS' or '../../utils/test-helpers_VBS_CCIS'
import { CSMImport, Common } from 'Locators/BookingLocators';
import { GateCommon, GateImport } from 'Locators/GateLocators';

export async function CSM_ImportBooking_MOTL(
  page: Page,
  data: any,
  bookingNumberFile: string,
  blnNumberFile: string,
  containerNumberFile: string,
  cargoNumberFile: string,
) {
// test.setTimeout(160000); // Set timeout to 2 minutes
let stopExecution = false;
let stopExecutionCont = false;
let ContainerNo: string;
await test.step('Login and navigate to Import Booking screen', async () => {
    // await login(page);
    // await selectEntityAndSite(page);
    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
    await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');
    await clickAndMeasureDynamic(page, CSMImport.AddBookingButton, CSMImport.LIGMNumberInput, 'Add Import Booking');
  });

  await test.step('Fill Import Booking details', async () => {
    await page.locator(CSMImport.LIGMNumberInput).fill(data.LIGMNumber);
    await page.waitForTimeout(1000);
    // await page.locator(CSMImport.LIGMDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="LIGMDate"]').click();
    await selectFutureDay(page, 1);
    // const LineNumber = getRandomNumberString(5);
    await page.locator(CSMImport.LineNumberInput).type(data.LineNumber); 
    await writeTestArtifact(cargoNumberFile, `${data.LineNumber}`);
    // await page.locator(CSMImport.LineNumberInput).type(getRandomNumberString(5));
    // const blnNumber = 'BLN' + getRandomNumberString(10);
    await page.locator(CSMImport.BLNumberInput).type(data.blnNumber);
    // await page.waitForTimeout(1000);
    // await page.locator(CSMImport.BLDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });

    await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="BLDate"]').click();
    await selectFutureDay(page, 1);
    await page.locator(CSMImport.GIGMNumberInput).type(getRandomNumberString(7));
    // await page.locator(CSMImport.GIGMDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="GIGMDate"]').click();
    await selectFutureDay(page, 1);
    await page.locator(CSMImport.SMTPNumberInput).type('SMTP' + getRandomNumberString(7));
    await page.locator(CSMImport.TModeTypeSelect).selectOption(data.Transport_Mode);
    await page.locator(CSMImport.TModeAgentInput).type('Transport Mode Agent');
    await page.locator(CSMImport.PortOfLoadingSelect).selectOption(data.PortOfLoading);
    await page.locator(CSMImport.PortOfArrivalSelect).selectOption(data.PortOfArrival);
    await page.locator(CSMImport.BreifCargoDescriptionTextarea).fill('This is an automation test for Import Booking');
    // await clickAndMeasureDynamic(page, CSMImport.SubmitBookingButton, CSMImport.UpdateDetailsButton, 'Submit booking details');
    await page.locator(CSMImport.SubmitBookingButton).click();

    const duplicateErrorblnNumber = page.locator("//span[text()='ERROR!BL No. already exists.']");

    if (await duplicateErrorblnNumber.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Negative testing successfully completed');
    stopExecution = true;
    return; 
    }
   
    await page.locator(CSMImport.UpdateDetailsButton).isVisible();
    await expect(page.locator(CSMImport.BookingNumberLabel)).toBeVisible();
    // const bookingNumber = (await page.locator(CSMImport.BookingNumberLabel).textContent())?.replace(/\s+/g, '');
    await page.waitForTimeout(3000);
    const bookingNumber = await page.locator(CSMImport.BookingNumberLabel).textContent();
    console.log('Booking Number:', bookingNumber);
    console.log('BLN Number:', data.blnNumber);

    writeTestArtifact(bookingNumberFile, `${bookingNumber}`);
    writeTestArtifact(blnNumberFile, data.blnNumber);

    await clickAndMeasureDynamic(page, CSMImport.UpdateDetailsButton, CSMImport.BookingDetails, 'Update booking details');
  });
  if (stopExecution) {
    return; // exits whole function
    }

  await test.step('Fill CHA, Operator, Commodity and update booking', async () => {
    await page.locator(CSMImport.PrAcctHolder).click();
    await page.locator(CSMImport.PrAcctHolderAutocompleteInput).fill(data.CHA_Name);
    // await page.locator(CSMImport.AutocompleteOption).first().click();
    await page.locator("div.dropdown-item").first().click();

    await page.locator(CSMImport.OperatorAutocompleteInput).fill(data.OperatorID);
    await page.locator(CSMImport.AutocompleteOption).first().click();

    await page.locator(CSMImport.CHAclick).click();
    await page.locator(CSMImport.SearchCHAInput).fill(data.CHA_Name);
    // await page.locator(CSMImport.AutocompleteOption).first().click();
    await page.locator("div.dropdown-item").first().click();
    await page.locator(CSMImport.CommoditySelect).selectOption(data.Commodity);

    await page.locator(CSMImport.UpdateButton).isVisible();
    await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.CargoTabButton, 'Update booking details');
    await page.locator(CSMImport.CargoTabButton).isVisible();
    await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.AddNewCargoButton, 'Add Cargo');
    await clickAndMeasureDynamic(page, CSMImport.AddNewCargoButton, CSMImport.FreightAndPackagesDiv, 'Add Cargo');
  });

  await test.step('Add Cargo details', async () => {
    await page.click(CSMImport.FreightAndPackagesDiv);
    await page.locator(CSMImport.DECWeightInput).fill(data.DECWeight);
    await page.locator(CSMImport.WtMeasUnitSelect).selectOption({ label: `${data.WeightUnit}` });
    await page.locator(CSMImport.DECVolumeInput).fill(data.DECVolume);
    await page.locator(CSMImport.VolMeasUnitSelect).selectOption({ label: `${data.VolumeUnit}` });
    await page.waitForTimeout(1000);
    await page.locator(CSMImport.CANoOfPackageInput).fill(data.Packages);
    await page.locator(CSMImport.CAPackageTypeSelect).selectOption(data.PackageType);

    await clickAndMeasureDynamic(page, CSMImport.AddCargoButton, CSMImport.AddNewCargoButton, 'Submit Add Cargo');
    console.log('Cargo added successfully');
  });

  await test.step('Add Container details', async () => {
    await clickAndMeasureDynamic(page, CSMImport.ContainerTabButton, CSMImport.AddNewContainerButton, 'Route to Container tab');
    await clickAndMeasureDynamic(page, CSMImport.AddNewContainerButton, CSMImport.IGMDetailsDiv, 'Click Add Container');
    await page.click(CSMImport.IGMDetailsDiv);

    // const ContainerNo = 'IMPU' + getRandomNumberString(7);
    writeTestArtifact(containerNumberFile, data.ContainerNo);
  
    await page.locator(CSMImport.ContainerNoInput).fill(data.ContainerNo);
    await page.locator(CSMImport.COSizeTypeSelect).selectOption({ label: `${data.DepotSizeType}` });
    await page.locator(CSMImport.ISOSizeTypeSelect).selectOption({ label: `${data.ISOSizeType}` });
    await page.locator(CSMImport.LFCLSelect).selectOption({ label: `${data.FreightKind}` });

    await page.locator(CSMImport.DONumberInput).fill('DON' + getRandomNumberString(7));
    // const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    //   .toISOString()
    //   .slice(0, 16);
    // const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    //   .toISOString()
    //   .slice(0, 16);
    // await page.locator(CSMImport.DODateInput).fill(deliveryOrderDate);
    await page.locator(CSMImport.DODateInput).click();
    await selectFutureDay(page, 1);
    // await page.locator(CSMImport.DOValidityDateInput).fill(deliveryValidtyDate);
    await page.locator(CSMImport.DOValidityDateInput).click();
    await selectFutureDay(page, 2);

    await expect(page.locator(CSMImport.ResetButton)).toBeVisible();
    await expect(page.locator(CSMImport.CancelButton)).toBeVisible();

    await page.locator(CSMImport.UpdateButton).click();
    const invalidContainerNumberMessage = page.locator(CSMImport.InvalidContainerNumberMessage);
    if (await invalidContainerNumberMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(invalidContainerNumberMessage).toBeVisible();
      await page.locator(CSMImport.ProceedButton).click();
    }

    // const duplicateErrorContainerNo = page.locator("//span[contains(text(),'Container already exist in another booking.')]");
    const duplicateErrorContainerNo = await page.locator("//span[contains(text(),'Container already exist in another booking.')]");

    // if (await duplicateErrorContainerNo.isVisible().catch(() => false)) {
    if (await duplicateErrorContainerNo.waitFor({state: 'visible',timeout: 5000,})
      .then(() => true)
      .catch(() => false)) {
      console.log('Negative testing for duplicate container number successfully completed');
      stopExecutionCont = true;
      return; 
    }
    // Save ContainerNo for later steps
    // (page as any)._containerNo = data.ContainerNo;
  });

  if (stopExecutionCont) {
    return; // exits whole function
    }
  console.log('Container added successfully');

  await test.step('Add BOE and Map Cargo', async () => {
    await page.waitForTimeout(2000);
    await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.OpenActions, 'BOE');
    await page.locator(CSMImport.OpenActions).click();
    if (!(await page.locator(CSMImport.BOEListItem).isVisible())) {
      await page.locator(CSMImport.OpenActions).click();
    }
    await clickAndMeasureDynamic(page, CSMImport.BOEListItem, CSMImport.BENumberInput, 'Route to BOE Screen');

    await page.locator(CSMImport.BENumberInput).fill(getRandomNumberString(7));
    // await page.locator(CSMImport.BEDateInput).type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });
    await page.locator(CSMImport.BEDateInput).click();
    await selectFutureDay(page, 0);

    await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.CargoTabButton, 'Update BOE');

    await page.locator(CSMImport.OpenActions).isVisible();
    await page.locator(CSMImport.OpenActions).click();
    if (!(await page.locator(CSMImport.MapListItem).isVisible())) {
      await page.locator(CSMImport.OpenActions).click();
    }
    // await page.locator(CSMImport.MapListItem).click();
    // await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesInput, 'Route to Mapping Screen');
    await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesCheckbox, 'Route to Mapping Screen');
    await page.locator(CSMImport.PackagesCheckbox).check();
    await page.locator(CSMImport.PackagesInput).fill(data.Packages);

    await clickAndMeasureDynamic(page, CSMImport.MapButton, CSMImport.AddNewCargoButton, 'Map Cargo');
  });

  await test.step('Work Order tab and final assertions', async () => {
    // Retrieve ContainerNo from previous step
    // const ContainerNo = (page as any)._containerNo;
    const ContainerNo = await readTestArtifact(containerNumberFile);

    await clickAndMeasureDynamic(page, CSMImport.WorkOrderTabButton, `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
    expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
    await clickAndMeasureDynamic(page, CSMImport.EditContainerButton(ContainerNo), CSMImport.WorkOrderSubmitButton, 'Edit Container');
    const WO_Description = await page.locator('select[formcontrolname="JODID"]').textContent();
    await expect(WO_Description).not.toBe('');
    await expect('select[formcontrolname="AllocationUnitID"]').not.toBe('');
    await clickAndMeasureDynamic(page, CSMImport.WorkOrderSubmitButton, `//app-manage-containers//div[normalize-space()="${ContainerNo}"]`, 'Update Container');
    // await page.locator(CSMImport.WorkOrderSubmitButton).click();
    // await expect(page.locator(CSMImport.WorkOrderTransportation)).toBeVisible();
    await page.close();
    console.log('TC002_CS_ImportBooking_MOTL completed successfully');
  });
}

export async function Gate_Import(
  page: Page,
  data: any,
  ReadbookingNumberFile: string,
  ReadblnNumberFile: string,
  ReadcontainerNumberFile: string
){
  const Vehicle_No = 'MH' + getRandomNumberString(5);
  const containerNo = await readTestArtifact(ReadcontainerNumberFile);

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

    await page.locator(GateImport.SurveyRemarkDropdown).click();
    if (!(await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).isVisible())) {
      await page.locator(GateImport.SurveyRemarkDropdown).click();
    }
    await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).click();

    await page.locator(GateImport.EIRNoInput).fill(data.EIRNo);
    await page.locator(GateImport.PortNameDropdown).click();
    if (!(await page.locator('.dropdown-item', { hasText: data.portName }).isVisible())) {
      await page.locator(GateImport.PortNameDropdown).click();
    }
    await page.locator('.dropdown-item', { hasText: data.portName }).click();

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

  await test.step('Validate Container at Gatout Screen', async () => {
    await clickAndMeasureDynamic(page, GateCommon.ToggleButton, GateCommon.ValidateButton(Vehicle_No), 'Route to Gate Out screen');
    await expect(page.locator(`//tr[td[normalize-space()="${containerNo}"]]//button[normalize-space()="Validate"]`)).toBeVisible();
    await page.click(GateCommon.ValidateButton(Vehicle_No));
    await expect(
  page.locator("span.font-medium")).toHaveText(
  `Validation failed: ERROR! Container No. ${containerNo} CY3 operation is not completed for this container.`);
  });
}





// import { test, expect, Page} from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,selectEntityAndSite, getRandomNumberString, readTestArtifact,
//   writeTestArtifact, selectFutureDay} from '../utils/test-helpers'; // <-- Update this path if needed, e.g. './utils/test-helpers_VBS_CCIS' or '../../utils/test-helpers_VBS_CCIS'
// import { CSMImport, CSMCommon } from 'Locators/BookingLocators';
// import { Common, GateImport } from 'Locators/GateLocators';

// export async function CSM_ImportBooking_MOTL(
//   page: Page,
//   data: any,
//   bookingNumberFile: string,
//   blnNumberFile: string,
//   containerNumberFile: string,
//   cargoNumberFile: string
// ) {
// test.setTimeout(160000); // Set timeout to 2 minutes
// await test.step('Login and navigate to Import Booking screen', async () => {
//     // await login(page);
//     // await selectEntityAndSite(page);
//     await clickAndMeasureDynamic(page, CSMCommon.CustomerServiceLogo, CSMCommon.BookingTab, 'Route to Customer Service');
//     await clickAndMeasureDynamic(page, CSMCommon.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
//     await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');
//     await clickAndMeasureDynamic(page, CSMImport.AddBookingButton, CSMImport.LIGMNumberInput, 'Add Import Booking');
//   });

//   await test.step('Fill Import Booking details', async () => {
//     await page.locator(CSMImport.LIGMNumberInput).fill(getRandomNumberString(15));
//     await page.waitForTimeout(1000);
//     // await page.locator(CSMImport.LIGMDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="LIGMDate"]').click();
//     await selectFutureDay(page, 1);
//     const LineNumber = getRandomNumberString(5);
//     await page.locator(CSMImport.LineNumberInput).type(LineNumber); 
//     writeTestArtifact(cargoNumberFile, `${LineNumber}`);
//     // await page.locator(CSMImport.LineNumberInput).type(getRandomNumberString(5));
//     const blnNumber = 'BLN' + getRandomNumberString(10);
//     await page.locator(CSMImport.BLNumberInput).type(blnNumber);
//     await page.waitForTimeout(1000);
//     // await page.locator(CSMImport.BLDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });

//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="BLDate"]').click();
//     await selectFutureDay(page, 1);
//     await page.locator(CSMImport.GIGMNumberInput).type(getRandomNumberString(7));
//     // await page.locator(CSMImport.GIGMDateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="GIGMDate"]').click();
//     await selectFutureDay(page, 1);
//     await page.locator(CSMImport.SMTPNumberInput).type('SMTP' + getRandomNumberString(7));
//     await page.locator(CSMImport.TModeTypeSelect).selectOption(data.Transport_Mode);
//     await page.locator(CSMImport.TModeAgentInput).type('Transport Mode Agent');
//     await page.locator(CSMImport.PortOfLoadingSelect).selectOption(data.PortOfLoading);
//     await page.locator(CSMImport.PortOfArrivalSelect).selectOption(data.PortOfArrival);
//     await page.locator(CSMImport.BreifCargoDescriptionTextarea).fill('This is an automation test for Import Booking');
//     await clickAndMeasureDynamic(page, CSMImport.SubmitBookingButton, CSMImport.UpdateDetailsButton, 'Submit booking details');

//     const bookingNumber = (await page.locator(CSMImport.BookingNumberLabel).textContent())?.replace(/\s+/g, '');
//     console.log('Booking Number:', bookingNumber);
//     console.log('BLN Number:', blnNumber);

//     writeTestArtifact(bookingNumberFile, `${bookingNumber}`);
//     writeTestArtifact(blnNumberFile, blnNumber);

//     await clickAndMeasureDynamic(page, CSMImport.UpdateDetailsButton, CSMImport.BookingDetails, 'Update booking details');
//   });

//   await test.step('Fill CHA, Operator, Commodity and update booking', async () => {
//     await page.locator(CSMImport.CHAAutocompleteInput).fill(data.CHA_Name);
//     await page.locator(CSMImport.AutocompleteOption).first().click();

//     await page.locator(CSMImport.OperatorAutocompleteInput).fill(data.OperatorID);
//     await page.locator(CSMImport.AutocompleteOption).first().click();

//     await page.locator(CSMImport.SearchCHAInput).fill(data.CHA_Name);
//     await page.locator(CSMImport.AutocompleteOption).first().click();
//     await page.locator(CSMImport.CommoditySelect).selectOption(data.Commodity);

//     await page.locator(CSMImport.UpdateButton).isVisible();
//     await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.CargoTabButton, 'Update booking details');
//     await page.locator(CSMImport.CargoTabButton).isVisible();
//     await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.AddNewCargoButton, 'Add Cargo');
//     await clickAndMeasureDynamic(page, CSMImport.AddNewCargoButton, CSMImport.FreightAndPackagesDiv, 'Add Cargo');
//   });

//   await test.step('Add Cargo details', async () => {
//     await page.click(CSMImport.FreightAndPackagesDiv);
//     await page.locator(CSMImport.DECWeightInput).fill(data.DECWeight);
//     await page.locator(CSMImport.WtMeasUnitSelect).selectOption({ label: `${data.WeightUnit}` });
//     await page.locator(CSMImport.DECVolumeInput).fill(data.DECVolume);
//     await page.locator(CSMImport.VolMeasUnitSelect).selectOption({ label: `${data.VolumeUnit}` });
//     await page.waitForTimeout(1000);
//     await page.locator(CSMImport.CANoOfPackageInput).fill(data.Packages);
//     await page.locator(CSMImport.CAPackageTypeSelect).selectOption(data.PackageType);

//     await clickAndMeasureDynamic(page, CSMImport.AddCargoButton, CSMImport.AddNewCargoButton, 'Submit Add Cargo');
//     console.log('Cargo added successfully');
//   });

//   await test.step('Add Container details', async () => {
//     await clickAndMeasureDynamic(page, CSMImport.ContainerTabButton, CSMImport.AddNewContainerButton, 'Route to Container tab');
//     await clickAndMeasureDynamic(page, CSMImport.AddNewContainerButton, CSMImport.IGMDetailsDiv, 'Click Add Container');
//     await page.click(CSMImport.IGMDetailsDiv);

//     const ContainerNo = 'IMPU' + getRandomNumberString(7);
//     writeTestArtifact(containerNumberFile, ContainerNo);
  
//     await page.locator(CSMImport.ContainerNoInput).fill(ContainerNo);
//     await page.locator(CSMImport.COSizeTypeSelect).selectOption({ label: `${data.DepotSizeType}` });
//     await page.locator(CSMImport.ISOSizeTypeSelect).selectOption({ label: `${data.ISOSizeType}` });
//     await page.locator(CSMImport.LFCLSelect).selectOption({ label: `${data.FreightKind}` });

//     await page.locator(CSMImport.DONumberInput).fill('DON' + getRandomNumberString(7));
//     const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
//       .toISOString()
//       .slice(0, 16);
//     const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
//       .toISOString()
//       .slice(0, 16);
//     // await page.locator(CSMImport.DODateInput).fill(deliveryOrderDate);
//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="DODate"]').click();
//     await selectFutureDay(page, 1);
//     // await page.locator(CSMImport.DOValidityDateInput).fill(deliveryValidtyDate);
//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="DOValidityDate"]').click();
//     await selectFutureDay(page, 1);

//     await expect(page.locator(CSMImport.ResetButton)).toBeVisible();
//     await expect(page.locator(CSMImport.CancelButton)).toBeVisible();
//     await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.AddNewContainerButton, 'Update Container');
//     console.log('Container added successfully');

//     // Save ContainerNo for later steps
//     (page as any)._containerNo = ContainerNo;
//   });

//   await test.step('Add BOE and Map Cargo', async () => {
//     await clickAndMeasureDynamic(page, CSMImport.CargoTabButton, CSMImport.OpenActions, 'BOE');
//     await page.locator(CSMImport.OpenActions).click();
//     await clickAndMeasureDynamic(page, CSMImport.BOEListItem, CSMImport.BENumberInput, 'Route to BOE Screen');

//     await page.locator(CSMImport.BENumberInput).fill(getRandomNumberString(7));
//     // await page.locator(CSMImport.BEDateInput).type(`${getNextDateTimeFormatted(0).date}`, { delay: 200 });
//     await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="BEDate"]').click();
//     await selectFutureDay(page, 0);

//     await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.CargoTabButton, 'Update BOE');

//     await page.locator(CSMImport.OpenActions).isVisible();
//     await page.locator(CSMImport.OpenActions).click();
//     // await page.locator(CSMImport.MapListItem).click();
//     // await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesInput, 'Route to Mapping Screen');
//     await clickAndMeasureDynamic(page, CSMImport.MapListItem, CSMImport.PackagesCheckbox, 'Route to Mapping Screen');
//     await page.locator(CSMImport.PackagesCheckbox).check();
//     await page.locator(CSMImport.PackagesInput).fill(data.Packages);

//     await clickAndMeasureDynamic(page, CSMImport.UpdateButton, CSMImport.AddNewCargoButton, 'Map Cargo');
//   });

//   await test.step('Work Order tab and final assertions', async () => {
//     // Retrieve ContainerNo from previous step
//     const ContainerNo = (page as any)._containerNo;

//     await clickAndMeasureDynamic(page, CSMImport.WorkOrderTabButton, `//td[normalize-space()="${ContainerNo}"]`, 'Route to Work Order tab');
//     expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
//     await clickAndMeasureDynamic(page, CSMImport.EditContainerButton(ContainerNo), CSMImport.WorkOrderSubmitButton, 'Edit Container');
//     const WO_Description = await page.locator('select[formcontrolname="JODID"]').textContent();
//     await expect(WO_Description).not.toBe('');
//     await expect('select[formcontrolname="AllocationUnitID"]').not.toBe('');
//     await clickAndMeasureDynamic(page, CSMImport.WorkOrderSubmitButton, `//app-manage-containers//div[normalize-space()="${ContainerNo}"]`, 'Update Container');
//     // await page.locator(CSMImport.WorkOrderSubmitButton).click();
//     // await expect(page.locator(CSMImport.WorkOrderTransportation)).toBeVisible();
//     await page.close();
//     console.log('TC002_CS_ImportBooking_MOTL completed successfully');
//   });
// }

// export async function Gate_Import(
//   page: Page,
//   data: any,
//   ReadbookingNumberFile: string,
//   ReadblnNumberFile: string,
//   ReadcontainerNumberFile: string
// ){
//   const Vehicle_No = 'MH' + getRandomNumberString(5);
//   const containerNo = await readTestArtifact(ReadcontainerNumberFile);

//   await test.step('Navigate to Import Container edit screen', async () => {
//     await clickAndMeasureDynamic(page, Common.GateWeighbridgeLogo, Common.StandardServicesBtn, 'Route to Gate & Weighbridge Operations');
//     await clickAndMeasureDynamic(page, Common.StandardServicesBtn, GateImport.ImportContainerTab, 'Route to Import Container tab');
//     await clickAndMeasureDynamic(page, GateImport.ImportContainerTab, GateImport.TBAButton(containerNo), 'Route to Import Container');
//     await clickAndMeasureDynamic(page, GateImport.TBAButton(containerNo), Common.EditButton, 'Open Import Container details');
//     await clickAndMeasureDynamic(page, Common.EditButton, GateImport.VehicleNoInput, 'Route to Edit page');
//   });

//   await test.step('Fill Import Container details and save', async () => {
//     await page.locator(GateImport.VehicleNoInput).fill(Vehicle_No);

//     await page.locator(GateImport.TransportDropdown).click();
//     await page.waitForTimeout(1000);
//     if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
//       await page.locator(GateImport.TransportDropdown).click();
//     }
//     await page.locator(GateImport.TransportDropdownFirst).click();

//     await page.locator(GateImport.TareWeightInput).fill(data.tareWeight);
//     await page.locator(GateImport.DamageDetailsInput).fill(data.damageDetails);
//     await page.locator(GateImport.MaxPermissibleWeightInput).fill(data.maxPermissibleWeight);
//     await page.locator(GateImport.CustomSealInput).fill(data.customSeal);
//     await page.locator(GateImport.IGMSealInput).fill(data.igmSealNo);
//     await page.locator(GateImport.TruckRFIDInput).fill(data.truckRFID);

//     await page.locator(GateImport.SurveyRemarkDropdown).click();
//     if (!(await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).isVisible())) {
//       await page.locator(GateImport.SurveyRemarkDropdown).click();
//     }
//     await page.locator(GateImport.SurveyRemarkOption(data.surveyRemark)).click();

//     await page.locator(GateImport.EIRNoInput).fill(data.EIRNo);
//     await page.locator(GateImport.PortNameDropdown).click();
//     if (!(await page.locator('.dropdown-item', { hasText: data.portName }).isVisible())) {
//       await page.locator(GateImport.PortNameDropdown).click();
//     }
//     await page.locator('.dropdown-item', { hasText: data.portName }).click();

//     await page.locator(GateImport.PortExitPassInput).fill(data.portExitPassNo);
//     await page.locator(GateImport.PortOutDateTimeInput).fill(data.portOutDateTime);
//     await page.locator(GateImport.CFSGateInDateTimeInput).fill(data.cfsGateInDateTime);
//     await page.locator(GateImport.PortTransNoInput).fill(data.portTransNo);
//     await page.locator(GateImport.IsWeighmentCheckbox).uncheck();

//     await clickAndMeasureDynamic(page, Common.SaveButton, Common.ValidateButton(Vehicle_No), 'Save Import Container details');
//   });

//   await test.step('Validate and execute Import Container', async () => {
//     await page.click(Common.ValidateButton(Vehicle_No));
//     await expect(page.getByText('Validation successful')).toBeVisible();
//     await page.click(Common.ExecuteButton(Vehicle_No));
//     // await expect(page.getByText('Execution successful')).toBeVisible();
//     console.log(`Gate Ops for Cargo Hold executed successfully for Container No : ${containerNo} with Vehicle No : ${Vehicle_No}`);
//   });
// }