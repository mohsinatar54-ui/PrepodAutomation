import { test, expect } from '@playwright/test';
import { login, selectEntityAndSite} from '../../utils/test-helpers';
 //import { Gate_Import } from '@tests/Import_MOTL/TC001_GATE_IMPORT_MOTL_.test';
import { Gate_Import, Gate_Import_HOLD } from 'Flows/ImportFlow';
import { SwitchModule } from '../../utils/test-helpers';





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


test('TC002_GATE_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(160_000); // 2 minutes timeout for this test
  // await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  //await Gate_Import(page, cargoHoldGateData, 'CargoHold_BookingNumber.txt', 'CargoHold_BLN_Number.txt', 'CargoHold_ContainerNumber.txt');
  await Gate_Import_HOLD(loginPage, cargoHoldGateData, 'Hold_Vehicle');
   SwitchModule(loginPage, 'Yard Operations');
    // await yardExecution1(loginPage);
    // SwitchModule(loginPage, 'Gate Operations');
    // await gateOutWithCargoAndTruck1(loginPage);
    // SwitchModule(loginPage, 'Customer Service Portal');
    // await newJobOrder(loginPage,jobOrderConfig,'MO9F');

}
)
