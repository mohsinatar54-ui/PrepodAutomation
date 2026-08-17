import { chromium, expect, Page, TestInfo, TestType, FullConfig } from '@playwright/test';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CSMExport } from '../Locators/BookingLocators';
import { Common, CSMImport } from 'Locators/BookingLocators';
import type {Reporter,Suite,TestCase,TestResult,} from '@playwright/test/reporter';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const URL = 'https://prepac.logstarerp.com';
// const Username = 'adityasingh';
// const Password = 'Test@123';

// const URL = 'https://prepaclx.logstarerp.com/uen/login';
const URL = 'https://preprod.logstarcloud.io/';
const Username = 'adityasingh';
const Password = 'Test@123';

// const URL = 'https://msdemo.logstarerp.com/usren/login';
// const Username = 'aditya.singh';
// const Password = 'Pass@123';

// const URL = 'https://cmajedu.logstarerp.com/uen/login';
// const Username = 'aditya.singh';
// const Password = 'Pass@123';

  const Entity = 'Beacon Depot';
  const Site = 'West Terminal';
  const Account = 'Envecon Software';
  // const Entity = 'Mercantile';
  // const Site = 'Kemba';

export async function selectEntityAndSite(page: Page) {
  // await page.locator('//ng-select[@placeholder="Select Entity"]').selectOption({ label: entity });
  // await page.locator('//ng-select[@placeholder="Select Site"]').selectOption({ label: Site });
  // Entity selection
  await page.locator('//ng-select[@placeholder="Select Account"]').click();
  await page.locator(`//div[@role="option"]//div[normalize-space()="${Account}"]`).click();
  await page.locator('//ng-select[@placeholder="Select Entity"]').click();
  await page.locator(`//div[@role="option"]//span[normalize-space()="${Entity}"]`).click();
  await page.locator('//ng-select[@placeholder="Select Site"]').click();
  await page.locator(`//div[@role="option"]//span[normalize-space()="${Site}"]`).click();
}


export function getNextDateTimeFormatted(n: number): { date: string, day: string, month: string, year: string, hours: string, minutes: string } {
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
  return { date, day, month, year, hours, minutes };
}

export function getRandomNumberString(length: number): string {
  return Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
}

export async function login(page: Page) {
  await page.goto(URL, {
    waitUntil: 'domcontentloaded'
    // timeout: 600000
  });
  await page.locator('//a[normalize-space()="Login"]').click();
  // Step 2: Login flow + MNR visibility selection
  await page.locator('//input[@name="username"]').fill(Username);
  await page.locator('//input[@name="password"]').fill(Password);
  await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//ng-select[@placeholder="Select Entity"]', 'Click Login button');
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
  // await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
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
      Duration: Number(duration),
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
 // private htmlOutputDir: string;
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
    // Get test case name and sanitize it for filename
    const testName = test.title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-MM-SS

    // Create report filename with test case name
    const targetFile = `report_${testName}_${timestamp}.html`;
    const targetPath = path.join('reports', targetFile);

    // Ensure destination folder exists
    fs.mkdirSync('reports', { recursive: true });

    const htmlFilePath = path.join(this.htmlOutputDir, 'index.html');

    // Copy and rename the HTML file after each test with test case name
    if (fs.existsSync(htmlFilePath)) {
      fs.copyFileSync(htmlFilePath, targetPath);
      console.log(`📄 Saved report with test case name: ${targetPath}`);
    } else {
      console.warn(`⚠️  HTML report not found at: ${htmlFilePath}`);
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



export async function SwitchModule(page: Page, Module_Name: string): Promise<void> {
   
  await page.locator('//nav[@id="navigation"]').hover();
  await page.locator('(//a[contains(@class,"cursor-pointer")])[1]').click();

  // Click module logo based on provided module name
  await page.locator(`(//img[@alt="${Module_Name} Logo"])[1]`).click();
//  await page.locator('//h3[text()=" Cargo Warehouse Management "]').click();
  
}
// export async function SwitchModuleCSM(page: Page, Module_Name: string): Promise<void> {
   
//   await page.locator('//nav[@id="navigation"]').hover();
//   await page.locator('(//a[contains(@class,"cursor-pointer")])[1]').click();

//   // Click module logo based on provided module name
// //  await page.locator(`(//img[@alt="${Module_Name} Logo"])[1]`).click();
//  // await page.locator('//h3[text()=" Cargo Warehouse Management "]').click();
//   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');
//   await clickAndMeasureDynamic(page, Common.BookingTab, CSMExport.ClickonBooking, 'Route to Booking tab');
  
// }

export function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}

export async function MOTL(
  page: Page,
): Promise<void> {

  const containerNo = await readTestArtifact('MOTL_Container.txt');

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




export async function XOTP(
  page: Page,
): Promise<void> {


  const containerNo = await readTestArtifact('XITF_Container.txt');

  console.log('Using container number:', containerNo);

  await login(page);

  await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Export bookings"]', 'Route to Booking tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Export bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Export booking screen');

  await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

  await page.locator('//button[normalize-space()="Search"]').click();

  await clickAndMeasureDynamic(
    page,
    '//a[contains(text(), "EXP")]',
    '//button[normalize-space()="Update Details"]',
    'Open Import Booking details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Update Details"]',
    '//button[normalize-space()="Cargo"]',
    'Go to Export Booking details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Cargo"]',
    '//button//i[@class="fas fa-ellipsis-v"]',
    'Go to Cargo details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button//i[@class="fas fa-ellipsis-v"]',
    '//li[normalize-space()="Arrived"]',
    'Click on more options and select Arrived');

  await clickAndMeasureDynamic(
    page,
    '//li[normalize-space()="Arrived"]',
    '//button[normalize-space()="Arrived"]',
    'Route to Arrived Details page'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Arrived"]',
    '//button//i[@class="fas fa-ellipsis-v"]',
    'Submit Arrived Details'
  );

  await clickAndMeasureDynamic(
    page,
    '//button//i[@class="fas fa-ellipsis-v"]',
    '//li[normalize-space()="LEO"]',
    'Click on more options and select LEO'
  );

  await clickAndMeasureDynamic(
    page,
    '//li[normalize-space()="LEO"]',
    '//input[@formcontrolname="LEONumber"]',
    'Route to LEO Details page'
  );

  const leoNumber = 'LEO' + getRandomNumberString(5);

  await page.locator('//input[@formcontrolname="LEONumber"]').fill(leoNumber);

  await page.locator('input[formcontrolname="LEODate"]').type(`${getNextDateTimeFormatted(0).day}`, { delay: 200 });


  await page.keyboard.type(`${getNextDateTimeFormatted(0).month}`, { delay: 200 });

  await page.keyboard.type(`${getNextDateTimeFormatted(0).year}`, { delay: 200 });
  await page.keyboard.press('ArrowRight');

  await page.keyboard.type(`${getNextDateTimeFormatted(0).hours}:${getNextDateTimeFormatted(0).minutes}`, { delay: 200 });
  await page.keyboard.press('ArrowDown');

  await page.locator('//input[normalize-space()="Submit"]').fill('Automation Test LEO');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Job Orders"]', 'Submit LEO details and find Job Orders');




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

  await page.locator('//select[@ng-reflect-name="flex_424"]').selectOption({ value: "Loaded Container" });
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


export async function MO9F(
  page: Page,
): Promise<{ MO9FvehicleNo: string }> {

  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');

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
  await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "104" }); // JobActivityPoint : Container Operation
  await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1073" }); // JobDescription : Direct De-Stuffing/ Destuff Delivery  (MO9F)

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
    '//button[normalize-space()="Cargo Transport"]',
    'Submit Job Order'
  );

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Cargo Transport"]',
    '//button[normalize-space()="+ Add Transport"]',
    'Route to Cargo Transport'
  );

  // Add Transport details 

  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="+ Add Transport"]',
    '//input[@formcontrolname="NoOfTransports"]',
    'Add Transport Details'
  );

  await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
  await page.locator('//button[normalize-space( )="Select All Cargos"]').click();


  const MO9FvehicleNo = generateVehicleNumber();


  await page.locator('//input[@formcontrolname="TModNo"]').first().fill(MO9FvehicleNo);

  await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
  // await page.locator('//button[normalize-space( )="Select All Containers"]').click();



  // Add Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Add"]',
    '//button[normalize-space()="Job Plan"]',
    'Add Job Order'
  );

  await page.locator('//button[normalize-space()="Job Plan"]').click();

  await page.locator('//label[normalize-space()="DestuffDoneBy* *"]//following-sibling::select').selectOption({ value: "LBR" });

  // Save Job Order
  await page.locator('//button[normalize-space()="Save"]').click();

  // Submit Job Order
  await clickAndMeasureDynamic(
    page,
    '//button[normalize-space()="Submit"]',
    '//div[normalize-space()="Job Plan Details"]',
    'Submit Job Order'
  );


  console.log('Job Order created successfully');
  return { MO9FvehicleNo };
}


