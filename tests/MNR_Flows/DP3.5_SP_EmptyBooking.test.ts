import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, waitForPageLoad } from 'utils/test-helpers';

const URL_8030 = 'http://172.16.23.54:8030/Account/Login';
const USERNAME_8030 = 'appadmin@logstarerp.com';
const PASSWORD_8030 = 'StarLog@2024';

const OPERATOR_NAME = 'MMJ Logistics';
const EMPTY_JOB_TYPE = 'Empty Container In from Port (EITP)';
const DEPOT_SIZE_TYPE = '20 STD';
const ISO_SIZE_TYPE = '22G1';
const TOTAL_CONTAINERS = '5';
const TRANSPORTER = 'CMA CGM';
const MAX_WEIGHT = '15000';
const GRADE = 'Grade-A Container';
const SURVEY_REMARK = 'Condition OK';
const PORT_NAME = 'CCTL';
const DAMAGE_DETAILS = 'Not Much';
const EIR = '2486';
const DEPOT_QUALITY_CODE = 'BUBBLE LINER';
const DEPOT_CONDITION_CODE = 'A-Available';
const PORT_OUT_DATE = '26 Nov 2025 11:00';
const OPERATOR_CONDITION_CODE = 'NON-DAMAGE';

async function loginToDP8030Application(page: any) {
  await page.goto(URL_8030);
  // await page.setViewportSize({ width: 1920, height: 1080 });
  await page.locator('//input[@id="Email"]').fill(USERNAME_8030);
  await page.locator('//input[@id="Password"]').fill(PASSWORD_8030);
  // await page.locator('//input[@id="btnSubmit"]').click();
  await clickAndMeasureDynamic(page, '//input[@id="btnSubmit"]', '//span[text()="Home"]', 'Login to DP 8030 Application');
  await waitForPageLoad(page, '//span[text()="Home"]');
}

async function searchAndRouteToFeature(page: any, feature: string) {
  // If the search box is not visible, click the menu toggle to reveal it
  if (!(await page.locator('//input[@placeholder="Search..."]').isVisible())) {
    await page.locator('//a[@data-toggle="offcanvas"]').click();
  }
  // await page.locator('//a[@data-toggle="offcanvas"]').click();
  // await page.locator('//input[@placeholder="Search..."]').click();
  await page.locator('//input[@placeholder="Search..."]').fill(feature);
  // await page.locator(`//a//span[text()='${feature}']`).click();
  // await clickAndMeasureDynamic(page, `//a//span[text()='${feature}']`, `//span[text()='${feature}' and @class="panel-title"]`, `Route to ${feature}`);
  await clickAndMeasureDynamic(page, `//a//span[text()='${feature}']`, '(//div[@class="panel-heading"])[1]', `Route to ${feature}`);
}

async function setupAlertHandler(page: any) {
  page.on('dialog', async (dialog: any) => {
    console.log(`Alert detected: ${dialog.message()}`);
    await dialog.accept();
  });
}

function generateRandomReferenceBookingNumber(): string {
  const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
  return `BkRefNo${randomNumbers}`;
}


function generateContainerNumber(prefix: string, length: number): string {
  const randomNumber = Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
  return `${prefix}${randomNumber}`;
}

/**
 * Generate And Input Vehicle Number
 * Converted from: Generate And Input Vehicle Number
 */
