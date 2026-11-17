import { Page,expect,Locator} from '@playwright/test';

import { clickAndMeasureDynamic,getNextDateTimeFormatted,readTestArtifact } from '../utils/test-helpers';

import { Common, CSMExport, CSMImport } from 'Locators/BookingLocators';
import { selectFutureDay } from 'utils/createExcelData';
import { YardPlanner } from 'Locators/YardLocators';
import { CSMEmpty } from 'Locators/BookingLocators';
import { GateCommon, GateExport, GateImport } from 'Locators/GateLocators';
import { GateEmpty } from 'Locators/GateLocators';



export class Mercantile {


static async navigateHeaders(page: Page, headerName: string) {
    const header = page.getByRole('button', {
        name: headerName,
        exact: true
    });

    await header.waitFor({ state: 'visible' });
    await header.click();
}

static async clickonLeftNavigationTab(page: Page, tabName: string) {
    await page.getByText(tabName, { exact: true }).click();
}

static async verifyDropdownOptions(
    dropdown: Locator,
    dropdownName: string
) {
    await dropdown.click();

    const validOptions = dropdown.locator(
        'option:not([value="0: null"])'
    );

    const count = await validOptions.count();

    expect(
        count,
        `FAIL: "${dropdownName}" dropdown has no valid options.`
    ).toBeGreaterThan(0);

    console.log(
        `PASS: "${dropdownName}" dropdown has ${count} valid options.`
    );
}

static async verifyCompleteTable(page: Page) {
    const table = page.locator('table');
    const rows = table.locator('tbody tr');
    const headers = table.locator('thead th');

    // Verify table is displayed
    await expect(table).toBeVisible();

    // Verify table headers exist
    const headerCount = await headers.count();

    expect(
        headerCount,
        'FAIL: Table has no column headers'
    ).toBeGreaterThan(0);

    // Verify data rows exist
    const rowCount = await rows.count();

    expect(
        rowCount,
        'FAIL: Table contains no data rows'
    ).toBeGreaterThan(0);

    // Validate each row independently
    for (let i = 0; i < rowCount; i++) {
        const cells = rows.nth(i).locator('td');
        const cellCount = await cells.count();

        expect(
            cellCount,
            `FAIL: Row ${i + 1} contains no cells`
        ).toBeGreaterThan(0);

        let emptyCellCount = 0;

        for (let j = 0; j < cellCount; j++) {
            const cellText = (await cells.nth(j).innerText()).trim();

            if (cellText === '') {
                emptyCellCount++;
            }
        }

        expect(
            emptyCellCount,
            `FAIL: Row ${i + 1} has ${emptyCellCount} empty cells. Maximum allowed is 2.`
        ).toBeLessThanOrEqual(2);
    }

    console.log(
        `PASS: Table verified. Rows: ${rowCount}, Columns: ${headerCount}. Each row allows up to 2 empty cells.`
    );
}

}