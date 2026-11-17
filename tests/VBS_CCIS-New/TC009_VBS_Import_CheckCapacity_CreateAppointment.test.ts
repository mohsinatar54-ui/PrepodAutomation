import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments } from 'Locators/All locators/VBSMasters';
import { getTomorrowDateFormats, SelectVehicleType, setBookingTypeCapacity,Createfile } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite,readTestArtifact } from '../../utils/test-helpers';

const bookingType = 'Import';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';

// const artifactsDir = path.resolve(__dirname, '../test-artifacts');
// const bookingNoFilePath = `${artifactsDir}/VBS_Import_Booking_Number.txt`;

const bookingNo = readTestArtifact('VBSImport_BookingNumber.txt');

test('TC009_VBS_Import_CheckCapacity_CreateAppointment', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
  // await login(page);

  // await clickAndMeasureDynamic(page, '//img[@alt="Vehicle Booking System Logo"]', '//button[normalize-space()="Appointments"]', 'Click VBS tile');
  await test.step('Login and navigate to Shipping Line Master', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
  });
  
  
  await test.step('Set booking type capacity to 0 and attempt to create appointment', async () => {
  await setBookingTypeCapacity(page, bookingType, '0');
  });

  // const bookingNo = readTestArtifact('VBS_Import_Booking_Number.txt');
  
  await test.step('Attempt to create appointment with booking type capacity set to 0', async () => {
    // Click on the Appointments menu (should already be at /vbs/appointments from the tile)
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');
  
    // Open transporter dropdown and pick 2nd option
    // await page.locator(Appointments.TransporterDropdown).selectOption({ index: 2 });
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });
    // await page.click('//select[@name="transporter"]//option[2]');
  
    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');
  
    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));
  
    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));

    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));
  
    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });
  
    // Fill booking number
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    // await page.waitForTimeout(2000);
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
  
    // Click on the first checkbox (could be terms or agree)
    await page.click(Appointments.FirstCheckbox);

    await page.click(Appointments.SaveAppointmentButton);
    await expect(page.getByText(`Cannot create appointment. Booking type 'IMPORT' has no capacity configured. Please set capacity for this booking type before creating appointments.`)).toBeVisible();
  });

  await test.step('Set booking type capacity to 10', async () => {
    await setBookingTypeCapacity(page, bookingType, '10');
  });
  page.close();

});
