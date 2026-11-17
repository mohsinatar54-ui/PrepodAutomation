import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { APIRequestContext } from '@playwright/test';
import { selectEntityAndSite } from '../../utils/test-helpers';
import { MNR } from 'Pages/MNR';
// // const URL = 'https://ueapp.logstarerp.com/login';
// const Username = 'sagar.patil';
// const Password = 'Pass@123';

// const Entity = 'CMA';
// const Site = 'Jeddah';
const MNR_data = {
    Operator_Value: '1',
    Estimate_Type_Value: '955',

    DepotSizeType: '20STD',
    ISOSizeType: '22G1',

    Quality_Value: '943',
    Condition_Value: '932',

    Location_Code: 'LT5N',
    Repair_Mode_Code: "03-5121/Door Panel - Replace - 1954x943x2.0 mm (For 8'6'' containers)",
    Comp_Code: 'Roof bow pin',
    Damage_Type: 'WB - Bald',
    Qty: '1',
    Repair_Type: 'AB - Abrasive clean and paint',
    Responsible: 'Owner',
    Estimate_Done_Value: '43',
    Estimate_Type: 'Box',
    container_number: 'MSKU9595201'
};


/**
 * Fetches the MNR container list from the API.
 * @param request Playwright APIRequestContext
 * @returns Promise<any[]> List of containers
 */
export async function fetchMNRContainerList(request: APIRequestContext): Promise<any[]> {
  const url = 'https://prepacgateapi.logstarerp.com/MNRIntegration/MNR-container-list?GeoId=1';
  const response = await request.get(url, { ignoreHTTPSErrors: true });
  expect(response.status()).toBe(200);
  const json = await response.json();
  console.log('API Response:', json);
  return json;
}

/**
 * Gets the first container with ISOSizeType '22G1' from the MNR container list.
 * @param request Playwright APIRequestContext
 * @returns Promise<string> Container number
 */
export async function getFirst22G1Container(request: APIRequestContext): Promise<string> {
  const list = await fetchMNRContainerList(request);
  const selected = list.find((item: any) => item.ISOSizeType === '22G1');
  expect(selected).toBeTruthy();
  const container = selected.ContainerNo;
  console.log('Selected 22G1 Container =', container);
  return container;
}

test('TC002_MNR_DepotContainer_CreateEstimate', async ({ page }) => {
  test.setTimeout(160_000); // 2 minutes timeout for this test
  const loginPage = await login(page);
   await selectEntityAndSite(loginPage);
   await MNR.DepotContainer(loginPage,MNR_data)
});

