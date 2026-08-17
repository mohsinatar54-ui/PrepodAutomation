import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact,writeTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments} from 'Locators/VBSMasters';
import { CSMImport } from 'Locators/BookingLocators';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
// import { Vehicle_No } from './Gate_Operation_Import.test';

//Create Appointment
const bookingType = 'Import';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 5';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
const Cancel_Remark = 'Cancelling appointment with Automation script';

let ImportMOTL: any;

test.beforeAll(async () => {

ImportMOTL = {
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
});

test.beforeEach(async ({ page }) => {
    await login(page);
    await selectEntityAndSite(page);
// Removed extra closing brace causing syntax error
});

test('VBS_SetShipping_Special_Enable', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Create appointment for the booking', async () => {
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.ShippingLineTab, 'Navigate to Master');
  await clickAndMeasureDynamic(page, Master.ShippingLineTab, Master.Edit_ShippingLine(ImportMOTL.OperatorID), 'Navigate to Shipping Line Master');
  await page.locator(Master.Edit_ShippingLine(ImportMOTL.OperatorID)).click();
  const ShippingEnabled = await page
    .locator(Master.Checkbox_ShippingLine(ImportMOTL.OperatorID))
    .isChecked();
  if (!ShippingEnabled) {
    await page.locator(Master.Checkbox_ShippingLine(ImportMOTL.OperatorID)).click();
    await page.locator(Master.Save_ShippingLine(ImportMOTL.OperatorID)).click();
  } else {
    console.log('Shipping Line already enabled, proceeding with test');
  }
  await page.locator(Master.Save_ShippingLine(ImportMOTL.OperatorID)).click();
  await expect(page.locator(`//tr[td[normalize-space()="${ImportMOTL.OperatorID}"]]//i[contains(@class,'fa-check')]`)).toBeVisible();
 });
});

test('Create Import MOTL Booking', async ({ page }) => {
  await CSM_ImportBooking_MOTL(page, ImportMOTL, 'VBSImportSS_BookingNumber.txt', 'VBSImportSS_BLN_Number.txt', 'VBSImportSS_ContainerNumber.txt', 'VBSImportSS_CargoNumber.txt');
});  

test('Import_CreateAppointment for special shipping Enabled', async ({ page }) => {
  let appointmentNo = '';
  const bookingNo = readTestArtifact('VBS_ImportSS_Booking_Number.txt');
  await test.step('Login and Route to Appointments', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });

  await test.step('Fill details and Create Appointment', async () => {
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');

    // Open transporter dropdown and pick by label
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });

    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');

    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));

    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));

    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });

    // Fill booking number
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    await expect(
      page.locator('.confirm-box-message')
    ).toHaveText(
      'Special shipping line detected - time slots will be not be required for this booking'
    );
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    await page.waitForTimeout(2000);
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    // await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
    await expect(page.locator(Appointments.SlotDropdown)).not.toBeVisible();

    // Click on the first checkbox (could be terms or agree)
    await page.click(Appointments.FirstCheckbox);

    // Click Submit button
    await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');
  });

  await test.step('Cancel the created appointment', async () => {
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    await writeTestArtifact('VBS_ImportSS_Appointment_Number.txt', appointmentNo);

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentLinkByNo(appointmentNo) + ' /preceding-sibling::button',
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      'Click Cancel icon'
    );
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      Appointments.AppointmentCancelYesButton,
      'Click Yes button'
    );

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelYesButton,
      Appointments.AppointmentCancelRemarkTextarea,
      'Click Yes button to cancel appointment'
    );
    await page.click(Appointments.AppointmentCancelBookingButton);
    await expect(page.getByText('Please enter a remark before cancelling.')).toBeVisible();
    await page.fill(Appointments.AppointmentCancelRemarkTextarea, Cancel_Remark);
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelBookingButton,
      Appointments.AppointmentCancelSuccessToast,
      'Confirm cancellation'
    );
    await expect(page.getByText(/Booking cancelled successfully!/)).toBeVisible();
  });
  await test.step('Verify appointment is cancelled', async () => {  
    await expect(page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo))).toHaveText('Cancelled');
    const appointmentStatusLocator = page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo));
    const appointmentStatus = await appointmentStatusLocator.textContent();
    console.log('Appointment Status:', appointmentStatus);
    await expect(appointmentStatusLocator).toHaveText('Cancelled');

    await expect(page.locator(Appointments.AppointmentStatusCellByAppointmentNo(appointmentNo))).toHaveText('Cancelled');
    await expect(page.locator(Appointments.AppointmentCancelRemarkCellByAppointmentNo(appointmentNo))).toHaveText(Cancel_Remark);
  });
  // End of test steps
});

