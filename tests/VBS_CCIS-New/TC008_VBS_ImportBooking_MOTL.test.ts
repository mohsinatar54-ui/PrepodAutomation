import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
  extractCargoDetailsNumber, selectEntityAndSite,readTestArtifact } from '../../utils/test-helpers';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';

const bookingfile = 'VBSImport_BookingNumber.txt';
const blnfile = 'VBSImport_BLN_Number.txt';
const containerfile = 'VBSImport_ContainerNumber.txt';
const cargofile = 'VBSImport_CargoNumber.txt';
// test.describe.serial('Cargo Hold Tests', () => {
let ImportMOTL: any;

test.beforeAll(async () => {

ImportMOTL = {
  DepotSizeType: '20 STD (20STD)',
  ISOSizeType: '22G1',
  TotalContainers: '5',
  Transport_Mode: 'Vessel',
  CHA_Name: 'MMJ LOGISTICS',
  OperatorID: 'MMJ LOGISTICS',
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
});

test.beforeEach(async ({ page }) => {
  await login(page);
  await selectEntityAndSite(page);
});

test('TC008_VBS_ImportBooking_MOTL', async ({ page }) => {
  await test.setTimeout(120000); // Set timeout to 2 minutes for this test
  await CSM_ImportBooking_MOTL(page, ImportMOTL, bookingfile, blnfile, containerfile, cargofile);
});
