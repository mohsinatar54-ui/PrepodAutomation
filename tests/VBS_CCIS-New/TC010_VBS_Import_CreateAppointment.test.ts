import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, Createfile, readTestArtifact } from '../../utils/test-helpers';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments } from 'Locators/VBSMasters';
import { getTomorrowDateFormats, SelectVehicleType, setBookingTypeCapacity,Createfile } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite,readTestArtifact } from '../../utils/test-helpers';

const bookingType = 'Import';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
const Cancel_Remark = 'Cancelling appointment with Automation script';

// const artifactsDir = path.resolve(__dirname, '../test-artifacts');
const artifactsDir = 'test-artifacts';
// const bookingNoFilePath = `${artifactsDir}/VBS_Import_Booking_Number.txt`;
// const containerNo = `${artifactsDir}/VBS_Import_Container_Number.txt`;

test('TC010_VBS_Import_CreateAppointment', async ({ page }) => {
  let appointmentNo = '';
  const bookingNo = readTestArtifact('VBSImport_BookingNumber.txt');
  const containerNo = readTestArtifact('VBSImport_ContainerNumber.txt');
  await test.step('Login and Route to Appointments', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });

  await test.step('Fill details and Create Appointment', async () => {
    for (let i = 1; i <= 2; i++) {
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
      // await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');

      await page.locator(Appointments.SaveAppointmentButton).click();

      // Put if condition after every iteration
      if (i === 1) {
      await expect(page.locator(Appointments.AppointmentViewLink)).toBeVisible();
      } else if (i === 2) {
      // await expect(page.getByText(`Container ${containerNo} already has an appointment.`)).toBeVisible();
      await expect(page.locator('div').filter({ hasText: new RegExp(`^Container '${containerNo}' already has an appointment\\.$`) })).toBeVisible();
      }
    }
    // await page.locator(Appointments.Cancelbutton).click(); // Close the Create Appointment form
    await page.getByRole('button', { name: 'Cancel' }).click();
  });
  await test.step('Cancel the created appointment', async () => {
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    Createfile('VBS_Import_Appointment_Number', appointmentNo);

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
  page.close();

});