export async function M09FYardOps(
  page: Page, stackType: string, stackName: string
): Promise<void> {

  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');


  console.log('Using container number:', containerNo);

  await clickAndMeasureDynamic(page, '(//img[@alt="Yard Management Logo"])[1]', '//button[normalize-space()="Yard Planner"]', 'Route to Yard Microservice');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Planner"]', '//div[normalize-space()="Yard Planning - Gate"]', 'Route to Yard Planner');

  //   await page.locator(
  //   "//tr[td//a[normalize-space()='ASDU0002026']]//button[normalize-space()='Plan']"
  // ).click();

  // const containerNo = await readTestArtifact('EmptyIn_Container.txt')

  await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

  await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

  await clickAndMeasureDynamic(page, `(//td//a[normalize-space()='${containerNo}'])[1]`, '//p[text()="Planned Container No"]/following-sibling::p', 'Click on container number');

  await expect(page.locator('//p[text()="Planned Container No"]/following-sibling::p')).toHaveText(containerNo);
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Plan"]', `//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`, 'Click on Plan button');
  // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`).click();
  // await page.locator('//div[@class="options-list"]//div[2]').click();

  await page.locator(`//app-custom-dropdown[@formcontrolname="StackTypeID"]`).click();
  await page.locator(`//div[@class="options-list"]//span[normalize-space()="${stackType}"]`).click();

  await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`).click();
  await page.locator('//input[@placeholder="Search options..."]').fill(stackName);
  await page.locator(`//div[@class="option-item"]`).first().click();

  // await expect(page.locator('//app-custom-dropdown[@formcontrolname="PlannedCraneID"]//span')).not.toBeEmpty();

  // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedNextCraneID"]`).click();
  // await page.locator(`(//div[@class="option-item"])[1]`).click();

  await page.locator('textarea[formcontrolname="PlannerComments"]').fill('Planned via Automation Script');

  // await page.locator('//button[normalize-space()="Submit"]').click();
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', `//div[normalize-space()="Yard Planning - Gate"]`, 'Submit Yard Planning');

  await clickAndMeasureDynamic(page, `//button[normalize-space()="Yard Execution"]`, '//div[normalize-space()="Gate"]', 'Open Yard Execution - Gate tab');

  await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

  await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

  await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`, '//button[normalize-space()="Execute"]', 'Click on container number in Yard Execution');
  await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', '//input[@formcontrolname="search"]', 'Execute the planned move');

  await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

  console.log('Yard Operations for container number ' + containerNo + ' completed successfully');



}


export async function ImportTally(
  page: Page, MO9FvehicleNo: string
): Promise<void> {

  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');


  console.log('Using container number:', containerNo);


  await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Import Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Import Tally tab');

  await page.locator('//input[@formcontrolname="TModNo"]').fill(MO9FvehicleNo);

  await page.locator('//button[normalize-space()="Search"]').click();

  await page.locator('//a[@class="booking-link"]').first().click();

  await page.locator(`//a[normalize-space()="${MO9FvehicleNo}"]`).click();

  await page.locator('//button[normalize-space()="+ Add Tally"]').click();

  await page.locator('//select[@formcontrolname="ContainerNo"]').selectOption({ label: containerNo }); // Tally Type : Full

  await page.locator('input[formcontrolname="PlanDate"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
  // await page.keyboard.press('ArrowRight');

  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
  // await page.keyboard.press('ArrowRight');  
  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
  await page.keyboard.press('ArrowRight');
  console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
  await page.keyboard.press('ArrowDown');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', `//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`, 'Update Tally');

  await page.locator(`//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`).click();

  await page.locator('//button[normalize-space()="+ Add Cargo"]').click();


  const declaredPackages = await page
    .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
    .inputValue();

  await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);

  await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);

  await page.locator('//label[normalize-space()="No. of Damaged Packages*"]//following-sibling::input').fill('0');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Submit"]', 'Update Tally');

  await page.locator('//button[normalize-space()="Submit"]').click();

  await page.locator('//button[normalize-space()="Yes, Submit"]').click();

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Load"]', '//button[normalize-space()="Complete Container Destuffing"]', 'Complete Transport Cargo Load');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Destuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Destuffing');

  await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');
}


