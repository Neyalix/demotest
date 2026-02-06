POM - Page Object Model
 two important principles
 
 DRY - Don't Repeat Yourself - if you ahve to re-use something more than once, create a function and reuse it.
 
 KISS - Keep it simple Stupid don't over complicate to impress, make it maintanable 
 
Discriptive naming - Follow

Avoid tiny method
async clickSubmit(){
	await this.page.getByRole('button', {name: "Log In"}).click()
}

