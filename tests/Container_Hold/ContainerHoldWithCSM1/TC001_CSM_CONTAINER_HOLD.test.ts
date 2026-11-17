import { test, expect,Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
  extractCargoDetailsNumber, selectEntityAndSite, readTestArtifact, 
  SwitchModule} from '../../../utils/test-helpers';
import { CSM_ImportBooking_MOTL, Gate_Import } from '../../../Flows/ImportFlow';
import { YardPlannerFlow_Hold } from 'Flows/YardFlow';
import { CChold } from 'Pages/CChold';
//import {Ga}


const cargoHoldData = {
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
  WeightUnit: 'Kilogram',
  VolumeUnit: 'Gallons',
  Packages: '100',
  PackageType: 'Bulk',
  FreightKind: 'FCL',
  JobCategory: 'Container Job',
  JobActivityPoint: 'Depot Gate Operation',
  JobDescription: '1078', // 'Container In By Truck From Factory Stuffing (XITF)'
  LIGMNumber: getRandomNumberString(7),
  blnNumber: 'BLN' + getRandomNumberString(10),
  LineNumber: getRandomNumberString(5),
  ContainerNo: 'IMPU' + getRandomNumberString(7),
  POL: 'VAGE',
  POA: 'BPCL'
};



let loginPage: Page;


test.beforeEach(async ({ page }) => {
   loginPage = await login(page);
  await selectEntityAndSite(loginPage);
});

test('TC001_CSM_CONTAINER_HOLD', async () => {
  await test.setTimeout(600000); 
  // await login(page);
  // await selectEntityAndSite(page);
    await CSM_ImportBooking_MOTL(loginPage, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');

});



// test('TC002_CSM_CARGO_HOLD_CheckDuplicateBLNumber', async ({ page }) => {
//   await test.setTimeout(120000); // Set timeout to 2 minutes for this test
//   await CSM_ImportBooking_MOTL(page, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');
// });

// test('TC003_CSM_CARGO_HOLD_CheckDuplicateContainerNumber', async ({ page }) => {
//   await test.setTimeout(120000);
//   const ContainerNumber = await readTestArtifact('ContainerHold_ContainerNumber.txt');
//   const tc003Data = {
//     ...cargoHoldData,
//     LIGMNumber: getRandomNumberString(15),
//     blnNumber: 'BLN' + getRandomNumberString(10),
//     ContainerNo: ContainerNumber
//   };
//   await CSM_ImportBooking_MOTL(page, tc003Data, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', ContainerNumber, 'ContainerHold_CargoNumber.txt');
// });