export async function EO9FTally(
  page: Page, EO9FvehicleNo: string
): Promise<void> {

//  const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt'); // New change 

const containerNo = await readTestArtifact('ExportDirect_EO9F_Container.txt');
  console.log('Using container number:', containerNo);

  await clickAndMeasureDynamic(page, '//button[text()="Cargo Verification"]', '//button[text()="Export Cargo Verification"]', 'Route to Export cargo verification tab '); //new code 
  
  await clickAndMeasureDynamic(page, '//button[text()="Export Cargo Verification"]','//span[text()="Export Cargo Verification"]', 'Click on Export cargo verification tab '); //new code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab'); // old code 

 // await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab'); /old Code

  
//  await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo); // old code

//  await page.locator('//button[normalize-space()="Search"]').click();

  await page.locator('//input[@placeholder="Search"]').fill(EO9FvehicleNo);

  // await page.locator('//a[@class="booking-link"]').first().click(); // OLD CODE

  await page.locator('((//th[text()="#"]/ancestor::table/child::tbody/child::tr)[1]/child::td/div)[1]//span/span').first().click(); // New CODE

  await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();

  await page.locator('//button[normalize-space()="+ Add Tally"]').click();

  await page.locator('//select[@formcontrolname="ContainerNo"]').selectOption({ label: containerNo }); // Tally Type : Full

  await page.locator('input[formcontrolname="PlanDate"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
  // await page.keyboard.press('ArrowRight');

  await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
  // await page.keyboard.press('ArrowRight');  
  await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
  await page.keyboard.press('ArrowRight');
  console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

  await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
  await page.keyboard.press('ArrowDown');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', `//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`, 'Update Tally');

  await page.locator(`//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`).click();

  await page.locator('//button[normalize-space()="+ Add Cargo"]').click();


  const declaredPackages = await page
    .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
    .inputValue();

  await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);

  await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);

  await page.locator('//label[normalize-space()="No. of Damaged Packages*"]//following-sibling::input').fill('0');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Submit"]', 'Update Tally');

  await page.locator('//button[normalize-space()="Submit"]').click();

  await page.locator('//button[normalize-space()="Yes, Submit"]').click();

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Unload"]', '//button[normalize-space()="Complete Container Stuffing"]', 'Complete Transport Cargo Unload');

  await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

  await page.locator('//button[normalize-space()="Yes"]').click();

  console.log('Tally completed successfully');

  
}





export async function SealCuttingSSR(
  page: Page,
  data: any,
  ContainerNofile: string
): Promise<void> {

  const ContainerNo = await readTestArtifact(ContainerNofile);

  console.log('Using container number:', ContainerNo);

  await login(page);

  await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, Common.BookingTab, 'Route to Customer Service');

  await clickAndMeasureDynamic(page,  Common.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');

  await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.ContainerNoInput, 'Route to Import booking screen');

  await page.locator(CSMImport.ContainerNoInput).fill(ContainerNo);

  // await page.locator('//button[normalize-space()="Search"]').click();

  await clickAndMeasureDynamic(page,'//a[contains(text(), "BLN")]','//button[normalize-space()="Update Details"]','Open Import Booking details');

  await clickAndMeasureDynamic(page,'//button[normalize-space()="Update Details"]', '//button[normalize-space()="Job Orders"]','Route to Update Details page');

  // // Route to Job Orders tab
  // await clickAndMeasureDynamic(page, '//button[normalize-space()="Job Orders"]','//button[normalize-space()="+ New Job Order"]','Route to Job Orders tab');

  // // Open Add Job Order
  // await clickAndMeasureDynamic(
  //   page,'//button[normalize-space()="+ New Job Order"]', 'select[formcontrolname="JOBCatID"]','Add Job Order');

  // // Fill Job Order details
  // await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
  // await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "104" }); // JobActivityPoint : Container Operation
  // await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1090" }); // JobDescription : Seal Cutting  (CO02)

  // await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

  // // Add Job Order
  // await clickAndMeasureDynamic(page,'//button[normalize-space()="Add"]','//div[normalize-space()="Job Plan Details"]','Add Job Order');

  // // Save Job Order
  // await page.locator('//button[normalize-space()="Save"]').click();

  // // Submit Job Order
  // await clickAndMeasureDynamic(page,'//button[normalize-space()="Submit"]', '//div[text()="Add JobOrder"]','Submit Job Order');
  await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
  await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
  await page.locator(CSMExport.JobCatId).selectOption(data.JobCategory);
  await page.locator(CSMExport.JobActId).selectOption(data.JobActivityPoint);
  await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription });
  // await page.locator(CSMExport.JobDesc).selectOption(data.JobDescription );
  // await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' });
  // await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo);
  // await page.locator(CSMExport.JobConId).click();
  // await page.locator(`//option[normalize-space()="${data.ContainerNo}"]`).click();
  await page.locator(CSMExport.JobConId).selectOption({ label: ContainerNo });
  await page.locator('//app-site-wall-nz-date-picker[@formcontrolname="PlanDate"]').click();
  await selectFutureDay(page, 1);
  await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
  await page.click(CSMExport.Save);
  await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
  console.log('Job Order created successfully');
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




export async function extractCargoDetailsNumber(page: Page): Promise<string> {
  const cargoText = await page
    .locator('div:has-text("Cargo Details")')
    .first()
    .textContent();

  if (!cargoText) {
    throw new Error('Cargo Details text not found');
  }

  // 🔥 Remove everything except digits
  const cargoNumber = cargoText.replace(/\D/g, '');

  if (!cargoNumber) {
    throw new Error('Cargo Details number not extracted');
  }

  return cargoNumber;
}



// export async function selectFutureDay(page: Page, daysToAdd: number) {
// //   const date = new Date();
// //   date.setDate(date.getDate() + daysToAdd);
 
// //   const day = date.getDate();
 
// //   // const todayMonth = today.getMonth();
// //   // const targetMonth = tomorrow.getMonth();
// //   // If month changes → go to next month
// //   // if (targetMonth !== todayMonth) {
// //   //   await page.locator('.ant-picker-header-next-btn').click();
// //   // }
 
// //  await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner', {
// //     hasText: String(day),
// //   }).first().click();
//   const date = new Date();
//   const day = date.getDate();
//   const todayMonth = date.getMonth();
//   date.setDate(date.getDate() + daysToAdd);
//   const targetMonth = date.getMonth();
//    //If month changes → go to next month
//   if (targetMonth !== todayMonth) {
//     await page.locator('.ant-picker-header-next-btn').first().click();
//   }
//   // await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner ng-star-inserted', {
//   //   hasText: String(day),
//   // }).first().click();
//   await page.locator('td[role="gridcell"]', {
//     hasText: String(day),
//   }).first().click();
// }//ant-picker-cell-inner

export async function selectFutureDay(page: Page, daysToAdd: number) {
  const today = new Date();
  const Nextday = new Date(today);
  //const todayMonth = today.getMonth();
  Nextday.setDate(today.getDate() + daysToAdd);
 const nextDayNumber  = Nextday.getDate();
   //If month changes → go to next month
  if (Nextday.getMonth()!== today.getMonth()) {
    await page.locator('.ant-picker-header-next-btn').click();
  }
     await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner').filter({ hasText: String(nextDayNumber )}).first().click();
}

export async function GoToMicroservice(page: Page, MicroserviceLogo: string): Promise<void> {
  await clickAndMeasureDynamic(
    page,
    `(//img[@alt="${MicroserviceLogo}"])[1]`,
    '//nav[@id="navigation"]',
    `Route to ${MicroserviceLogo.replace(' Logo', '')}`
  );
}
 
