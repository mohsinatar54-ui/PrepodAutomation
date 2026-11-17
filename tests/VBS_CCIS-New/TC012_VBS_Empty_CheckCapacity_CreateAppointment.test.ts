import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, Createfile, writeTestArtifact, readTestArtifact, setBookingTypeCapacity, SelectVehicleType, selectEntityAndSite } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { Master, Appointments } from 'Locators/All locators/VBSMasters';

  const DepotSizeType = '20 STD';
  const ISOSizeType = '22G1';
  const TotalContainers = '5';
  const bookingType = 'Empty';
  const Operator = 'MAERSK INDIA PVT LTD';
  // const transporter = 'ADITYA LOGISTICS';
  const transporter = 'MMJ LOGISTICS';
  const Gate_Name = 'GATE 1';
  const Service = 'Drop Off';

const bookingNo = readTestArtifact('VBS_Empty_BookingNumber.txt');

test('TC012_VBS_Empty_CheckCapacity_CreateAppointment', async ({ page }) => {
  // test.setTimeout(120_000); // 2 minutes timeout for this test
  test.setTimeout(120000); // Set timeout to 2 minutes

  await test.step('Login and navigate to Shipping Line Master', async () => {
      await login(page);
      await selectEntityAndSite(page);    
      await page.locator(Master.VBS_Microservice).click();
      await SelectVehicleType(page, 'Truck');
    });
    
  // await login(page)

  await test.step('Set booking type capacity to 0 and attempt to create appointment', async () => {
    await setBookingTypeCapacity(page, bookingType, '0');
    });

    
  await test.step('Attempt to create appointment with booking type capacity set to 0', async () => {
    // Click on the Appointments menu (should already be at /vbs/appointments from the tile)
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');
  
    // Open transporter dropdown and pick 2nd option
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
    await expect(page.getByText(`Cannot create appointment. Booking type 'EMTY' has no capacity configured. Please set capacity for this booking type before creating appointments.`)).toBeVisible();
  });

  await test.step('Set booking type capacity to 10', async () => {
    await setBookingTypeCapacity(page, bookingType, '10');
  });
  page.close();
});
