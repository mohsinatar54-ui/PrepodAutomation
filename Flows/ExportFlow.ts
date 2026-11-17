import { test, expect, Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite, SwitchModule, clickAndMeasureDynamic1 } from '../utils/test-helpers';
import { Common,CSMEmpty, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { createExcelFile, createPreAdviceExcel } from '../utils/createExcelData';
import { GateImport,GateEmpty } from 'Locators/GateLocators';
import { Cargo } from 'Locators/CargoLocators';



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

await expect
  .poll(
    async () => {
      const value = (
        await page.locator(CSMExport.Exp_BookingNumber).innerText()
      ).trim();

      console.log(`Current Booking Number: [${value}]`);

      return value;
    },
    {
      timeout: 60000,
      intervals: [1000, 2000, 3000],
    }
  )
  .not.toBe('-');

const ExportbookingNo = (
  await page.locator(CSMExport.Exp_BookingNumber).innerText()
).replace(/\s+/g, '');

console.log(`Final Export Booking Number: ${ExportbookingNo}`);

writeTestArtifact(
  bookingNumberFile,
  `${ExportbookingNo}`


);


    // await expect(await page.locator(CSMExport.Exp_BookingNumber)).toBeVisible();
    // const ExportbookingNo = (await page.locator(CSMExport.Exp_BookingNumber).innerText()).replace(/\s+/g, '');
    // writeTestArtifact(bookingNumberFile, `${ExportbookingNo}`);
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
     if (`${data.JobDescription}`=== '3: 1078') {
      await page.locator(CSMExport.ConIn).fill(data.ContainerNo);
    }
    else {
    await page.locator(CSMExport.ConIn).fill(data.ContainerNo);

await page.locator(CSMExport.Autolist)
    .first()
    .click();
  }
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
  //    await page.locator(CSMExport.button).click();
  //   await page.locator(CSMExport.Map).click();
  //   const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
  //   writeTestArtifact(cargoNumberFile, cargoNo1);
  //   console.log(`Cargo Number stored: ${cargoNo1}`);
  //   //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
  //  // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
  //   await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages);
  //   await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
  });

  await test.step('Step 7:Create job order for new Booking Record', async () => {
       await page.locator(CSMExport.button).click();
    await page.locator(CSMExport.Map).click();
    const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
   // writeTestArtifact(cargoNumberFile, cargoNo1);
  //  console.log(`Cargo Number stored: ${cargoNo1}`);
    //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
   // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
     await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages); //temp code**
     await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.JobOrder, 'Map Cargo to Container'); //temp code**
        //  await page.locator('//a[text()="71684BN20260827001EXP"]').click();//temp code
        //  await page.locator(CSMExport.UpdateDetails).click(); // temp code
        //  await page.locator(CSMExport.Container).click(); // temp code but usable 
        //   await page.locator(CSMExport.button).click(); // temp code but usable
        //   await page.locator(CSMExport.Map).click(); // temp code but usable
      //    const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
      //    writeTestArtifact(containerNumberFile, cargoNo1);
        //  console.log(`Cargo Number stored: ${cargoNo1}`);
      //    await page.locator('//button[normalize-space()="Back"]').click();
        //  await page.locator().click();
    // await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    // await page.locator(CSMExport.button).click();
    // await page.locator(CSMExport.Map).click();
    //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
   // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
    // await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages);
    // await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
    //  await page.locator('//input[@placeholder="Container No."]').fill(data.ContainerNo);  // Temp 
    //  await page.waitForTimeout(2000);             // Temp      
    //  await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// Temp 
    //  await page.waitForTimeout(2000); // Temp 
   //   await page.locator(CSMExport.UpdateDetails).click();// Temp 
   //   await page.locator(CSMExport.Update).click();
    //  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');// Temp 
    await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
    await page.locator(CSMExport.JobCatId).selectOption(data.JobCategory);
    await page.locator(CSMExport.JobActId).selectOption(data.JobActivityPoint);
          if (`${data.JobDescription}`=== '2: 1063') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo);
      }
         
          if (`${data.JobDescription}`=== '1: 1086') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.CargoNO).selectOption(cargoNo1);
      }
         if (`${data.JobDescription}`=== '3: 1078') {
           await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
           await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo);
      }

 //   await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription }); ///tempcode
