import { test, expect } from '@playwright/test';
import { clickAndMeasureDynamic, SwitchModule, login, MOTL, readTestArtifact, getRandomNumberString, writeTestArtifact,selectEntityAndSite } from '../../utils/test-helpers';
import fs from 'fs';
import { Express_Gate_in } from 'Flows/ExportFlow';


const Transporter = 'ADITYA LOGISTICS';
const   Activity = 'EITP';
const   Driver = 'MJ';
const   Driver_Licence_No = 'MJ420';
const   Operator = 'MAERSKLINE';
const   Depot_Size = '20 STD'
const   ISO_Size = '22G1'
const   Primary_AC_Holder = 'MMJ LOGISTICS'
const   Depot_Condition_Code = 'Damage'

function generateVehicleNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `MH46${randomLetters}${randomDigits}`;
}
const Condition_Remark = 'Condition OK';
const Vehicle_No = generateVehicleNumber();

// Container number artifact file
test('TC002_GATE_EXPRESS.test', async ({ page }) => {
  test.setTimeout(200_000); // 2 minutes

  const loginPage = await login(page);
  await selectEntityAndSite(loginPage);
  await Express_Gate_in(loginPage);

  });

  

