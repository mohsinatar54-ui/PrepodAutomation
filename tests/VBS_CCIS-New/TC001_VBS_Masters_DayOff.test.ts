import { test, expect } from '@playwright/test';
import { getTomorrowDateFormats, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString,selectEntityAndSite } from '../../utils/test-helpers';
import { Master } from 'Locators/All locators/VBSMasters';

const ApptDate = 1;

test('TC001_VBS_Masters_DayOff', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Login and select entity/site', async () => {
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

  await test.step('Validate Day Off creation', async () => {
    const dayOffDescription = await page.locator('//tr//td[normalize-space()="Automation Test Day Off"]');
    const dayOffDate = await page.locator('//tr//td[normalize-space()="Automation Test Day Off"]//following-sibling::td[1]');
    const dayOffWeekday = await page.locator('//tr//td[normalize-space()="Automation Test Day Off"]//following-sibling::td[2]');

    await expect(dayOffDescription).toHaveText('Automation Test Day Off');
    await expect(dayOffDate).toHaveText(tomorrow_ddMmmYYYY);
    await expect(dayOffWeekday).toHaveText(tomorrow_weekday);
    // await expect(page.locator('//table//tr[1]//td[1]')).toContainText('Automation Test Day Off');
    // await expect(page.locator('//table//tr[1]//td[2]')).toContainText(tomorrow_ddMmmYYYY);
    // await expect(page.locator('//table//tr[1]//td[3]')).toContainText(tomorrow_weekday);
    console.log('Day Off Created successfully');
  });

  await test.step('Delete Day Off', async () => {
    await clickAndMeasureDynamic(page, '//td[normalize-space()="Automation Test Day Off"]//following-sibling::td//i', '//div[@class="confirm-box delete"]', 'Click Confirm Delete button');
    // await clickAndMeasureDynamic(page, '(//div[@class="relative inline-block group"])[1]', '//div[@class="confirm-box delete"]', 'Click Delete button');
    // await clickAndMeasureDynamic(page, Master.DeleteDayOff, '//th[text()="Day Off Description"]', 'Click Confirm Delete button');
    await page.locator(Master.DeleteDayOff).click();
  });

  await test.step('Validate Day Off deletion', async () => {
    await expect(page.locator('//tr//td[normalize-space()="Automation Test Day Off"]')).not.toBeVisible();
    // await expect(page.locator('//table//tr[1]//td[3]')).not.toContainText(tomorrow_weekday);
    console.log('Day Off deleted successfully');
  });

  await test.step('Close browser', async () => {
    await page.close();
    console.log('Browser closed successfully');
    console.log('TC001_VBS_Masters_DayOff completed successfully');
  });

});