export async function routeToMicroservice(page: Page, Microservice: string): Promise<void> {
  await page.locator("//nav[@id='navigation']").hover();
  await page.locator('(//a[contains(@class,"cursor-pointer")])[1]').click();
  // await clickAndMeasureDynamic(page,`(//img[@alt="${MicroserviceLogo}"])[1]`,'//nav[@id="navigation"]',`Route to ${MicroserviceLogo.replace(' Logo', '')}`);
  await clickAndMeasureDynamic(page,Microservice,'//nav[@id="navigation"]',`Route to ${Microservice.replace(' Logo', '')}`);
  // await page.getByRole('button', { name: 'System Log' }).hover();
 
}
 



// export function getNextDateTimeFormatted(n: number): { date: string, day: string, month: string, year: string, hours: string, minutes: string } {
//   const now = new Date();
//   now.setDate(now.getDate() + n);

//   const pad = (n: number) => n < 10 ? '0' + n : n.toString();

//   const day = pad(now.getDate());
//   const month = pad(now.getMonth() + 1); // Months are 0-indexed
//   const year = now.getFullYear().toString();
//   // .toString().slice(-2);
//   const hours = pad(now.getHours());
//   const minutes = pad(now.getMinutes());
//   const date = `${day}${month}${year}`;
//   return { date, day, month, year, hours, minutes };
// }

// export function getRandomNumberString(length: number): string {
//   return Array(length)
//     .fill(0)
//     .map(() => Math.floor(Math.random() * 10))
//     .join('');
// }

// export async function login(page: Page) {
//   await page.goto(URL, {
//     waitUntil: 'domcontentloaded'
//     // timeout: 600000
//   });
//   await page.locator('//a[normalize-space()="Login"]').click();
//   // Step 2: Login flow + MNR visibility selection
//   await page.locator('//input[@name="username"]').fill(Username);
//   await page.locator('//input[@name="password"]').fill(Password);
//   await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//ng-select[@placeholder="Select Entity"]', 'Click Login button');

//   // Entity selection
//   // await page.locator('(//div[@class="ng-input"]//input)[1]').fill(Entity);
//   // await clickAndMeasureDynamic(page, '(//div[@class="ng-input"]//input)[1]', `//div[@role="option"]//span[text()="${Entity}"]`, 'Select Entity');
//   // await page.locator('(//div[@class="ng-input"]//input)[2]').fill(Site);
//   // await clickAndMeasureDynamic(page, '(//div[@class="ng-input"]//input)[2]', `//div[@role="option"]//span[text()="${Site}"]`, 'Select Site');
// }
// export async function clickAndMeasureDynamic(page: Page, beforeSelector: string, afterSelector: string, description: string) {
//   const clickStart = Date.now();
//   await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
//   // Wait until the loading element with ng-reflect-loading="true" is NOT visible
//   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

//   // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
//   await page.locator('//div[@class="custom-loader"]').waitFor({ state: 'hidden', timeout: 300000 });

//   await page.locator(beforeSelector).click();

//   await page.waitForLoadState('networkidle');
//   await page.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 300000 });
//   await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
//   // Wait until the loading element with ng-reflect-loading="true" is NOT visible
//   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

//   // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
//   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });

//   await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
//   const clickEnd = Date.now();
//   const duration = clickEnd - clickStart;
//   console.log(`⏱️ Page load duration after ${description}: ${duration} ms`);
//   savePerformanceToExcel([
//     {
//       TestName: description || beforeSelector + ' to ' + afterSelector,
//       Action: 'Click',
//       Duration: Number(duration),
//     },
//   ]);
//   // If afterSelector is not found, proceed further (do not throw)
//   try {
//     await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
//   } catch (e) {
//     console.warn(`afterSelector not found: ${afterSelector}, proceeding further.`);
//   }
//   // await page.locator('//div[@class="toast-message"]').waitFor({ state: 'hidden', timeout: 60000 });
//   return duration;
// }

// export async function waitForPageLoad(page: Page, selector: string) {
//   await page.locator('//div[@data-progress-text="100%"]').isVisible();
//   await page.locator('//body[contains(@class,"pace-running")]').waitFor({ state: 'hidden', timeout: 300000 });
//   await page.locator('//body[contains(@class,"pace-done")]').waitFor({ state: 'visible', timeout: 300000 });
//   await page.locator(selector).waitFor({ state: 'visible', timeout: 300000 });
// }

// class HtmlNamerReporter implements Reporter {
//   private htmlOutputDir: string;

//   onBegin(config: FullConfig, suite: Suite) {
//     // Detect if running from IDE (Cursor/VS Code) to use correct report folder
//     const isIDERun = process.env.VSCODE_PID || process.env.CURSOR_PID;
//     this.htmlOutputDir = isIDERun ? 'playwright-report-ide' : 'playwright-report';
//   }

//   onTestBegin(test: TestCase) {
//     // Optional: Called when a test starts
//   }

//   async onTestEnd(test: TestCase, result: TestResult) {
//     // Get test case name and sanitize it for filename
//     const testName = test.title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '_');
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-MM-SS

//     // Create report filename with test case name
//     const targetFile = `report_${testName}_${timestamp}.html`;
//     const targetPath = path.join('reports', targetFile);

//     // Ensure destination folder exists
//     fs.mkdirSync('reports', { recursive: true });

//     const htmlFilePath = path.join(this.htmlOutputDir, 'index.html');

//     // Copy and rename the HTML file after each test with test case name
//     if (fs.existsSync(htmlFilePath)) {
//       fs.copyFileSync(htmlFilePath, targetPath);
//       console.log(`📄 Saved report with test case name: ${targetPath}`);
//     } else {
//       console.warn(`⚠️  HTML report not found at: ${htmlFilePath}`);
//     }
//   }

//   onEnd() {
//     // Log the location of the HTML report
//     const reportPath = path.resolve(this.htmlOutputDir, 'index.html');
//     if (fs.existsSync(reportPath)) {
//       console.log(`\n📊 HTML Report generated at: ${reportPath}`);
//       console.log(`💡 To view the report, run: npm run test:report:ide`);
//       console.log(`   Or open: file:///${reportPath.replace(/\\/g, '/')}\n`);
//     }
//   }
// }

// export default HtmlNamerReporter;

// /**
//  * Retrieves the currently executed test file name (without extension).
//  * Useful for naming reports based on the running test file.
//  */
// export function getTestFileName(): string {
//   // Try Playwright context (process.env.TEST_FILE if set by runner)
//   if (process.env.TEST_FILE) {
//     const filePath = process.env.TEST_FILE;
//     return filePath.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
//   }

//   // Try parsing from process.argv, looking for first *.test.ts entry
//   const testFileArg = process.argv.find(arg =>
//     /(\.test\.ts|\.spec\.ts)$/i.test(arg)
//   );
//   if (testFileArg) {
//     return testFileArg.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
//   }

