import { test, expect } from "@playwright/test";
import {clickAndMeasureDynamic, login, getRandomNumberString,writeTestArtifact, selectFutureDay,} from "../../../utils/test-helpers";
import { Common, CSMImport } from "../../../Locators/BookingLocators";
// import fs from "fs";

const DepotSizeType = "20 STD (20STD)";
const ISOSizeType = "22G1";
const TotalContainers = "5";
const Transport_Mode = "Vessel";
const CHA_Name = "MMJ LOGISTICS";
const OperatorID = "MAERSKLINE";
const Commodity = "WHEAT";
const PortOfLoading = "BPCL";
const PortOfArrival = "MUMBAI";
const DECWeight = "1000";
const DECVolume = "1000";
const WeightUnit = "Tonnes";
const VolumeUnit = "Cubic Meter";
const Packages = "100";
const PackageType = "Bulk";
const FreightKind = "FCL";
const JobCategory = "Container Job";
const JobActivityPoint = "Depot Gate Operation";
const JobDescription = "1078"; //'Container In By Truck From Factory Stuffing (XITF)';

test("TC001_CSM_Import_MOTL", async ({ page }) => {
  // Step 1: Start tracing for this tes
  // Step 2: Go to Login Page
  await login(page);
  await clickAndMeasureDynamic(
    page,
    Common.CustomerServiceLogo,
    Common.BookingTab,
    "Route to Customer Service",
  );

  await clickAndMeasureDynamic(
    page,
    Common.BookingTab,
    CSMImport.ImportBookingsButton,
    "Route to Booking tab",
  );

  await clickAndMeasureDynamic(
    page,
    CSMImport.ImportBookingsButton,
    CSMImport.AddBookingButton,
    "Route to Import booking screen",
  );

  await clickAndMeasureDynamic(
    page,
    CSMImport.AddBookingButton,
    CSMImport.LIGMNumberInput,
    "Add Import Booking",
  );
  // page.pause();

  // const LIGM_No = getRandomNumberString(15);
  await page.locator(CSMImport.LIGMNumberInput).fill(getRandomNumberString(15));
  await page.waitForTimeout(1000);
  // await page.locator('//input[@formcontrolname="LIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  const LineNumber = getRandomNumberString(5);
  await page.locator(CSMImport.LineNumberInput).fill(LineNumber);
  writeTestArtifact("Cargo_Number.txt", `${LineNumber}`);

  const blnNumber = "BLN" + getRandomNumberString(10);
  await page.locator(CSMImport.BLNumberInput).type(blnNumber);
  await page.waitForTimeout(1000);
  // await page.locator('//input[@formcontrolname="BLDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.GIGMNumberInput).type(getRandomNumberString(7));
  await page.waitForTimeout(1000);
  //await page.pause();
  // await page.locator('//input[@formcontrolname="GIGMDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.SMTPNumberInput).type("SMTP" + getRandomNumberString(7));
  // await page.waitForTimeout(1000);
  // await page.locator('//input[@formcontrolname="SMTPDate"]').type(`${getNextDateTimeFormatted(1).date}`, { delay: 200 });
  await page.locator(CSMImport.TModeTypeSelect).selectOption(Transport_Mode);
  await page.locator(CSMImport.TModeAgentInput).type("Transport Mode Agent");
  await page.locator(CSMImport.PortOfLoadingSelect).selectOption(PortOfLoading);
  await page.locator(CSMImport.PortOfArrivalSelect).selectOption(PortOfArrival);
  // await page.locator('input[formcontrolname="ArrivalDate"]').fill(`${getNextDateTimeFormatted(1).date}`);
  await page.locator(CSMImport.BreifCargoDescriptionTextarea).fill("This is an automation test for Import Booking");

  await clickAndMeasureDynamic(
    page,
    CSMImport.SubmitBookingButton,
    CSMImport.UpdateDetailsButton,
    "Submit booking details",
  );

  // const blnNumber =  'BLN6091551403';
  // await page.locator(`//a[normalize-space()="${blnNumber}"]`).click();
  // Minimized script: get booking number, log to console and file
  // Extract the booking number (IMP number) from the corresponding <strong> tag
  const bookingNumber = await page.locator(CSMImport.BookingNumberLabel).textContent();
  console.log("Booking Number:", bookingNumber);
  // Extract and log the BLN number as shown on the screen to the same file as booking number
  console.log("BLN Number:", blnNumber);
  writeTestArtifact("Cargo_Hold_BookingNo.txt", `${bookingNumber}`);

  await clickAndMeasureDynamic(
    page,
    CSMImport.UpdateDetailsButton,
    CSMImport.BookingDetails,
    "Update booking details",
  );

  await page.locator(CSMImport.CHAAutocompleteInput).fill(CHA_Name);
  await page.locator(CSMImport.AutocompleteOption).first().click();

  await page.locator(CSMImport.OperatorAutocompleteInput).fill(OperatorID);
  await page.locator(CSMImport.AutocompleteOption).first().click();

  await page.locator(CSMImport.SearchCHAInput).fill(CHA_Name);
  await page.locator(CSMImport.AutocompleteOption).first().click();
  await page.locator(CSMImport.CommoditySelect).selectOption(Commodity);

  //await page.pause();
  await page.locator(CSMImport.UpdateButton).isVisible();
  await clickAndMeasureDynamic(
    page,
    CSMImport.UpdateButton,
    CSMImport.CargoTabButton,
    "Update booking details",
  );
  await page.locator(CSMImport.CargoTabButton).isVisible();
  await clickAndMeasureDynamic(
    page,
    CSMImport.CargoTabButton,
    CSMImport.AddNewCargoButton,
    "Add Cargo",
  );

  await clickAndMeasureDynamic(
    page,
    CSMImport.AddNewCargoButton,
    CSMImport.FreightAndPackagesDiv,
    "Add Cargo",
  );

  await page.click(CSMImport.FreightAndPackagesDiv);
  await page.locator(CSMImport.DECWeightInput).fill(DECWeight);
  await page.locator(CSMImport.WtMeasUnitSelect).selectOption({ label: `${WeightUnit}` });
  // await page.locator('select[formcontrolname="validateWtMeasUnitID"]').selectOption(WeightUnit);
  // await page.waitForTimeout(1000);
  await page.locator(CSMImport.DECVolumeInput).fill(DECVolume);
  // await page.locator('select[formcontrolname="validateVolMeasUnitID"]').selectOption(VolumeUnit);
  await page.locator(CSMImport.VolMeasUnitSelect).selectOption({ label: `${VolumeUnit}` });
  await page.waitForTimeout(1000);
  await page.locator(CSMImport.CANoOfPackageInput).fill(Packages);
  await page.locator(CSMImport.CAPackageTypeSelect).selectOption(PackageType);

  await clickAndMeasureDynamic(
    page,
    CSMImport.AddCargoButton,
    CSMImport.AddNewCargoButton,
    "Submit Add Cargo",
  );
  console.log("Cargo added successfully");

  await clickAndMeasureDynamic(
    page,
    CSMImport.ContainerTabButton,
    CSMImport.AddNewContainerButton,
    "Route to Container tab",
  );
  await clickAndMeasureDynamic(
    page,
    CSMImport.AddNewContainerButton,
    CSMImport.IGMDetailsDiv,
    "Click Add Container",
  );
  await page.click(CSMImport.IGMDetailsDiv);

  // const artifactsDir =
  //   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts';

  // const containerFilePath = `${artifactsDir}/Import_Container_Number.txt`;

  const ContainerNo = "HLDU" + getRandomNumberString(7);

  // // Ensure artifacts directory exists
  // if (!fs.existsSync(artifactsDir)) {
  //   fs.mkdirSync(artifactsDir, { recursive: true });
  // }

  // // Append container number to file
  // fs.writeFileSync(
  //   containerFilePath,
  //   ContainerNo,
  //   { encoding: 'utf-8' }
  // );

  // console.log(`Container Number stored: ${ContainerNo}`);

  writeTestArtifact("Cargo_Hold_Container_Number.txt", ContainerNo);

  await page.locator(CSMImport.ContainerNoInput).fill(ContainerNo);
  await page.locator(CSMImport.COSizeTypeSelect).selectOption({ label: `${DepotSizeType}` });
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').click();
  // await page.locator('//select[@formcontrolname="COSizeTypeID"]').selectOption({ label: `${DepotSizeType}` });
  await page.locator(CSMImport.ISOSizeTypeSelect).selectOption({ label: `${ISOSizeType}` });
  // await page.locator('//select[@formcontrolname="ISOSizeType"]').selectOption({ label: `${ISOSizeType}` });
  await page.locator(CSMImport.LFCLSelect).selectOption({ label: `${FreightKind}` });
  // await page.locator('//select[@formcontrolname="LFCL"]').clivrmalize-space()="${FreightKind}"]`).click();

  await page.locator(CSMImport.DONumberInput).fill("DON" + getRandomNumberString(7));
  // const deliveryOrderDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  //   .toISOString()
  //   .slice(0, 16);
  // const deliveryValidtyDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  //   .toISOString()
  //   .slice(0, 16);
  await page.locator(CSMImport.DODateInput).click();

  await selectFutureDay(page, 2);

  await page.locator(CSMImport.DOValidityDateInput).click();

  await selectFutureDay(page, 4);

  await expect(page.locator(CSMImport.ResetButton)).toBeVisible();
  await expect(page.locator(CSMImport.CancelButton)).toBeVisible();
  await clickAndMeasureDynamic(
    page,
    CSMImport.UpdateButton,
    CSMImport.AddNewContainerButton,
    "Update Container",
  );
  console.log("Container added successfully");

  await clickAndMeasureDynamic(
    page,
    CSMImport.CargoTabButton,
    CSMImport.OpenActions,
    "BOE",
  );

  await page.locator(CSMImport.OpenActions).click();
  await clickAndMeasureDynamic(
    page,
    CSMImport.BOEListItem,
    CSMImport.BENumberInput,
    "Route to BOE Screen",
  );

  await page.locator(CSMImport.BENumberInput).fill(getRandomNumberString(7));

  await page.locator(CSMImport.BEDateInput).click();
  await selectFutureDay(page, 0);
  await clickAndMeasureDynamic(
    page,
    CSMImport.UpdateButton,
    CSMImport.CargoTabButton,
    "Update BOE",
  );

  await page.locator(CSMImport.OpenActions).isVisible();
  await page.locator(CSMImport.OpenActions).click();

  await clickAndMeasureDynamic(
    page,
    CSMImport.MapListItem,
    `(//div[contains(@class,"w-full border")][.//div[normalize-space()="${ContainerNo}"]])[1]`,
    "Route to Mapping Screen",
  );

  console.log(`Located row for container ${ContainerNo}`);

  // Checkbox
  await page.locator(`(//div[contains(@class,"w-full border")][.//div[normalize-space()="${ContainerNo}"]]//input[@type="checkbox"])[1]`).check();

  // Packages input
  await page.locator(`(//div[contains(@class,"w-full border")][.//div[normalize-space()="${ContainerNo}"]]//input[@type="number"])[1]`).fill("100");

  await clickAndMeasureDynamic(
    page,
    CSMImport.UpdateButton,
    CSMImport.CargoTabButton,
    "Map Cargo",
  );

  // const ContainerNo = 'ATCU4872261'
  await clickAndMeasureDynamic(
    page,
    CSMImport.WorkOrderTabButton,
    `//td[normalize-space()="${ContainerNo}"]`,
    "Route to Work Order tab",
  );
  expect(await page.locator(`//td[normalize-space()="${ContainerNo}"]`).isVisible()).toBeTruthy();
  // Click the edit icon (pen) which is a sibling of the container number
  await clickAndMeasureDynamic(
    page,
    CSMImport.EditContainerButton(ContainerNo),
    CSMImport.WorkOrderSubmitButton,
    "Edit Container",
  );
  const WO_Description = await page.locator(CSMImport.WorkOrderDescriptionSelect).textContent();
  await expect(WO_Description).not.toBe("");
  await expect(CSMImport.AllocationUnitSelect).not.toBe("");
  await clickAndMeasureDynamic(
    page,
    CSMImport.WorkOrderSubmitButton,
    `(//div[contains(normalize-space(),"Work Order No.")])[1]`,
    "Update Container",
  );
  await page.close();
  console.log("TC002_CSM_ImportBooking_MOTL completed successfully");
});
