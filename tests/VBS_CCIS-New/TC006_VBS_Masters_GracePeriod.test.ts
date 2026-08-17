import { test, expect } from '@playwright/test';
import { Master } from 'Locators/VBSMasters';
// import { login, selectEntityAndSite, SelectVehicleType, clickAndMeasureDynamic } from 'utils/test-helpers_VBS_CCIS';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';


const Gate_Name = 'GATE 2'; // This is the name of the gate to be selected for operating hours\

  const NegativeTest_GracePeriod = async (
    page: any,
    EarlyAccess: string,
    LateAccess: string
  ) => {
    await page.locator(Master.EditEarlyAccess(Gate_Name)).clear();
    await page.locator(Master.EditLateAccess(Gate_Name)).clear();
    await page.locator(Master.EditEarlyAccess(Gate_Name)).fill(EarlyAccess);
    await page.locator(Master.EditLateAccess(Gate_Name)).fill(LateAccess);
    await page.locator(Master.SaveIcon_GracePeriod).click();
  };

test('TC006_VBS_Masters_GracePeriod', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Login and navigate to Grace Period tab', async () => {
    await login(page);
    await selectEntityAndSite(page);    
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Master.MastersTab, Master.GracePeriodTab, 'Click Vehicle Masters');
    await clickAndMeasureDynamic(page, Master.GracePeriodTab, Master.GateNameDropdown_GracePeriod, 'Route to Gate Operating Hours');
  });

  await test.step('Add Grace Period for Gate', async () => {
    await page.locator(Master.GateNameDropdown_GracePeriod).click();
    await page.locator(Master.GateNameOption_GracePeriod(Gate_Name)).click();

    await page.locator(Master.ServiceTypeDropdown_GracePeriod).click();
    await page.locator(Master.ServiceTypeOption_GracePeriod('Drop off')).click();

    await page.locator(Master.EarlyAccessInput_GracePeriod).fill('10');
    await page.locator(Master.LateAccessInput_GracePeriod).fill('10');
    await expect(page.locator(Master.Cancel_GracePeriod)).toBeVisible();
    await clickAndMeasureDynamic(page, Master.Save_GracePeriod, Master.GracePeriodRowByGateName(Gate_Name), 'Click Add Grace Period button');
    console.log(`Grace period for ${Gate_Name} added successfully`);
  });

  await test.step('Validate that negative values are not accepted for Grace Period', async () => {
    await page.locator(Master.Edit_GracePeriod(Gate_Name)).click();
    await NegativeTest_GracePeriod(page, '-20', '30');
    await expect(page.getByText('Minutes cannot be negative.')).toBeVisible();

    await NegativeTest_GracePeriod(page, '30', '-20');
    await expect(page.getByText('Minutes cannot be negative.')).toBeVisible();

    await NegativeTest_GracePeriod(page, '40', '30');
    await expect(page.getByText('Early arrival minutes cannot exceed 30.')).toBeVisible();

    await NegativeTest_GracePeriod(page, '30', '40');
    await expect(page.getByText('Late arrival minutes cannot exceed 30.')).toBeVisible();

    await page.locator(Master.CancelIcon_GracePeriod).click();
  });

  await test.step('Edit Grace Period for Gate', async () => {
    await clickAndMeasureDynamic(page, Master.Edit_GracePeriod(Gate_Name), Master.EditEarlyAccess(Gate_Name), 'Click Edit Grace Period button');
    await page.locator(Master.EditEarlyAccess(Gate_Name)).clear();
    await page.locator(Master.EditEarlyAccess(Gate_Name)).fill('15');
    await page.locator(Master.EditLateAccess(Gate_Name)).clear();
    await page.locator(Master.EditLateAccess(Gate_Name)).fill('15');
    await expect(page.locator(Master.Cancel_GracePeriod)).toBeVisible();
    await clickAndMeasureDynamic(page, Master.SaveIcon_GracePeriod, Master.GracePeriodRowByGateName(Gate_Name), 'Click Save button');
    await expect(page.locator(Master.EarlyAccessValue(Gate_Name))).toHaveText('15');
    await expect(page.locator(Master.LateAccessValue(Gate_Name))).toHaveText('15');
    console.log(`Grace period for ${Gate_Name} edited successfully`);
  });

  await test.step('Delete Grace Period for Gate', async () => {
    await clickAndMeasureDynamic(page, Master.Delete_GracePeriod(Gate_Name), Master.ConfirmDelete_GracePeriod, 'Click Delete Grace Period button');
    await clickAndMeasureDynamic(page, Master.ConfirmDelete_GracePeriod, Master.GracePeriodDeleted_Toast, 'Click Yes button');
    await expect(page.locator(Master.GracePeriodDeleted_Toast)).toBeVisible();
    console.log(`Grace period for deleted successfully`);
    page.close();
    console.log('TC006_VBS_Masters_GracePeriod completed successfully');
  });

});