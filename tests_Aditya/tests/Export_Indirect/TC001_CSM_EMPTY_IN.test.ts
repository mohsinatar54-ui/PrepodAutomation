import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectFutureDay } from '../../utils/test-helpers';
import fs from 'fs';

const DepotSizeType = '20 STD';
const ISOSizeType = '22G1';
const TotalContainers = '5';


test('TC001_CS_EmptyBooking', async ({ page }) => {
  // test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Empty bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Empty bookings"]', '//button[normalize-space()="+ Add Booking"]', 'Route to Empty booking screen');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Booking"]', '//input[@placeholder="Search Operator..."]', 'Route to Empty booking screen');



  await page.locator('//input[@placeholder="Search Operator..."]').fill('MAERSKLINE');
  await page.locator('//li//div[normalize-space()="MAERSKLINE"]').click();
  
  // await page.getByLabel('Booking Operator').fill('MMJ LOGISTICS');
  // await page.getByText('MMJ LOGISTICS').click();
  // await page.locator('input[placeholder="Search Account Holder..."]').click();
  // await expect(page.locator('//app-autocomplete-dropdown[@formcontrolname="ACHID"]//input[@ng-reflect-model="MMJ LOGISTICS"]')).toBeVisible();
  // Select the option by its value attribute ("1061") for "Empty Container In from Port (EITP)"
  await page.locator('select[formcontrolname="JobActID"]').selectOption('Empty Container In from Port (EITP)');
  await page.locator('select[formcontrolname="JWOID"]').selectOption('Job Order');

  await page.locator('nz-date-picker[formcontrolname="PlanDate"]').click();

  await selectFutureDay(page, 1);
  // await page.locator('input[formcontrolname="PlanDate"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });


  // await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
 
  // await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
  // //await page.keyboard.press('ArrowRight');
  // console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  // await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
  // await page.keyboard.press('ArrowDown');

  const BookingReferenceNo = 'BK' + getRandomNumberString(6);
  await page.locator('input[formcontrolname="BookingRefrenecNumber"]').fill(`${BookingReferenceNo}`);
  // await page.keyboard.press('Tab');
  // await expect(page.getByText('This field should be a number.')).toBeVisible();
  // await page.waitForTimeout(1000);
  // // await page.locator('input[formcontrolname="BookingRefrenecNumber"]').click();
  // await page.locator('input[formcontrolname="BookingRefrenecNumber"]').clear();
  // await page.waitForTimeout(1000);
  // const BookingReferenceNo = getRandomNumberString(6);


  writeTestArtifact('Booking_Ref.txt', BookingReferenceNo)

  console.log(`Booking Reference Number stored: ${BookingReferenceNo}`);



  // fs.appendFileSync(`${artifactsDir}/TC001_CS_EmptyBooking.txt`, `Booking Reference No: ${BookingReferenceNo}\n`);
  await page.locator('input[formcontrolname="BookingRefrenecNumber"]').fill(BookingReferenceNo);
  await page.waitForTimeout(1000);
  await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//button[normalize-space()="Update Details"]', 'Submit booking details');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update Details"]', '//button[normalize-space()="+Add Sub Booking"]', 'Update details');
  console.log('Booking details filled and submitted successfully');

  // const EmptyBookingNumber = await page.locator('a[ng-reflect-router-link="/booking/empty-booking/details"]').innerText();
  // writeTestArtifact('Empty_BkgNumber.txt', EmptyBookingNumber)


  const EmptyBookingNumber = await page.locator(
    '//div[contains(text(),"Update Booking")]'
  ).evaluate(el => el.textContent.split(':')[1].trim());

  writeTestArtifact('Empty_BkgNumber.txt', EmptyBookingNumber)


  await clickAndMeasureDynamic(page, '//button[normalize-space()="+Add Sub Booking"]', '//select[@formcontrolname="DepCOSztyID"]', 'Cick Add Sub Booking');
  await page.locator('//select[@formcontrolname="DepCOSztyID"]').selectOption(DepotSizeType);
  await page.locator('input[formcontrolname="TotalContainers"]').fill('5');
  await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();
  await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+Add Sub Booking"]', 'Add Sub Booking');

  console.log('Sub Booking added successfully');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="+ Add Container"]', 'Route to Empty booking screen');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Container"]', '//select[@formcontrolname="DepCOSztyID"]', 'Cick Add Container');
  await page.locator('//select[@formcontrolname="DepCOSztyID"]').selectOption(DepotSizeType);
  await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption(ISOSizeType);
  await expect(page.locator('//input[@formcontrolname="TareWeight"]')).not.toBeEmpty();
  await expect(page.locator('//input[@formcontrolname="COPlanDate"]')).not.toBeEmpty();
  const ContainerNo = 'EXIU' + getRandomNumberString(7);
  // fs.appendFileSync('test-artifacts/TC008_CS_EmptyAppointment.txt', `Container No: ${ContainerNo}\n`);


  writeTestArtifact('Export_Indirect_Container.txt', ContainerNo)

  console.log(`Container Number stored: ${ContainerNo}`);


  await page.locator('//input[@formcontrolname="ContainerNo"]').fill(ContainerNo);
  await expect(page.locator('input[formcontrolname="BookingReferenceNo"]')).not.toBeEmpty();
  await expect(page.locator('//button[normalize-space()="Reset"]')).toBeVisible();
  await expect(page.locator('//button[normalize-space()="Cancel"]')).toBeVisible();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+ Add Container"]', 'Add Container');
  console.log('Container added successfully');

  await clickAndMeasureDynamic(page, '//app-update-emptybookingtabs//button[normalize-space()="Job Order"]', '//app-job-order//div[contains(@class,"text-center relative")]', 'Validate job order exsit under Job Order tab');
  // Get and log the text content of the target div row (first job order row)
  const jobOrderRow = await page.locator('//div[contains(@class,"w-full border border-table-grey")][1]');
  const jobOrderText = await jobOrderRow.innerText();
  console.log('Job Order Row Text:', jobOrderText);
  fs.appendFileSync('test-artifacts/TC008_Joborder.txt', `Job Order Row Text: ${jobOrderText}\n`);
  await page.close();
  console.log('TC001_CS_EmptyBooking completed successfully');
});
