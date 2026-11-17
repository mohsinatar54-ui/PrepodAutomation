
// Add Node.js types for process
/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');


// Use a dedicated folder for IDE runs to ensure fresh reports
// This prevents caching issues when running tests from IDE vs terminal
const isIDERun = process.env.VSCODE_PID || process.env.CURSOR_PID;
const reportFolder = isIDERun ? 'playwright-report-ide' : 'playwright-report';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // globalSetup: './utils/global.setup.ts', // Commented out - file doesn't exist
  timeout: 1200_000, // 2 minutes per test
  // globalTimeout: 10 * 60 * 1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  retries: 0, // retry failed tests once
  // workers: process.env.CI ? 1 : undefined,
  workers: 1,

  // Stop the current folder run immediately after the first failed test
  // This allows the external runner to start the folder again from TC001
  maxFailures: 1,

  reporter: [
    ['html', { 
      outputFolder: `reports/html-report-${timestamp}`, 
      open: 'never' 
    }]
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: [
  //   ['html', { outputFolder: reportFolder, open: 'never' }],
  //   ['./utils/test-helpers.ts']
  //   // ['html'],
  //   // ['json', { outputFile: 'test-results/results.json' }],
  //   // ['junit', { outputFile: 'test-results/results.xml' }]
   ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'https://ueapp.logstarerp.com/login',
    testIdAttribute: 'data-test',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on',
    
    navigationTimeout: 120000, 
    actionTimeout: 120000, // 30 seconds per action (locator.fill, click, etc.)
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    headless: false, // Run in headed mode (browser visible)
    /* Record video on failure */
    /* Reuse login session from global setup */
    // storageState: 'authState.json', // Commented out - file may not exist
    // launchOptions: {
    //   slowMo: 1500
    // }
     viewport: { width: 1366, height: 633 },
   launchOptions: {
     args: ['--window-size=1366,633'],
     slowMo: 1000
  },

},

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',

        // IMPORTANT: no Desktop Chrome device preset
        viewport: {
          width: 1366,
          height: 633,
        },

      }
      // use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});









































































































































































// // Add Node.js types for process
// /// <reference types="node" />
// import { defineConfig, devices } from '@playwright/test';
// const timestamp = new Date().toISOString().replace(/[:.]/g, '-');


// // Use a dedicated folder for IDE runs to ensure fresh reports
// // This prevents caching issues when running tests from IDE vs terminal
// const isIDERun = process.env.VSCODE_PID || process.env.CURSOR_PID;
// const reportFolder = isIDERun ? 'playwright-report-ide' : 'playwright-report';

// /**
//  * @see https://playwright.dev/docs/test-configuration
//  */
// export default defineConfig({
//   // globalSetup: './utils/global.setup.ts', // Commented out - file doesn't exist
//   timeout: 200_000, // 2 minutes per test
//   // globalTimeout: 10 * 60 * 1000,
//   testDir: './tests',
//   /* Run tests in files in parallel */
//   fullyParallel: false,
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   // retries: process.env.CI ? 2 : 1,
//   /* Opt out of parallel tests on CI. */
//   retries: 1, // retry failed tests once
//   // workers: process.env.CI ? 1 : undefined,
//   workers: 1,
//   reporter: [
//     ['html', { 
//       outputFolder: `reports/html-report-${timestamp}`, 
//       open: 'never' 
//     }]
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   // reporter: [
//   //   ['html', { outputFolder: reportFolder, open: 'never' }],
//   //   ['./utils/test-helpers.ts']
//   //   // ['html'],
//   //   // ['json', { outputFile: 'test-results/results.json' }],
//   //   // ['junit', { outputFile: 'test-results/results.xml' }]
//    ],
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Base URL to use in actions like `await page.goto('/')`. */
//     // baseURL: 'https://ueapp.logstarerp.com/login',
//     testIdAttribute: 'data-test',
//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     // trace: 'on',
    
//     navigationTimeout: 120000, 
//     actionTimeout: 120000, // 30 seconds per action (locator.fill, click, etc.)
//     ignoreHTTPSErrors: true,
//     video: 'retain-on-failure',
//     /* Take screenshot on failure */
//     screenshot: 'only-on-failure',
//     headless: false, // Run in headed mode (browser visible)
//     /* Record video on failure */
//     /* Reuse login session from global setup */
//     // storageState: 'authState.json', // Commented out - file may not exist
//     // launchOptions: {
//     //   slowMo: 1500
//     // }
//      viewport: { width: 1366, height: 633 },
//    launchOptions: {
//      args: ['--window-size=1366,633'],
//      slowMo: 500
//   },

// },

//   /* Configure projects for major browsers */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     // },

//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },

//     // /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     // /* Test against branded browsers. */
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   /* Run your local dev server before starting the tests */
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://127.0.0.1:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });
