import { test, expect } from '@playwright/test';
import { Master } from 'Locators/VBSMasters';
// import { login, selectEntityAndSite, SelectVehicleType, clickAndMeasureDynamic } from 'utils/test-helpers_VBS_CCIS';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';

const shippingLineCode = '1112025';
const shippingLineName = '1112025';
const Capacity = `50`;
const Capacity2 = `60`;

test('TC007_VBS_Masters_ShippingLine_CCIS', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes

  await test.step('Login and navigate to Shipping Line Master', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.ShippingLineTab, 'Navigate to Master');
    await clickAndMeasureDynamic(page, Master.ShippingLineTab, Master.Edit_ShippingLine(shippingLineCode), 'Navigate to Shipping Line Master');
    });
    
    await test.step('Edit Shipping Line and verify changes', async () => {
    await page.locator(Master.Edit_ShippingLine(shippingLineCode)).click();
    await page.locator(Master.Checkbox_ShippingLine(shippingLineCode)).click();
    await page.locator(Master.CapacityInput_ShippingLine(shippingLineCode)).fill(Capacity);
    await page.locator(Master.Save_ShippingLine(shippingLineCode)).click();
    // await expect(page.locator('span', { hasText: 'Do you want to disable no time slot restriction for'})).toBeVisible();
    // await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.locator(Master.Cancel_ShippingLine(shippingLineCode))).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(Master.CapacityValue_ShippingLine(shippingLineCode))).toHaveText(Capacity);
    });
  
    await test.step('Edit Shipping Line again and verify changes', async () => {
    await page.locator(Master.Edit_ShippingLine(shippingLineCode)).click();
    await page.locator(Master.Checkbox_ShippingLine(shippingLineCode)).click();
    await page.locator(Master.CapacityInput_ShippingLine(shippingLineCode)).fill(Capacity2);
    await page.locator(Master.Save_ShippingLine(shippingLineCode)).click();
    // await expect(page.locator('span', { hasText: 'Do you want to disable no time slot restriction for'})).toBeVisible();
    // await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.locator(Master.SaveSuccess_ShippingLine(shippingLineCode))).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(Master.CapacityValue_ShippingLine(shippingLineCode))).toHaveText(Capacity2);
      });
    page.close();
  page.close();
  console.log('TC007_VBS_Masters_ShippingLine completed successfully');
});