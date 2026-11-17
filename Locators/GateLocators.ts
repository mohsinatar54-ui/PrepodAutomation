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
    Transportdropdown1:'//app-searchable-dropdown[@formcontrolname="transporter"]//div[@class="dropdown-input"]',
    TransportDropdownFirst: '//div[@class="dropdown-list"]//div[1]',
    TareWeightInput: "//div[label[contains(., 'Tare Weight')]]//input",
    DamageDetailsInput: "//div[label[contains(., 'Damage Details')]]//input",
    MaxPermissibleWeightInput: "//div[label[contains(., 'Max Permissible Weight')]]//input",
    CustomSealInput: "//div[label[contains(., 'Custom / Actual Seal')]]//input",
    IGMSealInput: "//div[label[contains(., 'IGM Seal No.')]]//input",
    TruckRFIDInput: "//div[label[contains(., 'Truck RFID No.')]]//input",
    SurveyRemarkDropdown: 'app-searchable-dropdown[ng-reflect-placeholder="Select Survey Remark"]',
    ServeyRemarkoption1:'//div[@class="dropdown-list"]//div[1]',
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
    DepotQualityCODE:'//label[text()=" Depot Quality Code "]/following-sibling::app-searchable-dropdown',
    DepotQualityCODE1:'//label[text()=" Depot Quality Code"]/following-sibling::app-searchable-dropdown',
    SearchbybookingNo:'//input[@placeholder="Search by booking no."]',
    Gate:'//label[text()=" Gate"]/following-sibling::app-searchable-dropdown',
    EmptyYard:'//app-searchable-dropdown[@formcontrolname="yardStop"]',
    MFGdate:'//input[@id="manufacturedDate"]',
    DepotSize:'//app-searchable-dropdown[@formcontrolname="depotSize"]',
    ISOSize:'//app-searchable-dropdown[@formcontrolname="isoSize"]',
    Selectholdtype:'//app-searchable-dropdown[@ng-reflect-field-name="holdType"]',
    HoldComment:'//label[text()=" Hold Comments "]/following-sibling::input'
    
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
    SurveyRemarkDropdown: '//app-searchable-dropdown[@ng-reflect-placeholder="Select Survey Remark"]',
    SurveyRemarkOption: (surveyRemark: string) => `//div[@class="dropdown-list"]//div[normalize-space()="${surveyRemark}"]`,

    EIRNoInput: "//div[label[contains(., 'EIR No.')]]//input",
    PortExitPassInput: "//div[label[contains(., 'Port Exit Pass No.')]]//input",
    PortOutDateTimeInput: "//div[label[contains(., 'Port Out Date Time')]]//input[@type='datetime-local']",
    CFSGateInDateTimeInput: "//div[label[contains(., 'CFS Gate In Date Time')]]//input[@type='datetime-local']",

     PortNameDropdown: '//label[text()=" Port Name And Threshold Limit "]/following-sibling::app-searchable-dropdown',
     PortNameInput: '//input[@placeholder="Select Port Name And Threshold Limit"]',
     PortNameFirstOption: '//label[text()=" Port Name And Threshold Limit "]/following-sibling::app-searchable-dropdown//div',
    EmptyYard: '//app-searchable-dropdown[@ng-reflect-field-name="yardStopID"]',
    EmptyYardFirstOption: '//div[@class="dropdown-list"]//div[1]',
    ManufactureDate: "//label[contains(normalize-space(),'Manufacture Date')]/following::input[@type='date'][1]",
    SaveButton: '//button[normalize-space()="Save"]',
    ValidateButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
    ExecuteButton: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,
    Planned_Out_Weighbridge:'//label[text()=" Planned Out Weighbridge "]/following-sibling::app-searchable-dropdown',
    Planned_out_Weighbridge_input:'//input[@placeholder="Select Planned Out Weighbridge"]',
    Planned_Out_Weighbridge_option:'//label[text()=" Planned Out Weighbridge "]/following-sibling::app-searchable-dropdown//div[4]',
    Planned_In_Weighbridge_input:'//input[@placeholder="Select Planned In Weighbridge"]',
    Planned_in_Weighbridgenew:'//label[text()=" Planned In Weighbridge "]/following-sibling::app-searchable-dropdown', 
    Planned_in_Weighbridge_option1:'//label[text()=" Planned In Weighbridge "]/following-sibling::app-searchable-dropdown//div[4]'

}
export const GateExport = {
  //  GateOperationsLogo: '//img[@alt="Gate Operations Logo"]',
  //  StandardServicesButton: '//button[normalize-space()="Standard Services"]',
    CargoButton: '//button[normalize-space()="Cargo"]',
    ExportCargoLink: '//a[normalize-space()="Export Cargo"]',
    SearchByBookingInput: '//input[@placeholder="Search by booking no."]',
    SearchButton: '//button[normalize-space()="Search"]',
    ValidateButtonE: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Validate"]`,
    ExecuteButtonE: (Vehicle_No: string) => `//tr[td//a[normalize-space()="${Vehicle_No}"]]//button[normalize-space()="Execute"]`,
    ContainerButton: '//button[normalize-space()="Container"]',
    GateOuttoggle:'//span[normalize-space()="Gate In"]/following-sibling::label',
    GateExportBNsearch:'//input[@placeholder="Search by booking no."]',
    Exportcontainerbutton:'//a[text()=" Export Container "]',

};


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