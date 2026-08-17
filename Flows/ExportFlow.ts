import { test, expect, Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite } from '../utils/test-helpers';
import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';


      // const PrimaryACCountHolder = 'ADITYA LOGISTICS(ADI01)';
      // const Operator = 'MMJ LOGISTICS';
      // const DepotSizeType = '20 STD (20STD)';
      // const ISOSizeType = '22G1';
      // const TotalContainers = '5';
      // const CargoWeight = '1000';
      // const CargoVolume = '1000';
      // const WeightUnit = 'Tonnes';
      // const VolumeUnit = 'Cubic Meter';
      // const CargoPackages = '100';
      // const PackageType = 'Bulk';
      // const Commodity = 'Aluminium';
      // const FreightKind = 'FCL';
      // const Sealtype = 'ESEAL';
      // const PortOfLoading = 'JNPT';
      // const PortOfArrival = 'BPCL';
      // const POL = 'VAGE';
      // const JobCategory = 'Container Job';
      // const JobActivityPoint = 'Depot Gate Operation';
      // const JobDescription = "1078" //'Container In By Truck From Factory Stuffing (XITF)';
      // const ContainerNo = 'PWTU' + getRandomNumberString(7);
      // const business_identification_no = 'BIN' + getRandomNumberString(10);
      // const Shipping_Bill_Number = getRandomNumberString(7);

export async function ExportBooking_XITF(
  page: Page,
  data: any,
  bookingNumberFile: string,
  containerNumberFile: string) {
  test.setTimeout(6000_000); // 2 minute timeout for this test
  // await test.step('Step 1: Login to CSM Application', async () => {
  //   await login(page);
  // });

  await test.step('Step  Select Booking with Export Type', async () => {
    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');
     await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');
  });

  await test.step('Step 3: Create new Export Booking Record', async () => {
    await clickAndMeasureDynamic(page, CSMExport.AddBooking, CSMExport.SubBooking, 'Route to Export booking screen');
    await page.locator(CSMExport.ShippingBillNumber).fill(data.Shipping_Bill_Number);
    await page.locator(CSMExport.ShippingBillDate).click();
    await page.locator(CSMExport.ShippingBillDate).click();
    await selectFutureDay(page, 0);
   // await page.locator('div').filter({ hasText: /^Business Identification No\.$/ }).getByRole('textbox').fill(data.business_identification_no);
    // await page.getByRole('textbox', { name: 'Search Exporter...' }).fill(data.PrimaryAccountHolder);
    await page.locator(CSMExport.Exporter).click();
    await page.locator(CSMExport.ExporterInput).fill(data.PrimaryAccountHolder);
    await page.getByText(data.PrimaryAccountHolder).first().click();
    // await page.getByText('*Shipping Bill Number*').click();
    // await page.getByRole('textbox', { name: 'Search CHA...' }).fill(data.Operator);
    await page.locator(CSMExport.Operator).click();
    await page.locator(CSMExport.OperatorInput).fill(data.CHA);
    await page.getByText(data.CHA).first().click();
    await page.fill(CSMExport.FOBValue, data.FOBValue);
    // await page.locator(CSMExport.LoadingPort).selectOption(data.POL);
    // await page.locator(CSMExport.DischargePort).selectOption(data.POA);
    await page.locator(CSMExport.LoadingPort).fill(data.POL);
     await page.locator('//div[text()="VAGE"]/parent::li')
    .filter({ hasText: data.POL })
    .click();
     await page.locator(CSMExport.DischargePort).fill(data.POA);
      await page.locator('//div[text()="BPCL"]/parent::li')
    .filter({ hasText: data.POA })
    .click();
  
    if (`${data.JobDescription}`=== '3: 1078') {
      await page.locator(CSMExport.containerFullIn).click();
    }
    // await page.getByRole('button', { name: 'Add' }).click();
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.UpdateDetails, 'Submit booking details');
    await expect(await page.locator(CSMExport.Exp_BookingNumber)).toBeVisible();
    const ExportbookingNo = (await page.locator(CSMExport.Exp_BookingNumber).innerText()).replace(/\s+/g, '');
    writeTestArtifact(bookingNumberFile, `${ExportbookingNo}`);
  });

  await test.step('Step 4: Update Booking record with Cargo details', async () => {
    await page.locator(CSMExport.UpdateDetails).click();
    // Search and select Exporter
    // await page.pause();
    await page.waitForTimeout(3000);
    await page.locator(CSMExport.AccntHolder).fill(data.PrimaryAccountHolder);
    // await page.locator('li[role="option"]').first().click();
    // await page.getByText(data.PrimaryAccountHolder).first().click();
    await page.locator('ul', {hasText: data.PrimaryAccountHolder}).first().click();
    await page.locator(CSMExport.OperatorBkDet).fill(data.Operator);
    // await page.locator('li[role="option"]').first().click();
    // await page.getByText(data.Operator).first().click();
    await page.locator('ul', {hasText: data.Operator}).first().click();
    await page.locator(CSMExport.Update).click();

    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    await clickAndMeasureDynamic(page, CSMExport.AddCargo, CSMExport.ClickONFP, 'Add Cargo');
    if (`${data.JobDescription}`=== '2: 1063') {
      await page.locator(CSMExport.ClickShippingDetail).click();
      await page.locator(CSMExport.CheckDirectStuffing).check();
    }
    await page.locator(CSMExport.ClickONFP).click();
    await page.locator(CSMExport.Weight).fill(data.CargoWeight);
    await page.locator(CSMExport.WtUnit).selectOption({ label: `${data.WeightUnit}` });
    // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.CargoV).fill(data.CargoVolume);
    // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
    await page.locator(CSMExport.VUnit).selectOption({ label: `${data.VolumeUnit}` });
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.PkgNum).fill(data.CargoPackages);
    await page.locator(CSMExport.PkgId).selectOption(data.PackageType);
    await page.locator(CSMExport.ComId).selectOption(data.Commodity);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddCargo, 'Submit Add Cargo');
    console.log('Cargo added successfully');
  });

  await test.step('Step 5:Add container into Booking Record', async () => {
    await clickAndMeasureDynamic(page, CSMExport.Container, CSMExport.AddContainer, 'Route to Container tab');
    await clickAndMeasureDynamic(page, CSMExport.AddContainer, CSMExport.ConInfo, 'Click Add Container');
    await page.click(CSMExport.ConInfo);
    writeTestArtifact(containerNumberFile, data.ContainerNo)
    console.log(`Container Number stored: ${data.ContainerNo}`);
    // await page.locator(CSMExport.ConIn).fill(data.ContainerNo);
    
    // await page.locator(CSMExport.ConIn,CSMExport.Autolist)
    // .first()
    // .click();
    await page.locator(CSMExport.ConIn).fill(data.ContainerNo);

await page.locator(CSMExport.Autolist)
    .first()
    .click();
    await page.locator(CSMExport.SelectLFCL).selectOption({ label: `${data.FreightKind}` });
    await page.locator(CSMExport.Deposize).selectOption({ label: `${data.DepotSizeType}` });
    await page.locator(CSMExport.ISOsize).selectOption({ label: `${data.ISOSizeType}` });
    await page.locator(CSMExport.Equipment).selectOption({ label: `${data.Sealtype}` });
  });

  await test.step('Step 6: Add container with Enhancement filed into Booking Record', async () => {
  //  await page.locator(CSMExport.PortOfLoading).selectOption(data.POL);
  await page.locator(CSMExport.LoadingPort).fill(data.POL);
  await page.locator('//div[text()="VAGE"]/parent::li')
    .filter({ hasText: data.POL })
    .click();

 //    await page.locator(CSMExport.DischargePort).fill(data.POA);
    await page.locator(CSMExport.Remark).fill("QA_Automation");
    await page.locator(CSMExport.OtherDetails).click();
    // await page.locator(CSMExport.Hold).click();
    // await page.locator(CSMExport.HoldType).selectOption(data.HoldType);   // commented to create out job order
    // await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddContainer, 'Update Container');
    await page.locator(CSMExport.Add).click();
   
    const invalidContainerNumberMessage = page.locator(CSMImport.InvalidContainerNumberMessage);
        if (await invalidContainerNumberMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(invalidContainerNumberMessage).toBeVisible();
          await page.locator(CSMImport.ProceedButton).click();
        }
    console.log('Container added successfully');
  });

  await test.step('Step 7:Create job order for new Booking Record', async () => {
    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    await page.locator(CSMExport.button).click();
    await page.locator(CSMExport.Map).click();
    // await page.locator(CSMExport.CargoPkg).fill(CargoPackages);
    // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages);
    await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages);
    await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
    //  await page.locator('//input[@placeholder="Container No."]').fill(data.ContainerNo);  // Temp 
    //  await page.waitForTimeout(2000);             // Temp      
    //  await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
    //  await page.waitForTimeout(2000); // Temp 
    //  await page.locator(CSMExport.UpdateDetails).click();// Temp 
    //  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');// Temp 
   await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
    await page.locator(CSMExport.JobCatId).selectOption(data.JobCategory);
    await page.locator(CSMExport.JobActId).selectOption(data.JobActivityPoint);
    await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription });
  //  await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' });
    await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo);
    await page.locator(CSMExport.EstDtTime).click();
    await selectFutureDay(page, 1);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
    await page.click(CSMExport.Save);
    // await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
    // console.log('Export Booking created successfully');
    // await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// newly temp added 
    // await page.waitForTimeout(2000);//temp added
 
  });
}

