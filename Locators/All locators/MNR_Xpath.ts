export const MNR_Xpath = {

  // ===== Navigation =====
  MNR_LOGO: '//div//img[@alt="Container Maintenance & Repair Logo"]',
  CONTAINER_BUTTON: '//button[normalize-space()="Container"]',
  EXTERNAL_CONTAINERS_BUTTON: '//button[normalize-space()="External Containers"]',
  NEW_CONTAINER_BUTTON: '//button[normalize-space()="+ New Container"]',

  // ===== Container Creation =====
  OPERATOR_DROPDOWN: '//select[@formcontrolname="OperatorId"]',
  DEPOT_SIZE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="OPSSizeType"]',
  DEPOT_SIZE_INPUT: '//input[@placeholder="Select Depot Size/Type"]',

  ISO_SIZE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="SzTypeId"]',
  ISO_SIZE_INPUT: '//input[@placeholder="Select ISO Size Type"]',

  CONTAINER_NUMBER_INPUT: '//input[@formcontrolname="ContainerNo"]',
  QUALITY_DROPDOWN: '//select[@formcontrolname="QualityId"]',

  // Dynamic dropdown option
  DROPDOWN_OPTION: (value: string) =>
    `//div[@class="dropdown-list"]//div[normalize-space()="${value}"]`,
  DROPDOWN_OPTION1:'(//div[@class="dropdown-list"]//div)[1]',
  RESPONSIBLE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="Responsible"]',
  DOPTION: (value: string) => `//div[contains(@class,"dropdown-list")]//div[normalize-space()="${value}"]`,
  ADD_BUTTON: '//button[normalize-space()="Add"]',
  CONTAINER_LIST: '//app-view-container-list',

  // Dynamic container number in table
  CONTAINER_NUMBER_LINK: (containerNumber: string) =>
    `//table/tbody/tr/td[1]/a[normalize-space(.)="${containerNumber}"]`,

  CONTAINER_ROW: (containerNumber: string) =>
    `//table/tbody/tr[td[1]/a[normalize-space(.)="${containerNumber}"]]`,

  // ===== Repair Details =====
  RESPONSIBLE_DROPDOWN1: '//app-searchable-dropdown[@formcontrolname="Responsible"]',
  RESPONSIBLE_INPUT: '//input[@placeholder="Select Responsible"]',

  CONTRACT_APPLICABLE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="ContractApplicable"]',
  CONTRACT_APPLICABLE_INPUT: '//input[@placeholder="Select Contract Applicable"]',

  RESPONSIBLE_PARTY_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="ResponsibleParty"]',
  RESPONSIBLE_PARTY_INPUT: '//input[@placeholder="Select Responsible Party"]',

  COMPONENT_CODE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="CompCode"]',
  COMPONENT_CODE_INPUT: '//input[@placeholder="Select Component Code"]',

  REPAIR_MODE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]',
  REPAIR_MODE_INPUT: '//input[@placeholder="Select Repair Mode"]',

  MATERIAL_CODE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="MaterialCode"]',
  MATERIAL_CODE_INPUT: '//input[@placeholder="Select Material Code"]',

  LOCATION_CODE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="LocationCode"]',
  LOCATION_CODE_INPUT: '//input[@placeholder="Select Location Code"]',

  DAMAGE_CODE_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="DamageCode"]',
  DAMAGE_CODE_INPUT: '//input[@placeholder="Select Damage Code"]',

  LABOUR_RATE_INPUT: '//input[@formcontrolname="LabourRate"]',
  QTY_INPUT: '//input[@formcontrolname="Qty"]',

  ADD_TO_GRID_BUTTON: '//button[normalize-space()="Add To Grid"]',

  // ===== Estimate Details =====
  ESTIMATE_DONE_BY_DROPDOWN: '//select[@formcontrolname="EstimateDoneBy"]',
  SEND_RESPONSIBLE_PARTY_DROPDOWN: '//select[@formcontrolname="sendResponsibleParty"]',

  SAVE_BUTTON: '//button[normalize-space()="Save"]',
  SUBMIT_BUTTON: '//button[normalize-space()="Submit"]',
  SUBMIT_BUTTON_SPACED: '//button[text()=" Submit "]',

  APPROVE_BUTTON: '//button[normalize-space()="Approve"]',
  APPROVE_BUTTON_SPACED:'//button[text()="Approve"]',
   APPROVE_BUTTON1:'(//button[text()="Approve"])[1]',
  Completed_tag:'//span[text()="Completed"]',

  // ===== Work Order =====
  SELECTED_FOREMAN_DROPDOWN: '//select[@formcontrolname="selectedForemanId"]',
  UPDATE_WORK_ORDER_BUTTON: '//button[text()="Update Work Order"]',
  NO_BUTTON: '//button[text()="No"]',
  INSERT_BUTTON: '//button[normalize-space()="Insert"]',
  COMPLETE_JOB_ORDER_BUTTON: '//button[normalize-space()="Complete Job Order"]',
  PART_NUMBER_DROPDOWN: '//app-searchable-dropdown[@formcontrolname="PartNumber"]',
   PART_NUMBER_OPTION: '(//div[@class="dropdown-list"]//div)[1]',
  // ===== Final Validation =====
  CREATED_CONTAINER_LINK: (containerNumber: string) =>
    `//td//a[normalize-space(.)="${containerNumber}"]`,

  Length:'//select[@formcontrolname="Length"]',
  Width:'//select[@formcontrolname="Width"]',
  LENGTH_DROPDOWN: '//select[@formcontrolname="Length"]',
  Startbutton:"//button[text()='Start']",
  Stopbutton:"//button[text()='Stop']", 

