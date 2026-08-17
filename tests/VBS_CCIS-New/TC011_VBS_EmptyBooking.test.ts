import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, writeTestArtifact, selectFutureDay, selectEntityAndSite } from '../../utils/test-helpers';
import fs from 'fs';
import { CSM_EmptyFlow } from '../../Flows/EmptyFlow';


const EmptyData = {
  DepotSizeType: '20 STD',
  ISOSizeType: '22G1',
  TotalContainerCount: '5',
  Operator: 'MAERSKLINE',
  POL: 'VAGE',
  POD: 'Port den',
  JobActivity: 'Empty Container In from Port (EITP)',
  JobWorkType: 'Job Order',
  HoldType: 'Shipping line hold',
};

test('TC011_VBS_EmptyBooking', async ({ page }) => {
  await test.setTimeout(60000); // Set timeout to 2 minutes for this test
  await login(page);
  await selectEntityAndSite(page);
  await CSM_EmptyFlow(page, EmptyData, 'VBS_EmptyBooking_Ref.txt', 'VBS_Empty_BookingNumber.txt', 'VBS_EmptyIn_Container.txt');
});