test('VBS_SetShipping_Special_Disable', async ({ page }) => {
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.ShippingLineTab, 'Navigate to Master');
  await clickAndMeasureDynamic(page, Master.ShippingLineTab, Master.Edit_ShippingLine(ImportMOTL.OperatorID), 'Navigate to Shipping Line Master');
  await page.locator(Master.Edit_ShippingLine(ImportMOTL.OperatorID)).click();
  const ShippingDisabled = await page
    .locator(Master.Checkbox_ShippingLine(ImportMOTL.OperatorID))
    .isChecked();
  if (ShippingDisabled) {
    await page.locator(Master.Checkbox_ShippingLine(ImportMOTL.OperatorID)).click();
    // expect(page.locator(Master.Save_ShippingLine(ImportMOTL.OperatorID))).not.toBeEnabled();
    // await page.waitForTimeout(2000);
    // await page.locator(Master.Save_ShippingLine(ImportMOTL.OperatorID)).click();
  } else {
    console.log('Shipping Line already disabled, proceeding with test');
  }
  await page.locator(Master.Save_ShippingLine(ImportMOTL.OperatorID)).click();
  await expect(page.locator(Master.Edit_ShippingLine(ImportMOTL.OperatorID))).toBeVisible();
});

test('Import_CreateAppointment with Special Shipping disabled', async ({ page }) => {
  let appointmentNo = '';
  const bookingNo = readTestArtifact('VBS_ImportSS_Booking_Number.txt');
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');

  await test.step('Fill details and Create Appointment', async () => {
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');

    // Open transporter dropdown and pick by label
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });

    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');

    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));

    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));

    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });

    // Fill booking number
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    // await expect(
    //   page.locator('.confirm-box-message')
    // ).toHaveText(
    //   'Special shipping line detected - time slots will be not be required for this booking'
    // );
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    await page.waitForTimeout(2000);
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
    // await expect(page.locator(Appointments.SlotDropdown)).not.toBeVisible();

    // Click on the first checkbox (could be terms or agree)
    await page.click(Appointments.FirstCheckbox);

    // Click Submit button
    await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');
  });

  await test.step('Cancel the created appointment', async () => {
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    await writeTestArtifact('VBS_ImportSS_Appointment_Number.txt', appointmentNo);

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentLinkByNo(appointmentNo) + ' /preceding-sibling::button',
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      'Click Cancel icon'
    );
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      Appointments.AppointmentCancelYesButton,
      'Click Yes button'
    );

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelYesButton,
      Appointments.AppointmentCancelRemarkTextarea,
      'Click Yes button to cancel appointment'
    );
    await page.click(Appointments.AppointmentCancelBookingButton);
    await expect(page.getByText('Please enter a remark before cancelling.')).toBeVisible();
    await page.fill(Appointments.AppointmentCancelRemarkTextarea, Cancel_Remark);
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelBookingButton,
      Appointments.AppointmentCancelSuccessToast,
      'Confirm cancellation'
    );
    await expect(page.getByText(/Booking cancelled successfully!/)).toBeVisible();
  });

  await test.step('Verify appointment is cancelled', async () => {  
    await expect(page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo))).toHaveText('Cancelled');
    const appointmentStatusLocator = page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo));
    const appointmentStatus = await appointmentStatusLocator.textContent();
    console.log('Appointment Status:', appointmentStatus);
    await expect(appointmentStatusLocator).toHaveText('Cancelled');

    await expect(page.locator(Appointments.AppointmentStatusCellByAppointmentNo(appointmentNo))).toHaveText('Cancelled');
    await expect(page.locator(Appointments.AppointmentCancelRemarkCellByAppointmentNo(appointmentNo))).toHaveText(Cancel_Remark);
    page.close();
  });
});