//   //  await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' }); * temp code
 //  await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo); // temp*
   //  await page.locator(CSMExport.JobConId).selectOption({ index: 0 }); // temp *
      await page.locator(CSMExport.EstDtTime).click();
        await selectFutureDay(page, 3);
     await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
     await page.click(CSMExport.Save);
    // await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
    // console.log('Export Booking created successfully');
    // await page.locator('//a[@class="hover:opacity-70 cursor-pointer ng-star-inserted"]').click();// newly temp added 
    // await page.waitForTimeout(2000);//temp added
 
  });
}

export async function ExportBooking_XITF1(
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
  //    await page.locator(CSMExport.button).click();
  //   await page.locator(CSMExport.Map).click();
  //   const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
  //   writeTestArtifact(cargoNumberFile, cargoNo1);
  //   console.log(`Cargo Number stored: ${cargoNo1}`);
  //   //await page.locator(CSMExport.CargoPkg).fill(CargoPackages); // temp code**
  //  // await page.locator('(//input[@type="number"])[1]').fill(data.CargoPackages); //temp code**
  //   await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages);
  //   await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
  });

  await test.step('Step 7:Create job order for new Booking Record', async () => {
       await page.locator(CSMExport.button).click();
    await page.locator(CSMExport.Map).click();
    const cargoNo1 = await page.locator(CSMExport.CargoNumber).innerText();
     await page.locator(CSMExport.PackagesInput).fill(data.CargoPackages); //temp code**
     await clickAndMeasureDynamic(page, CSMExport.Updatebutton, CSMExport.JobOrder, 'Map Cargo to Container'); //temp code**
     //await SwitchModule()   
 
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
export async function ExportBooking_XITF_With_JobPlan_Savesubmit1(
  page: Page,) {
  test.setTimeout(200_000); // 2 minute timeout for this test
  
  await test.step('Step 7:Create job order for new Booking Record', async () => {

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
export async function ExportBooking_XITC_With_JobPlan_Savesubmit(
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


const cartingDoneBy = page.locator(
  '//label[text()="CartingDoneBy*"]//following-sibling::select'
);

await cartingDoneBy.click({ force: true });

await cartingDoneBy.selectOption({ label: 'Crane' });


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
// export async function Import_Direct_Booking__With_JobPlan_Savesubmit(
//   page: Page,) {
//   test.setTimeout(200_000); // 2 minute timeout for this test
  
//   await test.step('Step 7:Create job order for new Booking Record', async () => {
//      // Add Job Order
//   // await clickAndMeasureDynamic(
//   //   page,
//   //   '//button[normalize-space()="Add"]',
//   //   '//button[normalize-space()="Job Plan"]',
//   //   'Add Job Order'
//   // );
//  await clickAndMeasureDynamic1(
//     page,
//     '//button[normalize-space()="Job Plan"]','//div[text()="Job Planning"]',
//     'click on Job plan'
//   );
// //  await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="PlanDate"]').click();

// //  await selectFutureDay(page, 2);

// const cartingDoneBy = page.locator(
//   '//label[text()="DestuffDoneBy*"]//following-sibling::select'
// );

// await cartingDoneBy.click({ force: true });

// await cartingDoneBy.selectOption({ label: 'LBR' });


//   // Save Job Order
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Submit Job Order
//   await clickAndMeasureDynamic1(
//     page,
//     '//button[normalize-space()="Submit"]',
//     '//div[normalize-space()="Job Plan Details"]',
//     'Submit Job Order'
//   );

//   });
// }

export async function Import_Direct_Booking__With_JobPlan_Savesubmit(
  page: Page
) {
  test.setTimeout(200_000);

  await test.step(
    'Step 7: Create job order for new Booking Record',
    async () => {

      // -------------------------------------------------------
      // 1. Click Job Plan
      // -------------------------------------------------------
      const jobPlanButton = page.locator(
        '//button[normalize-space()="Job Plan"]'
      );

      const jobPlanningPage = page.locator(
        '//div[normalize-space()="Job Planning"]'
      );

      await jobPlanButton.waitFor({
        state: 'visible',
        timeout: 30_000
      });

      console.log('Clicking Job Plan...');

      await jobPlanButton.click();

      await page.waitForTimeout(20000);

      // IMPORTANT:
      // Do not wait for generic "Loading..." here.
      // Wait for the actual Job Planning screen.
      // await jobPlanningPage.waitFor({
      //   state: 'visible',
      //   timeout: 30_000
      // });

     // console.log('Job Planning screen opened successfully');


      // -------------------------------------------------------
      // 2. Select Destuff Done By
      // -------------------------------------------------------
      const cartingDoneBy = page.locator(
        '//label[normalize-space()="DestuffDoneBy*"]//following-sibling::select'
      );

      await cartingDoneBy.waitFor({
        state: 'visible',
        timeout: 30_000
      });

      await cartingDoneBy.selectOption({
        label: 'LBR'
      });

      console.log('DestuffDoneBy selected: LBR');


      // -------------------------------------------------------
      // 3. Save Job Order
      // -------------------------------------------------------
      const saveButton = page.locator(
        '//button[normalize-space()="Save"]'
      );

      await saveButton.waitFor({
        state: 'visible',
        timeout: 30_000
      });

      console.log('Saving Job Order...');

      await saveButton.click();


      // -------------------------------------------------------
      // 4. Submit Job Order
      // -------------------------------------------------------
      const submitButton = page.locator(
        '//button[normalize-space()="Submit"]'
      );

      const jobPlanDetails = page.locator(
        '//div[normalize-space()="Job Plan Details"]'
      );

      await submitButton.waitFor({
        state: 'visible',
        timeout: 30_000
      });

      console.log('Submitting Job Order...');

      await submitButton.click();

      // Wait for the actual result of Submit.
      await jobPlanDetails.waitFor({
        state: 'visible',
        timeout: 30_000
      });

      console.log('Job Order submitted successfully');
    }
  );
}
export async function ExportBooking_XOTP_With_JobPlan_Savesubmit(
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
const BookingType = page.locator(
  '//label[normalize-space()="Booking Type**"]/following-sibling::select'
);

await BookingType.click({ force: true });

await BookingType.selectOption({ label: 'BUFFER Container' });

  // // Save Job Order
  // await page.locator('//button[normalize-space()="Save"]').click();

   await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Save"]',
    '//button[normalize-space()="Submit"]',
    'Submit Job Order'
  );

  // Submit Job Order

  // Save Job Order
  await page.locator('//button[normalize-space()="Submit"]').click();
  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="Submit"]',
  //   '//div[normalize-space()="Job Plan Details"]',
  //   'Submit Job Order'
  // );

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
//  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();

  const EO9FvehicleNo = `EO9F${getRandomNumberString(6)}`;
  writeTestArtifact(vehicleArtifactFile, EO9FvehicleNo);
  console.log(`Vehicle Number stored: ${EO9FvehicleNo}`);

 // await page.locator('//input[@formcontrolname="TModNo"]').first().fill(EO9FvehicleNo);
  await page.locator('//label[text()="Transport Mode Number"]/parent::div/input').fill(EO9FvehicleNo);
  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  await page.locator('//button[text()="Add"]').click();
   
}

export async function createPreAdviceImport(page: Page) {
  const { filePath, referenceNo, containerNumbers } = createPreAdviceExcel();
  const preContainer1 = containerNumbers[0];
 // const preContainer2 = containerNumbers[1];

  console.log('Generated file:', filePath);
  console.log('Reference No:', referenceNo);
  console.log('Container Numbers:', containerNumbers);

  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
  await clickAndMeasureDynamic(page, Common.BookingTab, CSMEmpty.EmptyBooking, 'Route to Booking tab');
  await clickAndMeasureDynamic(page, CSMEmpty.PreAnnoucement, CSMEmpty.UploadFile, 'Route to Pre-Advice Empty Booking');
  await clickAndMeasureDynamic(page, CSMEmpty.UploadFile, CSMEmpty.Selectfile, 'Route to Selectfile');

  const fileChooserPromise = page.waitForEvent('filechooser');

await page.locator(CSMEmpty.Selectfile).click();

const fileChooser = await fileChooserPromise;

await fileChooser.setFiles(filePath);
 
  // await page.locator(CSMEmpty.Selectfile).setInputFiles(filePath);
  await page.locator(CSMEmpty.UPloadbutton).click();

  const searchInput = page.locator('//input[contains(@placeholder, "Search by Container No")]');
  const searchButton = page.locator('//button[normalize-space()="Search"]');

  await searchInput.waitFor({ state: 'visible' });
  await searchInput.fill(preContainer1);
 // await searchButton.click();
await expect(page.locator(`//tr[td[normalize-space(.)='${preContainer1}']]`)).toBeVisible();
  // await expect(page.locator(`//tr[td[normalize-space(.)='preContainer1']]`)).toBeVisible();
  await writeTestArtifact('PreContainer1.txt', preContainer1);

  // await searchInput.fill(preContainer2);
  // await searchButton.click();

  // await expect(page.locator(`//tr[td[contains(., "${preContainer2}")]]`)).toBeVisible();
  // await writeTestArtifact('PreContainer2.txt', preContainer2);

  console.log(' Container have been added successfully for Pre-Advice.');

  return { filePath, referenceNo, preContainer1};
}

export async function Express_Gate_in(page: Page) {
  test.setTimeout(120_000); // 2 minutes

  // ================================
  // Navigation
  // ================================
  await clickAndMeasureDynamic(
    page,
    '(//img[@alt="Gate Operations Logo"])[1]',
    '//button[normalize-space()="Express Services"]',
    "Route to Gate Operations",
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Express Services"]',
    '//button[normalize-space()="Express Empty"]',
    "Route to Express Services",
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Express Empty"]',
    '//button[normalize-space()="Truck In"]',
    "Route to Express Empty",
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Truck In"]',
    '//input[@placeholder="Enter vehicle number"]',
    "Route to Truck In",
  );

  

  //Vehicle No
  // await page.locator('//input[@placeholder="Enter vehicle number"]').click();
  // await page
  //   .locator('//input[@placeholder="Enter vehicle number"]')
  //   .fill(Vehicle_No);

  // //Transporter
  // await page.locator('//div[text()=" Select transporter "]').first().click();
  // await page
  //   .locator('//input[@placeholder="Select transporter"]')
  //   .fill(Transporter);
  // await page.locator('//div[@class="dropdown-item"]').first().click();

  // //Activity
  // await page.locator('//div[text()=" Select activity "]').first().click();
  // await page.locator('//input[@placeholder="Select activity"]').fill(Activity);
  // await page.locator('//div[@class="dropdown-item"]').first().click();

  // //Driver
  // await page.locator('//input[@placeholder="Enter driver name"]').click();
  // await page.locator('//input[@placeholder="Enter driver name"]').fill(Driver);

  // //Driver Licence No
  // await page
  //   .locator('//input[@placeholder="Enter driver licence number"]')
  //   .click();
  // await page
  //   .locator('//input[@placeholder="Enter driver licence number"]')
  //   .fill(Driver_Licence_No);

  // await clickAndMeasureDynamic(
  //   page,
  //   '//button[normalize-space()="GO"]',
  //   '//input[@placeholder="Enter container number"]',
  //   "Route to Go",
  // );

  //Container No
  // const ContainerNo = "PWTU" + getRandomNumberString(7);

  const ContainerNo = await readTestArtifact("PreContainer1.txt");

  //Add Container
  await page
    .locator('//input[@placeholder="Enter container number"]')
    .fill(ContainerNo);

   await page.waitForTimeout(5000);

//    const EmptyYard = page.locator(GateImport.EmptyYard);

// // First click: open dropdown
// await EmptyYard.locator('.dropdown-header').click({ force: true });

// // Second click: activate the search field
// await EmptyYard.locator('.dropdown-input').click({ force: true });

// // Wait for the input to appear
// const searchInput = EmptyYard.locator('input');

// await searchInput.waitFor({
//   state: 'visible',
//   timeout: 10000
// });

// // Search and select
// await searchInput.fill('Stop 1');

// await EmptyYard.getByText('Stop 1', { exact: true }).click({ force: true });

// const EmptyYard = page.locator(GateImport.EmptyYard);

// // Open dropdown
// await EmptyYard.locator('.dropdown-header').click({ force: true });

// // Select the value directly
// await EmptyYard.getByText('Stop 1', { exact: true }).click({ force: true });

  // await page.locator(GateImport.Transportdropdown1).click();
  //     await page.waitForTimeout(1000);
  //     if (!(await page.locator(GateImport.TransportDropdownFirst).isVisible())) {
  //       await page.locator(GateImport.Transportdropdown1).click();
  //     }
  //     await page.locator(GateImport.TransportDropdownFirst).click();

// const DepotQC = page.locator(GateImport.DepotQualityCODE1);

// // Open dropdown
// await DepotQC.locator('.dropdown-header').click({ force: true });

// // Select the value directly
// await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });



// const DepotQC = page.locator(GateImport.DepotQualityCODE1);

// // First click: open dropdown
// await DepotQC.locator('.dropdown-header').click({ force: true });

// // Second click: activate the search field
// await DepotQC.locator('.dropdown-input').click({ force: true });

// // Wait for the input to appear
// const searchInput1 = DepotQC.locator('input');

// await searchInput1.waitFor({
//   state: 'visible',
//   timeout: 10000
// });

// // Search and select
// await searchInput1.fill('AQUABA');

// await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });

  const Gate = page.locator(GateImport.Gate);

  await Gate.click({ force: true });

  await Gate.locator('input').fill('Gate10021');

  await Gate.getByText('Gate10021', { exact: true }).click({ force: true });

  const DepotSize = page.locator(GateImport.DepotSize);

  await DepotSize.click({ force: true });

  await DepotSize.locator('input').fill('20 STD');

  await DepotSize.getByText('20 STD (20STD)', { exact: true }).click({ force: true });

  const ISOSize1 = page.locator(GateImport.ISOSize);

  await ISOSize1.click({ force: true });

  await ISOSize1.locator('input').fill('20G1');

  await ISOSize1.getByText('20G1', { exact: true }).click({ force: true });

  const DepotQC = page.locator(GateImport.DepotQualityCODE1);

  await DepotQC.click({ force: true });

  await DepotQC.locator('input').fill('AQUABA');

  await DepotQC.getByText('AQUABA', { exact: true }).click({ force: true });


// Select the Empty Yard dropdown
// Empty Yard dropdown
// await page.locator(GateImport.EmptyYard).click();


// Open dropdown
//await emptyYard.locator('.dropdown-header').click({ force: true });

// Select first option using your existing locator
// const firstYardOption = page.locator(
//   GateEmpty.EmptyYardFirstOption
// );

// await firstYardOption.waitFor({
//   state: 'visible',
//   timeout: 10000
// });

// await firstYardOption.click();

const emptyYard = page.locator(GateImport.EmptyYard);

// Retry opening the dropdown if needed
const firstYardOption = page.locator(GateEmpty.EmptyYardFirstOption);

for (let attempt = 0; attempt < 3; attempt++) {
  await emptyYard.waitFor({ state: 'visible', timeout: 10000 });

  // Click the dropdown
  await emptyYard.click();

  // Check whether the first option becomes visible
  try {
    await firstYardOption.waitFor({
      state: 'visible',
      timeout: 3000
    });

    break;
  } catch {
    if (attempt === 2) {
      throw new Error('Empty Yard dropdown did not open after 3 attempts');
    }
  }
}

// Select the first option
await firstYardOption.click();

await page.waitForTimeout(1000);

await page.locator(GateImport.MFGdate).type(`${getNextDateTimeFormatted(0).day}`, { delay: 200 });
await page.keyboard.type(`${getNextDateTimeFormatted(0).month}`, { delay: 200 });
await page.keyboard.type(`${getNextDateTimeFormatted(0).year}`, { delay: 200 });

// await page.locator(CSMExport.EstDtTime).click();
//         await selectFutureDay(page, 3);



//   const yardDropdown = page.locator(
//   'app-searchable-dropdown[formcontrolname="yardStop"]'
// );

// // Open the dropdown
// await yardDropdown.locator('.dropdown-header').click();

// // Print the HTML after opening
// console.log(
//   await yardDropdown.evaluate(el => el.outerHTML)
// );

// const yardDropdown = page.locator(
//   'app-searchable-dropdown[formcontrolname="yardStop"]'
// );

// await yardDropdown.locator('.dropdown-header').click();

// const options = page.locator('.dropdown-option');
// await options.first().waitFor({ state: 'visible' });
// await options.first().click();
  // if (await page.locator(GateImport.EmptyYard).isVisible()) {
  //       await page.locator(GateImport.EmptyYard).click();
  //       if (!(await page.locator(GateEmpty.EmptyYardFirstOption).isVisible())) {
  //         await page.locator(GateEmpty.EmptyYard).click();
  //       }
  //       await page.locator(GateEmpty.EmptyYardFirstOption).click();
  //     }

  // const EmptyYard = page.locator(GateImport.EmptyYard);

  // await EmptyYard.click({ force: true });

  // await EmptyYard.locator('input').fill('Stop 1');

  // await EmptyYard.getByText('Stop 1', { exact: true }).click({ force: true });

//   const EmptyYard1 = page.locator(GateImport.EmptyYard);
 
//  await EmptyYard1.click({ force: true });
 
//  await EmptyYard1.locator('input').click({ force: true });
 
//  await EmptyYard1.locator('input').fill('Stop 1');
 
//  await EmptyYard1.getByText('Stop 1', { exact: true }).click({ force: true });

 //await page.locator('//input[@formcontrolname="manufacturedDate"]').click();
 //   await selectFutureDay(page, 2);

  // // Locator for error popup
  // const preAnnounceError = page.locator(
  //   '//div//span[contains(text(),"is not Pre-announced.")]',
  // );

  // // Wait briefly for message rendering
  // await page.waitForTimeout(3000);

  // // Check if popup appeared
  // if (await preAnnounceError.isVisible()) {
  //   const errorText = await preAnnounceError.textContent();
  //   console.log("❌ Error Popup Appeared:", errorText);
  // } else {
  //   console.log("✅ Container : " + ContainerNo + " is pre-announced.");
  // }

  // //Operator
  // await page
  //   .locator(
  //     '//input[@placeholder="Type to search operator (use %%% for all)"]',
  //   )
  //   .first()
  //   .click();
  // await page
  //   .locator(
  //     '//input[@placeholder="Type to search operator (use %%% for all)"]',
  //   )
  //   .fill(Operator);
  // await page.locator(`//div[normalize-space()="${Operator}"]`).first().click();

  // //Depot Size
  // await page
  //   .locator('//div[normalize-space()="Select depot size"]')
  //   .first()
  //   .click();
  // await page
  //   .locator('//input[@placeholder="Select depot size"]')
  //   .fill(Depot_Size);
  // await page.locator('//div[@class="dropdown-item"]').first().click();

  // //ISO Size
  // await page
  //   .locator('//div[normalize-space()="Select ISO size"]')
  //   .first()
  //   .click();
  // await page.locator('//input[@placeholder="Select ISO size"]').fill(ISO_Size);
  // await page.locator(`//div[normalize-space()="${ISO_Size}"]`).first().click();

  // //Primary A/c Holder
  // await page
  //   .locator('//input[@placeholder="Type to search account holder"]')
  //   .first()
  //   .click();
  // await page
  //   .locator('//input[@placeholder="Type to search account holder"]')
  //   .fill(Primary_AC_Holder);

  //Depot Condition Code
  // await page
  //   .locator('//div[normalize-space()="Select depot condition code"]')
  //   .first()
  //   .click();
  // await page
  //   .locator('//input[@placeholder="Select depot condition code"]')
  //   .fill('Available');
  // await page
  //   .locator(`//div[normalize-space()="${Depot_Condition_Code}"]`)
  //   .first()
  //   .click();

  // //Depot Quality Code
  // await page
  //   .locator('//div[normalize-space()="Select depot quality code"]')
  //   .first()
  //   .click();
  // await page.locator('//div[@class="dropdown-item"]').first().click();

  // //Condition Survey Remark
  // await page
  //   .locator('//input[@formcontrolname="comment"]')
  //   .fill(Condition_Remark);

  // writeTestArtifact("Depot_Estimate_SurveyRemark.txt", Condition_Remark);

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//button[normalize-space()="Execute"]',
    "Route to Add",
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Execute"]',
    '//button[normalize-space()="Truck In"]',
    "Route to Execute",
  );
}