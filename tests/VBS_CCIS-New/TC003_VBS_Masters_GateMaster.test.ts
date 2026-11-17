import { test, expect } from '@playwright/test';
import { Master } from 'Locators/All locators/VBSMasters';
// import { login, selectEntityAndSite, SelectVehicleType, clickAndMeasureDynamic } from 'utils/test-helpers_VBS_CCIS';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';

test('TC003_VBS_Masters_GateMaster', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Login and select entity/site', async () => {
    await login(page);
    await selectEntityAndSite(page);
  });

  await test.step('Navigate to VBS Microservice and select vehicle type', async () => {
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
  });

  await test.step('Navigate to Gate Masters', async () => {
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.GateTab, 'Click Vehicle Masters');
    await clickAndMeasureDynamic(page, Master.GateTab, Master.Edit_GateConfig, 'Route to Gate Masters');
  });

  await test.step('Set Gate Config to No and verify', async () => {
    await page.locator(Master.Edit_GateConfig).click();
    await page.locator(Master.Input_GateConfig).clear();
    await page.locator(Master.Input_GateConfig).fill('100');
    await page.locator(Master.Select_GateConfig_1).selectOption('No');
    await page.locator(Master.Select_GateConfig_2).selectOption('No');
    await clickAndMeasureDynamic(page, Master.SaveButton_GateConfig, Master.Edit_GateConfig, 'Click Save button');
    await expect(page.locator(Master.PickUpGateValue)).toHaveText('No');
    await expect(page.locator(Master.DropOffGateValue)).toHaveText('No');
  });

  await test.step('Set Gate Config to Yes and verify', async () => {
    await page.locator(Master.Edit_GateConfig).click();
    await page.locator(Master.Input_GateConfig).clear();
    await page.locator(Master.Input_GateConfig).fill('100');
    await page.locator(Master.Select_GateConfig_1).selectOption('Yes');
    await page.locator(Master.Select_GateConfig_2).selectOption('Yes');
    await clickAndMeasureDynamic(page, Master.SaveButton_GateConfig, Master.Edit_GateConfig, 'Click Save button');
    await expect(page.locator(Master.PickUpGateValue)).toHaveText('Yes');
    await expect(page.locator(Master.DropOffGateValue)).toHaveText('Yes');
  });

  await test.step('Close page and log completion', async () => {
    await page.close();
    console.log('TC003_VBS_Masters_GateMaster completed successfully');
  });
});
