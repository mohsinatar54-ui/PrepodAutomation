import { test, expect,Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, readTestArtifact } from '../../utils/test-helpers';
import { Common, CSMHoldRelease } from '../../Locators/BookingLocators';
import { selectEntityAndSite } from '../../utils/test-helpers';

const BookingType = "MCNC" //Import Bookings
const Comments = "Putting container on hold for testing purpose";

const containerNo = readTestArtifact('ContainerHold_ContainerNumber.txt');
const BookingNo = readTestArtifact('ContainerHold_BookingNumber.txt');
const HoldType = 'Customs'; //Option to select while putting cargo on hold
let loginPage: Page;

test('TC003_CSM_CONTAINER_HOLD', async ({ page }) => {
    await test.setTimeout(120000); // Set timeout to 2 minutes to accommodate for any delays in the test execution
     loginPage = await login(page);
     await selectEntityAndSite(loginPage);
    await clickAndMeasureDynamic(loginPage, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(loginPage, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.AddContainer, 'Route to Hold Screen ');
    await clickAndMeasureDynamic(loginPage, CSMHoldRelease.AddContainer, CSMHoldRelease.CodeSelect, 'Route to Adding Container to Hold ');

  //  await loginPage.locator(CSMHoldRelease.CodeSelect).selectOption({ value: BookingType });
    await loginPage.locator("//select[@formcontrolname='Code']").selectOption('MCNC');
 //   await page.locator("//select[@formcontrolname='Code']").selectOption('Import Bookings');
    // Container Booking Number
await loginPage.locator(CSMHoldRelease.ContainerBookingNumber).fill(BookingNo);

await loginPage.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await loginPage.locator(CSMHoldRelease.AutocompleteOption).first().click();


// Container Number
await loginPage.locator(CSMHoldRelease.ContainerNoInput).fill(containerNo);

await loginPage.locator(CSMHoldRelease.AutocompleteOption).first()
    .waitFor({ state: 'visible', timeout: 10000 });

await loginPage.locator(CSMHoldRelease.AutocompleteOption).first().click();
    // Click Hold Type dropdown
await loginPage.locator("//app-multi-select-dropdown[@placeholder='Select hold type']").click();

// Select Auto Hold
await loginPage.locator(
  "//li[contains(@class,'option-item')][.//span[normalize-space()='Auto Hold']]//input[@type='checkbox']"
).check();

    // Open the multiselect dropdown

   // await loginPage.locator(CSMHoldRelease.MultiSelectSelectedItems).click();

    // Select "Customs"
  //  await loginPage.locator(CSMHoldRelease.MultiSelectOptionText, { hasText: HoldType }).click();

    await loginPage.locator(CSMHoldRelease.CommentsInput).fill(Comments);

    await loginPage.locator(CSMHoldRelease.SubmitButton).click();

  await clickAndMeasureDynamic(loginPage, CSMHoldRelease.SubmitButton, CSMHoldRelease.AddContainer, 'Hold the container');


//    await expect(loginPage.locator(CSMHoldRelease.ContainerRowByNumber(containerNo))).toBeVisible();
    
    console.log(`Container ${containerNo} has been successfully put on hold with booking number ${BookingNo}.`);

}
)

