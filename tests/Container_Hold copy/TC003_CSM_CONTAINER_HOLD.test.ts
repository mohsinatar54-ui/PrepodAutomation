import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, readTestArtifact } from '../../utils/test-helpers';
import { Common } from 'Locators/GateLocators';
const BookingType = "MCNC" //Import Bookings
const Comments = "Putting container on hold for testing purpose";

test('TC003_CSM_CONTAINER_HOLD', async ({ page }) => {

    await login(page);

    await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Hold & Release"]', 'Route to Customer Service');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="Hold & Release"]', '//button[normalize-space()="+ Add Container"]', 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Container"]', '//select[@formcontrolname="Code"]', 'Route to Adding Container to Hold ');

    const containerNo = readTestArtifact('ContainerHold_ContainerNumber.txt');
    const BookingNo = readTestArtifact('ContainerHold_BookingNumber.txt');

    await page.locator('//select[@formcontrolname="Code"]').selectOption({ value: BookingType });

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="BookingNumber"]//input').fill(BookingNo);
    await page.locator('//li[@role="option"]').first().click();

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="ContainerNo"]//input').fill(containerNo);
    await page.locator('//li[@role="option"]').first().click();

    // Open the multiselect dropdown

    await page.locator('app-multi-select-dropdown[formcontrolname="CMLMOP"] .selected-items').click();

    // Select "Customs"
    await page.locator('li.option-item span', { hasText: 'Customs' }).click();

    await page.locator(`//input[@formcontrolname="comments"]`).fill(Comments);

    await page.locator('//button[normalize-space()="Add"]').click();

    await expect(page.locator(`//td[contains(., "${containerNo}")]`)).toBeVisible();
    
    console.log(`Container ${containerNo} has been successfully put on hold with booking number ${BookingNo}.`);
}
)

