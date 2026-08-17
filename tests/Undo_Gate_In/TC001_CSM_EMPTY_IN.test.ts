
import { test, expect } from '@playwright/test';
import {
  clickAndMeasureDynamic,
  login,
  getRandomNumberString,
  writeTestArtifact
} from '../../utils/test-helpers';
import { selectFutureDay } from '../../utils/createExcelData';

const DepotSizeType = '20 STD';
const ISOSizeType = '22G1';
const TotalContainers = '5';

test('TC001_CS_EmptyBooking', async ({ page }) => {

  let BookingReferenceNo = '';
  let EmptyBookingNumber = '';
  let ContainerNo = '';

  // =========================
  // STEP 1: Login
  // =========================
  await test.step('Login to application', async () => {
    await login(page);
  });

  // =========================
  // STEP 2: Navigate to Empty Booking
  // =========================
  await test.step('Navigate to Empty Booking screen', async () => {

    await clickAndMeasureDynamic(page,
      '(//img[@alt="Customer Service Logo"])[1]',
      '//button[normalize-space()="Booking"]',
      'Route to Customer Service'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Booking"]',
      '//button[normalize-space()="Empty bookings"]',
      'Route to Booking tab'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Empty bookings"]',
      '//button[normalize-space()="+ Add Booking"]',
      'Route to Empty booking screen'
    );
  });

  // =========================
  // STEP 3: Fill Booking Details
  // =========================
  await test.step('Fill Empty Booking details', async () => {

    await page.locator('//input[@placeholder="Search Operator..."]').fill('MAERSKLINE');
    await page.locator('//li//div[normalize-space()="MAERSKLINE"]').click();

    await page.locator('select[formcontrolname="JobActID"]')
      .selectOption('Empty Container In from Port (EITP)');

    await page.locator('select[formcontrolname="JWOID"]')
      .selectOption('Job Order');

    await page.locator('//div[@class="ant-picker-input"]').click();

    await selectFutureDay(page, 1);

    BookingReferenceNo = 'BK' + getRandomNumberString(6);

    await page.locator('input[formcontrolname="BookingRefrenecNumber"]')
      .fill(BookingReferenceNo);

    writeTestArtifact('Booking_Ref.txt', BookingReferenceNo);

    console.log(`Booking Reference Number: ${BookingReferenceNo}`);

    await clickAndMeasureDynamic(page,
      '//button[@type="submit"]',
      '//button[normalize-space()="Update Details"]',
      'Submit booking details'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Update Details"]',
      '//button[normalize-space()="+Add Sub Booking"]',
      'Update details'
    );
  });

  // =========================
  // STEP 4: Capture Booking Number
  // =========================
  await test.step('Capture generated booking number', async () => {

    EmptyBookingNumber = await page.locator(
      'a[ng-reflect-router-link="/booking/empty-booking/details"]'
    ).innerText();

    writeTestArtifact('Empty_BookingNo.txt', EmptyBookingNumber);

    // await expect(EmptyBookingNumber).not.toBeEmpty();

    console.log(`Empty Booking Number: ${EmptyBookingNumber}`);
  });

  // =========================
  // STEP 5: Add Sub Booking
  // =========================
  await test.step('Add Sub Booking', async () => {

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="+Add Sub Booking"]',
      '//select[@formcontrolname="DepCOSztyID"]',
      'Click Add Sub Booking'
    );

    await page.locator('//select[@formcontrolname="DepCOSztyID"]')
      .selectOption(DepotSizeType);

    await page.locator('input[formcontrolname="TotalContainers"]')
      .fill(TotalContainers);

    await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();
    await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Add"]',
      '//button[normalize-space()="+Add Sub Booking"]',
      'Add Sub Booking'
    );
  });

  // =========================
  // STEP 6: Add Container
  // =========================
  await test.step('Add Container to booking', async () => {

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Container"]',
      '//button[normalize-space()="+ Add Container"]',
      'Route to Container tab'
    );

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="+ Add Container"]',
      '//select[@formcontrolname="DepCOSztyID"]',
      'Click Add Container'
    );

    await page.locator('//select[@formcontrolname="DepCOSztyID"]')
      .selectOption(DepotSizeType);

    await page.locator('//select[@formcontrolname="ISOSizeType"]')
      .selectOption(ISOSizeType);

    await expect(page.locator('//input[@formcontrolname="TareWeight"]'))
      .not.toBeEmpty();

    await expect(page.locator('//input[@formcontrolname="COPlanDate"]'))
      .not.toBeEmpty();

    ContainerNo = 'CNTU' + getRandomNumberString(7);

    writeTestArtifact('EmptyIn_Container_MNR.txt', ContainerNo);

    console.log(`Container Number: ${ContainerNo}`);

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="ContainerNo"]//input')
      .fill(ContainerNo);

    await expect(page.locator('input[formcontrolname="BookingReferenceNo"]'))
      .not.toBeEmpty();

    await clickAndMeasureDynamic(page,
      '//button[normalize-space()="Add"]',
      '//button[normalize-space()="+ Add Container"]',
      'Add Container'
    );
  });

  // =========================
  // STEP 7: Validate Job Order
  // =========================
  await test.step('Validate Job Order generation', async () => {

    await clickAndMeasureDynamic(page,
      '//app-update-emptybookingtabs//button[normalize-space()="Job Order"]',
      '//app-job-order//div[contains(@class,"text-center relative")]',
      'Open Job Order tab'
    );

    const jobOrderRow = page.locator(
      '//div[contains(@class,"w-full border border-table-grey")][1]'
    );

    await expect(jobOrderRow).toBeVisible();

    const jobOrderText = await jobOrderRow.innerText();

    console.log('Job Order Row:', jobOrderText);

    // await expect(jobOrderText).not.toBeEmpty();
  });

  // =========================
  // STEP 8: Cleanup
  // =========================
  await test.step('Close session', async () => {
    await page.close();
  });

});