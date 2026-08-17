import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, waitForPageLoad, writeTestArtifact, generateVehicleNumber, readTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';

const PrimaryACCountHolder = 'ADITYA LOGISTICS(ADI01)';
const Operator = 'MMJ LOGISTICS';
const DepotSizeType = '20 STD (20STD)';
const ISOSizeType = '22G1';
const TotalContainers = '5';
const CargoWeight = '1000';
const CargoVolume = '1000';
const WeightUnit = 'Tonnes';
const VolumeUnit = 'Cubic Meter';
const CargoPackages = '100';
const PackageType = 'Bulk';
const Commodity = 'Aluminium';
const FreightKind = 'FCL';
const Sealtype = 'ESEAL';
const PortOfLoading = 'JNPT';
const PortOfArrival = 'BPCL';

const JobCategory = 'Container Job';
const JobActivityPoint = 'Container Operation';
const JobDescription = "1063" //'CFS Stuffing-Direct stuffing  (EO9F)';


test('TC001_CSM_EXPORT_EO9F', async ({ page }) => {
  // test.setTimeout(120_000); // 2 minutes timeout for this test
  await login(page);
  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Export bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Export bookings"]', '//button[normalize-space()="+ Add Booking"]', 'Route to Export booking screen');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Booking"]', '//input[@formcontrolname="SBNumber"]', 'Route to Export booking screen');

  const Shipping_Bill_Number = getRandomNumberString(7);
  await page.locator('div').filter({ hasText: /^\*Shipping Bill Number$/ }).getByRole('textbox').fill(Shipping_Bill_Number);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todaydate = `${yyyy}-${mm}-${dd}`;
  await page.locator('input[type="date"]').fill(todaydate);

  const business_identification_no = 'BIN' + getRandomNumberString(10);
  await page.locator('div').filter({ hasText: /^Business Identification No\.$/ }).getByRole('textbox').fill(business_identification_no);
  await page.getByRole('textbox', { name: 'Search Exporter...' }).fill('MMJ');
  await page.getByText('MMJ LOGISTICS').first().click();
  // await page.getByText('*Shipping Bill Number*').click();
  await page.getByRole('textbox', { name: 'Search CHA...' }).fill('MMJ');
  await page.getByText('MMJ LOGISTICS').first().click();
  await page.fill('input[formcontrolname="FOB_VAL"]', '500000');
  await page.getByRole('combobox').nth(1).selectOption(PortOfLoading);
  await page.getByRole('combobox').nth(2).selectOption(PortOfArrival);
  // await page.locator('div').filter({ hasText: /^Is Break bulk\?$/ }).getByRole('checkbox').check();
  // await page.locator('//input[@formcontrolname="TotalContainerFullIn"]').check();

  await page.getByRole('button', { name: 'Add' }).click();

  const bookingNumber = await page.locator('//label[contains(text(),"Booking No.")]/following-sibling::strong').textContent();

  writeTestArtifact('Export_Indirect_Booking_Number.txt', bookingNumber ? bookingNumber.trim() : '');
  console.log(`Booking Number stored: ${bookingNumber}`);

  await expect(page.locator('//button[normalize-space()="Update Details"]')).toBeVisible();
  // await expect(page.getByText('10943BN20260110001EXP | Edit')).toBeVisible();
  // const bookingNumberElement = await page.locator('div.text-700-title');
  // const bookingNumberText = await bookingNumberElement.innerText();
  // const artifactsDir = 'C:/Users/mra004.ENVECON/Documents/Playwright_Automation/Playwright_CS_Microservice/tests/test-artifacts';

  // if (!fs.existsSync(artifactsDir)) {
  //   fs.mkdirSync(artifactsDir, { recursive: true });
  // }

  // const filePath = `${artifactsDir}/TC003_CS_ExportBooking.txt`;

  // fs.appendFileSync(filePath, `Booking Number: ${bookingNumberText}\n`);

  // console.log(`Artifact file created/updated at: ${filePath}`);

  // Click Update Details
  await page.locator('//button[normalize-space()="Update Details"]').click();

  // Search and select Exporter
  // await page.pause();

  await page.waitForTimeout(3000);
  await page.locator('//app-autocomplete-dropdown[@formcontrolname="ACHID"]//input').fill(PrimaryACCountHolder);
  await page.locator('li[role="option"]').first().click();


  await page.locator('//app-autocomplete-dropdown[@formcontrolname="OperatorID"]//input').fill(Operator);
  await page.locator('li[role="option"]').first().click();

  await page.locator('//button[normalize-space()="Update"]').click();

  console.log('Export Booking created successfully')

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button[normalize-space()="+ New Cargo"]', 'Add Cargo');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Cargo"]', '(//div[contains(@class,"panel-header") and normalize-space()="Shipping Detail"])[1]', 'Add Cargo');

  await clickAndMeasureDynamic(
    page,
    '(//div[contains(@class,"panel-header") and normalize-space()="Shipping Detail"])[1]',
    '//input[@formcontrolname="IsDirect"]',
    'Open Shipping Detail'
  );

  await page.locator('//input[@formcontrolname="IsDirect"]').check();

  await page.click('//div[text()=" Freight and Packages "]');
  await page.locator('input[formcontrolname="Weight"]').fill(CargoWeight);
  await page.locator('select[formcontrolname="WeightUnit"]').selectOption({ label: `${WeightUnit}` });
  // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
  await page.waitForTimeout(1000);
  await page.locator('input[formcontrolname="Volume"]').fill(CargoVolume);
  // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
  await page.locator('select[formcontrolname="VolumeUnit"]').selectOption({ label: `${VolumeUnit}` });
  await page.waitForTimeout(1000);
  await page.locator('input[formcontrolname="PackageNumbers"]').fill(CargoPackages);
  await page.locator('select[formcontrolname="PackageTypeID"]').selectOption(PackageType);

  await page.locator('select[formcontrolname="CommodityID"]').selectOption(Commodity);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+ New Cargo"]', 'Submit Add Cargo');
  console.log('Cargo added successfully');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Container"]', '//button[normalize-space()="+ New Container"]', 'Route to Container tab');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Container"]', '//div[text()=" Container Information "]', 'Click Add Container');
  await page.click('//div[text()=" Container Information "]');



  // const ContainerNo = 'PWTU' + getRandomNumberString(7);

  // writeTestArtifact('EO9F_Container.txt', ContainerNo)

  const ContainerNo = await readTestArtifact('Export_Indirect_Container.txt')
  console.log(`Container Number stored: ${ContainerNo}`);


  await page.locator('//app-autocomplete-dropdown[@formcontrolname="ContainerNo"]//input').fill(ContainerNo);
  await page.locator('select[formcontrolname="LFCL"]').selectOption({ label: `${FreightKind}` });
  await page.locator('//select[@formcontrolname="DepotSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });

  await page.locator('//select[@formcontrolname="ISOSizeTypeID"]').selectOption({ label: `${ISOSizeType}` });

  await page.locator('select[formcontrolname="EquipmentSealType"]').selectOption({ label: `${Sealtype}` });

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//button[normalize-space()="+ New Container"]', 'Update Container');
  console.log('Container added successfully');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Cargo"]', '//button[normalize-space()="+ New Cargo"]', 'Add Cargo');

  await page.locator('//button//i[@class="fas fa-ellipsis-v"]').click();
  await page.locator('//ul/li[normalize-space()="Map"]').click();

  await page.locator('//input[@ng-reflect-name="packages0"]').fill(CargoPackages);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Map"]', '//button[normalize-space()="Job Orders"]', 'Map Cargo to Container');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Job Orders"]', '//button[normalize-space()="+ New Job Order"]', 'Route to Job Orders tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="+ New Job Order"]', 'select[formcontrolname="JOBCatID"]', 'Add Job Order');

  await page.locator('select[formcontrolname="JOBCatID"]').selectOption(JobCategory);

  await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption(JobActivityPoint);

  await page.locator('select[formcontrolname="JODID"]').selectOption({ value: JobDescription });

  await page.locator('select[formcontrolname="JODContainerID"]').selectOption(ContainerNo);

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Add"]', '//div[normalize-space()="Job Plan Details"]', 'Add Job Order');

  await page.click('//button[normalize-space()="Save"]');

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Cargo Transport"]',
    '//button[normalize-space()="+ Add Transport"]',
    'Route to Cargo Transport'
  );

  // Add Transport details 

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ Add Transport"]',
    '//input[@formcontrolname="NoOfTransports"]',
    'Add Transport Details'
  );

  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();


  const EO9FvehicleNo = generateVehicleNumber();

  writeTestArtifact('EO9F_Vehicle.txt', EO9FvehicleNo)
  console.log(`Vehicle Number stored: ${EO9FvehicleNo}`);


  await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);

  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  // await page.locator('//button[normalize-space( )="Select All Containers"]').click();



  // Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//button[normalize-space()="Job Plan"]',
    'Add Job Order'
  );

  await page.locator('//button[normalize-space()="Job Plan"]').click();

  // await page.locator('//label[normalize-space()="DestuffDoneBy* *"]//following-sibling::select').selectOption({ value: "LBR" });

  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Submit Job Order'
  );


  console.log('Job Order created successfully');

});