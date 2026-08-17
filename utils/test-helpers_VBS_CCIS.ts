import { chromium, expect, Page, TestInfo, TestType } from "@playwright/test";
import type { Reporter, FullConfig, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { log } from 'console';
import { Master } from 'Locators/VBSMasters';
import { test } from "@playwright/test";

  //QA Environment
  // const URL = 'http://172.16.23.54:9293/login';
  // const Username = 'suneha';
  // const Password = 'Pass@123';
   // const Entity = 'Beacon Depot';
  // const Site = 'Jeddah';

  //Prepaclx Environment
  // const URL = 'http://prepaclx.logstarerp.com/uen/login';
  // const Username = 'adityasingh';
  // const Password = 'Test@123';
  const Entity = 'Beacon Depot';
  const Site = 'West Terminal';

//Logstar Cloud Environment
const URL = 'https://logstarcloud.io/';
const Username = 'adityasingh';
const Password = 'Test@123';

export async function selectEntityAndSite(page: Page) {
  // await page.locator('//ng-select[@placeholder="Select Entity"]').selectOption({ label: entity });
  // await page.locator('//ng-select[@placeholder="Select Site"]').selectOption({ label: Site });
  // Entity selection
    await page.locator('//ng-select[@placeholder="Select Entity"]').click();
    await page.locator(`//div[@role="option"]//span[normalize-space()="${Entity}"]`).click();
    await page.locator('//ng-select[@placeholder="Select Site"]').click();
    await page.locator(`//div[@role="option"]//span[normalize-space()="${Site}"]`).click();
}

export async function setBookingTypeCapacity(page: any, bookingType: string, capacity: string) {
  // Navigate to Masters
  await clickAndMeasureDynamic(
    page,
    Master.MastersTab,
    Master.BookingTypeTab,
    'Go to Masters'
  );

  // Click on Booking Type Master in sidebar
  await clickAndMeasureDynamic(
    page,
    Master.BookingTypeTab,
    Master.Title_BookingType,
    'Go to Booking Type Master'
  );

  // Click the Edit icon for the specified booking type
  await page.click(Master.Edit_BookingType(bookingType));

  // Set capacity
  await page.fill(Master.CapacityInput_BookingType, capacity);

  // Click Save button
  await page.click(Master.Save_BookingType(bookingType));

  // Wait for the table to update and verify the change
  await expect(page.locator(Master.CapacityValue_BookingType(bookingType))).toHaveText(capacity);
}


export function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}

// Resolve project root (adjust ".." if utils folder depth differs)
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Centralized test-artifacts directory
const TEST_ARTIFACTS_DIR = path.join(PROJECT_ROOT, 'test-artifacts');

/**
 * Writes data to a file inside test-artifacts directory
 */
export function writeTestArtifact(
  fileName: string,
  data: string
): void {
  if (!fs.existsSync(TEST_ARTIFACTS_DIR)) {
    fs.mkdirSync(TEST_ARTIFACTS_DIR, { recursive: true });
  }

  const filePath = path.join(TEST_ARTIFACTS_DIR, fileName);
  fs.writeFileSync(filePath, data, 'utf-8');
}

/**
 * Reads data from a file inside test-artifacts directory
 */
export function readTestArtifact(
  fileName: string
): string {
  const filePath = path.join(TEST_ARTIFACTS_DIR, fileName);
  return fs.readFileSync(filePath, 'utf-8');
}

