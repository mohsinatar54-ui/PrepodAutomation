import { test, expect } from '@playwright/test';
import { login, selectEntityAndSite} from '../../utils/test-helpers';
import { Gate_Import } from '../../Flows/ImportFlow';


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
};


test('TC002_GATE_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(160_000); // 2 minutes timeout for this test
  // await login(page);
  await login(page);
  await selectEntityAndSite(page);
  await Gate_Import(page, cargoHoldGateData, 'CargoHold_BookingNumber.txt', 'CargoHold_BLN_Number.txt', 'CargoHold_ContainerNumber.txt');
}
)
