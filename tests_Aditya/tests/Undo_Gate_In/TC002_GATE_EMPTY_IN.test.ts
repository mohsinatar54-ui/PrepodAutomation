import { test, expect } from "@playwright/test";
import {
  login,
  clickAndMeasureDynamic,
  generateVehicleNumber,
  readTestArtifact,
  writeTestArtifact,
} from "../../utils/test-helpers";

const ContainerSurveyRemark = "Automation Test Check for Depot Estimate";
const surveyRemark = "Condition OK";

test("TC002_CSM_Undo_Gate_In", async ({ page }) => {
  test.setTimeout(120_000);

  const Vehicle_No = generateVehicleNumber();
  let containerNo = "";

  // =========================
  // STEP 1: Login
  // =========================
  await test.step("Login to application", async () => {
    await login(page);
  });

  // =========================
  // STEP 2: Navigate to Empty Container
  // =========================
  await test.step("Navigate to Empty Container screen", async () => {
    await clickAndMeasureDynamic(
      page,
      '(//img[@alt="Gate Operations Logo"])[1]',
      '//button[normalize-space()="Standard Services"]',
      "Route to Gate Operations",
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Standard Services"]',
      '//a[normalize-space()="Empty Container"]',
      "Route to Empty Container tab",
    );

    await clickAndMeasureDynamic(
      page,
      '//a[normalize-space()="Empty Container"]',
      '//input[contains(@placeholder, "Search by container no.")]',
      "Route to Empty Container screen",
    );
  });

  // =========================
  // STEP 3: Fetch Container
  // =========================
  await test.step("Fetch container from artifact and search", async () => {
    containerNo = await readTestArtifact("EmptyIn_Container_MNR.txt");

    console.log("Using container number:", containerNo);

    await page
      .locator('//input[contains(@placeholder, "Search by container no.")]')
      .fill(containerNo);

    await page.locator('//button[normalize-space()="Search"]').click();

    await clickAndMeasureDynamic(
      page,
      `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,
      '//button[normalize-space()="Edit"]',
      "Open container record",
    );

    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Edit"]',
      '//div[label[contains(., "Vehicle No")]]//input',
      "Open Edit screen",
    );
  });

  // =========================
  // STEP 4: Fill Container Details
  // =========================
  await test.step("Fill container details form", async () => {
    // Vehicle
    await page
      .locator('//div[label[contains(., "Vehicle No")]]//input')
      .fill(Vehicle_No);

    // Transport
    await page
      .locator(
        'app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]',
      )
      .click();
    await page.locator('//div[@class="dropdown-list"]//div[1]').click();

    // Basic fields
    await page
      .locator("//div[label[contains(., 'Tare Weight')]]//input")
      .fill("2500");
    await page
      .locator("//div[label[contains(., 'Damage Details')]]//input")
      .fill("No visible damage");
    await page
      .locator("//div[label[contains(., 'Max Permissible Weight')]]//input")
      .fill("30000");
    await page
      .locator("//div[label[contains(., 'Truck RFID No.')]]//input")
      .fill("RFID0001");

    // Survey Remark
    await page
      .locator(
        '//label[normalize-space()="Container Survey Remark"]/following::input[1]',
      )
      .fill(ContainerSurveyRemark);

    writeTestArtifact("Depot_Estimate_SurveyRemark.txt", ContainerSurveyRemark);

    await page
      .locator(
        'app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]',
      )
      .click();
    await page
      .locator(
        `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,
      )
      .click();

    // Other fields
    await page
      .locator("//div[label[contains(., 'EIR No.')]]//input")
      .fill("EIR20260109");
    await page
      .locator("//div[label[contains(., 'Port Exit Pass No.')]]//input")
      .fill("PEP123456");

    await page
      .locator("//div[label[contains(., 'Port Out Date Time')]]//input")
      .fill("2026-01-09T11:10");

    await page
      .locator("//div[label[contains(., 'CFS Gate In Date Time')]]//input")
      .fill("2026-01-09T11:15");

    // Condition Code
    await page
      .locator('//div[normalize-space()="Select Condition Code"]')
      .first()
      .click();
    await page
      .locator(
        '//app-searchable-dropdown//input[@placeholder="Select Condition Code"]',
      )
      .fill("Available");
    await page
      .locator('//div[contains(@class, "dropdown-item")]')
      .first()
      .click();

    // Port
    await page
      .locator(
        '//div[normalize-space()="Select Port Name And Threshold Limit"]',
      )
      .first()
      .click();
    await page
      .locator(
        '//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]',
      )
      .fill("BPCL");
    await page
      .locator('//div[contains(@class, "dropdown-item")]')
      .first()
      .click();

    // Save
    // await page.locator('//button[normalize-space()="Save"]').click();
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Save"]',
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
      "Wait for save to complete",
    );
  });

  // =========================
  // STEP 5: Validate Record Actions
  // =========================
  await test.step("Validate and Execute container", async () => {
    const validateBtn = page.locator(
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
    );

    await expect(validateBtn).toBeVisible();

    await validateBtn.click();

    const executeBtn = page.locator(
      `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,
    );

    await expect(executeBtn).toBeVisible();

    await executeBtn.click();
  });

  // ===============================
  // STEP 6: Navigate to Executed Containers Screen
  // ===============================

  await test.step("Navigate to Executed Containers Screen", async () => {
    await clickAndMeasureDynamic(
      page,
      '//button[normalize-space()="Executed Container"]',
      '//input[contains(@placeholder, "Container No")]',
      "Open Executed Containers screen",
    );

    await page
      .locator('//input[contains(@placeholder, "Container No")]')
      .fill(containerNo);
    await page.locator('//button[normalize-space()="Search"]').click();

    await page
      .locator(
        `(//tr[td[2][normalize-space()="${containerNo}"]]//button[normalize-space()="Undo Gate In"])`,
      )
      .waitFor();

    await page
      .locator(
        `(//tr[td[2][normalize-space()="${containerNo}"]]//button[normalize-space()="Undo Gate In"])`,
      )
      .click();

    await page
      .locator(
        '//button[contains(@class,"undo-bar-btn--confirm") and normalize-space()="Undo Gate In"]',
      )
      .waitFor();

    await clickAndMeasureDynamic(
      page,
      '//button[contains(@class,"undo-bar-btn--confirm") and normalize-space()="Undo Gate In"]',
      '//button[normalize-space()="Container"]',
      "Confirm Undo Gate In",
    );

    // ===============================
    // STEP 7: Validate container is not present in Executed Containers screen
    // ===============================

    await test.step("Validate container is present in Empty Container tab after Undo Gate In", async () => {
      
      await page
        .locator('//input[contains(@placeholder, "Container No")]')
        .fill(containerNo);
      await page.locator('//button[normalize-space()="Search"]').click();


      const containerRow = page.locator(
      `//tr[.//td[contains(normalize-space(),"${containerNo}")]]`
    );

    // Wait for search results to refresh
    await page.waitForLoadState('networkidle');

    await expect(
      containerRow,
      `Container ${containerNo} should not exist in Executed Containers screen after Undo Gate In`
    ).toHaveCount(0);

    console.log(
      `✅ Container ${containerNo} is removed from Executed Containers screen after Undo Gate In`
    );
    });
  });
});
