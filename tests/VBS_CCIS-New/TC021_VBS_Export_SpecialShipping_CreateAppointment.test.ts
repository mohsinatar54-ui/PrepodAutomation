import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted,SelectVehicleType,selectEntityAndSite, getRandomNumberString, Createfile, readTestArtifact,writeTestArtifact, setBookingTypeCapacity } from '../../utils/test-helpers_VBS_CCIS';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, readTestArtifact, selectEntityAndSite, selectFutureDay } from '../../utils/test-helpers';
import { setBookingTypeCapacity, SelectVehicleType} from '../../utils/test-helpers_VBS_CCIS';
import { Master,Appointments} from 'Locators/All locators/VBSMasters';
import { Common, CSMExport } from 'Locators/BookingLocators';
import { ExportBooking_XITF } from 'Flows/ExportFlow';
// import { Vehicle_No } from './Gate_Operation_Import.test';

//Create Appointment
const bookingType = 'Export';
// const bookingNo = '98960BN20260109001IMP';
const Gate_Name = 'GATE 1';
const Service = 'Drop Off';
// const transporter = 'ADITYA LOGISTICS';
const transporter = 'MMJ LOGISTICS';
export let appointmentNo = '';
// export const bookingNo = readTestArtifact('VBS_ExportSpecial_BookingNumber.txt')
export const Cancel_Remark = 'Cancelling appointment with Automation script';


const exportData = {
  PrimaryACCountHolder: 'ADITYA LOGISTICS',
  OperatorID: 'MMJ LOGISTICS',
  DepotSizeType: '20 STD (20STD)',
  ISOSizeType: '22G1',
  TotalContainers: '5',
  CargoWeight: '1000',
  CargoVolume: '1000',
  WeightUnit: 'Tonnes',
  VolumeUnit: 'Cubic Meter',
  CargoPackages: '100',
  PackageType: 'Bulk',
  Commodity: 'Aluminium',
  FreightKind: 'FCL',
  Sealtype: 'ESEAL',
  // PortOfLoading: 'JNPT',
  POA: 'BPCL',
  POL: 'VAGE',
  FOBValue: '500000',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Depot Gate Operation',
  JobDescription: '3: 1078', // 'Container In By Truck From Factory Stuffing (XITF)'
  ContainerNo: 'PWTU' + getRandomNumberString(7),
  business_identification_no: 'BIN' + getRandomNumberString(10),
  Shipping_Bill_Number: getRandomNumberString(7),
};

test.beforeEach(async ({ page }) => {
    await login(page);
    await selectEntityAndSite(page);
// Removed extra closing brace causing syntax error
});

test('VBS_SetShipping_Special_Enable', async ({ page }) => {
  // test.setTimeout(120000); // Set timeout to 2 minutes
  await test.step('Create appointment for the booking', async () => {
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.ShippingLineTab, 'Navigate to Master');
  await clickAndMeasureDynamic(page, Master.ShippingLineTab, Master.Edit_ShippingLine(exportData.OperatorID), 'Navigate to Shipping Line Master');
  await page.locator(Master.Edit_ShippingLine(exportData.OperatorID)).click();
  const ShippingEnabled = await page
    .locator(Master.Checkbox_ShippingLine(exportData.OperatorID))
    .isChecked();
  if (!ShippingEnabled) {
    await page.locator(Master.Checkbox_ShippingLine(exportData.OperatorID)).click();
    await page.locator(Master.Save_ShippingLine(exportData.OperatorID)).click();
  } else {
    console.log('Shipping Line already enabled, proceeding with test');
  }
  await page.locator(Master.Save_ShippingLine(exportData.OperatorID)).click();
  await expect(page.locator(`//tr[td[normalize-space()="${exportData.OperatorID}"]]//i[contains(@class,'fa-check')]`)).toBeVisible();
 });
});

