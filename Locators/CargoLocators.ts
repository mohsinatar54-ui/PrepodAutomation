export const Cargo = {
  CargoVerificationButton: '//button[text()="Cargo Verification"]',
  ExportCargoVerificationButton: '//button[text()="Export Cargo Verification"]',
  ExportCargoVerificationSpan: '//span[text()="Export Cargo Verification"]',

  TallyButton: '//button[normalize-space()="Tally"]',
  ImportTallyButton: '//button[normalize-space()="Import Tally"]',
  ExportTallyButton: '//button[normalize-space()="Export Tally"]',

  TModNoInput: '//input[@formcontrolname="TModNo"]',
  SearchInput: '//input[@placeholder="Search"]',
  SearchButton: '//button[normalize-space()="Search"]',

//  FirstCargoTableRowSpan: '((//th[text()="#"]/ancestor::table/child::tbody/child::tr)[1]/child::td/div)[1]//span/span',

  FirstCargoTableRowSpan: '//th[normalize-space()="#"]/ancestor::table//tbody/tr[1]/td[1]',

  AddTallyButton: '//button[normalize-space()="+ Add Tally"]',
  ContainerNoDropdown: '//select[@formcontrolname="ContainerNo"]',
  PlanDateInput: 'input[formcontrolname="PlanDate"]',

  SaveButton: '//button[text()="Save"]',

  ContainerRowLink: (containerNo: string) => `//tr//td[normalize-space()="${containerNo}"]//preceding-sibling::td//a`,

  VehicleLink: (EO9FvehicleNo: string) => `//a[normalize-space()="${EO9FvehicleNo}"]`,

  AddCargoButton: '//button[normalize-space()="+ Add Cargo"]',

  TallyPackagesInput: '//label[normalize-space()="Tally Packages(+ separated)"]//following-sibling::input',

  TallyPackagesInput1:'//label[normalize-space()="Tally Packages (+ separated)"]/following-sibling::input',

  NoOfGoodPackagesInput: '//label[normalize-space()="No. of Good Packages*"]//following-sibling::input',

  NoOfDamagedPackagesInput: '//label[normalize-space()="No. of Damaged Packages*"]//following-sibling::input',

  UpdateButton: '//button[normalize-space()="Update"]',

  SubmitButton: '//button[normalize-space()="Submit"]',

  YesSubmitButton: '//button[normalize-space()="Yes, Submit"]',

  YescompleteButton: '//button[normalize-space()="Yes, Complete"]',


  CompleteTransportCargoLoadButton: '//button[normalize-space()="Complete Transport Cargo Load"]',

  CompleteTransportCargoUnloadButton: '//button[normalize-space()="Complete Transport Cargo Unload"]',

  CompleteContainerStuffingButton: '//button[normalize-space()="Complete Container Stuffing"]',

  YesButton: '//button[normalize-space()="Yes"]',

  CargoWarehouseManagementLogo: '//img[@alt="Cargo Warehouse Management Logo"]',
  DashboardButton: '//button[normalize-space()="Dashboard"]',

  BookingLink: '//a[@class="booking-link"]',

  TemporaryBookingLink: '//a[@class="hover:opacity-70"]',

  TemporarySpecificBookingLink: "//a[text()='18082026121310694']",
  // NEW LOCATORS FOR completeStuffing
  CargoCompleteTransportCargoUnloadButton: '//button[normalize-space()="Complete Transport Cargo Unload"]',
  CargoCompleteContainerStuffingButton: '//button[normalize-space()="Complete Container Stuffing"]',
  CargoCompleteContainerdeStuffingButton: '//button[normalize-space()="Complete Container Destuffing"]',
  CargoStuffingYesButton: '//button[normalize-space()="Yes"]',
  CargoStorage:'//button[text()="Cargo Storage"]',
  Export_Cargo_Carting_Execution:'//button[text()="Export Cargo Carting Execution"]',
  Import_Cargo_Carting_Execution:'//button[text()="Import Cargo Carting Execution"]',
  //PlanDatetally:'//input[@formcontrolname="PlanDate"]'
  Yes_submit:'//button[normalize-space()="Yes, Submit"]',
  FirstTallyNumber:'//table//tbody/tr[1]/td[count(//table//thead//th[normalize-space()="Tally No."]/preceding-sibling::th)+1]//a[1]',
  CompleteCarting:'//button[text()="Complete Carting"]',
  Arrived:'//button[text()="Arrived"]',
  Export_Cargo_Storage_Stuffing:'//button[text()="Export Cargo Storage Stuffing"]',
  Export_Cargo_Carting:'//span[text()="Export Cargo Carting"]',
  Import_Cargo_Carting:'//span[text()="Import Cargo Carting"]',
  Complete_stuffing:'//button[normalize-space()="Complete Stuffing"]',
  Complete_Destuffing:'//button[normalize-space()="Complete Destuffing"]'


};
