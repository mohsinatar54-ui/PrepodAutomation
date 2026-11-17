import { test, expect,Page } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, 
  extractCargoDetailsNumber, selectEntityAndSite, readTestArtifact } from '../../utils/test-helpers';
import { CSM_ImportBooking_MOTL } from '../../Flows/ImportFlow';
import { CChold } from 'Pages/CChold';


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
let loginPage: Page;


test.beforeEach(async ({ page }) => {
   loginPage = await login(page);
  await selectEntityAndSite(loginPage);
});

test('TC001_CSM_CONTAINER_HOLD', async () => {
  await test.setTimeout(600000); 
  // await login(page);
  // await selectEntityAndSite(page);
   await CChold.HoldcontainerEdit(loginPage);
});
