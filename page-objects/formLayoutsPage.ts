import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase{

    

    constructor(page: Page){
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelecOption(email: string, password: string, optionText: string){
        const usingTheGridEmailInput = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridEmailInput.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridEmailInput.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGridEmailInput.getByRole('radio', {name: optionText}).check({force: true})
        await usingTheGridEmailInput.getByRole('button').click()
    }
/**
 * This method will fill out the Inline form with user details
 * @param name - Should be first and last name
 * @param email - valid email for the test user
 * @param rememberMe - true or false if user session to be saved
 */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).pressSequentially(name, {delay: 100})
        await inlineForm.getByRole('textbox', {name: "Email"}).pressSequentially(email, {delay: 100})
        if(rememberMe){
            await inlineForm.getByRole('checkbox').check({force: true})
            await inlineForm.getByRole('button').click()
        }
    }
}