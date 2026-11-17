export const GateImport = {
    Logo: "//img[@alt='Gate Operations Logo']",
    Service: "//button[normalize-space()='Standard Service']",
    Import: "//a[normalize-space()='Import Container']",
    ImContainer: (containerNo: string) => `//tr[td[contains(., '${containerNo}')]]//a[normalize-space(text())="TBA"]`,
    Edit: "//button[normalize-space()='Edit']",
    VehicleNo: "//label[contains(., 'Vehicle No')]/following-sibling::input",
    Transport: "app-searchable-dropdown[ng-reflect-placeholder='Select Transport']",
    List: "//div[@class='dropdown-list']//div[1]",
    TareWeight: "//div[label[contains(., 'Tare Weight')]]//input",
    Damage: "//div[label[contains(., 'Damage Details')]]//input",
    MaxWeight: "//div[label[contains(., 'Max Permissible Weight')]]//input",
    Seal: "//div[label[contains(., 'Custom / Actual Seal')]]//input",
    IGMSeal: "//div[label[contains(., 'IGM Seal No.')]]//input",
    TruckRFID: "//div[label[contains(., 'Truck RFID No.')]]//input",
    Remark: "app-searchable-dropdown[ng-reflect-placeholder='Select Survey Remark']",
    SelectRemark: (surveyRemark: string) => `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,
    EIRNo: "//div[label[contains(., 'EIR No.')]]//input",
    Port: "//div[text()='Select Port Name And Threshold Limit']",
    PortList: "//app-searchable-dropdown//input[@placeholder='Select Port Name And Threshold Limit']",
    ListClick: "//div[contains(@class,'dropdown-item')]",
    PExit: "//div[label[contains(., 'Port Exit Pass No.')]]//input",
    OutDate: "//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']",
    InDate: "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']",
    TransNo: "//div[label[contains(., 'Port Trans No')]]//input",
    Scan: "//div[label[contains(., 'Scan Status')]]//input[@type='checkbox']",
    Hold: "//div[label[contains(., 'Is Hold?')]]//input[@type='checkbox']",
    Weightment: "//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']",
    Trailer: "//div[label[contains(., 'Semi Low Bed Trailer Required')]]//input[@type='checkbox']",
    Save: "//button[normalize-space()='Save']",
    Validate: (Vehicle_No: string) => `//tr[td//a[normalize-space()='${Vehicle_No}']]//button[normalize-space()="Validate"]`,
    Execute: (Vehicle_No: string) => `//tr[td//a[normalize-space()='${Vehicle_No}']]//button[normalize-space()="Execute"]`,
    Container: "//a[normalize-space()='Import Container']",
    ValidateBT:(BareTruckIn:string)=>  `//tr[td//a[normalize-space()='${BareTruckIn}']]//button[normalize-space()="Validate"]`,
    ExecuteBT :(BareTruckIn:string) => `//tr[td//a[normalize-space()='${BareTruckIn}']]//button[normalize-space()="Execute"]`,
    GateIn : "//span[normalize-space()='Gate In']/following-sibling::label",
    Search : "//button[normalize-space()='Search']",
    SearchCon : "//input[@placeholder='Search by container no']",
    









}