test('Export FLow XITF', async ({ page }) => {
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
    await page.locator('div').filter({ hasText: /^\*Shipping Bill Number$/ }).getByRole('textbox').fill(exportData.Shipping_Bill_Number);
    // const today = new Date();
    // const yyyy = today.getFullYear();
    // const mm = String(today.getMonth() + 1).padStart(2, '0');
    // const dd = String(today.getDate()).padStart(2, '0');
    // const todaydate = `${yyyy}-${mm}-${dd}`;
    // await page.locator('input[type="date"]').fill(todaydate);
    await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="SBDate"]').click();
    await selectFutureDay(page, 0);
    await page.locator('div').filter({ hasText: /^Business Identification No\.$/ }).getByRole('textbox').fill(exportData.business_identification_no);
    await page.getByRole('textbox', { name: 'Search Exporter...' }).fill(exportData.PrimaryACCountHolder);
    await page.getByText(exportData.PrimaryACCountHolder).first().click();
    // await page.getByText('*Shipping Bill Number*').click();
    await page.getByRole('textbox', { name: 'Search CHA...' }).fill(exportData.OperatorID);
    await page.getByText(exportData.OperatorID).first().click();
    await page.fill('input[formcontrolname="FOB_VAL"]', exportData.FOBValue);
    // await page.locator(CSMExport.LoadingPort).selectOption("VAGE");
    await page.locator('//select[@formcontrolname="PortOfLoading"]').selectOption(exportData.POL);
    await page.locator(CSMExport.DischargePort).selectOption(exportData.POA);
    await page.locator(CSMExport.containerFullIn).click();
    // await page.getByRole('button', { name: 'Add' }).click();
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.UpdateDetails, 'Submit booking details');
    await expect(await page.locator(CSMExport.Exp_BookingNumber)).toBeVisible();
    const ExportbookingNo = (await page.locator(CSMExport.Exp_BookingNumber).innerText()).replace(/\s+/g, '');
    await writeTestArtifact('VBS_ExportSS_BookingNumber.txt', `${ExportbookingNo}`);
  });

  await test.step('Step 4: Update Booking record with Cargo details', async () => {
    
    await page.locator(CSMExport.UpdateDetails).click();
    // Search and select Exporter
    // await page.pause();
    await page.waitForTimeout(3000);
     await page.locator(CSMExport.AccntHolder).fill(exportData.PrimaryACCountHolder);
     await page.locator('li[role="option"]').first().click();
     await page.locator(CSMExport.Operator).fill(exportData.OperatorID);
     await page.locator('li[role="option"]').first().click();
     await page.locator(CSMExport.Update).click();
    
    await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
    await clickAndMeasureDynamic(page, CSMExport.AddCargo, CSMExport.ClickONFP, 'Add Cargo');
    await page.locator(CSMExport.ClickONFP).click();
    await page.locator(CSMExport.Weight).fill(exportData.CargoWeight);
    await page.locator(CSMExport.WtUnit).selectOption({ label: `${exportData.WeightUnit}` });
    // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.CargoV).fill(exportData.CargoVolume);
    // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
    await page.locator(CSMExport.VUnit).selectOption({ label: `${exportData.VolumeUnit}` });
    await page.waitForTimeout(1000);
    await page.locator(CSMExport.PkgNum).fill(exportData.CargoPackages);
    await page.locator(CSMExport.PkgId).selectOption(exportData.PackageType);
    await page.locator(CSMExport.ComId).selectOption(exportData.Commodity);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddCargo, 'Submit Add Cargo');
    console.log('Cargo added successfully');
  });


  await test.step('Step 5:Add container into Booking Record', async () => {
    
    await clickAndMeasureDynamic(page, CSMExport.Container, CSMExport.AddContainer, 'Route to Container tab');
    await clickAndMeasureDynamic(page, CSMExport.AddContainer, CSMExport.ConInfo, 'Click Add Container');
    await page.click(CSMExport.ConInfo);
    await writeTestArtifact('VBS_ExportSS_Container_Number.txt', exportData.ContainerNo)
    console.log(`Container Number stored: ${exportData.ContainerNo}`);
    await page.locator(CSMExport.ConIn).fill(exportData.ContainerNo);
    await page.locator(CSMExport.SelectLFCL).selectOption({ label: `${exportData.FreightKind}` });
    await page.locator(CSMExport.Deposize).selectOption({ label: `${exportData.DepotSizeType}` });
    await page.locator(CSMExport.ISOsize).selectOption({ label: `${exportData.ISOSizeType}` });
    await page.locator(CSMExport.Equipment).selectOption({ label: `${exportData.Sealtype}` });
  });

  await test.step('Step 6: Add container with Enhancement filed into Booking Record', async () => {
    await page.locator(CSMExport.PortOfLoading).selectOption(exportData.POL);
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
    await page.locator('(//input[@type="number"])[1]').fill(exportData.CargoPackages);
    await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
    await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
    await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
    await page.locator(CSMExport.JobCatId).selectOption(exportData.JobCategory);
    await page.locator(CSMExport.JobActId).selectOption(exportData.JobActivityPoint);
    // await page.locator(CSMExport.JobDesc).selectOption({ value: JobDescription });
    await page.locator(CSMExport.JobDesc).selectOption({ value: exportData.JobDescription });
    await page.locator(CSMExport.JobConId).selectOption(exportData.ContainerNo);
    await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
    await page.click(CSMExport.Save);
    await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
    console.log('Export Booking created successfully');
  });
});

