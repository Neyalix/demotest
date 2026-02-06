import {test, expect} from 'playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 200})

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page}) => {
        const usingTheGridEmailForm = page.locator('nb-card', {hasText: "Using the Grid"})

        // await usingTheGridEmailForm.getByLabel('Option 1').check({force: true})
        await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).check({force: true}) //IF method is hidden for some reason, use force: true
        const radioStatus = await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridEmailForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        await usingTheGridEmailForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()


    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    //You can use .check and .uncheck this will check if the box is ticked or not and perform action, while .click will always perform action.
    // Better use check and uncheck
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allCheckBoxes = page.getByRole('checkbox')
    //we nee .all() to create and array from the locators and use await since this is a promise on our locator
    for(const box of await allCheckBoxes.all()) {
        await box.uncheck({force: true}) // going through the loop cycle and check on each box from the array
        expect(await box.isChecked()).toBeFalsy() // assert that what we checked/unchecked is true/false
    }

})

test('lists and dropdowns', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colours = { //List of the colours the backgroumds have
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await dropdownMenu.click({delay: 200}) //Click on the dropdown menu before each itteration 
    for(const colour in colours){  //for in to walk through theme and assert that the colour match.
        await optionList.filter({hasText: colour}).click()
        await expect(header).toHaveCSS('background-color', colours[colour])
        if(colour != "Corporate"){
            await dropdownMenu.click({delay: 200}) //Click on the dropdown menu after each itteration 
        }
    }


})

test('tooltips', async({page}) => {
    // sometimes is a it tricky to find a tooltip because disappears in the 
    // DOM tree, you need to freeze the browser with F8 double tap to pause debbug.
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover() //to hover over the tooltip to show

    page.getByRole('tooltip') //only of a role tooltip is created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => { //when we have browser dialog box, we need page.on (listener) in order to keep the dialog box 
        expect(dialog.message()).toEqual('Are you sure you want to delete?') // then to assert that we have the message from the dialog box
        dialog.accept() // and to confirm action we need to accept the listener
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")

})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill("35")
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText("2").click()
    const targerRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targerRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill("neyalix@gmail.com")
    await page.locator('.nb-checkmark').click()
    await expect(targerRowById.locator('td').nth(5)).toHaveText('neyalix@gmail.com')

    //3 test filet of the table

    const ages = ["20", "30", "40", "200"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageROws = page.locator('tbody tr')

        for (let row of await ageROws.all()) {
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {

                expect(cellValue).toEqual(age)
            }
        }
    }
})  

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 1)
    const expectedDate = date.getDate().toString()
    const expextedMonthShort = date.toLocaleDateString('En-US', {month: 'short'})
    const expextedMonthLong = date.toLocaleDateString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expextedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthandYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedDateAndYear = `${expextedMonthLong} ${expectedYear}`

    while(!calendarMonthandYear.includes(expectedDateAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthandYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

    

})

