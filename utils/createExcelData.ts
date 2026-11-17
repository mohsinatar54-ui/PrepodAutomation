import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { chromium, expect, Page, TestInfo, TestType, FullConfig } from '@playwright/test';


function randomNumbers(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function generateContainerRow(i: number, igm: string, gigm: string, bl: string) {


return {
  "Sr. no.": i,
  "*Shipping Line": "ANGELTWO",
  "*Vessel Name": "Vessel_ABC_1",
  "*Inbound Voyage": "TestV",
  "*Outbound Voyage": "TestV",
  "*Line No": 1111,
  "*B/L No": bl,
  "B/L Date": "22092026",
  "Subline No": "",
  "HBL NO": "5750711",
  "HBL Date": "22092026",
  "Importer/Consignee": "ANGELTWO",
  "Nature of Cargo": "NON SOLAR",
  "Gross Weight": 48,
  "Unit of Weight": "KGS",
  "UNO Code": "ZZZ",
  "Cargo Description":
    "220 HD CONTAINERS STC WET DATES HS CODE: 08041020 2500/CARTONS",
  "Importer Address 1": "SHREE HARIKRUSHNA IMPEX",
  "Importer Address 2": "E 31, PHASE II, MARKET I, APMC MAH",
  "Importer Address 3": "ARASHTRA,400705",
  "Importer Address 4": "TEST ADDRESS 4",
  "Cargo Movement": "FCL",
  "Type of Package": "PKG",
  "Mode of Transport": "Truck",
  "Cargo": "GEN",
  "IMO Code": "",
  "MLO Code": "",
  "*POD": "VAGE",
  "Port of Destination": "Port den",
  "*Container No": `MOHS${randomNumbers(7)}`,
  "ISO Code": "22R1",
  "CtrSz": "20RF",
  "Tare Weight": 200,
  "Total No of Packages in Container": 100,
  "Cont Sub Line No": 111,
  "Container Seal No": randomNumbers(7),
  "Via No.": 4511,
  "*IGM Number": igm,
  "*IGM Date": "22092026",
  "Pan No": "5474571111",
  "*Origin": "TEST",
  "Hazardous": "Y",
  "LiveReefer": "Y",
  "OOG": "N",
  "No of Packages": 100,
  "Volume": 200,
  "Unit of Volume": "cbm",
  "ReeferTemperature": "20",
  "TemperatureUnit": "Celsius",
  "HMT": "10",
  "Vent": "30",
  "*GIGM NO": gigm,
  "*GIGM Date": "22092026",
  "IsHold": "N",
  "Hold Remark": " NOT ON HOLD",
  "Container Grade": "NEW",
  "Is Transit": "N",
  "Is Transhipment": "Y"
};


  //{
  //   "Sr. no.": i,
  //   "Via No.": 87777,
  //   "Vessel Name": "ANI016",
  //   "IGM Number": igm,
  //   "IGM Date": "02122025",
  //   "ContainerNo": `IALU${randomNumbers(7)}`,
  //   "Category": 20,
  //   "ISOCD": 2000,
  //   "Ctr Sz": 20,
  //   "LFCL": "FCL",
  //   "F/E": "F",
  //   "Ctr Type": "20STD",
  //   "L. No": 3939,
  //   "Seal No": `SL${randomNumbers(6)}`,
  //   "COA": "MAERSKLINE",
  //   "G . Wt  (in MT)": 30,
  //   "Consignee": "",
  //   "Cargo Description": "General",
  //   "B/L No": bl,
  //   "Pan No": "ABCE379D",
  //   "Group Code": "",
  //   "Origin": "CCTL",
  //   "Hazardous": "N",
  //   "LiveReefer": "N",
  //   "OOG": "N",
  //   "UNNOCode": "",
  //   "IMOCode": "",
  //   "Inbound Voyage": `IV${randomNumbers(4)}`,
  //   "Outbound Voyage": `OV${randomNumbers(4)}`,
  //   "GIGM NO": gigm,
  //   "GIGM Date": "02122025",
  //   "OFAC": "N",
  //   "IsHold": "Y",
  //   "Remark": "Kept on Hold"
  // };
}

// function GenerateEALContainerRow(Sb: string, Sn: string, bl: string) {


// return {
//   //"Sr. no.":i,
//   "SB Number":Sb,
//     "SB Date": "10-06-2026",
//     "Exporter Name": "ANGELTWO",
//     "CHA Name": "C000608273",
//     "FOB Value": 100000,
//     "Container Full In": "Y",
//     "Container No": `MOHS${randomNumbers(7)}`,
//     "ISO Size/Type": "22R1",
//     "Operator": "ANGELTWO",
//     "ACH Name": "C000608273",
//     "LFCL": "FCL",
//     "Declared Weight": 48,
//     "Declared Volume": 200,
//     "Seal No": Sn,
//     "LRF": "N",
//     "OOG": "N",
//     "VGM": 48,
//     "Destination": "VAGE",
//     "Commodity": "NON SOLAR",
//     "Cargo Description":
//       "220 HD CONTAINERS STC WET DATES HS CODE: 08041020 2500/CARTONS",
//     "Packages": 100,
//     "Package Type": "PKG",
//     "Gross Weight": 48,
//     "Weight Unit": "KGS",
//     "Volume": 200,
//     "Volume Unit": "CBM",
//     "Hazardous": "Y",
//     "IMO": "",
//     "UNNO": "ZZZ",
//     "Load Port": "TEST",
//     "Customs Seal": randomNumbers(7),
//     "Cargo Shipping Bill No": bl,
//     "IsHold": "N",
//     "Remark": "NOT ON HOLD",
//     "Container Grade": "NEW",
//     "IsTransit": "N",
//     "IsTranshipment": "Y"
// };



export function createExcelFile() {

  const igm = randomNumbers(7);
  const gigm = randomNumbers(7);
  const bl = `BLN${randomNumbers(7)}`;

  // const rows = [
  //   generateContainerRow(1, igm, gigm, bl),
  //   // generateContainerRow(2, igm, gigm, bl)
  // ];

   // Empty array for Excel rows
  const rows = [];

  // Generate required number of container rows
  for (let i = 1; i <= 5; i++) {

    rows.push(
      generateContainerRow(
        i,
        igm,
        gigm,
        bl
      )
    );

  }


  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const filePath = path.join(process.cwd(), "test-data", "igmUpload.xlsx");

  // Create test-data folder if it doesn't exist
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  XLSX.writeFile(wb, filePath);

  return {
    filePath,
    bl
  };
}

// export function createExcelFileForEAL() {

//   const Sb = randomNumbers(7);
//   const Sn = randomNumbers(7);
//   const bl = randomNumbers(7);

//   // const rows = [
//   //   generateContainerRow(1, igm, gigm, bl),
//   //   // generateContainerRow(2, igm, gigm, bl)
//   // ];

//    // Empty array for Excel rows
//   const rows = [];

//   // Generate required number of container rows
//   for (let i = 1; i <= 1; i++) {

//     rows.push(
//       GenerateEALContainerRow(
      
//         Sb,
//         Sn,
//         bl
//       )
//     );

//   }


//   const ws = XLSX.utils.json_to_sheet(rows);
//   const wb = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//   const filePath = path.join(process.cwd(), "test-data", "EALUpload.xlsx");

//   // Create test-data folder if it doesn't exist
//   fs.mkdirSync(path.dirname(filePath), { recursive: true });

//   XLSX.writeFile(wb, filePath);

//   return {
//     filePath,
//     bl
//   };
// }
// export async function selectFutureDay(page: Page, daysToAdd: number) {
//   const date = new Date();
//   date.setDate(date.getDate() + daysToAdd);

//   const day = date.getDate();

//   // const todayMonth = today.getMonth();
//   // const targetMonth = tomorrow.getMonth();
//   // If month changes → go to next month
//   // if (targetMonth !== todayMonth) {
//   //   await page.locator('.ant-picker-header-next-btn').click();
//   // }

//   await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner', {
//     hasText: String(day),
//   }).first().click();

// }

function getExcelDate(date = new Date()) {
  const utcDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const excelEpoch = Date.UTC(1899, 11, 30);

  return Math.floor(
    (utcDate - excelEpoch) / (1000 * 60 * 60 * 24)
  );
}


function GenerateEALContainerRow(
  Sb: string,
  Sn: string,
  bl: string
) {
  return {
    "SB Number": Sb,

    // Automatically today's date
    "SB Date": getExcelDate(),

    "Exporter Name": "ANGELTWO",
    "CHA Name": "C000608273",
    "FOB Value": 100000,
    "Container Full In": "Y",
    "Container No": `MOHS${randomNumbers(7)}`,
    "ISO Size/Type": "22G1",
    "Operator": "ANGELTWO",
    "ACH Name": "C000608273",
    "LFCL": "FCL",
    "Declared Weight": 48,
    "Declared Volume": 200,
    "Seal No": Sn,
    "LRF": "N",
    "OOG": "N",
    "VGM": 48,
    "Destination": "VAGE",
    "Commodity": "NON SOLAR",
    "Cargo Description":
      "220 HD CONTAINERS STC WET DATES HS CODE: 08041020 2500/CARTONS",
    "Packages": 100,
    "Package Type": "PKG",
    "Gross Weight": 48,
    "Weight Unit": "KGS",
    "Volume": 200,
    "Volume Unit": "CBM",
    "Hazardous": "N",
    "IMO": "",
    "UNNO": "ZZZ",
    "Load Port": "TEST",
    "Customs Seal": randomNumbers(7),
    "Cargo Shipping Bill No": bl,
    "IsHold": "N",
    "Remark": "NOT ON HOLD",
    "Container Grade": "NEW",
    "IsTransit": "N",
    "IsTranshipment": "Y"
  };
}


export function createExcelFileForEAL() {
  const Sb = randomNumbers(9);
  const Sn = randomNumbers(9);
  const bl = randomNumbers(9);

  const rows = [];

  for (let i = 1; i <= 1; i++) {
    rows.push(
      GenerateEALContainerRow(Sb, Sn, bl)
    );
  }

  const ws = XLSX.utils.json_to_sheet(rows);

  // Format SB Date as DD-MM-YYYY
  if (ws["B2"]) {
    ws["B2"].t = "n";
    ws["B2"].z = "dd-mm-yyyy";
  }

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Sheet1"
  );

  const filePath = path.join(
    process.cwd(),
    "test-data",
    "EALUpload.xlsx"
  );

  fs.mkdirSync(
    path.dirname(filePath),
    { recursive: true }
  );

  XLSX.writeFile(wb, filePath);

  return {
    filePath
  };
}


