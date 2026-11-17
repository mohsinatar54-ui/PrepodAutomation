// import { test, expect } from '@playwright/test';
// import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact } from '../../../utils/test-helpers';
// import fs from 'fs';
// import { selectEntityAndSite } from 'utils/test-helpers';
// import { CSMExport, CSMImport } from 'Locators/BookingLocators';
// import { Common } from 'Locators/BookingLocators';
// import { CSM_ImportBooking_MOTL } from 'Flows/ImportFlow';

// const ImportBookingData = {
//    DepotSizeType: '20 STD (20STD)',
//   ISOSizeType: '20G1',
//   TotalContainers: '5',
//   Transport_Mode: 'Vessel',
//   CHA_Name: 'MMJ LOGISTICS',
//   OperatorID: 'MAERSKLINE',
//   Commodity: 'WHEAT',
//   PortOfLoading: 'BPCL',
//   PortOfArrival: 'MUMBAI',
//   DECWeight: '1000',
//   DECVolume: '1000',
//   WeightUnit: 'Tonnes',
//   VolumeUnit: 'Cubic Meter',
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

// test('TC001_DIRECT_IMPORT_BOOKING_', async ({ page }) => {
//   await test.setTimeout(700000); // 2 minutes timeout for this test
//   await login(page);
//   await selectEntityAndSite(page);
//   await CSM_ImportBooking_MOTL(page,ImportBookingData,'Direct_Import_BookingNumber.txt','BLNNumber.txt','DirectImport_Container.txt','CargoNumber.txt');
  
// });