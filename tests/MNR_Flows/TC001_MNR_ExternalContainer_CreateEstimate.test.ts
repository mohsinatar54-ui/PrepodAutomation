import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString } from '../../utils/test-helpers';
import { selectEntityAndSite } from '../../utils/test-helpers';
import { MNR } from 'Pages/MNR';
// ===== Test Data =====
const MNRdata = {
    Operator_Value: 'MSK/MAERSKLINE',
    Depot_Size_Value: '20DV',
    ISO_Size_Value: '22G1',
    Type_Size_Value: '20',
    Type_Code_Value: 'DV',
    Quality_Code_Value: 'Available',
    Condition_Code_Value: 'I',
    // Short_Code: 'SC01',
    Responsible: 'Owner',
    Contract_Applicable: 'MSK/MAERSKLINE',
    Responsible_Party: 'MSK/MAERSKLINE',
    Component_Code: 'MRU',
    Repair_Mode: 'KKLL',
    Material_Code: 'BAT',
    Location_Code: 'LB0N',
    Damage_Code: 'EREDD2323',
    Labour_Rate: '100',
    Qty: '1',
    Length:'10',
    Width:'50',
    Estimate_Done_By_Value:'Enabill Admin',
    Send_Responsible_Party_Value: '2',
    PartNo:'BRUSH24'

};


test('TC001_MNR_ExternalContainer_CreateEstimate', async ({ page }) => {
  test.setTimeout(240_000); // 2 minutes timeout for this test
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await MNR.Externalcontainer(loginPage,MNRdata);
});


