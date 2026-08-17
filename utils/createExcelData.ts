import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { chromium, expect, Page, TestInfo, TestType, Reporter, FullConfig, Suite, TestCase, TestResult } from '@playwright/test';


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
    "Via No.": 87777,
    "Vessel Name": "ANI016",
    "IGM Number": igm,
    "IGM Date": "02122025",
    "ContainerNo": `IALU${randomNumbers(7)}`,
    "Category": 20,
    "ISOCD": 2000,
    "Ctr Sz": 20,
    "LFCL": "FCL",
    "F/E": "F",
    "Ctr Type": "20STD",
    "L. No": 3939,
    "Seal No": `SL${randomNumbers(6)}`,
    "COA": "MAERSKLINE",
    "G . Wt  (in MT)": 30,
    "Consignee": "",
    "Cargo Description": "General",
    "Bill of Lading": bl,
    "Pan No": "ABCE379D",
    "Group Code": "",
    "Origin": "CCTL",
    "Hazardous": "N",
    "LiveReefer": "N",
    "OOG": "N",
    "UNNOCode": "",
    "IMOCode": "",
    "Inbound Voyage": `IV${randomNumbers(4)}`,
    "Outbound Voyage": `OV${randomNumbers(4)}`,
    "GIGM NO": gigm,
    "GIGM Date": "02122025",
    "OFAC": "N",
    "IsHold": "Y",
    "Remark": "Kept on Hold"
  };
}

export function createExcelFile() {

  const igmNumber = randomNumbers(10);
  const gigmNumber = randomNumbers(10);
  const billOfLading = `BLN_${randomNumbers(7)}`;

  const rows = [
    generateContainerRow(1, igmNumber, gigmNumber, billOfLading),
    generateContainerRow(2, igmNumber, gigmNumber, billOfLading)
  ];

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const filePath = path.join(process.cwd(), "test-data", "igmUpload.xlsx");

  XLSX.writeFile(wb, filePath);

  return {
    filePath,
    billOfLading
  };
}


export async function selectFutureDay(page: Page, daysToAdd: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  const day = date.getDate();

  // const todayMonth = today.getMonth();
  // const targetMonth = tomorrow.getMonth();
  // If month changes → go to next month
  // if (targetMonth !== todayMonth) {
  //   await page.locator('.ant-picker-header-next-btn').click();
  // }

  await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner', {
    hasText: String(day),
  }).first().click();

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
    TruckNo: `TRK${100 + i}`,
    SealNo: "",
    CHA: "MMJ LOGISTICS",
    FreighForward: "",
    Importer: "",
    Exporter: "",
    DepotQualityCode: "",
    IsLiveReefer: "N",
    Humidity: "",
    Temperature: "",
    TempUnit: "",
    Ventilation: "",
    POL: "",
    POD: "",
    OOG: "",
    Transporter: "",
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
  const vehicleNumbers: string[] = [];

  const rows = [1, 2].map((i) => {
    const containerNo = `PREU${randomNumbers(7)}`;
    containerNumbers.push(containerNo);

    return generatePreAdviceRow(i, referenceNo, containerNo);
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const dirPath = path.join(process.cwd(), 'test-data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `preadvice_${referenceNo}.xlsx`);
  XLSX.writeFile(wb, filePath);

  return {
    filePath,
    referenceNo,
    containerNumbers // 🔥 important
  };
}