export function Createfile(prefix: string, CreatedNumber: string): string {
    const artifactsDir = path.resolve(__dirname, '../test-artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${prefix}.txt`;
    const filePath = path.join(artifactsDir, fileName);
    fs.writeFileSync(filePath, CreatedNumber, { encoding: 'utf-8' });
    console.log(`Container Number stored: ${CreatedNumber} in ${filePath}`);
    return filePath;
  }


  export function getNextDateTimeFormatted(n: number): { date: string, day: string, month: string, year: string, hours: string, minutes: string, dateTime: string } {
    const now = new Date();
    now.setDate(now.getDate() + n);
  
    const pad = (n: number) => n < 10 ? '0' + n : n.toString();
  
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // Months are 0-indexed
    const year = now.getFullYear().toString();
    // .toString().slice(-2);
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const date = `${day}${month}${year}`;
    const dateTime = `${day}${month}${year} ${hours}:${minutes}`;
    return { date, day, month, year, hours, minutes, dateTime };
  }

  export async function getTomorrowDateFormats(ApptDate: number) {
    let tomorrow_ddmmyyyy = '';
    let tomorrow_ddMmmYYYY = '';
    let tomorrow_weekday = '';

    await test.step('Calculate tomorrow\'s date formats', async () => {
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + ApptDate);
      const pad = (num: number) => String(num).padStart(2, '0');
      tomorrow_ddmmyyyy = `${pad(tomorrowDate.getDate())}-${pad(tomorrowDate.getMonth() + 1)}-${tomorrowDate.getFullYear()}`;
      console.log('tomorrow_ddmmyyyy: ', tomorrow_ddmmyyyy);

      const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      tomorrow_ddMmmYYYY = `${pad(tomorrowDate.getDate())} ${monthsShort[tomorrowDate.getMonth()]} ${tomorrowDate.getFullYear()}`;
      console.log('tomorrow_ddMmmYYYY: ', tomorrow_ddMmmYYYY);

      tomorrow_weekday = tomorrowDate.toLocaleDateString('en-US', { weekday: 'long' });
      console.log('tomorrow_weekday: ', tomorrow_weekday);
    });

    return {
      ddmmyyyy: tomorrow_ddmmyyyy,
      ddMmmYYYY: tomorrow_ddMmmYYYY,
      weekday: tomorrow_weekday,
    };
  }
export function getRandomNumberString(length: number): string {
  return Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
  }

  export async function login(page: Page) {
    await page.goto(URL);
    await page.locator('//a[normalize-space()="Login"]').click();
    // Step 2: Login flow + MNR visibility selection
    await page.locator('//input[@name="username"]').fill(Username);
    await page.locator('//input[@name="password"]').fill(Password);
    await clickAndMeasureDynamic(page, '//button[@type="submit"]', '(//div[@class="ng-input"]//input)[1]', 'Click Login button');
    
  }

export async function SelectVehicleType(page: Page, vehicleType: string) {
  if (vehicleType === 'Truck') {
    await page.locator(Master.TruckTab).click();
  } else if (vehicleType === 'Barge') {
    await page.locator(Master.BargeTab).click();
  } else if (vehicleType === 'Rail') {
    await page.locator(Master.RailTab).click();
  } else {
    throw new Error(`Unknown vehicle type: ${vehicleType}`);
  }
}
export async function clickAndMeasureDynamic(page: Page, beforeSelector: string, afterSelector: string, description: string) {
  const clickStart = Date.now();
  await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
  // Wait until the loading element with ng-reflect-loading="true" is NOT visible
  await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

  // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
  await page.locator('//div[@class="custom-loader"]').waitFor({ state: 'hidden', timeout: 300000 });

  await page.locator(beforeSelector).click();

  await page.waitForLoadState('networkidle');
  // await page.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 300000 });
  await page.waitForFunction(
    () => {
      const bodyText = document.body?.innerText ?? document.documentElement?.innerText ?? '';
      return !bodyText.includes('Loading...');
    },
    { timeout: 300000 }
  );
  await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
  // Wait until the loading element with ng-reflect-loading="true" is NOT visible
  await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

  // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
  await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

  await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
  const clickEnd = Date.now();
  const duration = clickEnd - clickStart;
  console.log(`⏱️ Page load duration after ${description}: ${duration} ms`);
  savePerformanceToExcel([
    {
      TestName: description || beforeSelector + ' to ' + afterSelector,
      Action: 'Click',
      Duration: Number(duration) , 
    },
  ]);
  // If afterSelector is not found, proceed further (do not throw)
  try {
    await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
  } catch (e) {
    console.warn(`afterSelector not found: ${afterSelector}, proceeding further.`);
  }
  // await page.locator('//div[@class="toast-message"]').waitFor({ state: 'hidden', timeout: 60000 });
  return duration;
}

