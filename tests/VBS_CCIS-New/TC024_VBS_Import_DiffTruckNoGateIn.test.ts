import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, Createfile, readTestArtifact } from '../../utils/test-helpers';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite, selectFutureDay } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments } from 'Locators/All locators/VBSMasters';
import { GateCommon, GateImport } from 'Locators/GateLocators';
// import { CSM_VBS_ImportBooking_MOTL } from 'Flows/ImportFlow';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';

const ImportMOTL = {
  DepotSizeType: '20 STD (20STD)',
  ISOSizeType: '22G1',
  TotalContainers: '5',
  Transport_Mode: 'Vessel',
  CHA_Name: 'MMJ LOGISTICS',
  OperatorID: 'MMJ LOGISTICS',
  Commodity: 'WHEAT',
  PortOfLoading: 'BPCL',
  PortOfArrival: 'MUMBAI',
  DECWeight: '1000',
  DECVolume: '1000',
  WeightUnit: 'Tonnes',
  VolumeUnit: 'Cubic Meter',
  Packages: '100',
  PackageType: 'Bulk',
  FreightKind: 'FCL',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Depot Gate Operation',
  JobDescription: '1078', // 'Container In By Truck From Factory Stuffing (XITF)'
  LIGMNumber: getRandomNumberString(15),
  blnNumber: 'BLN' + getRandomNumberString(10),
  LineNumber: getRandomNumberString(5),
  ContainerNo: 'IMPU' + getRandomNumberString(7)
};

const bookingType = 'Import';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
const Cancel_Remark = 'Cancelling appointment with Automation script';
const Vehicle_No = 'MH' + getRandomNumberString(6);
const DiffTruckNo = 'MH596271';

const artifactsDir = 'test-artifacts';
const containerNo = readTestArtifact('VBSImport_ContainerNumber.txt');
let appointmentNo = '';
const bookingNo = readTestArtifact('VBSImport_BookingNumber.txt');
const surveyRemark = 'Condition OK';

test.beforeEach(async ({ page }) => {
  test.setTimeout(60_000); // 1 minute timeout for each test
  await login(page);
  await selectEntityAndSite(page);
// Removed extra closing brace causing syntax error
});

// test('TC0025_VBS_ImportBooking_Common', async ({ page }) => {
//   test.setTimeout(120000);
//   await CSM_VBS_ImportBooking_MOTL(page);
// });
  
test('TC001_CSM_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(120000); // Set timeout to 2 minutes for this test
  await CSM_ImportBooking_MOTL(page, ImportMOTL, 'VBSImport_BookingNumber.txt', 'VBSImport_BLN_Number.txt', 'VBSImport_ContainerNumber.txt', 'VBSImport_CargoNumber.txt');
});

test('TC010_VBS_Import_CreateAppointment', async ({ page }) => {
  await test.step('Login and Route to Appointments', async () => {
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });

  await test.step('Fill details and Create Appointment', async () => {
    // for (let i = 1; i <= 2; i++) {
      // Wait for Create Appointment button to appear and click it
      await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');

      // Open transporter dropdown and pick by label
      await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });

      // Fill driverName
      await page.fill(Appointments.DriverNameInput, 'Automation Test');

      await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

      await page.fill(Appointments.TruckNumberInput, Vehicle_No);

      await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));

      await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });

      // Fill booking number
      await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
      await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
      // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
      await page.locator(Appointments.ServiceDropdown).isDisabled();
      await page.waitForTimeout(2000);
      await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
      await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
      await page.waitForTimeout(2000); // Wait for time to be processed
      await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });

      // Click on the first checkbox (could be terms or agree)
      await page.click(Appointments.FirstCheckbox);

      // Wait for Save Appointment button to be enabled before clicking
      await expect(page.locator(Appointments.SaveAppointmentButton)).toBeEnabled();

      // Click Submit button
      await page.locator(Appointments.SaveAppointmentButton).click();

  });
  
});

