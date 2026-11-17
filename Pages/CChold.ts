import { test, expect, Page} from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, readTestArtifact,
  writeTestArtifact, selectFutureDay} from '../utils/test-helpers'; // <-- Update this path if needed, e.g. './utils/test-helpers_VBS_CCIS' or '../../utils/test-helpers_VBS_CCIS';
import { CSMHoldRelease, CSMImport} from 'Locators/BookingLocators';
import { GateCommon } from 'Locators/GateLocators';
import { GateImport } from 'Locators/GateLocators';
import { Common } from 'Locators/BookingLocators';
import { selectEntityAndSite } from '../utils/test-helpers';

 //const containerNo = await readTestArtifact('ContainerHold_ContainerNumber.txt')

  const Entity = 'Beacon Depot';
  const Site = 'Site 7 (Manila)';
  const Account = 'Envecon Software';

  const Comments = "Putting container on hold for testing purpose";


  
export class CChold {

static async  CSMRelease(page: Page) {

  const containerNo = await readTestArtifact('ContainerHold_ContainerNumber.txt');
 // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
  await clickAndMeasureDynamic(page, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.AddContainer, 'Route to releasebutton ');
  await page.locator(CSMHoldRelease.SearchCC).fill(containerNo);
  await page.waitForTimeout(10000);
  await clickAndMeasureDynamic(page, CSMHoldRelease.Releasemenubutton, CSMHoldRelease.Releasebutton, 'Route to releasebutton1');
  await clickAndMeasureDynamic(page, CSMHoldRelease.Releasebutton, CSMHoldRelease.Releasebutton1, 'Route to releasebutton1');
  await clickAndMeasureDynamic(page, CSMHoldRelease.Releasebutton1, CSMHoldRelease.AddContainer, 'Release the container');


}

static async  HoldcontainerEdit(page: Page) {

  const BookingNo = await readTestArtifact('ContainerHold_BookingNumber.txt');
  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
  await clickAndMeasureDynamic(page, Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');
  await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.AddBookingButton, 'Route to Import booking screen');
  await page.locator(CSMHoldRelease.SearchCC).fill(BookingNo);
  await page.waitForTimeout(10000);
  await clickAndMeasureDynamic(page, CSMHoldRelease.Firstlinkcontainer, CSMImport.UpdateDetailsButton, 'Update booking details');
  await clickAndMeasureDynamic(page, CSMImport.UpdateDetailsButton, CSMImport.BookingDetails, 'Update booking details');
  await clickAndMeasureDynamic(page, CSMImport.ContainerTabButton, CSMImport.AddNewContainerButton, 'Route to Container tab');
  await clickAndMeasureDynamic(page, CSMHoldRelease.Editbutton, CSMHoldRelease.Otherdetails, 'Route to Container tab');
  await clickAndMeasureDynamic(page, CSMHoldRelease.Otherdetails, CSMHoldRelease.Holdcheck, 'Route to Container tab');
  await page.locator("//input[@type='checkbox' and @formcontrolname='IsHold']").check();
  const holdType = page.locator("//select[@formcontrolname='HoldTypeID']");
  await holdType.waitFor({ state: 'visible', timeout: 10000 });
  await holdType.click();
  await holdType.selectOption({ label: 'Auto Hold' }); 
  await page.locator(CSMImport.UpdateButton).click();
  await page.waitForTimeout(10000);
  const invalidContainerNumberMessage = page.locator(CSMImport.InvalidContainerNumberMessage);
    if (await invalidContainerNumberMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(invalidContainerNumberMessage).toBeVisible();
      await page.locator(CSMImport.ProceedButton).click();
    }
  
  }