export async function waitForPageLoad(page: Page, selector: string) {
  await page.locator('//div[@data-progress-text="100%"]').isVisible();
  await page.locator('//body[contains(@class,"pace-running")]').waitFor({ state: 'hidden', timeout: 300000 });
  await page.locator('//body[contains(@class,"pace-done")]').waitFor({ state: 'visible', timeout: 300000 });
  await page.locator(selector).waitFor({ state: 'visible', timeout: 300000 });
}

class HtmlNamerReporter implements Reporter {
  private htmlOutputDir!: string;

  onBegin(config: FullConfig, suite: Suite) {
    // Detect if running from IDE (Cursor/VS Code) to use correct report folder
    const isIDERun = process.env.VSCODE_PID || process.env.CURSOR_PID;
    this.htmlOutputDir = isIDERun ? 'playwright-report-ide' : 'playwright-report';
  }

  onTestBegin(test: TestCase) {
    // Optional: Called when a test starts
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const testName = test.title.replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const targetFile = `report_${testName}_${timestamp}.html`;
    const targetPath = path.join('reports', targetFile);

    // Ensure destination folder exists
    fs.mkdirSync('reports', { recursive: true });

    const htmlFilePath = path.join(this.htmlOutputDir, 'index.html');

    // Copy and rename the HTML file after each test
    if (fs.existsSync(htmlFilePath)) {
      fs.copyFileSync(htmlFilePath, targetPath);
      console.log(`📄 Saved report: ${targetPath}`);
    }
  }

  onEnd() {
    // Log the location of the HTML report
    const reportPath = path.resolve(this.htmlOutputDir, 'index.html');
    if (fs.existsSync(reportPath)) {
      console.log(`\n📊 HTML Report generated at: ${reportPath}`);
      console.log(`💡 To view the report, run: npm run test:report:ide`);
      console.log(`   Or open: file:///${reportPath.replace(/\\/g, '/')}\n`);
    }
  }
}

export default HtmlNamerReporter;

/**
 * Retrieves the currently executed test file name (without extension).
 * Useful for naming reports based on the running test file.
 */
export function getTestFileName(): string {
  // Try Playwright context (process.env.TEST_FILE if set by runner)
  if (process.env.TEST_FILE) {
    const filePath = process.env.TEST_FILE;
    return filePath.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
  }

  // Try parsing from process.argv, looking for first *.test.ts entry
  const testFileArg = process.argv.find(arg =>
    /(\.test\.ts|\.spec\.ts)$/i.test(arg)
  );
  if (testFileArg) {
    return testFileArg.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
  }

  // Try to check call stack (fallback)
  const original = Error.prepareStackTrace;
  try {
    const err = new Error();
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = (err.stack as unknown as NodeJS.CallSite[]);
    for (const call of stack) {
      const file = call.getFileName?.();
      if (file && /(\.test\.ts|\.spec\.ts)$/i.test(file)) {
        return file.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
      }
    }
  } catch { /* ignore */ } finally {
    Error.prepareStackTrace = original;
  }

  // Fallback if all else fails
  return "unknown_test_file";
}