//   // Try to check call stack (fallback)
//   const original = Error.prepareStackTrace;
//   try {
//     const err = new Error();
//     Error.prepareStackTrace = (_, stack) => stack;
//     const stack = (err.stack as unknown as NodeJS.CallSite[]);
//     for (const call of stack) {
//       const file = call.getFileName?.();
//       if (file && /(\.test\.ts|\.spec\.ts)$/i.test(file)) {
//         return file.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
//       }
//     }
//   } catch { /* ignore */ } finally {
//     Error.prepareStackTrace = original;
//   }

//   // Fallback if all else fails
//   return "unknown_test_file";
// }

// export function savePerformanceToExcel(
//   data: { TestName: string; Action: string; Duration: number }[],
// ) {
//   // Always use a single consolidated excel file for all performance logs in this run.
//   // File is named performance_report_consolidated_${dateStr}_${timeStr}.xlsx for this run, only one file per run.
//   // Pick a name and remember it for the duration of the process.

//   // Keep the file name static for the entire node process
//   // @ts-ignore
//   if (!global.__performanceExcelFileName) {
//     const now = new Date();
//     const dateStr = now.toISOString().split('T')[0];
//     const timeStr = now.toISOString().split('T')[1].replace(/[:.]/g, '').slice(0, 6); // HHMMSS
//     // @ts-ignore
//     // global.__performanceExcelFileName = `PerformanceReport_consolidated_${dateStr}_${timeStr}.xlsx`;
//     // @ts-ignore
//     const fileName = getTestFileName().replace(/\.[^/.]+$/, "");
//     // @ts-ignore
//     global.__performanceExcelFileName = `PerformanceReport_consolidated_${dateStr}_${timeStr}_${fileName}.xlsx`;
//   }
//   // @ts-ignore
//   const finalFileName = global.__performanceExcelFileName;

//   const reportsDir = path.resolve('Performance_Reports');
//   // Create directory if it doesn't exist
//   if (!fs.existsSync(reportsDir)) {
//     fs.mkdirSync(reportsDir, { recursive: true });
//   }

//   const filePath = path.join(reportsDir, finalFileName);
//   let workbook: XLSX.WorkBook;
//   let worksheet: XLSX.WorkSheet;

//   if (fs.existsSync(filePath)) {
//     // If file exists, load and append new data to worksheet
//     workbook = XLSX.readFile(filePath);
//     worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const existingData = XLSX.utils.sheet_to_json(worksheet);
//     const updatedData = [...existingData, ...data];
//     worksheet = XLSX.utils.json_to_sheet(updatedData);
//     workbook.Sheets[workbook.SheetNames[0]] = worksheet;
//   } else {
//     // If no file, create a new workbook
//     worksheet = XLSX.utils.json_to_sheet(data);
//     workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance');
//   }

//   XLSX.writeFile(workbook, filePath);
//   console.log(`📊 Report saved to ${filePath}`);
// }

// // export async function login(page: Page) {
// //   await page.goto('http://13.95.199.223/Account/Login');
// //   await page.locator('#Email').fill('admin@pia.com');
// //   await page.locator('#Password').fill('Admin@123');
// //   await clickAndMeasureDynamic(page, '//input[@value="Log in"]', '//div[contains(text(),"Terminal Operations")]', 'Log in button');
// // }

// // Create a new test fixture that always uses Chromium (Chrome)
// export function createChromiumTestFixture(base: TestType<any, any>) {
//   return base.extend<{ page: Page }>({
//     page: async ({ }, use: (pg: Page) => Promise<void>) => {
//       const browser = await chromium.launch({
//         channel: 'chrome',
//         headless: false,
//         args: ['--start-maximized'],
//       });
//       // const context = await browser.newContext({ viewport: null });
//       // The --start-maximized arg will make the actual window maximized
//       const context = await browser.newContext({
//         viewport: { width: 1920, height: 1080 }
//       });
//       const page = await context.newPage();
//       await use(page);
//       const size = await page.evaluate(() => ({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       }));
//       console.log('Viewport:', size);
//       // await browser.close();
//     },
//   });
// }

// /**
//  * Updates the "IAL PIA LOADTESTING.xlsx" file with n entries as specified.
//  * 
//  * - "Via No.": same random 5-digit number in all rows
//  * - "IGM Number": same random 7-digit number in all rows
//  * - "ContainerNo": unique in all rows, formatted as AUTO + 7-digit number
//  * - "Bill of Lading": same, BLADS + 5-digit number in all rows
//  * 
//  * @param {number} n - Number of rows to append
//  *
//  * The Excel file is: 
//  * C:\Users\mra004.ENVECON\Documents\Playwright_Automation\Playwright_TypeScript\tests\PW_Data_Library\IAL PIA LOADTESTING.xlsx
//  */
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



// export async function SwitchModule(page: Page, Module_Name: string): Promise<void> {

//   // await page.goto('https://prepac.logstarerp.com/ue/apppallet', {
//   //   waitUntil: 'domcontentloaded'
//   // });

//   // await page.goto(URL, {
//   //   waitUntil: 'domcontentloaded'
//   // });
//   await page.locator('//nav[@id="navigation"]').hover();

//   // Click module logo based on provided module name
//   await page.locator(`(//img[@alt="${Module_Name} Logo"])[1]`).click();
// }

// export function generateVehicleNumber(): string {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   const randomLetters =
//     letters[Math.floor(Math.random() * 26)] +
//     letters[Math.floor(Math.random() * 26)];

//   const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

//   return `MH46${randomLetters}${randomDigits}`;
// }

// export async function MOTL(
//   page: Page,
// ): Promise<void> {

//   const containerNo = await readTestArtifact('MOTL_Container.txt');

//   console.log('Using container number:', containerNo);

//   await login(page);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Import booking screen');

//   await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await clickAndMeasureDynamic(
//     page,
//     '//a[contains(text(), "BLN")]',
//     '//button[normalize-space()="Update Details"]',
//     'Open Import Booking details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Update Details"]',
//     '//button[normalize-space()="Job Orders"]',
//     'Route to Update Details page'
//   );


//   // Route to Job Orders tab
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Job Orders"]',
//     '//button[normalize-space()="+ New Job Order"]',
//     'Route to Job Orders tab'
//   );

//   // Open Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="+ New Job Order"]',
//     'select[formcontrolname="JOBCatID"]',
//     'Add Job Order'
//   );

//   // Fill Job Order details
//   await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
//   await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "102" }); // JobActivityPoint : Depot Gate Operation
//   await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1075" }); // JobDescription : Factory De Stuffing - Container Out For Delivery  (MOTL)

//   await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

//   // Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Add"]',
//     '//div[normalize-space()="Job Plan Details"]',
//     'Add Job Order'
//   );

//   // Save Job Order
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Submit Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Submit"]',
//     '//div[text()="Add JobOrder"]',
//     'Submit Job Order'
//   );

