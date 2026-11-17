import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, Createfile, writeTestArtifact, readTestArtifact, setBookingTypeCapacity, SelectVehicleType, selectEntityAndSite } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import {  setBookingTypeCapacity, SelectVehicleType } from '../../utils/test-helpers_VBS_CCIS';
import { Master, Appointments } from 'Locators/All locators/VBSMasters';
import { CSMExport, Common } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';


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
const POL = 'VAGE';
const JobCategory = 'Container Job';
const JobActivityPoint = 'Depot Gate Operation';
const JobDescription = "3: 1078" //'Container In By Truck From Factory Stuffing (XITF)';
const ContainerNo = 'PWTU' + getRandomNumberString(7);
const business_identification_no = 'BIN' + getRandomNumberString(10);
const Shipping_Bill_Number = getRandomNumberString(7);

test('TC014_VBS_ExportBooking_XITF', async ({ page }) => {
  test.setTimeout(180_000); // 3 minutes timeout for this test
  await test.step('Step 1: Login to CSM Application', async () => {
    await login(page);
    await selectEntityAndSite(page);   
  });

  await test.step('Step 2: Select Booking with Export Type', async () => {
    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');
    await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');
  });

  await test.step('Step 3: Create new Export Booking Record', async () => {
    await clickAndMeasureDynamic(page, CSMExport.AddBooking, CSMExport.SubBooking, 'Route to Export booking screen');
    // await page.locator('div').filter({ hasText: /^\*Shipping Bill Number$/ }).getByRole('textbox').fill(Shipping_Bill_Number);
    await page.locator(CSMExport.SubBooking).fill(Shipping_Bill_Number);
    // const today = new Date();
    // const yyyy = today.getFullYear();
    // const mm = String(today.getMonth() + 1).padStart(2, '0');
    // const dd = String(today.getDate()).padStart(2, '0');
    // const todaydate = `${yyyy}-${mm}-${dd}`;
    // await page.locator('input[type="date"]').fill(todaydate);
    await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="SBDate"]').click();
    await selectFutureDay(page, 0);
    await page.locator('div').filter({ hasText: /^Business Identification No\.$/ }).getByRole('textbox').fill(business_identification_no);
    await page.getByRole('textbox', { name: 'Search Exporter...' }).fill('MMJ');
    await page.getByText('MMJ LOGISTICS').first().click();
    // await page.getByText('*Shipping Bill Number*').click();
    await page.getByRole('textbox', { name: 'Search CHA...' }).fill('MMJ');
    await page.getByText('MMJ LOGISTICS').first().click();
    await page.fill('input[formcontrolname="FOB_VAL"]', '500000');
    // await page.locator(CSMExport.LoadingPort).selectOption("VAGE");
    await page.locator('//select[@formcontrolname="PortOfLoading"]').selectOption(POL);
    await page.locator(CSMExport.DischargePort).selectOption("Port den");
    await page.locator(CSMExport.containerFullIn).click();
    // await page.getByRole('button', { name: 'Add' }).click();
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.UpdateDetails, 'Submit booking details');
    await expect(await page.locator(CSMExport.Exp_BookingNumber)).toBeVisible();
    const ExportbookingNo = (await page.locator(CSMExport.Exp_BookingNumber).innerText()).replace(/\s+/g, '');
    writeTestArtifact('VBS_ExportBooking_BookingNumber.txt', `${ExportbookingNo}`);
  });

  await test.step('Step 4: Update Booking record with Cargo details', async () => {
    
    await page.locator(CSMExport.UpdateDetails).click();
    // Search and select Exporter
    // await page.pause();
    await page.waitForTimeout(3000);
     await page.locator(CSMExport.AccntHolder).fill(PrimaryACCountHolder);
     await page.locator('li[role="option"]').first().click();
     await page.locator(CSMExport.Operator).fill(Operator);
     await page.locator('li[role="option"]').first().click();
     await page.locator(CSMExport.Update).click();
    
    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    await clickAndMeasureDynamic(page, CSMExport.AddCargo, CSMExport.ClickONFP, 'Add Cargo');
    await page.locator(CSMExport.ClickONFP).click();
    await page.locator(CSMExport.Weight).fill(CargoWeight);
    await page.locator(CSMExport.WtUnit).selectOption({ label: `${WeightUnit}` });
    // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.CargoV).fill(CargoVolume);
    // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
    await page.locator(CSMExport.VUnit).selectOption({ label: `${VolumeUnit}` });
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.PkgNum).fill(CargoPackages);
    await page.locator(CSMExport.PkgId).selectOption(PackageType);
    await page.locator(CSMExport.ComId).selectOption(Commodity);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddCargo, 'Submit Add Cargo');
    console.log('Cargo added successfully');
  });


  await test.step('Step 5:Add container into Booking Record', async () => {
    
    await clickAndMeasureDynamic(page, CSMExport.Container, CSMExport.AddContainer, 'Route to Container tab');
    await clickAndMeasureDynamic(page, CSMExport.AddContainer, CSMExport.ConInfo, 'Click Add Container');
    await page.click(CSMExport.ConInfo);
    writeTestArtifact('Export_Container_Number.txt', ContainerNo)
    console.log(`Container Number stored: ${ContainerNo}`);
    await page.locator(CSMExport.ConIn).fill(ContainerNo);
    await page.locator(CSMExport.SelectLFCL).selectOption({ label: `${FreightKind}` });
    await page.locator(CSMExport.Deposize).selectOption({ label: `${DepotSizeType}` });
    await page.locator(CSMExport.ISOsize).selectOption({ label: `${ISOSizeType}` });
    await page.locator(CSMExport.Equipment).selectOption({ label: `${Sealtype}` });
  });

  await test.step('Step 6: Add container with Enhancement filed into Booking Record', async () => {
    await page.locator(CSMExport.PortOfLoading).selectOption(POL);
    await page.locator(CSMExport.Remark).fill("QA_Automation");
    await page.locator(CSMExport.OtherDetails).click();
    await page.locator(CSMExport.Hold).click();
    await page.locator(CSMExport.HoldType).selectOption("Shipping line hold");
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddContainer, 'Update Container');
    console.log('Container added successfully');
  });


  await test.step('Step 7:Create job order for new Booking Record', async () => {
    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    await page.locator(CSMExport.button).click();
    await page.locator(CSMExport.Map).click();
    // await page.locator(CSMExport.CargoPkg).fill(CargoPackages);
    await page.locator('(//input[@type="number"])[1]').fill(CargoPackages);
    await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
    await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
    await page.locator(CSMExport.JobCatId).selectOption(JobCategory);
    await page.locator(CSMExport.JobActId).selectOption(JobActivityPoint);
    // await page.locator(CSMExport.JobDesc).selectOption({ value: JobDescription });
    await page.locator('//select[@formcontrolname="JODID"]').selectOption({ value: JobDescription });
    await page.locator(CSMExport.JobConId).selectOption(ContainerNo);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
    await page.click(CSMExport.Save);
    await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
    console.log('Export Booking created successfully');
  });
});