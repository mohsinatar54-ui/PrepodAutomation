export const GateCommon = {
    SaveButton: '//button[normalize-space()="Save"]',
    ValidateButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
    ExecuteButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,
    GateWeighbridgeLogo: '//img[@alt="Gate Operations Logo"]',
    StandardServicesBtn: '//button[normalize-space()="Standard Services"]',
    EditButton: '//button[normalize-space()="Edit"]',
    ToggleButton: '//span[normalize-space()="Gate In"]/following-sibling::label/div',
    Masters: '//button[normalize-space()="Masters"]',
    GateToggle: '//span[normalize-space()="Gate In"]/following-sibling::label',
}

export const GateImport = {
    ImportContainerTab: '//a[normalize-space()="Import Container"]',
    TBAButton: (containerNo: string) => `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,  
    VehicleNoInput: '//div[label[contains(., "Vehicle No")]]//input',
    // TransportDropdown: '//app-searchable-dropdown[@ng-reflect-placeholder="Select Transport"]',
    TransportDropdown: '//app-searchable-dropdown[@ng-reflect-field-name="transport"]//div[@class="dropdown-input"]',
    TransportDropdownFirst: '//div[@class="dropdown-list"]//div[1]',
    TareWeightInput: "//div[label[contains(., 'Tare Weight')]]//input",
    DamageDetailsInput: "//div[label[contains(., 'Damage Details')]]//input",
    MaxPermissibleWeightInput: "//div[label[contains(., 'Max Permissible Weight')]]//input",
    CustomSealInput: "//div[label[contains(., 'Custom / Actual Seal')]]//input",
    IGMSealInput: "//div[label[contains(., 'IGM Seal No.')]]//input",
    TruckRFIDInput: "//div[label[contains(., 'Truck RFID No.')]]//input",
    SurveyRemarkDropdown: 'app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]',
    // SurveyRemarkOption: (surveyRemark: string) => `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,
    SurveyRemarkOption: (surveyRemark: string) => `//div[normalize-space()="${surveyRemark}"]`,
    EIRNoInput: "//div[label[contains(., 'EIR No.')]]//input",
    // PortNameDropdown: '//div[text()=" Select Port Name And Threshold Limit "]',
    OperatorConditionCode: '//app-searchable-dropdown[@ng-reflect-field-name="operatorConditionCode"]',
    OperatorCCFirstOption: '//div[@class="dropdown-list"]//div[1]',
    DepotConditionCode: '//app-searchable-dropdown[@ng-reflect-field-name="ConditionCode"]',
    DepotCCFirstOption: '//div[@class="dropdown-list"]//div[1]',
    DepotQualityCode: '//app-searchable-dropdown[@ng-reflect-field-name="depotQualityID"]',
    DepotQCFirstOption: '//div[@class="dropdown-list"]//div[1]',
    PortNameDropdown: '//app-searchable-dropdown[@ng-reflect-field-name="portName"]',
    // PortNameInput: '//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]',
    PortNameInput: '//app-searchable-dropdown[@ng-reflect-field-name="portName"]//input',
    PortNameFirstOption: '//div[contains(@class, "dropdown-item")]',
    PortExitPassInput: "//div[label[contains(., 'Port Exit Pass No.')]]//input",
    PortOutDateTimeInput: "//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']",
    CFSGateInDateTimeInput: "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']",
    PortTransNoInput: "//div[label[contains(., 'Port Trans No')]]//input",
    IsWeighmentCheckbox: "//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']",
}