//   console.log('Job Order created successfully');
// }




// export async function XOTP(
//   page: Page,
// ): Promise<void> {


//   const containerNo = await readTestArtifact('XITF_Container.txt');

//   console.log('Using container number:', containerNo);

//   await login(page);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Export bookings"]', 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Export bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Export booking screen');

//   await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await clickAndMeasureDynamic(
//     page,
//     '//a[contains(text(), "EXP")]',
//     '//button[normalize-space()="Update Details"]',
//     'Open Import Booking details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Update Details"]',
//     '//button[normalize-space()="Cargo"]',
//     'Go to Export Booking details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Cargo"]',
//     '//button//i[@class="fas fa-ellipsis-v"]',
//     'Go to Cargo details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button//i[@class="fas fa-ellipsis-v"]',
//     '//li[normalize-space()="Arrived"]',
//     'Click on more options and select Arrived');

//   await clickAndMeasureDynamic(
//     page,
//     '//li[normalize-space()="Arrived"]',
//     '//button[normalize-space()="Arrived"]',
//     'Route to Arrived Details page'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Arrived"]',
//     '//button//i[@class="fas fa-ellipsis-v"]',
//     'Submit Arrived Details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button//i[@class="fas fa-ellipsis-v"]',
//     '//li[normalize-space()="LEO"]',
//     'Click on more options and select LEO'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//li[normalize-space()="LEO"]',
//     '//input[@formcontrolname="LEONumber"]',
//     'Route to LEO Details page'
//   );

//   const leoNumber = 'LEO' + getRandomNumberString(5);

//   await page.locator('//input[@formcontrolname="LEONumber"]').fill(leoNumber);

//   await page.locator('input[formcontrolname="LEODate"]').type(`${getNextDateTimeFormatted(0).day}`, { delay: 200 });


//   await page.keyboard.type(`${getNextDateTimeFormatted(0).month}`, { delay: 200 });

//   await page.keyboard.type(`${getNextDateTimeFormatted(0).year}`, { delay: 200 });
//   await page.keyboard.press('ArrowRight');

//   await page.keyboard.type(`${getNextDateTimeFormatted(0).hours}:${getNextDateTimeFormatted(0).minutes}`, { delay: 200 });
//   await page.keyboard.press('ArrowDown');

//   await page.locator('//input[normalize-space()="Submit"]').fill('Automation Test LEO');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Job Orders"]', 'Submit LEO details and find Job Orders');




//   // Route to Job Orders tab
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Job Orders"]',
//     '//button[normalize-space()="+ New Job Order"]',
//     'Route to Job Orders tab'
//   );

//   // Open Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="+ New Job Order"]',
//     'select[formcontrolname="JOBCatID"]',
//     'Add Job Order'
//   );

//   // Fill Job Order details
//   await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
//   await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "102" }); // JobActivityPoint : Depot Gate Operation
//   await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1075" }); // JobDescription : Factory De Stuffing - Container Out For Delivery  (MOTL)

//   await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

//   // Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Add"]',
//     '//div[normalize-space()="Job Plan Details"]',
//     'Add Job Order'
//   );

//   await page.locator('//select[@ng-reflect-name="flex_424"]').selectOption({ value: "Loaded Container" });
//   // Save Job Order
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Submit Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Submit"]',
//     '//div[text()="Add JobOrder"]',
//     'Submit Job Order'
//   );

//   console.log('Job Order created successfully');
// }








// export async function MO9F(
//   page: Page,
// ): Promise<{ MO9FvehicleNo: string }> {

//   const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');

//   console.log('Using container number:', containerNo);

//   await login(page);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Customer Service Logo"])[1]', '//button[normalize-space()="Booking"]', 'Route to Customer Service');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Booking"]', '//button[normalize-space()="Import bookings"]', 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Import bookings"]', '//input[@formcontrolname="ContainerNo"]', 'Route to Import booking screen');

//   await page.locator('//input[@formcontrolname="ContainerNo"]').fill(containerNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await clickAndMeasureDynamic(
//     page,
//     '//a[contains(text(), "BLN")]',
//     '//button[normalize-space()="Update Details"]',
//     'Open Import Booking details'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Update Details"]',
//     '//button[normalize-space()="Job Orders"]',
//     'Route to Update Details page'
//   );


//   // Route to Job Orders tab
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Job Orders"]',
//     '//button[normalize-space()="+ New Job Order"]',
//     'Route to Job Orders tab'
//   );

//   // Open Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="+ New Job Order"]',
//     'select[formcontrolname="JOBCatID"]',
//     'Add Job Order'
//   );

//   // Fill Job Order details
//   await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
//   await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "104" }); // JobActivityPoint : Container Operation
//   await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1073" }); // JobDescription : Direct De-Stuffing/ Destuff Delivery  (MO9F)

//   await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

//   // Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Add"]',
//     '//div[normalize-space()="Job Plan Details"]',
//     'Add Job Order'
//   );

//   // Save Job Order
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Submit Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Submit"]',
//     '//button[normalize-space()="Cargo Transport"]',
//     'Submit Job Order'
//   );

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Cargo Transport"]',
//     '//button[normalize-space()="+ Add Transport"]',
//     'Route to Cargo Transport'
//   );

//   // Add Transport details 

//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="+ Add Transport"]',
//     '//input[@formcontrolname="NoOfTransports"]',
//     'Add Transport Details'
//   );

//   await page.locator('//input[@formcontrolname="NoOfTransports"]').fill('1');
//   await page.locator('//button[normalize-space( )="Select All Cargos"]').click();


//   const MO9FvehicleNo = generateVehicleNumber();


//   await page.locator('//input[@formcontrolname="TModNo"]').first().fill(MO9FvehicleNo);

//   await page.locator('//select[@formcontrolname="TModTransportID"]').first().selectOption({ value: '78031' });
//   // await page.locator('//button[normalize-space( )="Select All Containers"]').click();



//   // Add Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Add"]',
//     '//button[normalize-space()="Job Plan"]',
//     'Add Job Order'
//   );

//   await page.locator('//button[normalize-space()="Job Plan"]').click();

//   await page.locator('//label[normalize-space()="DestuffDoneBy* *"]//following-sibling::select').selectOption({ value: "LBR" });

//   // Save Job Order
//   await page.locator('//button[normalize-space()="Save"]').click();

//   // Submit Job Order
//   await clickAndMeasureDynamic(
//     page,
//     '//button[normalize-space()="Submit"]',
//     '//div[normalize-space()="Job Plan Details"]',
//     'Submit Job Order'
//   );


//   console.log('Job Order created successfully');
//   return { MO9FvehicleNo };
// }


// export async function M09FYardOps(
//   page: Page, stackType: string, stackName: string
// ): Promise<void> {

//   const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');


//   console.log('Using container number:', containerNo);

