import { test, expect } from '@playwright/test';
import { login, clickAndMeasureDynamic, readTestArtifact, writeTestArtifact, getRandomNumberString, selectEntityAndSite } from '../../utils/test-helpers';
import {CSMEmpty, Common, CSMImport} from 'Locators/BookingLocators'
import { selectFutureDay } from 'utils/test-helpers';
import { GateCommon,GateImport, GateEmpty } from 'Locators/GateLocators';
import { Gate_EmptyOUT_Flow, Gate_EmptyOUT_Flow_PreAnnoucement } from 'Flows/EmptyFlow';


const Gatedata = {
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
  Vehicle_No1: 'MH' + getRandomNumberString(5)
};


test('TC005_GATE_EMPTY_OUT', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes timeout for this test
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
   await Gate_EmptyOUT_Flow_PreAnnoucement(loginPage,Gatedata);
 
}
)
