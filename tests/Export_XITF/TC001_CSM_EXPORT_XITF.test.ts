import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, login, getNextDateTimeFormatted, getRandomNumberString, waitForPageLoad, writeTestArtifact, selectEntityAndSite } from '../../utils/test-helpers';
import fs from 'fs';
import { ExportBooking_XITF, ExportBooking_XITF_With_JobPlan_Savesubmit1 } from 'Flows/ExportFlow';
import { ExportBooking_XITF_With_JobPlan_Savesubmit } from 'Flows/ExportFlow';
import { time } from 'console';

// const PrimaryACCountHolder = 'ADITYA LOGISTICS(ADI01)';
// const Operator = 'MMJ LOGISTICS';
// const DepotSizeType = '20 STD (20STD)';
// const ISOSizeType = '22G1';
// const TotalContainers = '5';
// const CargoWeight = '1000';
// const CargoVolume = '1000';
// const WeightUnit = 'Tonnes';
// const VolumeUnit = 'Cubic Meter';
// const CargoPackages = '100';
// const PackageType = 'Bulk';
// const Commodity = 'Aluminium';
// const FreightKind = 'FCL';
// const Sealtype = 'ESEAL';
// const PortOfLoading = 'BPCL';
// const PortOfArrival = 'MUMBAI';

// const JobCategory = 'Container Job';
// const JobActivityPoint = 'Depot Gate Operation';
// const JobDescription = "Container In By Truck From Factory Stuffing  (XITF)" //'Container In By Truck From Factory Stuffing (XITF)';

const ExportBookingData = {
      PrimaryAccountHolder: 'ADITYA LOGISTICS',
     // Operator: 'MMJ LOGISTICS',
      Operator: 'MAERSKLINE',
      CHA: 'MMJ LOGISTICS',
      FOBValue: '500000',
      DepotSizeType: '20 STD (20STD)',
      ISOSizeType: '20G1',
      TotalContainers: '5',
      CargoWeight: '1000',
      CargoVolume: '1000',
      WeightUnit: 'Tonnes',
      VolumeUnit: 'Cubic Meter',
      CargoPackages: '100',
      PackageType: 'Bulk',
      Commodity: 'Aluminium',
      FreightKind: 'FCL',
      Sealtype: 'ESEAL',
      POA: 'BPCL',
      POL: 'VAGE',
      JobCategory: 'Container Job',
      JobActivityPoint: 'Depot Gate Operation',
      JobDescription: "3: 1078", //'Container In By Truck From Factory Stuffing (XITF)';
      HoldType: "Shipping Line Hold",
      ContainerNo: 'PWTU' + getRandomNumberString(7),
      business_identification_no: 'BIN' + getRandomNumberString(10),
      Shipping_Bill_Number: getRandomNumberString(7)
};


test('TC001_CSM_EXPORT_XITF', async ({ page }) => {
  await test.setTimeout(60_000); // 2 minutes timeout for this test
  // await login(page);
    const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await ExportBooking_XITF(loginPage, ExportBookingData, 'XITF_BookingNumber.txt', 'XITF_Container.txt');
  await ExportBooking_XITF_With_JobPlan_Savesubmit1(loginPage);
  
});
  