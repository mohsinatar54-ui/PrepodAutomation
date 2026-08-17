import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import { Common, CSMHoldRelease } from '../../Locators/BookingLocators';

const BookingType = "MCNC" //Import Bookings
const Comments = "Putting container on hold for testing purpose";
const HoldType = 'Customs' //Option to select while putting cargo on hold

const BookingNo = readTestArtifact('CargoHold_BookingNumber.txt');
const cargoNo = readTestArtifact('CargoHold_CargoNumber.txt');

async function addCargoOnHold(page: any) {
    await test.setTimeout(60000); // Set timeout to 1 minute for this test
    await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMHoldRelease.HoldReleaseTab, 'Route to Customer Service');
    await clickAndMeasureDynamic(page, CSMHoldRelease.HoldReleaseTab, CSMHoldRelease.CargoHoldTab, 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.CargoHoldTab, CSMHoldRelease.AddCargo, 'Route to Cargo Screen ');
    await clickAndMeasureDynamic(page, CSMHoldRelease.AddCargo, CSMHoldRelease.CodeSelect, 'Route to Adding Cargo to Hold ');

    await page.locator(CSMHoldRelease.CodeSelect).selectOption({ value: BookingType });

    await page.locator(CSMHoldRelease.CargoBookingNumber).fill(BookingNo);
    await page.locator(CSMHoldRelease.BookingOptionByText(BookingNo)).click()

    await page.locator(CSMHoldRelease.CargoNoInput).fill(cargoNo);
    await page.locator(CSMHoldRelease.CargoOptionByText(cargoNo)).click();

    // Open the multiselect dropdown
    await page.locator(CSMHoldRelease.MultiSelectSelectedItems).click();

    // Select "Customs"
    await page.locator(CSMHoldRelease.MultiSelectOptionText, { hasText: HoldType }).click();

    // await page.locator(CSMHoldRelease.MultiSelectSelectedItems).click();
    await page.locator(CSMHoldRelease.CommentsInput).click();
    await page.locator(CSMHoldRelease.CommentsInput).fill(Comments);

    await page.locator(CSMHoldRelease.SubmitButton).click();
    // await page.locator(CSMHoldRelease.CommentsLabel).click();
    await page.locator(CSMHoldRelease.BookingRowByNumber(BookingNo)).isVisible();
}

test.beforeEach(async ({ page }) => {
    await login(page);
    await selectEntityAndSite(page);
});


test('TC003_CSM_CARGO_HOLD', async ({ page }) => {
    await addCargoOnHold(page);

    console.log('Cargo put on Hold successfully');

}
)

test('TC003_CSM_CARGO_HOLD_CheckDuplicate', async ({ page }) => {
    await addCargoOnHold(page);
    await expect(page.getByText('ERROR! This cargo is already on hold.')).toBeVisible();
}
)