// test('Create Export Booking', async ({ page }) => {
//   await test.step('Step 2: Select Booking with Export Type', async () => {
//       await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
//       await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');
//       await clickAndMeasureDynamic(page, CSMExport.ClickonBooking, CSMExport.AddBooking, 'Route to Export booking screen');
//     });
  
//     await test.step('Step 3: Create new Export Booking Record', async () => {
//       await clickAndMeasureDynamic(page, CSMExport.AddBooking, CSMExport.SubBooking, 'Route to Export booking screen');
//       await page.locator('div').filter({ hasText: /^\*Shipping Bill Number$/ }).getByRole('textbox').fill(Shipping_Bill_Number);
//       const today = new Date();
//       const yyyy = today.getFullYear();
//       const mm = String(today.getMonth() + 1).padStart(2, '0');
//       const dd = String(today.getDate()).padStart(2, '0');
//       const todaydate = `${yyyy}-${mm}-${dd}`;
//       await page.locator('input[type="date"]').fill(todaydate);
//       await page.locator('div').filter({ hasText: /^Business Identification No\.$/ }).getByRole('textbox').fill(business_identification_no);
//       await page.getByRole('textbox', { name: 'Search Exporter...' }).fill('MMJ');
//       await page.getByText('MMJ LOGISTICS').first().click();
//       // await page.getByText('*Shipping Bill Number*').click();
//       await page.getByRole('textbox', { name: 'Search CHA...' }).fill('MMJ');
//       await page.getByText('MMJ LOGISTICS').first().click();
//       await page.fill('input[formcontrolname="FOB_VAL"]', '500000');
//       await page.locator(CSMExport.LoadingPort).selectOption("VAGE");
//       await page.locator(CSMExport.DischargePort).selectOption("Port den");
//       await page.locator(CSMExport.containerFullIn).click();
//       // await page.getByRole('button', { name: 'Add' }).click();
//       await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.UpdateDetails, 'Submit booking details');
//       await expect(await page.locator(CSMExport.Exp_BookingNumber)).toBeVisible();
//       const ExportbookingNo = (await page.locator(CSMExport.Exp_BookingNumber).innerText()).replace(/\s+/g, '');
//       writeTestArtifact('VBS_ExportSpecial_BookingNumber.txt', `${ExportbookingNo}`);
//     });
  
//     await test.step('Step 4: Update Booking record with Cargo details', async () => {
      
//       await page.locator(CSMExport.UpdateDetails).click();
//       // Search and select Exporter
//       // await page.pause();
//       await page.waitForTimeout(3000);
//        await page.locator(CSMExport.AccntHolder).fill(PrimaryACCountHolder);
//        await page.locator('li[role="option"]').first().click();
//        await page.locator(CSMExport.Operator).fill(OperatorID);
//        await page.locator('li[role="option"]').first().click();
//        await page.locator(CSMExport.Update).click();
      
//       await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
//       await clickAndMeasureDynamic(page, CSMExport.AddCargo, CSMExport.ClickONFP, 'Add Cargo');
//       await page.locator(CSMExport.ClickONFP).click();
//       await page.locator(CSMExport.Weight).fill(CargoWeight);
//       await page.locator(CSMExport.WtUnit).selectOption({ label: `${WeightUnit}` });
//       // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
//       await page.waitForTimeout(1000);
//       await page.locator(CSMExport.CargoV).fill(CargoVolume);
//       // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
//       await page.locator(CSMExport.VUnit).selectOption({ label: `${VolumeUnit}` });
//       await page.waitForTimeout(1000);
//       await page.locator(CSMExport.PkgNum).fill(CargoPackages);
//       await page.locator(CSMExport.PkgId).selectOption(PackageType);
//       await page.locator(CSMExport.ComId).selectOption(Commodity);
//       await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddCargo, 'Submit Add Cargo');
//       console.log('Cargo added successfully');
//     });
  
  
//     await test.step('Step 5:Add container into Booking Record', async () => {
      
