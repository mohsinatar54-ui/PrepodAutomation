import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact,writeTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite, selectFutureDay } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments} from 'Locators/VBSMasters';


const Cancel_Remark = 'Cancelling appointment with Automation script';


test('TC023_VBS_BulkCancellation_ExpiredCancelled', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Login and Route to Appointments', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });
  // page.pause();
  await test.step('Find Expired and Cancelled Appointments and select checkboxes', async () => {
    await page.locator('select[name="Status"]').selectOption('Expired');
    const expiredAppointment = await page.locator("(//tr[.//span[normalize-space()='Expired']]//a[contains(@href,'/appointment/view')])[1]").textContent();
    console.log('Expired Appointment:', expiredAppointment);
    await page.locator(
  `//tr[.//a[normalize-space()='${expiredAppointment?.trim()}'] and .//span[normalize-space()='Expired']]//input[@type='checkbox']`).check();  

    // Find the row with Cancelled status
    await page.locator('select[name="Status"]').selectOption('Cancelled');
    const cancelledAppointment = (await page.locator("(//tr[.//span[normalize-space()='Cancelled']]//a[contains(@href,'/appointment/view')])[1]").textContent())?.replace(/\s+/g, '');
    console.log('Cancelled Appointment:', cancelledAppointment);
    await page.locator(`//tr[.//a[normalize-space()='${cancelledAppointment?.trim()}'] and .//span[normalize-space()='Cancelled']]//input[@type='checkbox']`).check();

    // Click the Cancel button
    await page.locator(Appointments.CancelBulkBooking).click();
    await expect(page.locator(`//span[normalize-space()="The following appointments are already cancelled: ${cancelledAppointment}. They cannot be cancelled and have been removed from selection."]`)).toBeVisible();
    await expect(page.getByText('Are you sure you want to cancel all selected appointments?')).toBeVisible();
    await page.locator('//button[normalize-space()="No"]').isVisible;
    await page.locator('//button[normalize-space()="Yes"]').click();
    await page.fill(Appointments.AppointmentCancelRemarkTextarea, Cancel_Remark);
    await page.locator(Appointments.AppointmentCancelAppointmentsButton).click();
    await expect(page.getByText(/Appointments cancelled successfully!/)).toBeVisible();
  });  
  page.close();
});