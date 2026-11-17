// import { test, expect,Page } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
//   extractCargoDetailsNumber, selectEntityAndSite, readTestArtifact } from '../../utils/test-helpers';
// import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';



// const cargoHoldData = {
//   DepotSizeType: '20 STD (20STD)',
//   ISOSizeType: '22G1',
//   TotalContainers: '5',
//   Transport_Mode: 'Vessel',
//   CHA_Name: 'MMJ LOGISTICS',
//   OperatorID: 'Maersk',
//   Commodity: 'WHEAT',
//   PortOfLoading: 'BPCL',
//   PortOfArrival: 'MUMBAI',
//   DECWeight: '1000',
//   DECVolume: '1000',
//   WeightUnit: 'Tonnes',
//   VolumeUnit: 'Litres',
//   Packages: '100',
//   PackageType: 'Bulk',
//   FreightKind: 'FCL',
//   JobCategory: 'Container Job',
//   JobActivityPoint: 'Depot Gate Operation',
//   JobDescription: '1078', // 'Container In By Truck From Factory Stuffing (XITF)'
//   LIGMNumber: getRandomNumberString(15),
//   blnNumber: 'BLN' + getRandomNumberString(10),
//   LineNumber: getRandomNumberString(5),
//   ContainerNo: 'IMPU' + getRandomNumberString(7),
//   POL: 'VAGE',
//   POA: 'BPCL'
// };


// const cargoHoldGateData = {
//   tareWeight: '2500',
//   damageDetails: 'No visible damage',
//   maxPermissibleWeight: '30000',
//   customSeal: '100',
//   igmSealNo: 'IGM98765',
//   truckRFID: 'RFID0001',
//   surveyRemark: 'Condition OK',
//   EIRNo: 'EIR20260109',
//   portName: 'BPCL',
//   portExitPassNo: 'PEP123456',
//   portOutDateTime: '2026-01-09T11:10',
//   cfsGateInDateTime: '2026-01-09T11:15',
//   portTransNo: 'PTN20260109',
//   HoldComment:'Holdtest'
// };
// let loginPage: Page;


// test.beforeEach(async ({ page }) => {
//    loginPage = await login(page);
//   await selectEntityAndSite(loginPage);
//   await CSM_ImportBooking_MOTL(loginPage, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');

// });

// // test('TC001_CSM_CONTAINER_HOLD', async () => {
// //   await test.setTimeout(600000); 
// //   // await login(page);
// //   // await selectEntityAndSite(page);
  
// // });

// test('TC002_GATE_CONTAINER_HOLD.test.ts', async ({ page }) => {
//   test.setTimeout(600_000); // 2 minutes timeout for this test
//   // await login(page);
//  const loginPage = await login(page);
//   await selectEntityAndSite(loginPage);
//  await Gate_Import(loginPage, cargoHoldGateData, 'HRVehicleNo.txt',);
//  await SwitchModule(loginPage, 'Yard Operations');
//  await YardPlannerFlow_Hold(loginPage);
//  await SwitchModule(loginPage, 'Customer Service Portal');
//  await CChold.CSMRelease(loginPage);

// }
// )
// // test('TC002_CSM_CARGO_HOLD_CheckDuplicateBLNumber', async ({ page }) => {
// //   await test.setTimeout(120000); // Set timeout to 2 minutes for this test
// //   await CSM_ImportBooking_MOTL(page, cargoHoldData, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', 'ContainerHold_ContainerNumber.txt', 'ContainerHold_CargoNumber.txt');
// // });

// // test('TC003_CSM_CARGO_HOLD_CheckDuplicateContainerNumber', async ({ page }) => {
// //   await test.setTimeout(120000);
// //   const ContainerNumber = await readTestArtifact('ContainerHold_ContainerNumber.txt');
// //   const tc003Data = {
// //     ...cargoHoldData,
// //     LIGMNumber: getRandomNumberString(15),
// //     blnNumber: 'BLN' + getRandomNumberString(10),
// //     ContainerNo: ContainerNumber
// //   };
// //   await CSM_ImportBooking_MOTL(page, tc003Data, 'ContainerHold_BookingNumber.txt', 'ContainerHold_BLN_Number.txt', ContainerNumber, 'ContainerHold_CargoNumber.txt');
// //});
