# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Export_Direct\TC005_GATE_EXPORT_EO9F.test.ts >> TC002 GATE EXPORT XITF
- Location: PreProd_Playwright_Automation\tests\Export_Direct\TC005_GATE_EXPORT_EO9F.test.ts:20:1

# Error details

```
TimeoutError: locator.click: Timeout 70000ms exceeded.
Call log:
  - waiting for locator('//div[@role="option"]//span[normalize-space()="West Terminal"]')
    - waiting for" https://preprod.logstarcloud.io/gate/AuthToken?Key=d3bbd928-57c5-4f17-ac55-e45eef4b0a69&browserOrigin=https%3A%2F%2Fpreprod.logstarcloud.io" navigation to finish...
    - navigated to "https://preprod.logstarcloud.io/gate/AuthToken?Key=d3bbd928-57c5-4f17-ac55-e45eef4b0a69&browserOrigin=https%3A%2F%2Fpreprod.logstarcloud.io"

```

```
Error: locator.waitFor: Test ended.
Call log:
  - waiting for locator('//input[@placeholder="Search by booking no"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: Gate & Weighbridge Operations
      - generic [ref=e8]: App Version - v1
    - generic [ref=e9]:
      - generic [ref=e10]: Welcome, Aditya Singh
      - img [ref=e13] [cursor=pointer]
    - generic [ref=e16]:
      - button "English" [ref=e18] [cursor=pointer]:
        - generic [ref=e19]: English
        - img [ref=e20]
      - generic [ref=e22]:
        - img [ref=e24] [cursor=pointer]
        - generic [ref=e27]: App Palette
      - generic [ref=e28]:
        - img [ref=e30] [cursor=pointer]
        - generic [ref=e33]: Logout
  - navigation [ref=e34]:
    - button "Dashboard" [ref=e35] [cursor=pointer]
    - button "Standard Services" [ref=e36] [cursor=pointer]
    - button "Express Services" [ref=e37] [cursor=pointer]
    - button "Weighbridge Execution" [ref=e38] [cursor=pointer]
    - button "Executed Operation" [ref=e39] [cursor=pointer]
    - button "Amendment" [ref=e40] [cursor=pointer]
    - button "Masters" [ref=e41] [cursor=pointer]
    - button "Reports" [ref=e42] [cursor=pointer]
    - button "Track & Trace" [ref=e43] [cursor=pointer]
    - button "Logs" [ref=e44] [cursor=pointer]
  - generic [ref=e45]:
    - generic [ref=e48]:
      - button "Container" [ref=e49] [cursor=pointer]
      - button "Cargo" [ref=e50] [cursor=pointer]
      - button "Dummy Gate Operations" [ref=e51] [cursor=pointer]
      - button "Executed Container" [ref=e52] [cursor=pointer]
      - button "Executed Cargo" [ref=e53] [cursor=pointer]
    - button [ref=e54] [cursor=pointer]:
      - img [ref=e55]
    - main [ref=e57]:
      - generic [ref=e58]:
        - generic [ref=e59]: Cargo
        - generic [ref=e62]:
          - navigation [ref=e64]:
            - link "Import Cargo" [ref=e65] [cursor=pointer]:
              - /url: /gate/standard-services/cargo/import
            - link "Export Cargo" [active] [ref=e66] [cursor=pointer]:
              - /url: /gate/standard-services/cargo/export
          - generic [ref=e69]:
            - generic [ref=e70]:
              - heading "Export Cargo" [level=2] [ref=e71]
              - generic [ref=e72]:
                - generic [ref=e73]: Gate In
                - checkbox [ref=e75]
                - generic [ref=e77]: Gate Out
            - generic [ref=e79]:
              - textbox "Search by booking no." [ref=e80]
              - textbox "Search by cargo no." [ref=e81]
              - button "Search" [ref=e82] [cursor=pointer]
              - button "Clear" [ref=e83] [cursor=pointer]
            - generic [ref=e86]:
              - generic [ref=e90]:
                - generic [ref=e91]: Show
                - combobox [ref=e92]:
                  - option "10" [selected]
                  - option "25"
                  - option "50"
                  - option "100"
                  - option "200"
                - generic [ref=e93]: Records per page.
                - generic [ref=e94]: "Total Records: 15"
              - table [ref=e97]:
                - rowgroup [ref=e98]:
                  - row "Vehicle Number ▲ Cargo No. ▲ Booking No. ▲ Activity Description ▲ Transport ▲ Planned Gate In ▲ Planned Gate Out ▲ Is Weighment ▲ Is Hazardous? ▲ Planned In Weighbridge ▲ Planned Out Weighbridge ▲ Transport Plan Date ▲ Job Order ID ▲ Operation ▲ Gate Pass No. Transport Pass No. ▲ B/L No. ▲ Action" [ref=e99]:
                    - columnheader [ref=e100]:
                      - checkbox [ref=e102] [cursor=pointer]
                    - columnheader "Vehicle Number ▲" [ref=e103] [cursor=pointer]
                    - columnheader "Cargo No. ▲" [ref=e104] [cursor=pointer]
                    - columnheader "Booking No. ▲" [ref=e105] [cursor=pointer]
                    - columnheader "Activity Description ▲" [ref=e106] [cursor=pointer]
                    - columnheader "Transport ▲" [ref=e107] [cursor=pointer]
                    - columnheader "Planned Gate In ▲" [ref=e108] [cursor=pointer]
                    - columnheader "Planned Gate Out ▲" [ref=e109] [cursor=pointer]
                    - columnheader "Is Weighment ▲" [ref=e110] [cursor=pointer]
                    - columnheader "Is Hazardous? ▲" [ref=e111] [cursor=pointer]
                    - columnheader "Planned In Weighbridge ▲" [ref=e112] [cursor=pointer]
                    - columnheader "Planned Out Weighbridge ▲" [ref=e113] [cursor=pointer]
                    - columnheader "Transport Plan Date ▲" [ref=e114] [cursor=pointer]
                    - columnheader "Job Order ID ▲" [ref=e115] [cursor=pointer]
                    - columnheader "Operation ▲" [ref=e116] [cursor=pointer]
                    - columnheader "Gate Pass No." [ref=e117] [cursor=pointer]
                    - columnheader "Transport Pass No. ▲" [ref=e118] [cursor=pointer]
                    - columnheader "B/L No. ▲" [ref=e119] [cursor=pointer]
                    - columnheader "Action" [ref=e120] [cursor=pointer]
                - rowgroup [ref=e121]:
                  - row "EO9F672734 6363307/6363307/ALUMN 13912BN20260806001EXP LOADED TRUCK IN WITH CARGO DUMMY TRANSPORTER - - - - 2026-08-07 05:29:00.0000000 8884 Gate In 060826083955888411 - - Validate" [ref=e122]:
                    - cell [ref=e123]:
                      - checkbox [ref=e125] [cursor=pointer]
                    - cell "EO9F672734" [ref=e126] [cursor=pointer]:
                      - generic [ref=e127]: EO9F672734
                    - cell "6363307/6363307/ALUMN" [ref=e128]
                    - cell "13912BN20260806001EXP" [ref=e129]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e130]
                    - cell "DUMMY TRANSPORTER" [ref=e131] [cursor=pointer]
                    - cell "-" [ref=e132] [cursor=pointer]
                    - cell "-" [ref=e133] [cursor=pointer]
                    - cell [ref=e134] [cursor=pointer]
                    - cell [ref=e137]
                    - cell "-" [ref=e140] [cursor=pointer]
                    - cell "-" [ref=e141] [cursor=pointer]
                    - cell "2026-08-07 05:29:00.0000000" [ref=e142]
                    - cell "8884" [ref=e143]
                    - cell "Gate In" [ref=e144]
                    - cell "060826083955888411" [ref=e145]
                    - cell "-" [ref=e146]
                    - cell "-" [ref=e147]
                    - cell "Validate" [ref=e148]:
                      - generic [ref=e149]:
                        - button "Edit" [ref=e150] [cursor=pointer]
                        - button "Validate" [ref=e152] [cursor=pointer]
                  - row "EO9F759834 9150339/9150339/ALUMN 67929BN20260805001EXP LOADED TRUCK IN WITH CARGO DUMMY TRANSPORTER - - - - 2026-08-06 05:29:00.0000000 8858 Gate In 050826125703885815 - - Validate" [ref=e153]:
                    - cell [ref=e154]:
                      - checkbox [ref=e156] [cursor=pointer]
                    - cell "EO9F759834" [ref=e157] [cursor=pointer]:
                      - generic [ref=e158]: EO9F759834
                    - cell "9150339/9150339/ALUMN" [ref=e159]
                    - cell "67929BN20260805001EXP" [ref=e160]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e161]
                    - cell "DUMMY TRANSPORTER" [ref=e162] [cursor=pointer]
                    - cell "-" [ref=e163] [cursor=pointer]
                    - cell "-" [ref=e164] [cursor=pointer]
                    - cell [ref=e165] [cursor=pointer]
                    - cell [ref=e168]
                    - cell "-" [ref=e171] [cursor=pointer]
                    - cell "-" [ref=e172] [cursor=pointer]
                    - cell "2026-08-06 05:29:00.0000000" [ref=e173]
                    - cell "8858" [ref=e174]
                    - cell "Gate In" [ref=e175]
                    - cell "050826125703885815" [ref=e176]
                    - cell "-" [ref=e177]
                    - cell "-" [ref=e178]
                    - cell "Validate" [ref=e179]:
                      - generic [ref=e180]:
                        - button "Edit" [ref=e181] [cursor=pointer]
                        - button "Validate" [ref=e183] [cursor=pointer]
                  - row "MH12QS1803 4323434/4323434/ALUMN 94970BN20260804001EXP LOADED TRUCK IN WITH CARGO DUMMY TRANSPORTER - - - - 2026-08-05 05:29:00.0000000 8797 Gate In 040826090422879735 - - Validate" [ref=e184]:
                    - cell [ref=e185]:
                      - checkbox [ref=e187] [cursor=pointer]
                    - cell "MH12QS1803" [ref=e188] [cursor=pointer]:
                      - generic [ref=e189]: MH12QS1803
                    - cell "4323434/4323434/ALUMN" [ref=e190]
                    - cell "94970BN20260804001EXP" [ref=e191]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e192]
                    - cell "DUMMY TRANSPORTER" [ref=e193] [cursor=pointer]
                    - cell "-" [ref=e194] [cursor=pointer]
                    - cell "-" [ref=e195] [cursor=pointer]
                    - cell [ref=e196] [cursor=pointer]
                    - cell [ref=e199]
                    - cell "-" [ref=e202] [cursor=pointer]
                    - cell "-" [ref=e203] [cursor=pointer]
                    - cell "2026-08-05 05:29:00.0000000" [ref=e204]
                    - cell "8797" [ref=e205]
                    - cell "Gate In" [ref=e206]
                    - cell "040826090422879735" [ref=e207]
                    - cell "-" [ref=e208]
                    - cell "-" [ref=e209]
                    - cell "Validate" [ref=e210]:
                      - generic [ref=e211]:
                        - button "Edit" [ref=e212] [cursor=pointer]
                        - button "Validate" [ref=e214] [cursor=pointer]
                  - row "TBA 6478597/6478597/ABB 90477BN20260803001EXP BARE TRUCK IN FOR CARGO OUT - - - - - 2026-08-04 05:29:00.0000000 8736 Gate In 030826093945873657 - - Validate" [ref=e215]:
                    - cell [ref=e216]:
                      - checkbox [ref=e218] [cursor=pointer]
                    - cell "TBA" [ref=e219] [cursor=pointer]:
                      - generic [ref=e220]: TBA
                    - cell "6478597/6478597/ABB" [ref=e221]
                    - cell "90477BN20260803001EXP" [ref=e222]
                    - cell "BARE TRUCK IN FOR CARGO OUT" [ref=e223]
                    - cell "-" [ref=e224] [cursor=pointer]
                    - cell "-" [ref=e225] [cursor=pointer]
                    - cell "-" [ref=e226] [cursor=pointer]
                    - cell [ref=e227] [cursor=pointer]
                    - cell [ref=e230]
                    - cell "-" [ref=e233] [cursor=pointer]
                    - cell "-" [ref=e234] [cursor=pointer]
                    - cell "2026-08-04 05:29:00.0000000" [ref=e235]
                    - cell "8736" [ref=e236]
                    - cell "Gate In" [ref=e237]
                    - cell "030826093945873657" [ref=e238]
                    - cell "-" [ref=e239]
                    - cell "-" [ref=e240]
                    - cell "Validate" [ref=e241]:
                      - generic [ref=e242]:
                        - button "Edit" [ref=e243] [cursor=pointer]
                        - button "Validate" [ref=e245] [cursor=pointer]
                  - row "34567 2345432/2345432/ALUMN 11495BN20260730001EXP LOADED TRUCK IN WITH CARGO - - - - - 2026-10-30 05:29:00.0000000 8644 Gate In 010826063143864434 - - Validate" [ref=e246]:
                    - cell [ref=e247]:
                      - checkbox [ref=e249] [cursor=pointer]
                    - cell "34567" [ref=e250] [cursor=pointer]:
                      - generic [ref=e251]: "34567"
                    - cell "2345432/2345432/ALUMN" [ref=e252]
                    - cell "11495BN20260730001EXP" [ref=e253]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e254]
                    - cell "-" [ref=e255] [cursor=pointer]
                    - cell "-" [ref=e256] [cursor=pointer]
                    - cell "-" [ref=e257] [cursor=pointer]
                    - cell [ref=e258] [cursor=pointer]
                    - cell [ref=e261]
                    - cell "-" [ref=e264] [cursor=pointer]
                    - cell "-" [ref=e265] [cursor=pointer]
                    - cell "2026-10-30 05:29:00.0000000" [ref=e266]
                    - cell "8644" [ref=e267]
                    - cell "Gate In" [ref=e268]
                    - cell "010826063143864434" [ref=e269]
                    - cell "-" [ref=e270]
                    - cell "-" [ref=e271]
                    - cell "Validate" [ref=e272]:
                      - generic [ref=e273]:
                        - button "Edit" [ref=e274] [cursor=pointer]
                        - button "Validate" [ref=e276] [cursor=pointer]
                  - row "MH43892 5734894/5734894/DRB 69746BN20260717001EXP LOADED TRUCK IN WITH CARGO Demo Logistics Pvt. Ltd. - - - - 2026-07-17 23:44:00.0000000 8171 Gate In 170726054548817110 200726065250817132e6b1 - Validate" [ref=e277]:
                    - cell [ref=e278]:
                      - checkbox [ref=e280] [cursor=pointer]
                    - cell "MH43892" [ref=e281] [cursor=pointer]:
                      - generic [ref=e282]: MH43892
                    - cell "5734894/5734894/DRB" [ref=e283]
                    - cell "69746BN20260717001EXP" [ref=e284]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e285]
                    - cell "Demo Logistics Pvt. Ltd." [ref=e286] [cursor=pointer]
                    - cell "-" [ref=e287] [cursor=pointer]
                    - cell "-" [ref=e288] [cursor=pointer]
                    - cell [ref=e289] [cursor=pointer]
                    - cell [ref=e292]
                    - cell "-" [ref=e295] [cursor=pointer]
                    - cell "-" [ref=e296] [cursor=pointer]
                    - cell "2026-07-17 23:44:00.0000000" [ref=e297]
                    - cell "8171" [ref=e298]
                    - cell "Gate In" [ref=e299]
                    - cell "170726054548817110" [ref=e300]
                    - cell "200726065250817132e6b1" [ref=e301]
                    - cell "-" [ref=e302]
                    - cell "Validate" [ref=e303]:
                      - generic [ref=e304]:
                        - button "Edit" [ref=e305] [cursor=pointer]
                        - button "Validate" [ref=e307] [cursor=pointer]
                  - row "MH8079 3452345/4576878/DRB 93047BN20260710001EXP LOADED TRUCK IN WITH CARGO Demo Logistics Pvt. Ltd. - - - - 2026-07-11 04:12:00.0000000 7910 Gate In 100726101412791071 - - Validate" [ref=e308]:
                    - cell [ref=e309]:
                      - checkbox [ref=e311] [cursor=pointer]
                    - cell "MH8079" [ref=e312] [cursor=pointer]:
                      - generic [ref=e313]: MH8079
                    - cell "3452345/4576878/DRB" [ref=e314]
                    - cell "93047BN20260710001EXP" [ref=e315]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e316]
                    - cell "Demo Logistics Pvt. Ltd." [ref=e317] [cursor=pointer]
                    - cell "-" [ref=e318] [cursor=pointer]
                    - cell "-" [ref=e319] [cursor=pointer]
                    - cell [ref=e320] [cursor=pointer]
                    - cell [ref=e323]
                    - cell "-" [ref=e326] [cursor=pointer]
                    - cell "-" [ref=e327] [cursor=pointer]
                    - cell "2026-07-11 04:12:00.0000000" [ref=e328]
                    - cell "7910" [ref=e329]
                    - cell "Gate In" [ref=e330]
                    - cell "100726101412791071" [ref=e331]
                    - cell "-" [ref=e332]
                    - cell "-" [ref=e333]
                    - cell "Validate" [ref=e334]:
                      - generic [ref=e335]:
                        - button "Edit" [ref=e336] [cursor=pointer]
                        - button "Validate" [ref=e338] [cursor=pointer]
                  - row "TBA 4844864/4844864/GEN 79419BN20260709001EXP LOADED TRUCK IN WITH CARGO - - - - - 2026-08-10 05:29:00.0000000 7837 Gate In 090726061918783780 - - Validate" [ref=e339]:
                    - cell [ref=e340]:
                      - checkbox [ref=e342] [cursor=pointer]
                    - cell "TBA" [ref=e343] [cursor=pointer]:
                      - generic [ref=e344]: TBA
                    - cell "4844864/4844864/GEN" [ref=e345]
                    - cell "79419BN20260709001EXP" [ref=e346]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e347]
                    - cell "-" [ref=e348] [cursor=pointer]
                    - cell "-" [ref=e349] [cursor=pointer]
                    - cell "-" [ref=e350] [cursor=pointer]
                    - cell [ref=e351] [cursor=pointer]
                    - cell [ref=e354]
                    - cell "-" [ref=e357] [cursor=pointer]
                    - cell "-" [ref=e358] [cursor=pointer]
                    - cell "2026-08-10 05:29:00.0000000" [ref=e359]
                    - cell "7837" [ref=e360]
                    - cell "Gate In" [ref=e361]
                    - cell "090726061918783780" [ref=e362]
                    - cell "-" [ref=e363]
                    - cell "-" [ref=e364]
                    - cell "Validate" [ref=e365]:
                      - generic [ref=e366]:
                        - button "Edit" [ref=e367] [cursor=pointer]
                        - button "Validate" [ref=e369] [cursor=pointer]
                  - row "TMO2 7867867/7867867/AGR 54113BN20260625001EXP LOADED TRUCK IN WITH CARGO SUPER HIGHWAY LOGISTICS - - - - 2026-07-26 05:29:00.0000000 7406 Gate In 250626064326740663 3006260157537406101f6d - Validate" [ref=e370]:
                    - cell [ref=e371]:
                      - checkbox [ref=e373] [cursor=pointer]
                    - cell "TMO2" [ref=e374] [cursor=pointer]:
                      - generic [ref=e375]: TMO2
                    - cell "7867867/7867867/AGR" [ref=e376]
                    - cell "54113BN20260625001EXP" [ref=e377]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e378]
                    - cell "SUPER HIGHWAY LOGISTICS" [ref=e379] [cursor=pointer]
                    - cell "-" [ref=e380] [cursor=pointer]
                    - cell "-" [ref=e381] [cursor=pointer]
                    - cell [ref=e382] [cursor=pointer]
                    - cell [ref=e385]
                    - cell "-" [ref=e388] [cursor=pointer]
                    - cell "-" [ref=e389] [cursor=pointer]
                    - cell "2026-07-26 05:29:00.0000000" [ref=e390]
                    - cell "7406" [ref=e391]
                    - cell "Gate In" [ref=e392]
                    - cell "250626064326740663" [ref=e393]
                    - cell "3006260157537406101f6d" [ref=e394]
                    - cell "-" [ref=e395]
                    - cell "Validate" [ref=e396]:
                      - generic [ref=e397]:
                        - button "Edit" [ref=e398] [cursor=pointer]
                        - button "Validate" [ref=e400] [cursor=pointer]
                  - row "TBA 7867867/7867867/AGR 54113BN20260625001EXP LOADED TRUCK IN WITH CARGO SUPER HIGHWAY LOGISTICS - - - - 2026-07-26 05:29:00.0000000 7406 Gate In 250626064310740618 - - Validate" [ref=e401]:
                    - cell [ref=e402]:
                      - checkbox [ref=e404] [cursor=pointer]
                    - cell "TBA" [ref=e405] [cursor=pointer]:
                      - generic [ref=e406]: TBA
                    - cell "7867867/7867867/AGR" [ref=e407]
                    - cell "54113BN20260625001EXP" [ref=e408]
                    - cell "LOADED TRUCK IN WITH CARGO" [ref=e409]
                    - cell "SUPER HIGHWAY LOGISTICS" [ref=e410] [cursor=pointer]
                    - cell "-" [ref=e411] [cursor=pointer]
                    - cell "-" [ref=e412] [cursor=pointer]
                    - cell [ref=e413] [cursor=pointer]
                    - cell [ref=e416]
                    - cell "-" [ref=e419] [cursor=pointer]
                    - cell "-" [ref=e420] [cursor=pointer]
                    - cell "2026-07-26 05:29:00.0000000" [ref=e421]
                    - cell "7406" [ref=e422]
                    - cell "Gate In" [ref=e423]
                    - cell "250626064310740618" [ref=e424]
                    - cell "-" [ref=e425]
                    - cell "-" [ref=e426]
                    - cell "Validate" [ref=e427]:
                      - generic [ref=e428]:
                        - button "Edit" [ref=e429] [cursor=pointer]
                        - button "Validate" [ref=e431] [cursor=pointer]
              - list [ref=e437]:
                - listitem "Previous Page" [ref=e438]:
                  - button "Previous Page" [disabled] [ref=e439]:
                    - img [ref=e441]
                - listitem "1" [ref=e443] [cursor=pointer]:
                  - generic [ref=e444]: "1"
                - listitem "2" [ref=e445] [cursor=pointer]:
                  - generic [ref=e446]: "2"
                - listitem "Next Page" [ref=e447] [cursor=pointer]:
                  - button "Next Page" [ref=e448]:
                    - img [ref=e450]
  - contentinfo [ref=e452]:
    - generic [ref=e453]: App Version - v1
    - generic [ref=e454]:
      - text: Copyright © 2026 Envecon LDA, Lisbon, Portugal. All Rights Reserved.
      - link "www.envecon.com" [ref=e455] [cursor=pointer]:
        - /url: https://www.envecon.com
    - generic [ref=e456]:
      - paragraph [ref=e457]: Product by
      - img "Envecon Logo" [ref=e458]
```

