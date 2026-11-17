import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, generateVehicleNumber, readTestArtifact, selectEntityAndSite, getRandomNumberString } from '../../utils/test-helpers';
// import {Common} from 'Locators/BookingLocators'
// import { GateEmpty } from 'Locators/GateLocators';
import { Gate_EmptyIN_Flow } from '../../Flows/EmptyFlow';

let GateEmptyData : any;

GateEmptyData = {
  surveyRemark: 'Condition OK',
  // vehicleNo: generateVehicleNumber(),
  TareWeight: '2500',
  DamageDetails: 'No visible damage',
  MaxPermissibleWeight: '30000',
  TruckRFID: 'RFID0001',
  EIRNo: 'EIR20260109',
  PortExitPassNo: 'PEP123456',
  PortOutDateTime: '2026-01-09T11:10',
  CFSGateInDateTime: '2026-01-09T11:15',
  PortName: 'BPCL',
  Vehicle_No: 'MH' + getRandomNumberString(5)
};

test('TC002_ExportINDirect_GATE_EMPTY_IN', async ({ page }) => {
  test.setTimeout(600000); // 2 minutes timeout for this test
  //await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  // const containerNo = await readTestArtifact('EmptyIn_Container.txt');
  await Gate_EmptyIN_Flow(loginPage, GateEmptyData, 'ExportINDirect_EmptyIn_Container.txt');
}
)