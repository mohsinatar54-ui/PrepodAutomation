import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact,writeTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite, selectFutureDay } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments} from 'Locators/All locators/VBSMasters';

const ApptDate = 2;
const bookingType = 'Import';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
const Cancel_Remark = 'Cancelling appointment with Automation script';

// const artifactsDir = path.resolve(__dirname, '../test-artifacts');
// const artifactsDir = 'test-artifacts';
// const bookingNoFilePath = `${artifactsDir}/VBS_Import_Booking_Number.txt`;
  let appointmentNo = '';
  const bookingNo = readTestArtifact('VBSImport_BookingNumber.txt');

test('TC001_VBS_Masters_DayOff', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Login and select entity/site', async () => 
  {
    await login(page);
    await selectEntityAndSite(page);
  });


  await test.step('Navigate to Day Off screen', async () => {
    // await clickAndMeasureDynamic(page, Master.VBS_Microservice, Master.MastersTab, 'Click VBS tile');
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.DayOffTab, 'Click Vehicle Masters');
    await clickAndMeasureDynamic(page, Master.DayOffTab, Master.DescriptionDayOff, 'Route to Day Off screen');
    await page.locator(Master.DescriptionDayOff).fill('Automation Test Day Off');
  });

  let tomorrow_ddmmyyyy: string;
  let tomorrow_ddMmmYYYY: string;
  let tomorrow_weekday: string;

  await test.step('Calculate tomorrow\'s date formats', async () => {
    // Get tomorrow's date in dd-mm-yyyy format
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + ApptDate);
    const pad = (num: number) => String(num).padStart(2, '0');
    tomorrow_ddmmyyyy = `${pad(tomorrowDate.getDate())}-${pad(tomorrowDate.getMonth() + 1)}-${tomorrowDate.getFullYear()}`;
    console.log('tomorrow_ddmmyyyy: ', tomorrow_ddmmyyyy);
    // Get tomorrow's date in "25 Dec 2025" format
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    tomorrow_ddMmmYYYY = `${pad(tomorrowDate.getDate())} ${monthsShort[tomorrowDate.getMonth()]} ${tomorrowDate.getFullYear()}`;
    console.log('tomorrow_ddMmmYYYY: ', tomorrow_ddMmmYYYY);
    // Get weekday for tomorrow's date (e.g. "Monday")
    tomorrow_weekday = tomorrowDate.toLocaleDateString('en-US', { weekday: 'long' });
    console.log('tomorrow_weekday: ', tomorrow_weekday);
  });
  await test.step('Create Day Off', async () => {
    await page.locator(Master.StartDateDayOff).type(tomorrow_ddmmyyyy);
    await expect(page.locator(Master.DayDayOff)).toBeVisible();
    await clickAndMeasureDynamic(page, Master.SubmitDayOff, '//table//tr[1]//td[1]', 'Save Day Off');
  });

  // await test.step('Login and Route to Appointments', async () => {
  //   await login(page);
  //   await selectEntityAndSite(page);    
  //   await page.locator(Master.VBS_Microservice).click();
  //   await SelectVehicleType(page, 'Truck');
  //   await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  //   });
  await test.step('Fill details and Create Appointment', async () => {
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
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
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(2).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    await expect(page.locator('span', { hasText: 'Day off. Please select another date!' })).toBeVisible();
    // await expect(page.getByText('Day off. Please select another date!')).toBeVisible();
    await page.close();});
  });