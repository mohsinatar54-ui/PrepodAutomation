# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Container_Hold\TC003_CSM_CONTAINER_HOLD.test.ts >> TC003_CSM_CONTAINER_HOLD
- Location: tests\Container_Hold\TC003_CSM_CONTAINER_HOLD.test.ts:14:1

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://preprod.logstarcloud.io/", waiting until "domcontentloaded"

```

# Test source

```ts
  7   | import { Common, CSMImport } from 'Locators/BookingLocators';
  8   | import type {Reporter,Suite,TestCase,TestResult,} from '@playwright/test/reporter';
  9   | import { Cargo } from 'Locators/CargoLocators';
  10  | import { bookingNo } from '@tests/VBS_CCIS-New/TC016_VBS_Export_CreateAppointment.test';
  11  | import { Locator } from '@playwright/test';
  12  | //import { bookingNumber } from '@tests/Export_Indirect/TC005_GATE_EXPORT_XICT.test';
  13  | 
  14  | 
  15  | 
  16  | 
  17  | const __filename = fileURLToPath(import.meta.url);
  18  | const __dirname = path.dirname(__filename);
  19  | 
  20  | // const URL = 'https://prepac.logstarerp.com';
  21  | // const Username = 'adityasingh';
  22  | // const Password = 'Test@123';
  23  | 
  24  | // const URL = 'https://prepaclx.logstarerp.com/uen/login';
  25  | const URL = 'https://preprod.logstarcloud.io/';
  26  | const Username = 'adityasingh';
  27  | const Password = 'Test@123';
  28  | 
  29  | // const URL = 'https://msdemo.logstarerp.com/usren/login';
  30  | // const Username = 'aditya.singh';
  31  | // const Password = 'Pass@123';
  32  | 
  33  | // const URL = 'https://cmajedu.logstarerp.com/uen/login';
  34  | // const Username = 'aditya.singh';
  35  | // const Password = 'Pass@123';
  36  | 
  37  |   const Entity = 'Beacon Depot';
  38  |   const Site = 'Site 7 (Manila)';
  39  |   const Account = 'Envecon Software';
  40  |   const AccountM = 'Mercantile';
  41  |   const EntityM = 'Mercantile';
  42  |     const SiteM = 'Kemba';
  43  |   // const Site = 'Kemba';
  44  | 
  45  | export async function selectEntityAndSite(page: Page) {
  46  |   // await page.locator('//ng-select[@placeholder="Select Entity"]').selectOption({ label: entity });
  47  |   // await page.locator('//ng-select[@placeholder="Select Site"]').selectOption({ label: Site });
  48  |   // Entity selection
  49  |   await page.locator('//ng-select[@placeholder="Select Account"]').click();
  50  |   await page.locator(`//div[@role="option"]//div[normalize-space()="${Account}"]`).click();
  51  |   await page.locator('//ng-select[@placeholder="Select Entity"]').click();
  52  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${Entity}"]`).click();
  53  |   await page.locator('//ng-select[@placeholder="Select Site"]').click();
  54  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${Site}"]`).click();
  55  | }
  56  | 
  57  | export async function selectEntityAndSiteM(page: Page) {
  58  |   // await page.locator('//ng-select[@placeholder="Select Entity"]').selectOption({ label: entity });
  59  |   // await page.locator('//ng-select[@placeholder="Select Site"]').selectOption({ label: Site });
  60  |   // Entity selection
  61  |   await page.locator('//ng-select[@placeholder="Select Account"]').click();
  62  |   await page.locator(`//div[@role="option"]//div[normalize-space()="${AccountM}"]`).click();
  63  |   await page.locator('//ng-select[@placeholder="Select Entity"]').click();
  64  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${EntityM}"]`).click();
  65  |   await page.locator('//ng-select[@placeholder="Select Site"]').click();
  66  |   await page.locator(`//div[@role="option"]//span[normalize-space()="${SiteM}"]`).click();
  67  | }
  68  | 
  69  | export function getNextDateTimeFormatted(n: number): { date: string, day: string, month: string, year: string, hours: string, minutes: string } {
  70  |   const now = new Date();
  71  |   now.setDate(now.getDate() + n);
  72  | 
  73  |   const pad = (n: number) => n < 10 ? '0' + n : n.toString();
  74  | 
  75  |   const day = pad(now.getDate());
  76  |   const month = pad(now.getMonth() + 1); // Months are 0-indexed
  77  |   const year = now.getFullYear().toString();
  78  |   // .toString().slice(-2);
  79  |   const hours = pad(now.getHours());
  80  |   const minutes = pad(now.getMinutes());
  81  |   const date = `${day}${month}${year}`;
  82  |   return { date, day, month, year, hours, minutes };
  83  | }
  84  | 
  85  | export function getRandomNumberString(length: number): string {
  86  |   return Array(length)
  87  |     .fill(0)
  88  |     .map(() => Math.floor(Math.random() * 10))
  89  |     .join('');
  90  | }
  91  | 
  92  | export async function switchToNewTab(
  93  |   page: Page,
  94  |   clickLocator: string
  95  | ): Promise<Page> {
  96  |   const [newPage] = await Promise.all([
  97  |     page.context().waitForEvent('page'),
  98  |     page.locator(clickLocator).click(),
  99  |   ]);
  100 | 
  101 |   await newPage.waitForLoadState('domcontentloaded');
  102 | 
  103 |   return newPage;
  104 | }
  105 | 
  106 | export async function login(page: Page): Promise<Page> {
> 107 |   await page.goto(URL, {
      |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  108 |     waitUntil: 'domcontentloaded',
  109 |   });
  110 | 
  111 |   // Click Login and switch to the newly opened tab
  112 |   const loginPage = await switchToNewTab(
  113 |     page, '//a[normalize-space()="Login"]');
  114 | 
  115 |   // Perform login on the new tab
  116 |   
  117 |   await loginPage.locator('//input[@name="username"]').fill(Username);
  118 |   await loginPage.locator('//input[@name="password"]').fill(Password);
  119 | 
  120 |   await clickAndMeasureDynamic(
  121 |     loginPage,
  122 |     '//button[@type="submit"]',
  123 |     '//ng-select[@placeholder="Select Entity"]',
  124 |     'Click Login button'
  125 |   );
  126 | 
  127 |   return loginPage;
  128 | }
  129 | 
  130 | // export async function loginNew(page: Page) {
  131 | //   await page.goto(URL, {
  132 | //     waitUntil: 'domcontentloaded'
  133 | //     // timeout: 600000
  134 | //   });
  135 | //   const newTabPromise = page.context().waitForEvent('page');
  136 | //   await page.locator('//a[normalize-space()="Login"]').click();
  137 | //   const loginPage = await newTabPromise;
  138 | //   await loginPage.waitForLoadState('domcontentloaded');
  139 | //   // Step 2: Login flow + MNR visibility selection
  140 | //   await loginPage.locator('//input[@name="username"]').fill(Username);
  141 | //   await loginPage.locator('//input[@name="password"]').fill(Password);
  142 | //   await clickAndMeasureDynamic(loginPage, '//button[@type="submit"]', '//ng-select[@placeholder="Select Entity"]', 'Click Login button');
  143 | //   return loginPage;
  144 | // }
  145 | 
  146 | 
  147 | 
  148 | 
  149 | 
  150 | 
  151 | 
  152 | 
  153 | 
  154 | 
  155 | 
  156 | 
  157 | 
  158 | 
  159 | 
  160 | 
  161 | 
  162 | // export async function switchToNewTab(
  163 | //   page: Page,
  164 | //   clickLocator: string
  165 | // ): Promise<Page> {
  166 | //   const [newPage] = await Promise.all([
  167 | //     page.context().waitForEvent('page'),
  168 | //     page.locator(clickLocator).click(),
  169 | //   ]);
  170 | 
  171 | //   await newPage.waitForLoadState('domcontentloaded');
  172 | 
  173 | //   return newPage;
  174 | // }
  175 | // export async function login(page: Page): Promise<Page> {
  176 | //   await page.goto(URL, {
  177 | //     waitUntil: 'domcontentloaded',
  178 | //   });
  179 | 
  180 | //   // Click Login and switch to the newly opened tab
  181 | //   const loginPage = await switchToNewTab(
  182 | //     page,
  183 | //     '//a[normalize-space()="Login"]'
  184 | //   );
  185 | 
  186 | //   // Perform login on the new tab
  187 | //   await loginPage.locator('//input[@name="username"]').fill(Username);
  188 | //   await loginPage.locator('//input[@name="password"]').fill(Password);
  189 | 
  190 | //   await clickAndMeasureDynamic(
  191 | //     loginPage,
  192 | //     '//button[@type="submit"]',
  193 | //     '//ng-select[@placeholder="Select Entity"]',
  194 | //     'Click Login button'
  195 | //   );
  196 | 
  197 | //   return loginPage;
  198 | // }
  199 | // export async function login(page: Page) {
  200 | //   await page.goto(URL, {
  201 | //     waitUntil: 'domcontentloaded'
  202 | //     // timeout: 600000
  203 | //   });
  204 | //   await page.locator('//a[normalize-space()="Login"]').click();
  205 | //   // Step 2: Login flow + MNR visibility selection
  206 | //   await page.locator('//input[@name="username"]').fill(Username);
  207 | //   await page.locator('//input[@name="password"]').fill(Password);
```