//   await clickAndMeasureDynamic(page, '(//img[@alt="Yard Management Logo"])[1]', '//button[normalize-space()="Yard Planner"]', 'Route to Yard Microservice');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Yard Planner"]', '//div[normalize-space()="Yard Planning - Gate"]', 'Route to Yard Planner');

//   //   await page.locator(
//   //   "//tr[td//a[normalize-space()='ASDU0002026']]//button[normalize-space()='Plan']"
//   // ).click();

//   // const containerNo = await readTestArtifact('EmptyIn_Container.txt')

//   await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

//   await clickAndMeasureDynamic(page, `(//td//a[normalize-space()='${containerNo}'])[1]`, '//p[text()="Planned Container No"]/following-sibling::p', 'Click on container number');

//   await expect(page.locator('//p[text()="Planned Container No"]/following-sibling::p')).toHaveText(containerNo);
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Plan"]', `//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`, 'Click on Plan button');
//   // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedITVNoID"]`).click();
//   // await page.locator('//div[@class="options-list"]//div[2]').click();

//   await page.locator(`//app-custom-dropdown[@formcontrolname="StackTypeID"]`).click();
//   await page.locator(`//div[@class="options-list"]//span[normalize-space()="${stackType}"]`).click();

//   await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedStackNoID"]`).click();
//   await page.locator('//input[@placeholder="Search options..."]').fill(stackName);
//   await page.locator(`//div[@class="option-item"]`).first().click();

//   // await expect(page.locator('//app-custom-dropdown[@formcontrolname="PlannedCraneID"]//span')).not.toBeEmpty();

//   // await page.locator(`//app-custom-dropdown[@formcontrolname="PlannedNextCraneID"]`).click();
//   // await page.locator(`(//div[@class="option-item"])[1]`).click();

//   await page.locator('textarea[formcontrolname="PlannerComments"]').fill('Planned via Automation Script');

//   // await page.locator('//button[normalize-space()="Submit"]').click();
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Submit"]', `//div[normalize-space()="Yard Planning - Gate"]`, 'Submit Yard Planning');

//   await clickAndMeasureDynamic(page, `//button[normalize-space()="Yard Execution"]`, '//div[normalize-space()="Gate"]', 'Open Yard Execution - Gate tab');

//   await page.locator('//input[@formcontrolname="search"]').fill(containerNo);

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).toBeVisible();

//   await clickAndMeasureDynamic(page, `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`, '//button[normalize-space()="Execute"]', 'Click on container number in Yard Execution');
//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Execute"]', '//input[@formcontrolname="search"]', 'Execute the planned move');

//   await expect(page.locator(`//td/a[normalize-space()='${containerNo}']`)).not.toBeVisible();

//   console.log('Yard Operations for container number ' + containerNo + ' completed successfully');



// }


// export async function ImportTally(
//   page: Page, MO9FvehicleNo: string
// ): Promise<void> {

//   const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');


//   console.log('Using container number:', containerNo);


//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Import Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Import Tally tab');

//   await page.locator('//input[@formcontrolname="TModNo"]').fill(MO9FvehicleNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await page.locator('//a[@class="booking-link"]').first().click();

//   await page.locator(`//a[normalize-space()="${MO9FvehicleNo}"]`).click();

//   await page.locator('//button[normalize-space()="+ Add Tally"]').click();

//   await page.locator('//select[@formcontrolname="ContainerNo"]').selectOption({ label: containerNo }); // Tally Type : Full

//   await page.locator('input[formcontrolname="PlanDate"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');  
//   await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
//   await page.keyboard.press('ArrowRight');
//   console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
//   await page.keyboard.press('ArrowDown');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', `//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`, 'Update Tally');

//   await page.locator(`//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`).click();

//   await page.locator('//button[normalize-space()="+ Add Cargo"]').click();


//   const declaredPackages = await page
//     .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
//     .inputValue();

//   await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);

//   await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);

//   await page.locator('//label[normalize-space()="No. of Damaged Packages*"]//following-sibling::input').fill('0');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Submit"]', 'Update Tally');

//   await page.locator('//button[normalize-space()="Submit"]').click();

//   await page.locator('//button[normalize-space()="Yes, Submit"]').click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Load"]', '//button[normalize-space()="Complete Container Destuffing"]', 'Complete Transport Cargo Load');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Destuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Destuffing');

//   await page.locator('//button[normalize-space()="Yes"]').click();

//   console.log('Tally completed successfully');
// }


// export async function EO9FTally(
//   page: Page, EO9FvehicleNo: string
// ): Promise<void> {

//   const containerNo = await readTestArtifact('Import_MO9F_Container_Number.txt');


//   console.log('Using container number:', containerNo);


//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Tally"]', '//button[normalize-space()="Import Tally"]', 'Route to Tally tab');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Export Tally"]', '//input[@formcontrolname="TModNo"]', 'Route to Export Tally tab');

//   await page.locator('//input[@formcontrolname="TModNo"]').fill(EO9FvehicleNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await page.locator('//a[@class="booking-link"]').first().click();

//   await page.locator(`//a[normalize-space()="${EO9FvehicleNo}"]`).click();

//   await page.locator('//button[normalize-space()="+ Add Tally"]').click();

//   await page.locator('//select[@formcontrolname="ContainerNo"]').selectOption({ label: containerNo }); // Tally Type : Full

//   await page.locator('input[formcontrolname="PlanDate"]').type(`${getNextDateTimeFormatted(1).day}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).month}`, { delay: 200 });
//   // await page.keyboard.press('ArrowRight');  
//   await page.keyboard.type(`${getNextDateTimeFormatted(1).year}`, { delay: 200 });
//   await page.keyboard.press('ArrowRight');
//   console.log(`Filling Plan Date : ${getNextDateTimeFormatted(1).month}/${getNextDateTimeFormatted(1).day}/${getNextDateTimeFormatted(1).year}`);

//   await page.keyboard.type(`${getNextDateTimeFormatted(1).hours}:${getNextDateTimeFormatted(1).minutes}`, { delay: 200 });
//   await page.keyboard.press('ArrowDown');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', `//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`, 'Update Tally');

//   await page.locator(`//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`).click();

//   await page.locator('//button[normalize-space()="+ Add Cargo"]').click();


//   const declaredPackages = await page
//     .locator('//label[normalize-space()="Declared No. of Packages"]/following-sibling::input')
//     .inputValue();

//   await page.locator('//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input').fill(declaredPackages);

//   await page.locator('//label[normalize-space()="No. of Good Packages*"]//following-sibling::input').fill(declaredPackages);

//   await page.locator('//label[normalize-space()="No. of Damaged Packages*"]//following-sibling::input').fill('0');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Update"]', '//button[normalize-space()="Submit"]', 'Update Tally');

//   await page.locator('//button[normalize-space()="Submit"]').click();

//   await page.locator('//button[normalize-space()="Yes, Submit"]').click();

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Back"]', '//button[normalize-space()="Complete Transport Cargo Load"]', 'Back to Complete Transport Cargo Load');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Transport Cargo Unload"]', '//button[normalize-space()="Complete Container Stuffing"]', 'Complete Transport Cargo Unload');