function generateVehicleNumber(prefix: string): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}${randomDigits}`;
}

/**
 * Get current date formatted as dd-mm-yyyy
 */
function getCurrentDateFormatted(incrementDays: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + incrementDays);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Get current time formatted as HH:mm
 */
function getCurrentTimeFormatted(): string {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}


test.describe.parallel('Load Test', () => {
  for (let i = 1; i <= 1; i++) {
    test(`DP3.5_SP_EmptyBooking_${i}`, async ({ page }) => {
      test.setTimeout(300_000); // 5 minutes timeout for this test
      await login(page);
    
      await clickAndMeasureDynamic(page, '//input[@id="btnSubmit"]', '//span[text()="Home"]', 'Login to DP 8030 Application');
      await waitForPageLoad(page, '//span[text()="Home"]');
      
      await searchAndRouteToFeature(page, 'Manual Empty Bookings');
      await clickAndMeasureDynamic(page, '//button[@ng-click="NewEmptyBooking()"]', '//input[@id="OperatorName"]', 'Create New Empty Booking');
    
      await clickAndMeasureDynamic(page, '//input[@id="OperatorName"]', '//input[@id="OperatorName"]', 'Fill Operator Name');
      await page.waitForTimeout(5000);
      await page.locator('//input[@id="OperatorName"]').type(OPERATOR_NAME);
      await page.waitForTimeout(5000);
      await page.locator('(//li[@role="option"])[1]').click();
    
      await page.locator("//select[@ng-model='model.JobActID']").selectOption(`${EMPTY_JOB_TYPE}`);
      await page.waitForTimeout(2000);
      
      const currentDate = getCurrentDateFormatted(1);
      const currentTime = getCurrentTimeFormatted();
      await page.locator('//input[@ng-model="model.PlanDate"]').type(currentDate);
      await page.keyboard.press('ArrowRight');
      await page.keyboard.type(currentTime);
    
      const bookingReferenceNo = generateRandomReferenceBookingNumber();
      await page.locator('//input[@ng-model="model.BookingRefrenecNumber"]').fill(bookingReferenceNo);
    
      await clickAndMeasureDynamic(page, '//button[@id="btnUpdate"]', '//span[text()="Add Sub Booking"]', 'Update Empty Booking');
      await clickAndMeasureDynamic(page, '//span[text()="Add Sub Booking"]', '//select[@ng-model="model.DepCOSztyID"]', 'Add Sub Booking');
      await page.locator('//select[@ng-model="model.DepCOSztyID"]').selectOption(DEPOT_SIZE_TYPE);
      await page.locator('#txttotalBookingcontainer').fill(TOTAL_CONTAINERS);
      await clickAndMeasureDynamic(page, '//a[text()="Update"]', '//tbody[@role="rowgroup"]//tr', 'Update - Sub Booking');
      await clickAndMeasureDynamic(page, '//div[@data-role="tabstrip"]//span[text()="Container"]', '//span[text()="Add Container"]', 'Route to Container tab');
      await clickAndMeasureDynamic(page, '//span[text()="Add Container"]', '//select[@ng-model="coModel.DepCOSztyID"]', 'Container Tab - Click Add Container');
      await page.locator('//select[@ng-model="coModel.DepCOSztyID"]').selectOption(DEPOT_SIZE_TYPE);
      await page.locator('//select[@ng-model="coModel.ISOSizeType"]').selectOption(ISO_SIZE_TYPE);
    
      const containerNumber = generateContainerNumber('CNTU', 7);
      await page.locator('//textarea[@name="ContainerNo"]').fill(containerNumber);
      // await clickAndMeasureDynamic(page, '//a[text()="Update"]', '//button[@id="btnYesAddContainerDetails"]', 'Invalid ISO container number validation pop up');
      await page.locator('//a[text()="Update"]').click();
      if (await page.locator('//button[@id="btnYesAddContainerDetails"]').isVisible()) {
        await clickAndMeasureDynamic(page, '//button[@id="btnYesAddContainerDetails"]', '//div[@id="EmptyContainer"]', 'Submit Container Details');
      }
    
      await searchAndRouteToFeature(page, 'ALL');
      // const containerNumber = 'CNTU5289985';
      await clickAndMeasureDynamic(page, '//li[@role="tab"]//span[text()="Container"]', '//input[@id="JobTypeNo"]', 'Route to Container Tab');
      await page.waitForTimeout(2000);
      // await page.locator('//input[@id="JobTypeNo"]').click();
      await page.locator('//input[@id="JobTypeNo"]').type(containerNumber);
      await page.locator(`//li[text()='${containerNumber}']`).click();
      // await page.waitForTimeout(2000);
      // await page.keyboard.press('ArrowDown');
      // await page.keyboard.press('Enter');
      await clickAndMeasureDynamic(page, '//button[@ng-click="SearchJobType(JobTypeNo)"]', `//td[@role="gridcell"]//span[text()='${containerNumber}']`, `Search Container number ${containerNumber}`);
    
      await page.locator("//b[text()='Action']").first().click();
    
      await page.waitForSelector("//span[text()='Edit']");
    
      await clickAndMeasureDynamic(page, "//span[text()='Edit']", '(//input[@ng-model="model.TModNo"])[1]', 'Gate Screen - Edit Gate Container');
      
      const truckNumber = generateVehicleNumber('MHAD');
      // await page.locator('//input[@ng-model="model.TModNo"]').fill(truckNumber);
      await page.getByLabel('Vehicle No.*').first().fill(truckNumber);
      // await page.locator('(//select[@ng-model="model.TModTransportID"])[1]').selectOption('//select[@ng-model="model.TModTransportID"]//option[@label])[1]');
      await page.getByLabel('Transporter').first().selectOption({ index: 1 });
      await page.locator('//input[@ng-model="model.Capacity"]').fill(MAX_WEIGHT);
      await page.locator('//input[@ng-model="model.Damage"]').fill(DAMAGE_DETAILS);
      await page.getByLabel('Port Name And Threshold Limit *').selectOption({ index: 1 });
      await page.locator('//select[@ng-model="model.RemarkID"]').selectOption(SURVEY_REMARK);
      await page.locator('//select[@ng-model="model.PortName"]').selectOption({ index: 1 });
    
      // Generate date/time in format "26 Nov 2025 11:00"
      const now = new Date();
      const desiredMonthIndex = 10; // 0-based: 10 = November
      // Set to November, keeping the current date and time
      now.setMonth(desiredMonthIndex);
      const day = String(now.getDate() - 1).padStart(2, '0');
      const month = now.toLocaleString('en-US', { month: 'short' });
      const year = now.getFullYear();
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const portOutDateTime = `${day} ${month} ${year} ${hour}:${minute}`;
    
      // Generate date +1 in format "26 Nov 2025 11:00" in IST
      
      console.log(`Port Out Date Time: ${portOutDateTime}`);
      await page.locator('//input[@name="PortOutDateTimeName"]').type(day, { delay: 100 });
      await page.keyboard.press('ArrowRight');
      await page.keyboard.type(month, { delay: 100 });
      await page.keyboard.press('ArrowRight');
      await page.keyboard.type(String(year), { delay: 100 });
      await page.keyboard.press('ArrowRight');
      await page.keyboard.type(hour, { delay: 100 });
      await page.keyboard.press('ArrowRight');
      await page.keyboard.type(minute, { delay: 100 });
    
      await page.locator('//input[@ng-model="model.EIRNo"]').fill(EIR);
      await page.waitForTimeout(1000);
      await page.locator('//select[@ng-model="model.NewDepotQualityID"]').selectOption(DEPOT_QUALITY_CODE);
      await page.locator('//select[@name="DepotConditionCodeValidation"]').selectOption(DEPOT_CONDITION_CODE);
      await page.locator('//select[@name="OperatorConditionCodeValidation"]').selectOption(OPERATOR_CONDITION_CODE);
    
      // Step 16: Update Gate In Details
      await clickAndMeasureDynamic(page, '//a[text()="Update"]', '//a[@ng-click="ConfirmRedirection(dataItem)"][1]', 'Update Gate In Details');
      await clickAndMeasureDynamic(page, '(//a[@ng-click="ConfirmRedirection(dataItem)"][1])', '//button[contains(text(),"Update")]', 'Go to Gate In Screen');
      await page.locator('//select[@id="ddlTransporter"]').isVisible
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'gate_in_screen.png' });
      await clickAndMeasureDynamic(page, '//button[contains(text(),"Update")]', '//li[@role="tab"]//span[text()="Container"]', 'Execute Gate In');
      await page.screenshot({ path: 'Execute_Gate_In.png' });
      console.log('✅ Empty Gate In test completed successfully');
    await page.close();
    });
  }
});