export async function selectFutureDay(
  page: Page,
  daysToAdd: number
) {
  const targetDate = new Date();

  targetDate.setHours(0, 0, 0, 0);
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const targetDay = targetDate.getDate();

  const today = new Date();

  // Calculate how many months we need to move forward
  const monthsToMove =
    (targetDate.getFullYear() - today.getFullYear()) * 12 +
    (targetDate.getMonth() - today.getMonth());

  // Move to target month
  for (let i = 0; i < monthsToMove; i++) {
    await page
      .locator('.ant-picker-header-next-btn')
      .click();
  }

  // Select target day
  await page
    .locator('.ant-picker-cell-in-view .ant-picker-cell-inner')
    .filter({ hasText: String(targetDay) })
    .first()
    .click();
}



function generatePreAdviceRow(i: number, referenceNo: string, containerNo: string) {
  return {
    ContainerNo: containerNo,
    AccountHolder: "MMJ LOGISTICS",
    Operator: "MMJ001",
    ISOSize: "22G1",
    Cycle: "MTY",
    Activity: "Empty Container In from Port (EITP)",
    ReferenceNo: referenceNo,
   // TruckNo: `TRK${100 + i}`,
    TruckNo: `TRK${randomNumbers(4)}`,
    SealNo: "",
    CHA: "MMJ LOGISTICS",
    FreighForward: "",
    Importer: "",
    Exporter: "",
    DepotQualityCode: "AQUABA",
    DepotCondition:"Available",
    IsLiveReefer: "N",
    Humidity: "",
    Temperature: "",
    TempUnit: "",
    Ventilation: "",
    POL: "",
    POD: "",
    OOG: "",
    Transporter: "OM SAI LOGISTICS - THANE",
    VESSELVOY: "",
    Weight: 100,
    WeightUnit: "kgs",
    IsHaz: "N",
    IMO1: "",
    IMO2: "",
    IMO3: "",
    UNNO1: "",
    UNNO2: "",
    UNNO3: "",
    Commodity: "",
    "Transport By": "CFS",
    MovementType: "ITT",
    Remark: "Auto Upload",
    IsHold: "N",
    OFAC: "N",
    ContainerSale: "N"
  };
}