export async function ExportBooking_XITF_With_JobPlan_Savesubmit(
  page: Page,) {
  test.setTimeout(200_000); // 2 minute timeout for this test
  
  await test.step('Step 7:Create job order for new Booking Record', async () => {
     // Add Job Order
  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="Add"]',
  //   '//button[normalize-space()="Job Plan"]',
  //   'Add Job Order'
  // );
 await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Job Plan"]','//button[text()="Save"]',
    'click on Job plan'
  );
 // await page.locator('//button[normalize-space()="Job Plan"]').click();

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

  });
}
export async function ExportBooking_XITF_Add_Transport(
  page: Page,
  vehicleArtifactFile: string = 'EO9F_Vehicle.txt'
) {
  await clickAndMeasureDynamic(page,'//button[normalize-space()="Cargo Transport"]', '//button[normalize-space()="+ Add Transport"]', 'Route to Cargo Transport');

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ Add Transport"]',
    '//input[@formcontrolname="NoOfTransports"]',
    'Add Transport Details'
  );

//  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();

  const EO9FvehicleNo = `EO9F${getRandomNumberString(6)}`;
  writeTestArtifact(vehicleArtifactFile, EO9FvehicleNo);
  console.log(`Vehicle Number stored: ${EO9FvehicleNo}`);

 // await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);
  await page.locator('//label[text()="Transport Mode Number"]/parent::div/input').fill(EO9FvehicleNo);
  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  await page.locator('//button[text()="Add"]').click();
   
}


