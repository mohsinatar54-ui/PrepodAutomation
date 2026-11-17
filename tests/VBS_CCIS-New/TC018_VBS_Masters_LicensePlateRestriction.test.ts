import { test, expect } from '@playwright/test';
import { Appointments, Master } from 'Locators/All locators/VBSMasters';
// import { login, selectEntityAndSite, SelectVehicleType, clickAndMeasureDynamic, readTestArtifact, getNextDateTimeFormatted } from 'utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';

const bookingType = 'Import';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
const transporterName = 'MMJ LOGISTICS (MMJ001)';
const ApptTransporterName = 'MMJ LOGISTICS';
const licensePlateNumber = 'AT' + getRandomNumberString(5); // Generate a random 5-digit number for license plate
// const TruckNumber = 'MH' + getRandomNumberString(6);
const bookingNo = readTestArtifact('VBSImport_BookingNumber.txt');
const containerNo = readTestArtifact('VBSImport_ContainerNumber.txt');

test('TC018_VBS_Masters_LicensePlateRestriction', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes

  await test.step('Login and navigate to Shipping Line Master', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.LicensePlateRestrictionTab, 'Navigate to Master');
    await clickAndMeasureDynamic(page, Master.LicensePlateRestrictionTab, Master.AddNew_LPR, 'Navigate to License Plate Restriction Master');
  });
  
  await test.step('Validate correct validation for field not filled', async () => {
    await page.locator(Master.AddNew_LPR).click();
    // await page.click(Master.SaveIcon_LPR);
    await page.locator(Master.SaveIcon_LPR).click();
    await expect(page.getByText('Please select a Transporter')).toBeVisible();
    await page.getByText('Please select a Transporter').click();
    await page.locator('select').nth(1).selectOption({ label: transporterName });
    await page.locator(Master.SaveIcon_LPR).click();
    await expect(page.getByText('Please enter at least one License Plate Number')).toBeVisible();
  });

  await test.step('Add License Plate Restriction', async () => {
    await page.locator(Master.LicensePlate_Input_LPR).fill(licensePlateNumber);
    await page.locator(Master.SaveIcon_LPR).click();
    await expect(page.locator('div').filter({ hasText: /^License Plate Restrictions saved successfully$/ })).toBeVisible();
    await expect(page.locator(Master.ValidateLPAdd(transporterName, licensePlateNumber))).toBeVisible();
  });

  await test.step('Create Import Appointment with Restricted License Plate', async () => {
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');
    
    // Open transporter dropdown and pick by label
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${ApptTransporterName}` });

    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');

    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

    await page.fill(Appointments.TruckNumberInput, licensePlateNumber); // Use the restricted license plate number

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
    await expect(page.locator('span').filter({ hasText: new RegExp(`^Truck number '${licensePlateNumber}' is restricted for this transporter at this site. This license plate is not allowed to create appointments.$`) })).toBeVisible()
  });
  
  await test.step('Check duplicate License Plate Restriction', async () => {
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.LicensePlateRestrictionTab, 'Navigate to Master');
    await clickAndMeasureDynamic(page, Master.LicensePlateRestrictionTab, Master.AddNew_LPR, 'Navigate to License Plate Restriction Master');
    await page.locator(Master.AddNew_LPR).click();
    await page.locator(Master.LicensePlate_Input_LPR).fill(licensePlateNumber);
    await page.locator('select').nth(1).selectOption({ label: transporterName });
    page.pause();
    await page.locator(Master.SaveIcon_LPR).click();
    await expect(page.getByText('The fields license_no, SiteID must make a unique set.')).toBeVisible();
    // await expect(page.locator(`//span[normalize-space()="Truck number '${licensePlateNumber}' is restricted for this transporter at this site. This license plate is not allowed to create appointments."]`)).toBeVisible()
    // await expect(page.locator('div').filter({ hasText: /^No license plates to deactivate$/ })).toBeVisible();
  });

  await test.step('Deactivate License Plate Restriction', async () => {    
  await page.locator(`//i[@class='fas fa-times text-red-600 cursor-pointer text-lg hover:text-red-800']`).click();
  const message = await page.locator('span.confirm-box-message').textContent();

  const plate = await page.locator(Master.GetPlateNumber(transporterName)).textContent();
  // Normalize text (remove extra spaces)
  const normalizedText = plate?.trim() || '';
  await page.locator(Master.EditLPR(transporterName)).click();
  await page.getByRole('button', { name: 'Deactivate all' }).click();
  if (normalizedText.includes(',')) {
    // Multiple values
    await expect(
      page.locator('div').filter({ hasText: /^All license plates deactivated$/ })
    ).toBeVisible();
  } else {
    // Single value
    await expect(
      page.locator('div').filter({ hasText: /^License plate deactivated$/ })
    ).toBeVisible();
  }
  // await expect(page.locator('div').filter({ hasText: /^All license plates deactivated$/ })).toBeVisible();
    await page.waitForTimeout(2000);
    await expect(page.locator(Master.ValidateLPAdd(transporterName, licensePlateNumber))).not.toBeVisible();
  });
  await test.step('Add Deactivated License Plate Restriction', async () => {
    await page.locator(Master.AddNew_LPR).click();
    await page.locator(Master.LicensePlate_Input_LPR).fill(licensePlateNumber);
    await page.locator('select').nth(1).selectOption({ label: transporterName });
    await page.locator(Master.SaveIcon_LPR).click();
    await expect(page.locator('div').filter({ hasText: /^The fields license_no, SiteID must make a unique set\.$/ })).toBeVisible()
    // await expect(page.locator('div').filter({ hasText: /^No license plates to deactivate$/ })).toBeVisible();
  });
  await page.close();
  console.log('TC017_VBS_Masters_LicensePlateRestriction completed successfully');
});