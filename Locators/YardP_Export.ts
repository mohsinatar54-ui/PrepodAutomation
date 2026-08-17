export const YardPExportL = {
    Logo: "//img[@alt='Yard Management Logo']",
    Service: "//button[normalize-space()='Standard Service']",
    Master : "//button[normalize-space()='Masters']",
    YardRule : "//button[normalize-space()='Yard Rule Config']",
    AutoPlan : "//label[normalize-space()='AutoPlan For Yard Position']",
    Search: "//button[normalize-space()='Search']",
    Edit: "//button[@title='Edit']",
    Booking: "//button[normalize-space()='Booking']",
    Execution: "//button[normalize-space()='Yard Execution']",
    Update: "//button[@type='submit']",
    Save: "//button[normalize-space()='Save']",
    Submit: "//button[normalize-space()='Submit']",
    Container : (containerNo:string)=> `//td/a[normalize-space()='${containerNo}']`,
    PlannedCon : "//p[text()='Planned Container No']/following-sibling::p",
    PlanBtn : "//button[normalize-space()='Plan']",
    PlanID : "//app-custom-dropdown[@formcontrolname='PlannedITVNoID']",
    Gate : "//div[normalize-space()='Gate']",
    EXcon:(containerNo:string)=>  `//tr[.//a[normalize-space()='${containerNo}']]//button[normalize-space()='Execute']`,
    Execute : "//button[normalize-space()='Execute']",
    CraneID : "//app-custom-dropdown[@formcontrolname='CraneID']",
    OptionList : "//div[@class='option-item']",
    



}