export function savePerformanceToExcel(
  data: { TestName: string; Action: string; Duration: number }[],
) {
  // Always use a single consolidated excel file for all performance logs in this run.
  // File is named performance_report_consolidated_${dateStr}_${timeStr}.xlsx for this run, only one file per run.
  // Pick a name and remember it for the duration of the process.

  // Keep the file name static for the entire node process
  // @ts-ignore
  if (!global.__performanceExcelFileName) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toISOString().split('T')[1].replace(/[:.]/g, '').slice(0, 6); // HHMMSS
    // @ts-ignore
    // global.__performanceExcelFileName = `PerformanceReport_consolidated_${dateStr}_${timeStr}.xlsx`;
    // @ts-ignore
    const fileName = getTestFileName().replace(/\.[^/.]+$/, "");
    // @ts-ignore
    global.__performanceExcelFileName = `PerformanceReport_consolidated_${dateStr}_${timeStr}_${fileName}.xlsx`;
  }
  // @ts-ignore
  const finalFileName = global.__performanceExcelFileName;

  const reportsDir = path.resolve('Performance_Reports');
  // Create directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, finalFileName);
  let workbook: XLSX.WorkBook;
  let worksheet: XLSX.WorkSheet;

  if (fs.existsSync(filePath)) {
    // If file exists, load and append new data to worksheet
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const existingData = XLSX.utils.sheet_to_json(worksheet);
    const updatedData = [...existingData, ...data];
    worksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;
  } else {
    // If no file, create a new workbook
    worksheet = XLSX.utils.json_to_sheet(data);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance');
  }

  XLSX.writeFile(workbook, filePath);
  console.log(`📊 Report saved to ${filePath}`);
}

// export async function login(page: Page) {
//   await page.goto('http://13.95.199.223/Account/Login');
//   await page.locator('#Email').fill('admin@pia.com');
//   await page.locator('#Password').fill('Admin@123');
//   await clickAndMeasureDynamic(page, '//input[@value="Log in"]', '//div[contains(text(),"Terminal Operations")]', 'Log in button');
// }

// Create a new test fixture that always uses Chromium (Chrome)
export function createChromiumTestFixture(base: TestType<any, any>) {
  return base.extend<{ page: Page }>({
    page: async ({ }, use: (pg: Page) => Promise<void>) => {
      const browser = await chromium.launch({
        channel: 'chrome',
        headless: false,
        args: ['--start-maximized'],
      });
      // const context = await browser.newContext({ viewport: null });
      // The --start-maximized arg will make the actual window maximized
      const context = await browser.newContext({ 
        viewport: { width: 1920, height: 1080 }
      });
      const page = await context.newPage();
      await use(page);
      const size = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }));
      console.log('Viewport:', size);
      // await browser.close();
    },
  });
}

/**
 * Updates the "IAL PIA LOADTESTING.xlsx" file with n entries as specified.
 * 
 * - "Via No.": same random 5-digit number in all rows
 * - "IGM Number": same random 7-digit number in all rows
 * - "ContainerNo": unique in all rows, formatted as AUTO + 7-digit number
 * - "Bill of Lading": same, BLADS + 5-digit number in all rows
 * 
 * @param {number} n - Number of rows to append
 *
 * The Excel file is: 
 * C:\Users\mra004.ENVECON\Documents\Playwright_Automation\Playwright_TypeScript\tests\PW_Data_Library\IAL PIA LOADTESTING.xlsx
 */
// export function updateIGMImportDataInExcel(n: number) {
//   const filePath = path.join(__dirname, 'IAL PIA LOADTESTING.xlsx');

//   // Helper to gen a 5-digit random number as string
//   function get5Digit(): string {
//     return Math.floor(10000 + Math.random() * 90000).toString();
//   }
//   // Helper to get a 7-digit random number as string
//   function get7Digit(): string {
//     return Math.floor(1000000 + Math.random() * 9000000).toString();
//   }

//   // Generate the shared values
//   const viaNo = get5Digit();
//   const igmNumber = get7Digit();
//   const blNo = get5Digit();

//   // Generate unique AUTO+7-digit container numbers
//   const containerNumbers: Set<string> = new Set();
//   while (containerNumbers.size < n) {
//     containerNumbers.add('AUTO' + get7Digit());
//   }
//   const arrContainerNumbers = Array.from(containerNumbers);

//   // Build data rows
//   const newData = [];
//   for (let i = 0; i < n; i++) {
//     newData.push({
//       "Via No.": viaNo,
//       "IGM Number": igmNumber,
//       "ContainerNo": arrContainerNumbers[i],
//       "Bill of Lading": `BLADS${blNo}`,
//     });
//   }