export function createPreAdviceExcel() {
  const referenceNo = randomNumbers(8);

  const containerNumbers: string[] = [];
  const rows = [];

  // Generate required number of container rows
  for (let i = 1; i <= 1; i++) {
    const containerNo = `PREU${randomNumbers(7)}`;
    containerNumbers.push(containerNo);

    rows.push(
      generatePreAdviceRow(
        i,
        referenceNo,
        containerNo
      )
    );
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // const filePath = path.join(
  //   process.cwd(),
  //   "test-data",
  //   `preadvice_${referenceNo}.xlsx`
  // );

  const filePath = path.join(process.cwd(), "test-data", "preadvice.xlsx");

  // Create test-data folder if it doesn't exist
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  XLSX.writeFile(wb, filePath);

  return {
    filePath,
    referenceNo,
    containerNumbers
  };
}

// export function createPreAdviceExcel() {
//   const referenceNo = randomNumbers(8);

//   const containerNumbers: string[] = [];
//   const vehicleNumbers: string[] = [];

//   const rows = [1, 2].map((i) => {
//     const containerNo = `PREU${randomNumbers(7)}`;
//     containerNumbers.push(containerNo);

//     return generatePreAdviceRow(i, referenceNo, containerNo);
    
//   });

//   const ws = XLSX.utils.json_to_sheet(rows);
//   const wb = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//   const dirPath = path.join(process.cwd(), 'test-data');
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }

//   const filePath = path.join(dirPath, `preadvice_${referenceNo}.xlsx`);
//   XLSX.writeFile(wb, filePath);

//   return {
//     filePath,
//     referenceNo,
//     containerNumbers // 🔥 important
//   };
// }