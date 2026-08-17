import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, readTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';


const BookingType = "MCNC" //Import Bookings
const Comments = "Putting container on hold for testing purpose";

test('TC003_CSM_CONTAINER_HOLD', async ({ page }) => {

    await login(page);


    await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Hold & Release"]', 'Route to Customer Service');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="Hold & Release"]', '//button[normalize-space()="+ Add Container"]', 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Container"]', '//select[@formcontrolname="Code"]', 'Route to Adding Container to Hold ');




    // const containerFilePath =
    //     'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Hold_Container_Number.txt';

    // if (!fs.existsSync(containerFilePath)) {
    //     throw new Error(`Container number file not found at: ${containerFilePath}`);
    // }

    // const containerNo = fs.readFileSync(containerFilePath, 'utf-8').trim();

    // if (!containerNo) {
    //     throw new Error('Container number file is empty');
    // }

    // console.log('Using container number:', containerNo);


    // const BkgNumberFile =
    //     'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Container_Hold_Booking_Number.txt';

    // if (!fs.existsSync(BkgNumberFile)) {
    //     throw new Error(`Booking number file not found at: ${BkgNumberFile}`);
    // }

    // const BookingNo = fs.readFileSync(BkgNumberFile, 'utf-8').trim();

    // if (!BookingNo) {
    //     throw new Error('Booking number file is empty');
    // }

    // console.log('Using booking number:', BookingNo);
    const containerNo = readTestArtifact('Container_Hold_Number.txt');
    const BookingNo = readTestArtifact('Container_Hold_Booking_No.txt');

    await page.locator('//select[@formcontrolname="Code"]').selectOption({ value: BookingType });

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="BookingNumber"]//input').fill(BookingNo);
    await page.locator('//li[@role="option"]').first().click();

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="ContainerNo"]//input').fill(containerNo);
    await page.locator('//li[@role="option"]').first().click();

    // Open the multiselect dropdown

    await page
        .locator('app-multi-select-dropdown[formcontrolname="CMLMOP"] .selected-items')
        .click();

    // Select "Customs"

    await page
        .locator('li.option-item span', { hasText: 'Customs' })
        .click();

    await page.locator(`//input[@formcontrolname="comments"]`).fill(Comments);

    await page.locator('//button[normalize-space()="Update"]').click();

    await expect(page.locator(`//td[contains(., "${containerNo}")]`)).toBeVisible();
    
    console.log(`Container ${containerNo} has been successfully put on hold with booking number ${BookingNo}.`);
}
)