//       await clickAndMeasureDynamic(page, CSMExport.Container, CSMExport.AddContainer, 'Route to Container tab');
//       await clickAndMeasureDynamic(page, CSMExport.AddContainer, CSMExport.ConInfo, 'Click Add Container');
//       await page.click(CSMExport.ConInfo);
//       writeTestArtifact('VBS_ExportSpecial_ContainerNumber.txt', ContainerNo);
//       console.log(`Container Number stored: ${ContainerNo}`);
//       await page.locator(CSMExport.ConIn).fill(ContainerNo);
//       await page.locator(CSMExport.SelectLFCL).selectOption({ label: `${FreightKind}` });
//       await page.locator(CSMExport.Deposize).selectOption({ label: `${DepotSizeType}` });
//       await page.locator(CSMExport.ISOsize).selectOption({ label: `${ISOSizeType}` });
//       await page.locator(CSMExport.Equipment).selectOption({ label: `${Sealtype}` });
//     });
  
//     await test.step('Step 6: Add container with Enhancement filed into Booking Record', async () => {
//       await page.locator(CSMExport.PortOfLoading).selectOption(POL);
//       await page.locator(CSMExport.Remark).fill("QA_Automation");
//       await page.locator(CSMExport.OtherDetails).click();
//       await page.locator(CSMExport.Hold).click();
//       await page.locator(CSMExport.HoldType).selectOption("Shipping line hold");
//       await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.AddContainer, 'Update Container');
//       console.log('Container added successfully');
//     });
  
//     await test.step('Step 7:Create job order for new Booking Record', async () => {
//         await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
//         await page.locator(CSMExport.button).click();
//         await page.locator(CSMExport.Map).click();
//         // await page.locator(CSMExport.CargoPkg).fill(CargoPackages);
//         await page.locator('(//input[@type="number"])[1]').fill(CargoPackages);
//         await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
//         await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
//         await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
//         await page.locator(CSMExport.JobCatId).selectOption(JobCategory);
//         await page.locator(CSMExport.JobActId).selectOption(JobActivityPoint);
//         // await page.locator(CSMExport.JobDesc).selectOption({ value: JobDescription });
//         await page.locator('//select[@formcontrolname="JODID"]').selectOption({ value: JobDescription });
//         await page.locator(CSMExport.JobConId).selectOption(ContainerNo);
//         await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
//         await page.click(CSMExport.Save);
//         await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
//         console.log('Export Booking created successfully');
//       });
//     // await test.step('Step 7:Create job order for new Booking Record', async () => {
//     //   await clickAndMeasureDynamic(page, CSMExport.Cargo, CSMExport.AddCargo, 'Add Cargo');
//     //   await page.locator(CSMExport.button).click();
//     //   await page.locator(CSMExport.Map).click();
//     //   await page.locator(CSMExport.CargoPkg).fill(CargoPackages);
//     //   await clickAndMeasureDynamic(page, CSMExport.SubmitMap, CSMExport.JobOrder, 'Map Cargo to Container');
//     //   await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
//     //   await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobId, 'Add Job Order');
//     //   await page.locator(CSMExport.JobCatId).selectOption(JobCategory);
//     //   await page.locator(CSMExport.JobActId).selectOption(JobActivityPoint);
//     //   await page.locator(CSMExport.JobDesc).selectOption({ value: JobDescription });
//     //   await page.locator(CSMExport.JobConId).selectOption(ContainerNo);
//     //   await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
//     //   await page.click(CSMExport.Save);
//     //   await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
//     //   console.log('Export Booking created successfully');
//     // });
// });  

