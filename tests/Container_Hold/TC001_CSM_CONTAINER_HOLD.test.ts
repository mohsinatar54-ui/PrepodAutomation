import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
  extractCargoDetailsNumber, selectEntityAndSite, readTestArtifact } from '../../utils/test-helpers';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';


const cargoHoldData = {
  DepotSizeType: '20 STD (20STD)',
  ISOSizeType: '22G1',
  TotalContainers: '5',
  Transport_Mode: 'Vessel',
  CHA_Name: 'MMJ LOGISTICS',
  OperatorID: 'Maersk',
  Commodity: 'WHEAT',
  PortOfLoading: 'BPCL',
  PortOfArrival: 'MUMBAI',
  DECWeight: '1000',
  DECVolume: '1000',
  WeightUnit: 'Tonnes',
  VolumeUnit: 'Cubic Meter',
  Packages: '100',
  PackageType: 'Bulk',
  FreightKind: 'FCL',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Depot Gate Operation',
  JobDescription: '1078', // 'Container In By Truck From Factory Stuffing (XITF)'
  LIGMNumber: getRandomNumberString(15),
  blnNumber: 'BLN' + getRandomNumberString(10),
  LineNumber: getRandomNumberString(5),
  ContainerNo: 'IMPU' + getRandomNumberString(7)
};

test.beforeEach(async ({ page }) => {
  await login(page);
  await selectEntityAndSite(page);
});

test('TC001_CSM_CONTAINER_HOLD', async ({ page }) => {
  await test.setTimeout(120000); 
  // await login(page);
  // await selectEntityAndSite(page);
  await CSM_ImportBooking_MOTL(page, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');
});

test('TC002_CSM_CARGO_HOLD_CheckDuplicateBLNumber', async ({ page }) => {
  await test.setTimeout(120000); // Set timeout to 2 minutes for this test
  await CSM_ImportBooking_MOTL(page, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');
});

test('TC003_CSM_CARGO_HOLD_CheckDuplicateContainerNumber', async ({ page }) => {
  await test.setTimeout(120000);
  const ContainerNumber = await readTestArtifact('ContainerHold_ContainerNumber.txt');
  const tc003Data = {
    ...cargoHoldData,
    LIGMNumber: getRandomNumberString(15),
    blnNumber: 'BLN' + getRandomNumberString(10),
    ContainerNo: ContainerNumber
  };
  await CSM_ImportBooking_MOTL(page, tc003Data, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', ContainerNumber, 'ContainerHold_CargoNumber.txt');
});