export const GateEmpty = {
    EmptyContainerTab: '//a[normalize-space()="Empty Container"]',
    SearchByContainerInput: '//input[@placeholder="Search by container no."]',
    SearchButton: '//button[normalize-space()="Search"]',
    TBAButton: (containerNo: string) => `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,
    EditButton: '//button[normalize-space()="Edit"]',
    VehicleNoInput: '//div[label[contains(., "Vehicle No")]]//input',
    VehicleNoEditInput: '//label[contains(., "Vehicle No")]/following-sibling::input',
    TBAbutton1:'//a[text()="TBA"]',

    TransportDropdown: 'app-searchable-dropdown[ng-reflect-placeholder="Select Transport"]',
    TransportDropdownFirst: '//div[@class="dropdown-list"]//div[1]',
    PlannedInWeighbridge:'//input[@placeholder="Select Planned In Weighbridge"]',
    PlannedInWeighbridgefirst:'//div[@class="dropdown-list"]//div[1]',
    TareWeightInput: "//div[label[contains(., 'Tare Weight')]]//input",
    DamageDetailsInput: "//div[label[contains(., 'Damage Details')]]//input",
    MaxPermissibleWeightInput: "//div[label[contains(., 'Max Permissible Weight')]]//input",
    TruckRFIDInput: "//div[label[contains(., 'Truck RFID No.')]]//input",

    HoldComments: "//label[contains(normalize-space(),'Hold Comments')]/following::input[1]",
    SurveyRemarkDropdown: 'app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]',
    SurveyRemarkOption: (surveyRemark: string) => `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,

    EIRNoInput: "//div[label[contains(., 'EIR No.')]]//input",
    PortExitPassInput: "//div[label[contains(., 'Port Exit Pass No.')]]//input",
    PortOutDateTimeInput: "//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']",
    CFSGateInDateTimeInput: "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']",

    PortNameDropdown: '//div[text()=" Select Port Name And Threshold Limit "]',
    PortNameInput: '//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]',
    PortNameFirstOption: '//div[contains(@class, "dropdown-item")]',
    EmptyYard: '//app-searchable-dropdown[@ng-reflect-field-name="yardStopID"]',
    EmptyYardFirstOption: '//div[@class="dropdown-list"]//div[1]',
    ManufactureDate: "//label[contains(normalize-space(),'Manufacture Date')]/following::input[@type='date'][1]",
    SaveButton: '//button[normalize-space()="Save"]',
    ValidateButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
    ExecuteButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,

}


// export const Common = {
//     SaveButton: '//button[normalize-space()="Save"]',
//     ValidateButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
//     ExecuteButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,
//     GateWeighbridgeLogo: '//img[@alt="Gate Operations Logo"]',
//     StandardServicesBtn: '//button[normalize-space()="Standard Services"]',
//     EditButton: '//button[normalize-space()="Edit"]',
// }

// export const GateImport = {
//     ImportContainerTab: '//a[normalize-space()="Import Container"]',
//     TBAButton: (containerNo: string) => `//tr[td[contains(., "${containerNo}")]]//a[normalize-space(text())="TBA"]`,  
//     VehicleNoInput: '//div[label[contains(., "Vehicle No")]]//input',
//     // TransportDropdown: '//app-searchable-dropdown[@ng-reflect-placeholder="Select Transport"]',
//     TransportDropdown: '//app-searchable-dropdown[@ng-reflect-field-name="transport"]//div[@class="dropdown-input"]',
//     TransportDropdownFirst: '//div[@class="dropdown-list"]//div[1]',
//     TareWeightInput: "//div[label[contains(., 'Tare Weight')]]//input",
//     DamageDetailsInput: "//div[label[contains(., 'Damage Details')]]//input",
//     MaxPermissibleWeightInput: "//div[label[contains(., 'Max Permissible Weight')]]//input",
//     CustomSealInput: "//div[label[contains(., 'Custom / Actual Seal')]]//input",
//     IGMSealInput: "//div[label[contains(., 'IGM Seal No.')]]//input",
//     TruckRFIDInput: "//div[label[contains(., 'Truck RFID No.')]]//input",
//     SurveyRemarkDropdown: 'app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]',
//     // SurveyRemarkOption: (surveyRemark: string) => `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,
//     SurveyRemarkOption: (surveyRemark: string) => `//div[normalize-space()="${surveyRemark}"]`,
//     EIRNoInput: "//div[label[contains(., 'EIR No.')]]//input",
//     // PortNameDropdown: '//div[text()=" Select Port Name And Threshold Limit "]',
//     PortNameDropdown: '//app-searchable-dropdown[@ng-reflect-field-name="portName"]',
//     // PortNameInput: '//app-searchable-dropdown//input[@placeholder="Select Port Name And Threshold Limit"]',
//     PortNameInput: '//app-searchable-dropdown[@ng-reflect-field-name="portName"]//input',
//     PortNameFirstOption: '//div[contains(@class, "dropdown-item")]',
//     PortExitPassInput: "//div[label[contains(., 'Port Exit Pass No.')]]//input",
//     PortOutDateTimeInput: "//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']",
//     CFSGateInDateTimeInput: "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']",
//     PortTransNoInput: "//div[label[contains(., 'Port Trans No')]]//input",
//     IsWeighmentCheckbox: "//div[label[contains(., 'Is Weighment?')]]//input[@type='checkbox']",
// }

// export const Empty = {
//     Logo : "//img[@alt='Customer Service Logo']",
   
// }

// export const Export = {
//    Logo : "//img[@alt='Customer Service Logo']",
   
// }