test('Gate_Operations_Import_RF', async ({ page }) => {

  let hazardMessage = '';

  // =========================
  // STEP 3: Configure Hazard Alert
  // =========================
  await test.step('Enable and validate Hazard Alert configuration', async () => {

    await clickAndMeasureDynamic(page, GateCommon.GateWeighbridgeLogo, GateCommon.Masters, 'Route to Gate & Weighbridge Operations');

    await clickAndMeasureDynamic(page, GateCommon.Masters, '//button[normalize-space()="Site Configuration"]', 'Route to Site Configuration');

    await clickAndMeasureDynamic(page, '//button[normalize-space()="Site Configuration"]', '//label[normalize-space()="Hazard alert"]', 'Route to Hazard Alert configuration');

    const hazardCheckbox = page.locator('#isHazAlert');

    await expect(hazardCheckbox).toBeVisible();

    // Only check if enabled
    if (await hazardCheckbox.isEnabled()) {
      await hazardCheckbox.check();
    }

    await expect(hazardCheckbox).toBeChecked();

    hazardMessage = await page.locator('#hazAlertMessage').inputValue();
    console.log('Hazard Message:', hazardMessage);

    await expect(hazardMessage).toContain('Hazardous');

    await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Site Configuration"]', 'Save Hazard Alert configuration');
    // await expect(page.getByText('Site configuration has been updated successfully.')).toBeVisible();
  });

  let Vehicle_No = '';

  // =========================
  // STEP 4: Fill Import Container Details
  // =========================
  await test.step('Fill Import Container details', async () => {

    await clickAndMeasureDynamic(page, GateCommon.StandardServicesBtn, GateImport.ImportContainerTab, 'Route to Import Container tab');

    await clickAndMeasureDynamic(page, GateImport.ImportContainerTab, GateImport.TBAButton(containerNo), 'Open container record');

    await clickAndMeasureDynamic(page, GateImport.TBAButton(containerNo), GateCommon.EditButton, 'Open Edit screen');

    await clickAndMeasureDynamic(page,GateCommon.EditButton,GateImport.VehicleNoInput,'Open Edit screen');

    await page.locator(GateImport.VehicleNoInput).fill(DiffTruckNo);

    await page.locator(GateImport.TransportDropdown).click();
    await page.locator(GateImport.TransportDropdownFirst).click();

    await page.locator(GateImport.TareWeightInput).fill('2500');
    await page.locator(GateImport.DamageDetailsInput).fill('No visible damage');
    await page.locator(GateImport.MaxPermissibleWeightInput).fill('30000');
    await page.locator(GateImport.CustomSealInput).fill('100' );
    await page.locator(GateImport.IGMSealInput).fill('IGM98765');
    await page.locator(GateImport.TruckRFIDInput).fill('RFID0001');

    await page.locator(GateImport.SurveyRemarkDropdown).click();
    await page.locator(GateImport.SurveyRemarkOption(surveyRemark)).click();

    await page.locator(GateImport.EIRNoInput).fill('EIR20260109');

    await page.locator(GateImport.PortNameDropdown).click();
    await page.locator(GateImport.PortNameInput).fill('BPCL');
    await page.locator(GateImport.PortNameFirstOption).first().click();

    await page.locator(GateImport.PortExitPassInput).fill('PEP123456');
    await page.locator(GateImport.PortOutDateTimeInput).fill('2026-01-09T11:10');
    await page.locator(GateImport.CFSGateInDateTimeInput).fill('2026-01-09T11:15');
    await page.locator(GateImport.PortTransNoInput).fill('PTN20260109');

    await page.locator(GateImport.IsWeighmentCheckbox).uncheck();

    await page.locator(GateCommon.SaveButton).click();
  });
  
  // =========================
  // STEP 5: Validate Hazard Popup
  // =========================
  await test.step('Validate Hazard Alert popup on Validate action', async () => {

    // await page.click(`//tr[td//a[normalize-space()="${DiffTruckNo}"]]//button[normalize-space()="Validate"]`);
    await page.click(GateCommon.ValidateButton(DiffTruckNo));
    // Scan the QA code
    await expect(page.getByText(`VBS validation failed: VBS Validation Failed : Truck number mismatch. Provided: ${DiffTruckNo}`)).toBeVisible();
    const popup = page.locator('POPUP_SELECTOR');

    // await expect(popup).toBeVisible();
    // await expect(popup).toContainText(hazardMessage);

    // await page.locator('OK_BUTTON_SELECTOR').click();
  });

  // =========================
  // STEP 6: Execute Operation
  // =========================
  // await test.step('Execute container operation', async () => {
  //   await page.click(`//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`);
  // });

});