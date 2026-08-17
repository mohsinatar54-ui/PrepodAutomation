import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact } from '../../utils/test-helpers';
import fs from 'fs';


const BookingType = "MCNC" //Import Bookings
const Comments = "Putting cargo on hold for testing purpose";

test('TC003_CSM_CARGO_HOLD', async ({ page }) => {

    await login(page);


    await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Hold & Release"]', 'Route to Customer Service');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="Hold & Release"]', '//button[normalize-space()="Manage Cargo"]', 'Route to Hold Screen ');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="Manage Cargo"]', '//button[normalize-space()="+ Add Cargo"]', 'Route to Cargo Screen ');
    await clickAndMeasureDynamic(page, '//button[normalize-space()="+ Add Cargo"]', '//select[@formcontrolname="Code"]', 'Route to Adding Cargo to Hold ');




    // const cargoFilePath =
    //     'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Cargo_Number.txt';

    // if (!fs.existsSync(cargoFilePath)) {
    //     throw new Error(`Cargo number file not found at: ${cargoFilePath}`);
    // }

    // const cargoNo = fs.readFileSync(cargoFilePath, 'utf-8').trim();

    // if (!cargoNo) {
    //     throw new Error('Cargo number file is empty');
    // }

    const BookingNo = readTestArtifact('Cargo_Hold_BookingNo.txt');
    const cargoNo = readTestArtifact('Cargo_Number.txt');

    console.log('Using cargo number:', cargoNo);


    await page.locator('//select[@formcontrolname="Code"]').selectOption({ value: BookingType });

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="bookingNumbers"]//input').fill(BookingNo);
    await page.locator(`//li[@role="option"]//div[contains(text(), "${BookingNo}")]`).click()

    await page.locator('//app-autocomplete-dropdown[@formcontrolname="cargoNo"]//input').fill(cargoNo);
    await page.locator(`//li[@role="option"]//div[contains(text(), "${cargoNo}")]`).click();

    // Open the multiselect dropdown
    await page
        .locator('app-multi-select-dropdown[formcontrolname="CMLMOP"] .selected-items')
        .click();

    // Select "Customs"
    await page
        .locator('li.option-item span', { hasText: 'Customs' })
        .click();


    await page
        .locator('app-multi-select-dropdown[formcontrolname="CMLMOP"] .selected-items')
        .click();    

    await page.locator(`//input[@formcontrolname="comments"]`).fill(Comments);

    await page.locator('//button[normalize-space()="Update"]').click();

    await page.locator(`//td[normalize-space()="${BookingNo}"]`).isVisible();

    console.log('Cargo put on Hold successfully');



}
)

