import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,selectEntityAndSite, getRandomNumberString, readTestArtifact, writeTestArtifact} from '../../utils/test-helpers';
import {SelectVehicleType,setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments } from 'Locators/VBSMasters';

const bookingType = 'Empty';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
const Cancel_Remark = 'Cancelling appointment with Automation script';

test('TC013_VBS_Empty_CreateAppointment', async ({ page }) => {
  let appointmentNo = '';
  test.setTimeout(120000); // Set timeout to 2 minutes

  let bookingNo: string;
  await test.step('Read booking number from artifact', async () => {
    bookingNo = readTestArtifact('VBS_Empty_BookingNumber.txt');
  });

  await test.step('Login and Route to Appointments', async () => {
      await login(page);
      await selectEntityAndSite(page);    
      await page.locator(Master.VBS_Microservice).click();
      await SelectVehicleType(page, 'Truck');
      await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });

  await test.step('Fill appointment form', async () => {
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });
    await page.fill(Appointments.DriverNameInput, 'Automation Test');
    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));
    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));
    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));
    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
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

    await writeTestArtifact('VBS_Empty_Appointment_Number.txt', appointmentNo);

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
  // page.close();
});