/// depot Container ////////////////////////

   mnrLogo: '//div//img[@alt="MNR Logo"]',
  containerButton: '//button[normalize-space()="Container"]',
  depotContainersButton: '//button[normalize-space()="Depot Containers"]',
  newContainerButton: '//button[normalize-space()="+ New Container"]',

  containerNumberInput: '//input[@formcontrolname="ContainerNo"]',
  estimateTypeSelect: '//select[@formcontrolname="EstimateType"]',
  qualityIdSelect: '//select[@formcontrolname="QualityId"]',
  damageIdSelect: '//select[@formcontrolname="DamageId"]',

  addButton: '//button[normalize-space()="Add"]',
  searchInput: '//input[@formcontrolname="search"]',

  locationCodeDropdown: '//app-searchable-dropdown[@formcontrolname="LocationCode"]',
  locationCodeInput: '//input[@placeholder="Select Location Code"]',
  locationCodeOption: (value:String) => `//div[@class="dropdown-list"]//div[text()=" ${value} "]`,

  repairModeDropdown: '//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]',
  repairModeFirstOption: '//app-searchable-dropdown[@formcontrolname="RepairModeCodedesc"]//*[@class="dropdown-list"]//div[1]',

  componentCodeDropdown: '//app-searchable-dropdown[@formcontrolname="CompCode"]',
  componentCodeInput: '//input[@placeholder="Select Component Code"]',
  componentCodeOption: (value:String) => `//div[@class="dropdown-list"]//div[text()=" ${value} "]`,

  damageTypeDropdown: '//app-searchable-dropdown[@formcontrolname="RP1"]',
  damageTypeInput: '//input[@placeholder="Select Damage Type"]',
  damageTypeOption: (value:String) => `//div[@class="dropdown-list"]//div[text()=" ${value} "]`,

  qtyInput: '//input[@formcontrolname="Qty"]',

  repairTypeDropdown: '//app-searchable-dropdown[@formcontrolname="RP2"]',
  repairTypeInput: '//input[@placeholder="Select Repair Type"]',
  repairTypeOption: (value:String) => `//div[@class="dropdown-list"]//div[text()=" ${value} "]`,

  responsibleDropdown: '//app-searchable-dropdown[@formcontrolname="Responsible"]',
  responsibleInput: '//input[@placeholder="Select Responsible"]',
  responsibleOption: (value:String) => `//div[@class="dropdown-list"]//div[text()=" ${value} "]`,

  addToGridButton: '//button[text()=" Add To Grid "]',
  estimateDoneBySelect: '//select[@formcontrolname="EstimateDoneBy"]',

  submitButton: '//button[text()=" Submit "]',
  approveButton: '//button[text()=" Approve "]',

  selectedForemanSelect: '//select[@formcontrolname="selectedForemanId"]',
  updateWorkOrderButton: '//button[text()=" Update Work Order "]',
  noButton: '//button[text()=" No "]',

  insertButton: '//button[normalize-space()="Insert"]',
  completeJobOrderButton: '//button[normalize-space()="Complete Job Order"]',

  containerRowLink: (value:String) =>`//tr[td[normalize-space()='New']]//a[normalize-space()='${value}']`,

  completedContainerLink: (value:String) => `//td//a[contains(text(),"${value}")]`,

  containerNumberLink: (value:String) =>`//a[normalize-space()="${value}"]`
};

