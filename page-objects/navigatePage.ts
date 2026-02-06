import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    
    readonly formLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator
    readonly smartTableMenuItem: Locator

    constructor(page: Page){
        super(page)
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
        this.smartTableMenuItem = page.getByText('Smart Table')
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage() {
    await this.selectGroupMenuItem('Forms')
    await this.page.waitForTimeout(1000)
    await this.datePickerMenuItem.click()
    }

    
    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()        
    }
    
    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.waitForTimeout(1000)
        await this.tooltipMenuItem.click()
    }
    
    async smartTablePage(){
    await this.selectGroupMenuItem('Tables & Data')
    await this.smartTableMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false"){
            await groupMenuItem.click()
        }
    }
}