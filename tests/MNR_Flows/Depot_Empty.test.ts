import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, waitForPageLoad, generateVehicleNumber } from '../../utils/test-helpers';

// ===== Test Data =====
const Operator_Value = 'MSK/MAERSKLINE';
const Depot_Size_Value = '20DV';
const ISO_Size_Value = '22G1';
const Type_Size_Value = '20';
const Type_Code_Value = 'DV';
const Quality_Code_Value = 'Damage';
const Condition_Code_Value = 'I';
// const Short_Code = 'SC01';
const Responsible = 'Owner';
const Contract_Applicable = 'MSK/MAERSKLINE';
const Responsible_Party = 'MSK/MAERSKLINE';
const Component_Code = 'AAA';
const Repair_Mode = 'RM1';
const Material_Code = 'AP';
const Location_Code = 'TL0N';
const Damage_Code = 'BT';
const Labour_Rate = '100';
const Qty = '1';
const Estimate_Done_By_Value = '2155';
const Send_Responsible_Party_Value = '2';


const OPERATOR_NAME = 'Maersk Line';
const EMPTY_JOB_TYPE = 'Empty Container In from Port (EITP)';
const DEPOT_SIZE_TYPE = '20DV';
const ISO_SIZE_TYPE = '22G1';
const MAX_WEIGHT = '1000';
const DAMAGE_DETAILS = 'Automation Test Damage Details';
const SURVEY_REMARK = 'BT - Bottom Damage';
const EIR = 'EIR' + getRandomNumberString(4);
const DEPOT_QUALITY_CODE = 'Damage';
const DEPOT_CONDITION_CODE = 'I';
const OPERATOR_CONDITION_CODE = 'I';


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

function generateRandomReferenceBookingNumber(): string {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
    return `BkRefNo${randomNumbers}`;
}

function generateContainerNumber(prefix: string, length: number): string {
    const randomNumber = Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
    return `${prefix}${randomNumber}`;
}

test('TC001_MNR_ExternalContainer_CreateEstimate', async ({ page }) => {
    test.setTimeout(120_000); // 2 minutes timeout for this test
    await login(page);

    await clickAndMeasureDynamic(page, '//div//img[@alt="Depot Plus Logo"]', '//span[text()="Home"]', 'Click Depot Plus Logo');

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
    await page.locator('#txttotalBookingcontainer').fill('1');
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

    const truckNumber = generateVehicleNumber();
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