  static async  ContainerHold_CSM(page: Page) {

    const containerNo = readTestArtifact('ContainerHold_ContainerNumber.txt');
    const BookingNo = readTestArtifact('ContainerHold_BookingNumber.txt');
    // const loginPage = await login(page);
    //  await selectEntityAndSite(loginPage);
  //  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.AddContainer, 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.AddContainer, CSMHoldRelease.CodeSelect, 'Route to Adding Container to Hold ');

  //  await loginPage.locator(CSMHoldRelease.CodeSelect).selectOption({ value: BookingType });
    await page.locator("//select[@formcontrolname='Code']").selectOption('MCNC');
 //   await page.locator("//select[@formcontrolname='Code']").selectOption('Import Bookings');
    // Container Booking Number
await page.locator(CSMHoldRelease.ContainerBookingNumber).fill(BookingNo);

await page.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await page.locator(CSMHoldRelease.AutocompleteOption).first().click();


// Container Number
await page.locator(CSMHoldRelease.ContainerNoInput).fill(containerNo);

await page.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await page.locator(CSMHoldRelease.AutocompleteOption).first().click();
    // Click Hold Type dropdown
await page.locator("//app-multi-select-dropdown[@placeholder='Select hold type']").click();

// Select Auto Hold
await page.locator(
  "//li[contains(@class,'option-item')][.//span[normalize-space()='Auto Hold']]//input[@type='checkbox']"
).check();

    // Open the multiselect dropdown

   // await loginPage.locator(CSMHoldRelease.MultiSelectSelectedItems).click();

    // Select "Customs"
  //  await loginPage.locator(CSMHoldRelease.MultiSelectOptionText, { hasText: HoldType }).click();

    await page.locator(CSMHoldRelease.CommentsInput).fill(Comments);

  //  await page.locator(CSMHoldRelease.SubmitButton).click();

  await clickAndMeasureDynamic(page, CSMHoldRelease.SubmitButton, CSMHoldRelease.AddContainer, 'Hold the container');


//    await expect(loginPage.locator(CSMHoldRelease.ContainerRowByNumber(containerNo))).toBeVisible();
    
    console.log(`Container ${containerNo} has been successfully put on hold with booking number ${BookingNo}.`);
  
  
  }

  static async  CargoHold_CSM(page: Page) {

    const cargoNo = readTestArtifact('CargoHold_CargoNumber.txt');
    const CargoBookingNo = readTestArtifact('CargoHold_BookingNumber.txt');
    // const loginPage = await login(page);
    //  await selectEntityAndSite(loginPage);
    // await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.AddContainer, 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.CargoHoldTab, CSMHoldRelease.AddCargo, 'Route to Cargo Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.AddCargo, CSMHoldRelease.CodeSelect, 'Route to Adding Cargo to Hold ');
  //  await loginPage.locator(CSMHoldRelease.CodeSelect).selectOption({ value: BookingType });
    await page.locator("//select[@formcontrolname='Code']").selectOption('MCNC');
 //   await page.locator("//select[@formcontrolname='Code']").selectOption('Import Bookings');
    // Container Booking Number
await page.locator(CSMHoldRelease.cargobookingNo).fill(CargoBookingNo);

await page.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await page.locator(CSMHoldRelease.AutocompleteOption).first().click();


// Container Number
await page.locator(CSMHoldRelease.CargoNo).fill(cargoNo);

await page.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await page.locator(CSMHoldRelease.AutocompleteOption).first().click();
    // Click Hold Type dropdown
await page.locator("//app-multi-select-dropdown[@placeholder='Select hold type']").click();

// Select Auto Hold
await page.locator(
  "//li[contains(@class,'option-item')][.//span[normalize-space()='Auto Hold']]//input[@type='checkbox']"
).check();

    // Open the multiselect dropdown

   // await loginPage.locator(CSMHoldRelease.MultiSelectSelectedItems).click();

    // Select "Customs"
  //  await loginPage.locator(CSMHoldRelease.MultiSelectOptionText, { hasText: HoldType }).click();

    await page.locator(CSMHoldRelease.CommentsInput).fill(Comments);

  //  await page.locator(CSMHoldRelease.SubmitButton).click();

  await clickAndMeasureDynamic(page, CSMHoldRelease.SubmitButton, CSMHoldRelease.AddCargo, 'Hold the container');


//    await expect(loginPage.locator(CSMHoldRelease.ContainerRowByNumber(containerNo))).toBeVisible();
    
    console.log(`Container ${cargoNo} has been successfully put on hold with booking number ${CargoBookingNo}.`);
  
  
  }
 }