test('ExportCreateAppointment for special shipping Enabled', async ({ page }) => {
  test.setTimeout(160_000)
  let appointmentNo = '';
  const bookingNo = await readTestArtifact('VBS_ExportSS_BookingNumber.txt');
  await test.step('Login and Route to Appointments', async () => {  
    await page.locator(Master.VBS_Microservice).click();
    await SelectVehicleType(page, 'Truck');
    await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');
  });

  await test.step('Fill details and Create Appointment', async () => {
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');

    // Open transporter dropdown and pick by label
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });

    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');

    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));

    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));

    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });

    // Fill booking number
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    await expect(
      page.locator('.confirm-box-message')
    ).toHaveText(
      'Special shipping line detected - time slots will be not be required for this booking'
    );
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    await page.waitForTimeout(2000);
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    // await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
    await expect(page.locator(Appointments.SlotDropdown)).not.toBeVisible();

    // Click on the first checkbox (could be terms or agree)
    await page.click(Appointments.FirstCheckbox);

    // Click Submit button
    await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');
  });

  await test.step('Cancel the created appointment', async () => {
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    await writeTestArtifact('VBS_ExportSS_Appointment_Number.txt', appointmentNo);

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentLinkByNo(appointmentNo) + ' /preceding-sibling::button',
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      'Click Cancel icon'
    );
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      Appointments.AppointmentCancelYesButton,
      'Click Yes button'
    );

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelYesButton,
      Appointments.AppointmentCancelRemarkTextarea,
      'Click Yes button to cancel appointment'
    );
    await page.click(Appointments.AppointmentCancelBookingButton);
    await expect(page.getByText('Please enter a remark before cancelling.')).toBeVisible();
    await page.fill(Appointments.AppointmentCancelRemarkTextarea, Cancel_Remark);
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelBookingButton,
      Appointments.AppointmentCancelSuccessToast,
      'Confirm cancellation'
    );
    await expect(page.getByText(/Booking cancelled successfully!/)).toBeVisible();
  });
  await test.step('Verify appointment is cancelled', async () => {  
    await expect(page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo))).toHaveText('Cancelled');
    const appointmentStatusLocator = page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo));
    const appointmentStatus = await appointmentStatusLocator.textContent();
    console.log('Appointment Status:', appointmentStatus);
    await expect(appointmentStatusLocator).toHaveText('Cancelled');

    await expect(page.locator(Appointments.AppointmentStatusCellByAppointmentNo(appointmentNo))).toHaveText('Cancelled');
    await expect(page.locator(Appointments.AppointmentCancelRemarkCellByAppointmentNo(appointmentNo))).toHaveText(Cancel_Remark);
  });
  // End of test steps
});

test('VBS_SetShipping_Special_Disable', async ({ page }) => {
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Master.MastersTab, Master.ShippingLineTab, 'Navigate to Master');
  await clickAndMeasureDynamic(page, Master.ShippingLineTab, Master.Edit_ShippingLine(exportData.OperatorID), 'Navigate to Shipping Line Master');
  await page.locator(Master.Edit_ShippingLine(exportData.OperatorID)).click();
  const ShippingDisabled = await page
    .locator(Master.Checkbox_ShippingLine(exportData.OperatorID))
    .isChecked();
  if (ShippingDisabled) {
    await page.locator(Master.Checkbox_ShippingLine(exportData.OperatorID)).click();
    await page.locator(Master.Save_ShippingLine(exportData.OperatorID)).click();
  } else {
    console.log('Shipping Line already disabled, proceeding with test');
  }
  // await page.locator(Master.Save_ShippingLine(exportData.OperatorID)).click();
  await expect(page.locator(`//tr[td[normalize-space()="${exportData.OperatorID}"]]//i[contains(@class,'fa-xmark')]`)).toBeVisible();
});

