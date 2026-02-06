import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase{
    

    constructor(page: Page){
        super(page)
    }

    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalander(numberOfDaysFromToday)   
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDateFromToday: number, secondDateFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalander(startDateFromToday) 
        const dateToAssertEnd = await this.selectDateInTheCalander(secondDateFromToday) 
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalander(numberOfDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expextedMonthShort = date.toLocaleDateString('En-US', {month: 'short'})
        const expextedMonthLong = date.toLocaleDateString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expextedMonthShort} ${expectedDate}, ${expectedYear}`
    
        let calendarMonthandYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedDateAndYear = `${expextedMonthLong} ${expectedYear}`
    
        while(!calendarMonthandYear.includes(expectedDateAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthandYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
        return dateToAssert
    }
}