# Test source

```ts
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
  89  |   await page.waitForSelector("text=Loading...", { state: 'hidden', timeout: 300000 });
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
> 114 |   await page.locator(afterSelector).waitFor({ state: 'visible', timeout: 300000 });
      |                                     ^ Error: locator.waitFor: Test ended.
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
  190 | export default HtmlNamerReporter;
  191 | 
  192 | /**
  193 |  * Retrieves the currently executed test file name (without extension).
  194 |  * Useful for naming reports based on the running test file.
  195 |  */
  196 | export function getTestFileName(): string {
  197 |   // Try Playwright context (process.env.TEST_FILE if set by runner)
  198 |   if (process.env.TEST_FILE) {
  199 |     const filePath = process.env.TEST_FILE;
  200 |     return filePath.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
  201 |   }
  202 | 
  203 |   // Try parsing from process.argv, looking for first *.test.ts entry
  204 |   const testFileArg = process.argv.find(arg =>
  205 |     /(\.test\.ts|\.spec\.ts)$/i.test(arg)
  206 |   );
  207 |   if (testFileArg) {
  208 |     return testFileArg.split(/[\\/]/).pop()!.replace(/\.[^/.]+$/, "");
  209 |   }
  210 | 
  211 |   // Try to check call stack (fallback)
  212 |   const original = Error.prepareStackTrace;
  213 |   try {
  214 |     const err = new Error();
```