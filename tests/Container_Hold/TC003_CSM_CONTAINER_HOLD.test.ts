import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, readTestArtifact } from '../../utils/test-helpers';
import { Common, CSMHoldRelease } from '../../Locators/BookingLocators';
import { selectEntityAndSite } from 'utils/test-helpers_VBS_CCIS';

const BookingType = "MCNC" //Import Bookings
const Comments = "Putting container on hold for testing purpose";

const containerNo = readTestArtifact('ContainerHold_ContainerNumber.txt');
const BookingNo = readTestArtifact('ContainerHold_BookingNumber.txt');
const HoldType = 'Customs' //Option to select while putting cargo on hold

test('TC003_CSM_CONTAINER_HOLD', async ({ page }) => {
    await test.setTimeout(120000); // Set timeout to 2 minutes to accommodate for any delays in the test execution
    await login(page);
    await selectEntityAndSite(page);
    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.AddContainer, 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.AddContainer, CSMHoldRelease.CodeSelect, 'Route to Adding Container to Hold ');

    await page.locator(CSMHoldRelease.CodeSelect).selectOption({ value: BookingType });

    await page.locator(CSMHoldRelease.ContainerBookingNumber).fill(BookingNo);
    await page.locator(CSMHoldRelease.AutocompleteOption).first().click();

    await page.locator(CSMHoldRelease.ContainerNoInput).fill(containerNo);
    await page.locator(CSMHoldRelease.AutocompleteOption).first().click();

    // Open the multiselect dropdown

    await page.locator(CSMHoldRelease.MultiSelectSelectedItems).click();

    // Select "Customs"
    await page.locator(CSMHoldRelease.MultiSelectOptionText, { hasText: HoldType }).click();

    await page.locator(CSMHoldRelease.CommentsInput).fill(Comments);

    await page.locator(CSMHoldRelease.SubmitButton).click();

    await expect(page.locator(CSMHoldRelease.ContainerRowByNumber(containerNo))).toBeVisible();
    
    console.log(`Container ${containerNo} has been successfully put on hold with booking number ${BookingNo}.`);

}
)

