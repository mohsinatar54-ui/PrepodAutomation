import { chromium, Page, TestType } from '@playwright/test';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Measures navigation time (in seconds) between clicks using Browser Performance API
 */
export async function measureClickNavigationTime(
  page: Page,
  clickSelector: string,
  description: string = ''
): Promise<number> {
  const start = Date.now();

  if (clickSelector) {
    // Click and wait for navigation/load to complete
    await Promise.all([
      page.click(clickSelector),
      page.waitForLoadState('load'),
    ]);
    // Also wait for networkidle to ensure all resources are loaded
    await page.waitForLoadState('networkidle');
  } else {
    // If no selector, wait for current page to be fully loaded
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
  }

  const end = Date.now();
  // const duration = ((end - start) / 1000).toFixed(2);
  const duration = (end - start);

  console.log(`⏱️ ${description || clickSelector} - Load Time: ${duration}s`);

  // Save result to excel file
  savePerformanceToExcel([
    {
      TestName: description || clickSelector,
      Action: 'Load',
      Duration: Number(duration),
    },
  ]);

  return Number(duration);
}

/**
 * Saves performance metrics to an Excel file (creates or updates)
 */
export function savePerformanceToExcel(
  data: { TestName: string; Action: string; Duration: number }[],
  fileName = 'latest_performance_report.xlsx'
) {
  const filePath = path.resolve(fileName);
  let workbook: XLSX.WorkBook;
  let worksheet: XLSX.WorkSheet;

  if (fs.existsSync(filePath)) {
    // If file exists, load and append new data
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

// Create a new test fixture that always uses Chromium (Chrome)
export function createChromiumTestFixture(base: TestType<any, any>) {
  return base.extend<{ page: Page }>({
    page: async ({ }, use: (pg: Page) => Promise<void>) => {
      const browser = await chromium.launch({
        channel: 'chrome',
        headless: false,
        args: ['--start-maximized'],
      });
      const context = await browser.newContext({ viewport: null });
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
// import type { Page } from '@playwright/test';

// export class TestHelpers {
//   static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
//     await page.waitForSelector(selector, { timeout });
//   }

//   static async waitForText(page: Page, text: string, timeout: number = 10000): Promise<void> {
//     await page.waitForSelector(`text=${text}`, { timeout });
//   }

//   static async clearAndFill(page: Page, selector: string, text: string): Promise<void> {
//     await page.fill(selector, '');
//     await page.fill(selector, text);
//   }

//   static async clickAndWaitForNavigation(page: Page, selector: string): Promise<void> {
//     await Promise.all([
//       page.waitForNavigation(),
//       page.click(selector)
//     ]);
//   }

//   static async scrollToElement(page: Page, selector: string): Promise<void> {
//     await page.locator(selector).scrollIntoViewIfNeeded();
//   }

//   static async getElementText(page: Page, selector: string): Promise<string> {
//     return await page.textContent(selector) || '';
//   }

//   static async isElementVisible(page: Page, selector: string): Promise<boolean> {
//     try {
//       await page.waitForSelector(selector, { timeout: 5000 });
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }


// export async function measureClickNavigationTime(
//   page: Page,
//   clickSelector: string,
//   description: string = ''
// ): Promise<number> {
//   // Record a timestamp as backup
//   const start = Date.now();

//   // Perform click and wait for navigation to finish
//   await Promise.all([
//     // page.click(clickSelector),
//     page.waitForLoadState('load'),
//   ]);

//   // Evaluate the browser's performance data
//   const timing = await page.evaluate(() => {
//     const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
//     return nav ? nav.duration : null;
//   });

//   // Fallback if Performance API returns null
//   const duration = timing
//     ? (timing / 1000).toFixed(2)
//     : ((Date.now() - start) / 1000).toFixed(2);

//   console.log(
//     `⏱️ ${description || clickSelector} - Load Time: ${duration} seconds`
//   );

//   return Number(duration);
// }