test('Export_CreateAppointment with Special Shipping disabled', async ({ page }) => {
  let appointmentNo = '';
  const bookingNo = readTestArtifact('VBS_ExportSS_BookingNumber.txt');
  await page.locator(Master.VBS_Microservice).click();
  await SelectVehicleType(page, 'Truck');
  await clickAndMeasureDynamic(page, Appointments.AppointmentsTab, Appointments.CreateAppointmentButton, 'Go to Appointments');

  await test.step('Fill details and Create Appointment', async () => {
    // Wait for Create Appointment button to appear and click it
    await clickAndMeasureDynamic(page, Appointments.CreateAppointmentButton, Appointments.TransporterDropdown, 'Click Create Appointment button');

    // Open transporter dropdown and pick by label
    await page.locator(Appointments.TransporterDropdown).selectOption({ label: `${transporter}` });

    // Fill driverName
    await page.fill(Appointments.DriverNameInput, 'Automation Test');

    await page.fill(Appointments.ContactNumberInput, getRandomNumberString(10));

    await page.fill(Appointments.TruckNumberInput, 'MH' + getRandomNumberString(6));

    await page.fill(Appointments.LicenceNoInput, 'LIC' + getRandomNumberString(8));

    await page.locator(Appointments.BookingTypeDropdown).selectOption({ label: `${bookingType}` });

    // Fill booking number
    await page.fill(Appointments.BookingNoInput, `${bookingNo}`);
    await clickAndMeasureDynamic(page, Appointments.BookingNoOption(bookingNo), Appointments.ServiceDropdown, 'Select Booking Number');
    // await expect(
    //   page.locator('.confirm-box-message')
    // ).toHaveText(
    //   'Special shipping line detected - time slots will be not be required for this booking'
    // );
    // await page.locator(Appointments.ServiceDropdown).selectOption({ label: `${Service}` });
    await page.locator(Appointments.ServiceDropdown).isDisabled();
    await page.waitForTimeout(2000);
    await page.locator(Appointments.GateDropdown).selectOption({ label: `${Gate_Name}` });
    await page.locator(Appointments.DateInput).type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
    await page.waitForTimeout(2000); // Wait for time to be processed
    await page.locator(Appointments.SlotDropdown).selectOption({ index: 2 });
    // await expect(page.locator(Appointments.SlotDropdown)).not.toBeVisible();

    // Click on the first checkbox (could be terms or agree)
    await page.click(Appointments.FirstCheckbox);

    // Click Submit button
    await clickAndMeasureDynamic(page, Appointments.SaveAppointmentButton, Appointments.AppointmentViewLink, 'Click Submit button');
  });

  await test.step('Cancel the created appointment', async () => {
    // Get the text of the <a> element with class "text-blue-600 hover:underline"
    const appointmentLink = await page.locator(Appointments.AppointmentViewLink);
    const appointmentText = await appointmentLink.textContent();
    const appointmentNoRaw = appointmentText ?? '';
    const appointmentNoStripped = appointmentNoRaw.replace(/\s+/g, '');
    appointmentNo = appointmentNoStripped;

    await writeTestArtifact('VBS_ExportSS_Appointment_Number.txt', appointmentNo);

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentLinkByNo(appointmentNo) + ' /preceding-sibling::button',
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      'Click Cancel icon'
    );
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelButtonByNo(bookingNo),
      Appointments.AppointmentCancelYesButton,
      'Click Yes button'
    );

    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelYesButton,
      Appointments.AppointmentCancelRemarkTextarea,
      'Click Yes button to cancel appointment'
    );
    await page.click(Appointments.AppointmentCancelBookingButton);
    await expect(page.getByText('Please enter a remark before cancelling.')).toBeVisible();
    await page.fill(Appointments.AppointmentCancelRemarkTextarea, Cancel_Remark);
    await clickAndMeasureDynamic(
      page,
      Appointments.AppointmentCancelBookingButton,
      Appointments.AppointmentCancelSuccessToast,
      'Confirm cancellation'
    );
    await expect(page.getByText(/Booking cancelled successfully!/)).toBeVisible();
  });

  await test.step('Verify appointment is cancelled', async () => {  
    await expect(page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo))).toHaveText('Cancelled');
    const appointmentStatusLocator = page.locator(Appointments.AppointmentStatusCellByBookingNo(bookingNo));
    const appointmentStatus = await appointmentStatusLocator.textContent();
    console.log('Appointment Status:', appointmentStatus);
    await expect(appointmentStatusLocator).toHaveText('Cancelled');

    await expect(page.locator(Appointments.AppointmentStatusCellByAppointmentNo(appointmentNo))).toHaveText('Cancelled');
    await expect(page.locator(Appointments.AppointmentCancelRemarkCellByAppointmentNo(appointmentNo))).toHaveText(Cancel_Remark);
    page.close();
  });
});