import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page}) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
    await pm.navigateTo().smartTablePage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelecOption('test@test.com', 'Welcome1', 'Option 1')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Philip', 'neyalix@gmail.com', true)
    await pm.navigateTo().datePickerPage()
    await pm.onDatepickerPage().selectCommonDatepickerDateFromToday(100)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 50)
})