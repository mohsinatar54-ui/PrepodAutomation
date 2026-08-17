# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Export_Direct\TC004_CSM_EXPORT_EO9F.test.ts >> TC001_CSM_EXPORT_EO9F
- Location: PreProd_Playwright_Automation\tests\Export_Direct\TC004_CSM_EXPORT_EO9F.test.ts:59:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('text=Loading...') to be hidden
    8 × locator resolved to visible <div class="loading-text" _ngcontent-ng-c4199626858="">Loading...</div>

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]: Loading...
  - generic [ref=e8]:
    - banner [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: Customer Service
        - generic [ref=e13]: App Version -V1.2.0 R1.1
      - generic [ref=e14]:
        - generic [ref=e15]: Welcome,Aditya Singh
        - img [ref=e18] [cursor=pointer]
      - generic [ref=e21]:
        - button "🇬🇧 English" [ref=e23] [cursor=pointer]:
          - generic [ref=e24]: 🇬🇧
          - generic [ref=e25]: English
          - img [ref=e26]
        - generic [ref=e28]:
          - img [ref=e30] [cursor=pointer]
          - generic [ref=e33]: App Palette
        - generic [ref=e34]:
          - img [ref=e36] [cursor=pointer]
          - generic [ref=e39]: Logout
    - navigation [ref=e40]:
      - button "Dashboard" [ref=e41] [cursor=pointer]
      - button "Booking" [ref=e42] [cursor=pointer]
      - button "Job Order" [ref=e43] [cursor=pointer]
      - button "Work Order" [ref=e44] [cursor=pointer]
      - button "Tally" [ref=e45] [cursor=pointer]
      - button "Warehouse" [ref=e46] [cursor=pointer]
      - button "Hold & Release" [ref=e47] [cursor=pointer]
      - button "Tracking" [ref=e48] [cursor=pointer]
      - button "SSR" [ref=e49] [cursor=pointer]
      - button "Reports" [ref=e50] [cursor=pointer]
      - button "Masters" [ref=e51] [cursor=pointer]
      - button "Settings" [ref=e52] [cursor=pointer]
      - button "System Log" [ref=e53] [cursor=pointer]
      - button "Amendment" [ref=e54] [cursor=pointer]
    - generic [ref=e55]:
      - generic [ref=e58]:
        - button "Empty bookings" [ref=e59] [cursor=pointer]
        - button "Import bookings" [ref=e60] [cursor=pointer]
        - button "Export bookings" [ref=e61] [cursor=pointer]
        - button "Pre-Announcement" [ref=e62] [cursor=pointer]
        - button "Inventory-upload" [ref=e63] [cursor=pointer]
        - button "tos-Manifest" [ref=e64] [cursor=pointer]
        - button "BL-approval" [ref=e65] [cursor=pointer]
        - button "clearance" [ref=e66] [cursor=pointer]
      - button "Hide Sidebar" [ref=e67] [cursor=pointer]:
        - img [ref=e68]
      - main [ref=e70]:
        - generic [ref=e73]:
          - generic [ref=e74]:
            - link "Job Order" [ref=e75] [cursor=pointer]:
              - /url: /csm/joborder/manage
            - text: ">>8858"
          - generic [ref=e76]:
            - generic [ref=e78]:
              - generic [ref=e80]: Job Order - 9150339
              - generic [ref=e81]:
                - generic [ref=e82]:
                  - generic [ref=e83]: Booking Type
                  - generic [ref=e84]: Export bookings
                - generic [ref=e85]:
                  - generic [ref=e86]: Booking Numbers
                  - generic [ref=e87]: 67929BN20260805001EXP
                - generic [ref=e88]:
                  - generic [ref=e89]: S/B No.
                  - generic [ref=e90]: "9150339"
                - generic [ref=e91]:
                  - generic [ref=e92]: S/B Date
                  - generic [ref=e93]: 2026-08-05 10:21
                - generic [ref=e94]:
                  - generic [ref=e95]: Job Category
                  - generic [ref=e96]: Container Job
                - generic [ref=e97]:
                  - generic [ref=e98]: Job Activity Point Category
                  - generic [ref=e99]: Container Operation
                - generic [ref=e100]:
                  - generic [ref=e101]: Job Description
                  - generic [ref=e102]: CFS Stuffing-Direct stuffing (EO9F)
                - generic [ref=e103]:
                  - generic [ref=e104]: Container No.
                  - generic [ref=e105]: CNTU7204472
                - generic [ref=e106]:
                  - generic [ref=e107]: Job Cycle
                  - generic [ref=e108]: Empty
                - generic [ref=e109]:
                  - generic [ref=e110]: Size/Type
                  - generic [ref=e111]: 20 STD
                - generic [ref=e112]:
                  - generic [ref=e113]: Booking Operator
                  - generic [ref=e114]: MAERSKLINE
                - generic [ref=e115]:
                  - generic [ref=e116]: Transport Mode Pass
                  - generic [ref=e117]: LOADED TRUCK IN WITH CARGO
                - generic [ref=e118]:
                  - generic [ref=e119]: Primary Account holder name
                  - generic [ref=e120]: ADITYA LOGISTICS
                - generic [ref=e121]:
                  - generic [ref=e122]: Account holder Contract
                  - generic [ref=e123]: ADITYA LOGISTICS
                - generic [ref=e124]:
                  - generic [ref=e125]: Job Plan DateTime
                  - generic [ref=e126]: 2026-08-05 23:59
                - generic [ref=e128]: Estimation DateTime
            - generic [ref=e131]:
              - button "Job Plan" [ref=e132] [cursor=pointer]
              - button "Containers" [ref=e133] [cursor=pointer]
              - button "Cargo Transport" [ref=e134] [cursor=pointer]
              - button "Personnel" [ref=e135] [cursor=pointer]
              - button "Equipment" [ref=e136] [cursor=pointer]
              - button "Material & Service" [ref=e137] [cursor=pointer]
            - generic [ref=e142]:
              - generic [ref=e143]: Job Planning
              - generic [ref=e144]:
                - generic [ref=e145]: Job Plan Details
                - generic [ref=e146]:
                  - generic [ref=e147]:
                    - generic [ref=e148]: Job Plan DateTime
                    - generic [ref=e151]:
                      - textbox "Select date and time" [ref=e152]: 05-08-2026 23:59
                      - generic:
                        - generic:
                          - img
                  - generic [ref=e153]:
                    - generic [ref=e154]: Estimation DateTime
                    - generic [ref=e157]:
                      - textbox "Select date and time" [ref=e158]
                      - generic:
                        - generic:
                          - img
                  - generic [ref=e159]:
                    - generic [ref=e160]: Job Status
                    - combobox [disabled] [ref=e162]:
                      - option "-- Select Status --"
                      - option "New" [selected]
                      - option "Open"
                      - option "Ready"
                      - option "Closed"
                      - option "Deleted"
                      - option "CANCELLED"
                  - generic [ref=e163]:
                    - generic [ref=e164]: Job Plan Instructions
                    - textbox [ref=e165]
              - button "Save" [active] [ref=e167] [cursor=pointer]
            - generic [ref=e168]:
              - button "Submit" [ref=e169] [cursor=pointer]
              - button "Back" [ref=e170] [cursor=pointer]
              - button "Delete" [ref=e171] [cursor=pointer]
              - button "Print" [ref=e172] [cursor=pointer]
              - button "Gate Pass Print" [ref=e173] [cursor=pointer]
    - contentinfo [ref=e174]:
      - generic [ref=e175]: App Version -V1.2.0 R1.1
      - generic [ref=e176]:
        - text: Copyright © 2026 Envecon Global Solutions. All Rights Reserved.
        - link "www.envecon.com" [ref=e177] [cursor=pointer]:
          - /url: https://www.envecon.com
      - generic [ref=e178]:
        - paragraph [ref=e179]: Product by
        - img "Envecon Logo" [ref=e180]
```

# Test source

```ts
  1   | import { chromium, expect, Page, TestInfo, TestType, FullConfig } from '@playwright/test';
  2   | import XLSX from 'xlsx';
  3   | import fs from 'fs';
  4   | import path from 'path';
  5   | import { fileURLToPath } from 'url';
  6   | import { CSMExport } from '../Locators/BookingLocators';
  7   | import { Common, CSMImport } from 'Locators/BookingLocators';
  8   | import type {Reporter,Suite,TestCase,TestResult,} from '@playwright/test/reporter';
  9   | 
  10  | 
  11  | 
  12  | 
  13  | const __filename = fileURLToPath(import.meta.url);
  14  | const __dirname = path.dirname(__filename);
  15  | 
  16  | // const URL = 'https://prepac.logstarerp.com';
  17  | // const Username = 'adityasingh';
  18  | // const Password = 'Test@123';
  19  | 
  20  | // const URL = 'https://prepaclx.logstarerp.com/uen/login';
  21  | const URL = 'https://preprod.logstarcloud.io/';
  22  | const Username = 'adityasingh';
  23  | const Password = 'Test@123';
  24  | 
  25  | // const URL = 'https://msdemo.logstarerp.com/usren/login';
  26  | // const Username = 'aditya.singh';
  27  | // const Password = 'Pass@123';
  28  | 
  29  | // const URL = 'https://cmajedu.logstarerp.com/uen/login';
  30  | // const Username = 'aditya.singh';
  31  | // const Password = 'Pass@123';
  32  | 
  33  |   const Entity = 'Beacon Depot';
  34  |   const Site = 'West Terminal';
  35  |   const Account = 'Envecon Software';
  36  |   // const Entity = 'Mercantile';
  37  |   // const Site = 'Kemba';
  38  | 
  39  | export async function selectEntityAndSite(page: Page) {
  40  |   // await page.locator('//ng-select[@placeholder="Select Entity"]').selectOption({ label: entity });
  41  |   // await page.locator('//ng-select[@placeholder="Select Site"]').selectOption({ label: Site });
  42  |   // Entity selection
  43  |   await page.locator('//ng-select[@placeholder="Select Account"]').click();
  44  |   await page.locator(`//div[@role="option"]//div[normalize-space()="${Account}"]`).click();
  45  |   await page.locator('//ng-select[@placeholder="Select Entity"]').click();
  46  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${Entity}"]`).click();
  47  |   await page.locator('//ng-select[@placeholder="Select Site"]').click();
  48  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${Site}"]`).click();
  49  | }
  50  | 
  51  | 
  52  | export function getNextDateTimeFormatted(n: number): { date: string, day: string, month: string, year: string, hours: string, minutes: string } {
  53  |   const now = new Date();
  54  |   now.setDate(now.getDate() + n);
  55  | 
  56  |   const pad = (n: number) => n < 10 ? '0' + n : n.toString();
  57  | 
  58  |   const day = pad(now.getDate());
  59  |   const month = pad(now.getMonth() + 1); // Months are 0-indexed
  60  |   const year = now.getFullYear().toString();
  61  |   // .toString().slice(-2);
  62  |   const hours = pad(now.getHours());
  63  |   const minutes = pad(now.getMinutes());
  64  |   const date = `${day}${month}${year}`;
  65  |   return { date, day, month, year, hours, minutes };
  66  | }
  67  | 
  68  | export function getRandomNumberString(length: number): string {
  69  |   return Array(length)
  70  |     .fill(0)
  71  |     .map(() => Math.floor(Math.random() * 10))
  72  |     .join('');
  73  | }
  74  | 
  75  | export async function login(page: Page) {
  76  |   await page.goto(URL, {
  77  |     waitUntil: 'domcontentloaded'
  78  |     // timeout: 600000
  79  |   });
  80  |   await page.locator('//a[normalize-space()="Login"]').click();
  81  |   // Step 2: Login flow + MNR visibility selection
  82  |   await page.locator('//input[@name="username"]').fill(Username);
  83  |   await page.locator('//input[@name="password"]').fill(Password);
  84  |   await clickAndMeasureDynamic(page, '//button[@type="submit"]', '//ng-select[@placeholder="Select Entity"]', 'Click Login button');
  85  | }
  86  | 
  87  | export async function clickAndMeasureDynamic(page: Page, beforeSelector: string, afterSelector: string, description: string) {
  88  |   const clickStart = Date.now();
> 89  |   await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
      |              ^ Error: page.waitForSelector: Test timeout of 120000ms exceeded.
  90  |   // Wait until the loading element with ng-reflect-loading="true" is NOT visible
  91  |   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });
  92  | 
  93  |   // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
  94  |   await page.locator('//div[@class="custom-loader"]').waitFor({ state: 'hidden', timeout: 300000 });
  95  | 
  96  |   await page.locator(beforeSelector).click();
  97  | 
  98  |   await page.waitForLoadState('networkidle');
  99  |   // await page.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 300000 });
  100 |   await page.waitForFunction(
  101 |     () => {
  102 |       const bodyText = document.body?.innerText ?? document.documentElement?.innerText ?? '';
  103 |       return !bodyText.includes('Loading...');
  104 |     },
  105 |     { timeout: 300000 }
  106 |   );
  107 |   // await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
  108 |   // Wait until the loading element with ng-reflect-loading="true" is NOT visible
  109 |   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });
  110 | 
  111 |   // (Repeated as in original) Wait until the loading element with ng-reflect-loading="true" is NOT visible
  112 |   await page.locator('//app-loader[@ng-reflect-loading="true"]').waitFor({ state: 'hidden', timeout: 300000 });
  113 | 
  114 |   await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
  115 |   const clickEnd = Date.now();
  116 |   const duration = clickEnd - clickStart;
  117 |   console.log(`⏱️ Page load duration after ${description}: ${duration} ms`);
  118 |   savePerformanceToExcel([
  119 |     {
  120 |       TestName: description || beforeSelector + ' to ' + afterSelector,
  121 |       Action: 'Click',
  122 |       Duration: Number(duration),
  123 |     },
  124 |   ]);
  125 |   // If afterSelector is not found, proceed further (do not throw)
  126 |   try {
  127 |     await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
  128 |   } catch (e) {
  129 |     console.warn(`afterSelector not found: ${afterSelector}, proceeding further.`);
  130 |   }
  131 |   // await page.locator('//div[@class="toast-message"]').waitFor({ state: 'hidden', timeout: 60000 });
  132 |   return duration;
  133 | }
  134 | 
  135 | export async function waitForPageLoad(page: Page, selector: string) {
  136 |   await page.locator('//div[@data-progress-text="100%"]').isVisible();
  137 |   await page.locator('//body[contains(@class,"pace-running")]').waitFor({ state: 'hidden', timeout: 300000 });
  138 |   await page.locator('//body[contains(@class,"pace-done")]').waitFor({ state: 'visible', timeout: 300000 });
  139 |   await page.locator(selector).waitFor({ state: 'visible', timeout: 300000 });
  140 | }
  141 | 
  142 | class HtmlNamerReporter implements Reporter {
  143 |  // private htmlOutputDir: string;
  144 |  private htmlOutputDir!: string;
  145 | 
  146 |   onBegin(config: FullConfig, suite: Suite) {
  147 |     // Detect if running from IDE (Cursor/VS Code) to use correct report folder
  148 |     const isIDERun = process.env.VSCODE_PID || process.env.CURSOR_PID;
  149 |     this.htmlOutputDir = isIDERun ? 'playwright-report-ide' : 'playwright-report';
  150 |   }
  151 | 
  152 |   onTestBegin(test: TestCase) {
  153 |     // Optional: Called when a test starts
  154 |   }
  155 | 
  156 |   async onTestEnd(test: TestCase, result: TestResult) {
  157 |     // Get test case name and sanitize it for filename
  158 |     const testName = test.title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '_');
  159 |     const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-MM-SS
  160 | 
  161 |     // Create report filename with test case name
  162 |     const targetFile = `report_${testName}_${timestamp}.html`;
  163 |     const targetPath = path.join('reports', targetFile);
  164 | 
  165 |     // Ensure destination folder exists
  166 |     fs.mkdirSync('reports', { recursive: true });
  167 | 
  168 |     const htmlFilePath = path.join(this.htmlOutputDir, 'index.html');
  169 | 
  170 |     // Copy and rename the HTML file after each test with test case name
  171 |     if (fs.existsSync(htmlFilePath)) {
  172 |       fs.copyFileSync(htmlFilePath, targetPath);
  173 |       console.log(`📄 Saved report with test case name: ${targetPath}`);
  174 |     } else {
  175 |       console.warn(`⚠️  HTML report not found at: ${htmlFilePath}`);
  176 |     }
  177 |   }
  178 | 
  179 |   onEnd() {
  180 |     // Log the location of the HTML report
  181 |     const reportPath = path.resolve(this.htmlOutputDir, 'index.html');
  182 |     if (fs.existsSync(reportPath)) {
  183 |       console.log(`\n📊 HTML Report generated at: ${reportPath}`);
  184 |       console.log(`💡 To view the report, run: npm run test:report:ide`);
  185 |       console.log(`   Or open: file:///${reportPath.replace(/\\/g, '/')}\n`);
  186 |     }
  187 |   }
  188 | }
  189 | 
```