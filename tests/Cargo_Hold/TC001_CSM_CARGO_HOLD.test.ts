import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
  extractCargoDetailsNumber, selectEntityAndSite,readTestArtifact } from '../../utils/test-helpers';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';
import { CChold } from 'Pages/CChold';
import { SwitchModule } from '../../utils/test-helpers';

// test.describe.serial('Cargo Hold Tests', () => {
 let cargoHoldData: any;

test.beforeAll(async () => {

 cargoHoldData = {
  DepotSizeType: '20 STD (20STD)',
  ISOSizeType: '22G1',
  TotalContainers: '5',
  Transport_Mode: 'Vessel',
  CHA_Name: 'MAERSK INDIA PVT LTD',
  OperatorID: 'MAERSK INDIA PVT LTD',
  Commodity: 'WHEAT',
  PortOfLoading: 'BPCL',
  PortOfArrival: 'MUMBAI',
  DECWeight: '1000',
  DECVolume: '1000',
  WeightUnit: 'Tonnes',
  VolumeUnit: 'Litres',
  Packages: '100',
  PackageType: 'Bulk',
  FreightKind: 'FCL',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Depot Gate Operation',
  JobDescription: '1078', // 'Container In By Truck From Factory Stuffing (XITF)'
  LIGMNumber: getRandomNumberString(15),
  blnNumber: 'BLN' + getRandomNumberString(10),
  LineNumber: getRandomNumberString(5),
  ContainerNo: 'IMPU' + getRandomNumberString(7),
  POL: 'VAGE',
  POA: 'BPCL'
};
});

test.beforeEach(async ({ page }) => {
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  
});

test('TC001_CSM_CARGO_HOLD', async ({ page }) => {
  await test.setTimeout(600000); // Set timeout to 2 minutes for this test
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await CSM_ImportBooking_MOTL(loginPage, cargoHoldData, 'CargoHold_BookingNumber.txt', 'CargoHold_BLN_Number.txt', 'CargoHold_ContainerNumber.txt', 'CargoHold_CargoNumber.txt');
  await SwitchModule(loginPage, 'Customer Service Portal');
  await CChold.CargoHold_CSM(loginPage);
  
  });


test('TC002_CSM_CARGO_HOLD_CheckDuplicateBLNumber', async ({ page }) => {
  await test.setTimeout(120000); // Set timeout to 2 minutes for this test
  await CSM_ImportBooking_MOTL(page, cargoHoldData, 'CargoHold_BookingNumber.txt', 'CargoHold_BLN_Number.txt', 'CargoHold_ContainerNumber.txt', 'CargoHold_CargoNumber.txt');
});

test('TC003_CSM_CARGO_HOLD_CheckDuplicateContainerNumber', async ({ page }) => {
  await test.setTimeout(120000);
  const ContainerNumber = await readTestArtifact('CargoHold_ContainerNumber.txt');
  const tc003Data = {
    ...cargoHoldData,
    LIGMNumber: getRandomNumberString(15),
    blnNumber: 'BLN' + getRandomNumberString(10),
    ContainerNo: ContainerNumber
  };
  await CSM_ImportBooking_MOTL(page, tc003Data, 'CargoHold_BookingNumber.txt', 'CargoHold_BLN_Number.txt', ContainerNumber, 'CargoHold_CargoNumber.txt');
});

// });