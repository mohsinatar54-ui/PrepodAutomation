import { test, expect } from '@playwright/test';
import { Master } from 'Locators/All locators/VBSMasters';
// import { login, selectEntityAndSite, SelectVehicleType, clickAndMeasureDynamic } from 'utils/test-helpers_VBS_CCIS';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';

  const Gate_Name = 'GATE 1'; // This is the name of the gate to be selected for operating hours\
  const Appointment_Duration = '60';
  const Appointment_Perslot = '10';
  const Day = 'Monday';
  const Start_Time = '10:00';
  const Stop_Time = '17:00';

  const fillGateOperatingHourFields = async (
    page: any,
    duration: string,
    perSlot: string
  ) => {
    await page.locator(Master.Appt_DurationInput_Edit).clear();
    await page.locator(Master.Appt_SlotInput_Edit).clear();
    // await page.locator(Master.SlotCapacity_GateOpHrs).fill('');
    await page.locator(Master.Appt_DurationInput_Edit).fill(duration);
    await page.locator(Master.Appt_SlotInput_Edit).fill(perSlot);
  };

test('TC004_VBS_Masters_GateOperatingHours', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes

  await test.step('Login and select entity/site', async () => {
    await login(page);
    await selectEntityAndSite(page);    
  });

  await test.step('Navigate to Gate Operating Hours', async () => {
    // await clickAndMeasureDynamic(page, Master.VBS_Microservice, Master.MastersTab, 'Click VBS tile');
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.GateTab, 'Click Vehicle Masters');
    await clickAndMeasureDynamic(page, Master.GateOperatingHoursTab, Master.GateNamesDropdown_GateOpHrs, 'Route to Gate Operating Hours');
  });

    await test.step('Fill all details and add Gate', async () => {
      // Select gate from ng-select
      await page.locator('ng-select[name="gateNames"] .ng-input input').fill(Gate_Name);
      await page.locator(`.ng-dropdown-panel .ng-option`).filter({ hasText: Gate_Name }).first().click();

      // Fill duration
      await page.locator('input[name="slotDuration"]').fill(Appointment_Duration);
      // Fill slot capacity
      await page.locator('input[name="slotCapacity"]').fill(Appointment_Perslot);

      // Select day from ng-select
      await page.locator('ng-select[name="daysOfWeek"] .ng-input input').fill(Day);
      await page.locator(`.ng-dropdown-panel .ng-option`).filter({ hasText: Day }).click();

      // Fill start and end time
      await page.locator('input[name="startTime"]').fill(Start_Time);
      await page.locator('input[name="endTime"]').fill(Stop_Time);

      // Click Add gate button
      await page.locator('button', { hasText: 'Add gate' }).click();
      // Optionally, assert for success or error message if needed
    });
  
  await test.step('Validate Appointment Duration cannot be negative and Appointment Per Slot cannot be 0', async () => {
    await page.locator('i.fa-pen-to-square').first().click();
    await fillGateOperatingHourFields(page, '-30', '10');
    await page.locator('i.fa-check').first().click();
    await expect(page.getByText('Slot Duration must be positive and Slot Capacity must be non-negative')).toBeVisible();

    await fillGateOperatingHourFields(page, '0', '10');
    await page.locator('i.fa-check').first().click();
    await expect(page.getByText('Slot Duration must be a positive whole number')).toBeVisible();

    await fillGateOperatingHourFields(page, '60', '-10');
    await page.locator('i.fa-check').first().click();
    await expect(page.getByText('Slot Duration must be positive and Slot Capacity must be non-negative')).toBeVisible();

    await page.locator('i.fa-times').first().click();
  });
  await test.step('Configure gate operating hours', async () => {
    await page.locator(Master.GateNamesDropdown_GateOpHrs).click();
    await page.locator(Master.GateNamesOption_GateOpHrs(Gate_Name)).click();
    await page.locator(Master.SlotDuration_GateOpHrs).fill(Appointment_Duration);
    await page.locator(Master.SlotCapacity_GateOpHrs).fill(Appointment_Perslot);
    await page.locator(Master.DaysOfWeekDropdown_GateOpHrs).click();
    await page.locator(Master.DaysOfWeekOption_GateOpHrs(Day)).click();
    await page.locator(Master.StartTime_GateOpHrs).type(Start_Time, { delay: 100 });
    await page.locator(Master.EndTime_GateOpHrs).type(Stop_Time, { delay: 100 });
    await expect(page.locator(Master.CancelButton_GateOpHrs)).toBeVisible();
    await page.locator(Master.AddGateButton_GateOpHrs).click();
    await expect(page.locator(`//span[normalize-space()="${Gate_Name} is already configured for Monday"]`)).toBeVisible();
  });

  await test.step('Close page and log completion', async () => {
    page.close();
    console.log('TC004_VBS_Masters_GateOperatingHours completed successfully');
  });
});