//   // Read or create the file, then update/replace the respective columns in the data
//   let workbook: XLSX.WorkBook, worksheet: XLSX.WorkSheet, existingData: any[] = [];
//   try {
//     workbook = XLSX.readFile(filePath);
//     worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     existingData = XLSX.utils.sheet_to_json(worksheet);

//     // Only update up to n rows or all existing rows, whichever is smaller
//     for (let i = 0; i < Math.min(n, existingData.length); i++) {
//       existingData[i]["Via No."] = viaNo;
//       existingData[i]["IGM Number"] = igmNumber;
//       existingData[i]["ContainerNo"] = arrContainerNumbers[i];
//       existingData[i]["Bill of Lading"] = `BLADS${blNo}`;
//     }
//     // If more n than existing rows, add new ones
//     if (n > existingData.length) {
//       for (let i = existingData.length; i < n; i++) {
//         existingData.push({
//           "Via No.": viaNo,
//           "IGM Number": igmNumber,
//           "ContainerNo": arrContainerNumbers[i],
//           "Bill of Lading": `BLADS${blNo}`,
//         });
//       }
//     }
//   } catch (e) {
//     workbook = XLSX.utils.book_new();
//     worksheet = XLSX.utils.json_to_sheet([]);
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance');
//     // No data existed, so just use the newData
//     existingData = newData;
//   }

//   worksheet = XLSX.utils.json_to_sheet(existingData.slice(0, n));
//   workbook.Sheets[workbook.SheetNames[0]] = worksheet;

//   XLSX.writeFile(workbook, filePath);

//   console.log(`✅ Set ${n} IGM import rows in ${filePath} (columns replaced with new values)`);
// }

export async function SwitchModule(page: Page, Module_Name: string): Promise<void> {

  await page.reload();
  // Click module switcher (first cursor-pointer anchor)
  await page.goto('https://prepac.logstarerp.com/ue/apppallet');

  // Click module logo based on provided module name
  await page.locator(`(//img[@alt="${Module_Name} Logo"])[1]`).click();
}



export async function MOTL(
  page: Page,
): Promise<void> {

  const containerFilePath =
    'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Import_Reefer_Container_Number.txt';

  if (!fs.existsSync(containerFilePath)) {
    throw new Error(`Container number file not found at: ${containerFilePath}`);
  }

  const containerNo = fs.readFileSync(containerFilePath, 'utf-8').trim();

  if (!containerNo) {
    throw new Error('Container number file is empty');
  }

  console.log('Using container number:', containerNo);

  await login(page);

  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Import booking screen');

  await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

  await page.locator('//button[normalize-space()="Search"]').click();

  await clickAndMeasureDynamic(
    page,
    '//a[contains(text(), "BLN")]',
    '//button[normalize-space()="Update Details"]',
    'Open Import Booking details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update Details"]',
    '//button[normalize-space()="Job Orders"]',
    'Route to Update Details page'
  );


  // Route to Job Orders tab
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Job Orders"]',
    '//button[normalize-space()="+ New Job Order"]',
    'Route to Job Orders tab'
  );

  // Open Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ New Job Order"]',
    'select[formcontrolname="JOBCatID"]',
    'Add Job Order'
  );

  // Fill Job Order details
  await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
  await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "102" }); // JobActivityPoint : Depot Gate Operation
  await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1075" }); // JobDescription : Factory De Stuffing - Container Out For Delivery  (MOTL)

  await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

  // Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Add Job Order'
  );

  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[text()="Add JobOrder"]',
    'Submit Job Order'
  );

  console.log('Job Order created successfully');
}