//   await clickAndMeasureDynamic(page, '//button[normalize-space()="Complete Container Stuffing"]', '//button[normalize-space()="Yes"]', 'Complete Container Stuffing');

//   await page.locator('//button[normalize-space()="Yes"]').click();

//   console.log('Tally completed successfully');
// }





// export async function SealCuttingSSR(
//   page: Page,
//   data: any,
//   ContainerNofile: string
// ): Promise<void> {

//   const ContainerNo = await readTestArtifact(ContainerNofile);

//   console.log('Using container number:', ContainerNo);

//   await login(page);

//   await clickAndMeasureDynamic(page, Common.CustomerServiceLogo, CSMCommon.BookingTab, 'Route to Customer Service');

//   await clickAndMeasureDynamic(page, CSMCommon.BookingTab, CSMImport.ImportBookingsButton, 'Route to Booking tab');

//   await clickAndMeasureDynamic(page, CSMImport.ImportBookingsButton, CSMImport.ContainerNoInput, 'Route to Import booking screen');

//   await page.locator(CSMImport.ContainerNoInput).fill(ContainerNo);

//   await page.locator('//button[normalize-space()="Search"]').click();

//   await clickAndMeasureDynamic(page,'//a[contains(text(), "BLN")]','//button[normalize-space()="Update Details"]','Open Import Booking details');

//   await clickAndMeasureDynamic(page,'//button[normalize-space()="Update Details"]', '//button[normalize-space()="Job Orders"]','Route to Update Details page');

//   // // Route to Job Orders tab
//   // await clickAndMeasureDynamic(page, '//button[normalize-space()="Job Orders"]','//button[normalize-space()="+ New Job Order"]','Route to Job Orders tab');

//   // // Open Add Job Order
//   // await clickAndMeasureDynamic(
//   //   page,'//button[normalize-space()="+ New Job Order"]', 'select[formcontrolname="JOBCatID"]','Add Job Order');

//   // // Fill Job Order details
//   // await page.locator('select[formcontrolname="JOBCatID"]').selectOption({ value: "98" }); // JobCategory : Container Job 
//   // await page.locator('select[formcontrolname="JOBACTPCatID"]').selectOption({ value: "104" }); // JobActivityPoint : Container Operation
//   // await page.locator('select[formcontrolname="JODID"]').selectOption({ value: "1090" }); // JobDescription : Seal Cutting  (CO02)

//   // await page.locator('select[formcontrolname="JODContainerID"]').selectOption({ label: containerNo });

//   // // Add Job Order
//   // await clickAndMeasureDynamic(page,'//button[normalize-space()="Add"]','//div[normalize-space()="Job Plan Details"]','Add Job Order');

//   // // Save Job Order
//   // await page.locator('//button[normalize-space()="Save"]').click();

//   // // Submit Job Order
//   // await clickAndMeasureDynamic(page,'//button[normalize-space()="Submit"]', '//div[text()="Add JobOrder"]','Submit Job Order');
//   await clickAndMeasureDynamic(page, CSMExport.JobOrder, CSMExport.NewJO, 'Route to Job Orders tab');
//   await clickAndMeasureDynamic(page, CSMExport.NewJO, CSMExport.JobCatId, 'Add Job Order');
//   await page.locator(CSMExport.JobCatId).selectOption(data.JobCategory);
//   await page.locator(CSMExport.JobActId).selectOption(data.JobActivityPoint);
//   await page.locator(CSMExport.JobDesc).selectOption({ value: data.JobDescription });
//   // await page.locator(CSMExport.JobDesc).selectOption({ label: '/XITF/' });
//   await page.locator(CSMExport.JobConId).selectOption(data.ContainerNo);
//   await clickAndMeasureDynamic(page, CSMExport.Add, CSMExport.JobPlan, 'Add Job Order');
//   await page.click(CSMExport.Save);
//   await clickAndMeasureDynamic(page, CSMExport.Submit, CSMExport.JObOrderAdd, 'Submit Export Booking');
//   console.log('Job Order created successfully');
// }


// // Resolve project root (adjust ".." if utils folder depth differs)
// const PROJECT_ROOT = path.resolve(__dirname, '..');

// // Centralized test-artifacts directory
// const TEST_ARTIFACTS_DIR = path.join(PROJECT_ROOT, 'test-artifacts');

// /**
//  * Writes data to a file inside test-artifacts directory
//  */
// export function writeTestArtifact(
//   fileName: string,
//   data: string
// ): void {
//   if (!fs.existsSync(TEST_ARTIFACTS_DIR)) {
//     fs.mkdirSync(TEST_ARTIFACTS_DIR, { recursive: true });
//   }

//   const filePath = path.join(TEST_ARTIFACTS_DIR, fileName);
//   fs.writeFileSync(filePath, data, 'utf-8');
// }

// /**
//  * Reads data from a file inside test-artifacts directory
//  */
// export function readTestArtifact(
//   fileName: string
// ): string {
//   const filePath = path.join(TEST_ARTIFACTS_DIR, fileName);
//   return fs.readFileSync(filePath, 'utf-8');
// }




// export async function extractCargoDetailsNumber(page: Page): Promise<string> {
//   const cargoText = await page
//     .locator('div:has-text("Cargo Details")')
//     .first()
//     .textContent();

//   if (!cargoText) {
//     throw new Error('Cargo Details text not found');
//   }

//   // 🔥 Remove everything except digits
//   const cargoNumber = cargoText.replace(/\D/g, '');

//   if (!cargoNumber) {
//     throw new Error('Cargo Details number not extracted');
//   }

//   return cargoNumber;
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
 
//  await page.locator('.ant-picker-cell-in-view .ant-picker-cell-inner', {
//     hasText: String(day),
//   }).first().click();

// }


// export async function GoToMicroservice(page: Page, MicroserviceLogo: string): Promise<void> {
//   await clickAndMeasureDynamic(
//     page,
//     `(//img[@alt="${MicroserviceLogo}"])[1]`,
//     '//nav[@id="navigation"]',
//     `Route to ${MicroserviceLogo.replace(' Logo', '')}`
//   );
// }
 
// export async function routeToMicroservice(page: Page, Microservice: string): Promise<void> {
//   await page.locator("//nav[@id='navigation']").hover();
//   await page.locator('(//a[contains(@class,"cursor-pointer")])[1]').click();
//   // await clickAndMeasureDynamic(page,`(//img[@alt="${MicroserviceLogo}"])[1]`,'//nav[@id="navigation"]',`Route to ${MicroserviceLogo.replace(' Logo', '')}`);
//   await clickAndMeasureDynamic(page,Microservice,'//nav[@id="navigation"]',`Route to ${Microservice.replace(' Logo', '')}`);
//   // await page.getByRole('button', { name: 'System Log' }).hover();
 
// }
 