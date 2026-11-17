import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectFutureDay, selectEntityAndSite } from '../../utils/test-helpers';
import fs from 'fs';
import { CSM_Empty_IN_Flow } from '../../Flows/EmptyFlow';


const EmptyData = {
  DepotSizeType: '20 STD',
  ISOSizeType: '20G1',
  TotalContainerCount: '5',
  Operator: 'MAERSKLINE',
  POL: 'VAGE',
  POD: 'Port den',
  JobActivity: 'Empty Container In from Port (EITP)',
  JobWorkType: 'Job Order',
  HoldType: 'Shipping Line Hold',
  BookingReferenceNo: 'BK' + getRandomNumberString(6),
  ContainerNo: 'CNTU' + getRandomNumberString(7)
};

test('TC001_ExportINDirect_CSM_EMPTY_IN', async ({ page }) => {
  await test.setTimeout(600000); // Set timeout to 2 minutes for this test
  //await login(page);
  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  // await CSM_Empty_IN_Out_Flow(page, EmptyData, 'EmptyBooking_Ref.txt', 'Empty_BookingNumber.txt', 'EmptyIn_Container.txt');
  await CSM_Empty_IN_Flow(loginPage, EmptyData, 'ExportINDirect_EmptyBooking_Ref.txt', 'ExportINDirect_Empty_BookingNumber.txt', 'ExportINDirect_EmptyIn_Container.txt');
}); 