export function updateIGMImportDataInExcel(n: number) {
  const filePath = path.join(__dirname, 'IAL PIA LOADTESTING.xlsx');

  // Helper to gen a 5-digit random number as string
  function get5Digit(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
  // Helper to get a 7-digit random number as string
  function get7Digit(): string {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }

  // Generate the shared values
  const viaNo = get5Digit();
  const igmNumber = get7Digit();
  const blNo = get5Digit();

  // Generate unique AUTO+7-digit container numbers
  const containerNumbers: Set<string> = new Set();
  while (containerNumbers.size < n) {
    containerNumbers.add('AUTO' + get7Digit());
  }
  const arrContainerNumbers = Array.from(containerNumbers);

  // Build data rows
  const newData = [];
  for (let i = 0; i < n; i++) {
    newData.push({
      "Via No.": viaNo,
      "IGM Number": igmNumber,
      "ContainerNo": arrContainerNumbers[i],
      "Bill of Lading": `BLADS${blNo}`,
    });
  }

  // Read or create the file, then update/replace the respective columns in the data
  let workbook: XLSX.WorkBook, worksheet: XLSX.WorkSheet, existingData: any[] = [];
  try {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    existingData = XLSX.utils.sheet_to_json(worksheet);

    // Only update up to n rows or all existing rows, whichever is smaller
    for (let i = 0; i < Math.min(n, existingData.length); i++) {
      existingData[i]["Via No."] = viaNo;
      existingData[i]["IGM Number"] = igmNumber;
      existingData[i]["ContainerNo"] = arrContainerNumbers[i];
      existingData[i]["Bill of Lading"] = `BLADS${blNo}`;
    }
    // If more n than existing rows, add new ones
    if (n > existingData.length) {
      for (let i = existingData.length; i < n; i++) {
        existingData.push({
          "Via No.": viaNo,
          "IGM Number": igmNumber,
          "ContainerNo": arrContainerNumbers[i],
          "Bill of Lading": `BLADS${blNo}`,
        });
      }
    }
  } catch (e) {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance');
    // No data existed, so just use the newData
    existingData = newData;
  }

  worksheet = XLSX.utils.json_to_sheet(existingData.slice(0, n));
  workbook.Sheets[workbook.SheetNames[0]] = worksheet;

  XLSX.writeFile(workbook, filePath);

  console.log(`✅ Set ${n} IGM import rows in ${filePath} (columns replaced with new values)`);
}

export async function SealCuttingSSR(
  page: Page,
): Promise<void> {

  // const containerFilePath =
  //   'C:/Users/asi011/OneDrive - Envecon/Desktop/Playwright_MNR_Microservice/tests/test-artifacts/Import_SSR_Container_Number.txt';

  // if (!fs.existsSync(containerFilePath)) {
  //   throw new Error(`Container number file not found at: ${containerFilePath}`);
  // }

  // const containerNo = fs.readFileSync(containerFilePath, 'utf-8').trim();

  // if (!containerNo) {
  //   throw new Error('Container number file is empty');
  // }

  // console.log('Using container number:', containerNo);
  const containerNo = readTestArtifact('SSRImport_ContainerNumber.txt').trim();

  await login(page);

  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Import booking screen');

  await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

  await page.locator('//button[normalize-space()="Search"]').click();

  await clickAndMeasureDynamic(
    page,
    '//a[contains(text(), "BLN")]',
    '//button[normalize-space()="Update Details"]',
    'Open Import Booking details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update Details"]',
    '//button[normalize-space()="Job Orders"]',
    'Route to Update Details page'
  );


  // Route to Job Orders tab
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Job Orders"]',
    '//button[normalize-space()="+ New Job Order"]',
    'Route to Job Orders tab'
  );

  // Open Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ New Job Order"]',
    'select[formcontrolname="JOBCatID"]',
    'Add Job Order'
  );

  // Fill Job Order details
  await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
  await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "102" }); // JobActivityPoint : Depot Gate Operation
  await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1075" }); // JobDescription : Factory De Stuffing - Container Out For Delivery  (MOTL)

  await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

  // Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Add Job Order'
  );

  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[text()="Add JobOrder"]',
    'Submit Job Order'
  );

  console.log('Job Order created successfully');
}