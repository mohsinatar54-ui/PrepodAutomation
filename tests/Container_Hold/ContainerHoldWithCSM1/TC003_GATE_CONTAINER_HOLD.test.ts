import { test, expect } from '@playwright/test';
import { login, selectEntityAndSite, switchToNewTab} from '../../../utils/test-helpers';
import { Gate_Import } from '../../../Flows/ImportFlow';
import { SwitchModule } from '../../../utils/test-helpers';
import { YardPlannerFlow, YardPlannerFlow_Hold } from 'Flows/YardFlow';
import { CChold } from 'Pages/CChold';



const cargoHoldGateData = {
  tareWeight: '2500',
  damageDetails: 'No visible damage',
  maxPermissibleWeight: '30000',
  customSeal: '100',
  igmSealNo: 'IGM98765',
  truckRFID: 'RFID0001',
  surveyRemark: 'Condition OK',
  EIRNo: 'EIR20260109',
  portName: 'BPCL',
  portExitPassNo: 'PEP123456',
  portOutDateTime: '2026-01-09T11:10',
  cfsGateInDateTime: '2026-01-09T11:15',
  portTransNo: 'PTN20260109',
  HoldComment:'Holdtest'
};


test('TC003_GATE_CONTAINER_HOLD.test.ts', async ({ page }) => {
  test.setTimeout(600_000); // 2 minutes timeout for this test
  // await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await Gate_Import(loginPage, cargoHoldGateData, 'HRVehicleNo.txt',);
  await SwitchModule(loginPage, 'Yard Operations');
  await YardPlannerFlow_Hold(loginPage);
 await SwitchModule(loginPage, 'Customer Service Portal');
 await CChold.CSMRelease(loginPage);
 await SwitchModule(loginPage, 'Yard Operations');
 await YardPlannerFlow_Hold(loginPage);

}
)
