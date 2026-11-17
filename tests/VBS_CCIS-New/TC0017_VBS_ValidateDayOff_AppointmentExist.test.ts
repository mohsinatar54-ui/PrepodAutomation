import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite,SelectVehicleType, readTestArtifact, Createfile } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
import { Master, Appointments } from 'Locators/All locators/VBSMasters';
// import { appointmentNo, bookingNo, Cancel_Remark } from './TC016_VBS_Export_CreateAppointment.test';

const bookingNo = readTestArtifact('VBS_ExportBooking_BookingNumber.txt')
const Cancel_Remark = 'Cancelling appointment with Automation script';
const bookingType = 'Export';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
let appointmentNo = '';
const ApptDate = 1;

test('TC0017_VBS_ValidateDayOff_AppointmentExist', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
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
  await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(ApptDate).date}`, { delay: 200 });
  await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
  await page.click(Appointments.FirstCheckbox);
// Click Submit button
  await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');
  });

await test.step('Create, validate, and delete Day Off', async () => {
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.DayOffTab, 'Click Vehicle Masters');

  await clickAndMeasureDynamic(page, Master.DayOffTab, Master.DescriptionDayOff, 'Route to Day Off screen');
  await page.locator(Master.DescriptionDayOff).fill('Automation Test Day Off');

  // Get tomorrow's date in dd-mm-yyyy format
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + ApptDate);
  const pad = (num: number) => String(num).padStart(2, '0');
  const tomorrow_ddmmyyyy = `${pad(tomorrowDate.getDate())}-${pad(tomorrowDate.getMonth() + 1)}-${tomorrowDate.getFullYear()}`;
  console.log('tomorrow_ddmmyyyy: ', tomorrow_ddmmyyyy);
  // Get tomorrow's date in "25 Dec 2025" format
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tomorrow_ddMmmYYYY = `${pad(tomorrowDate.getDate())} ${monthsShort[tomorrowDate.getMonth()]} ${tomorrowDate.getFullYear()}`;
  console.log('tomorrow_ddMmmYYYY: ', tomorrow_ddMmmYYYY);
  // Get weekday for tomorrow's date (e.g. "Monday")
  const tomorrow_weekday = tomorrowDate.toLocaleDateString('en-US', { weekday: 'long' });
  console.log('tomorrow_weekday: ', tomorrow_weekday);

  const [day, month, year] = tomorrow_ddmmyyyy.split('-');
  const tomorrow_ddMmmYYYY_formatted = `${parseInt(day)} ${monthsShort[parseInt(month) - 1]} ${year}`;

  
  await page.locator(Master.StartDateDayOff).type(tomorrow_ddmmyyyy);
  await expect(page.locator(Master.DayDayOff)).toBeVisible();

  await page.locator(Master.SubmitDayOff).click();
  await expect(page.getByText(`Cannot create day off. Appointments exist at ${tomorrow_ddMmmYYYY}.`)).toBeVisible();
  
  await test.step('Cancel the created appointment', async () => {
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    await writeTestArtifact('VBS_Export_Appointment_Number', appointmentNo);

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
  await page.close();
  console.log('Browser closed successfully');
  console.log('TC0017_VBS_ValidateDayOff_AppointmentExist completed successfully');
  });
});
