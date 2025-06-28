import {test, expect} from '@playwright/test';



test.beforeEach(async ({page}) => {
    // Navigate to the base URL before each test
    await page.goto('http://localhost:4200/');
    await page.getByText('forms').click();
    await page.getByText('Form layouts').click();
});

test('locator syntax rule', async ({page}) => {

    //by Tag name
    page.locator('input');

    //by id
    page.locator('#inputEmail');

    //by class value
    page.locator('.shape-rectangle');

    //by attribute
    page.locator('[placeholder="Email"]');

    //by class value (full match)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]')

    // by combining multiple selectors
    page.locator('input[placeholder="Email"][nbinput]');

    // by Xpath (Not recommended)
    page.locator('//input[@placeholder="Email"]');

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")');
});

test('user facing locator', async ({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click();
    await page.getByRole('button', {name: 'Sign in'}).first().click();

    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();

    await page.getByText('Using the Grid').click();

    await page.getByTitle('IoT Dashboard').click();

});

test('locating child elements', async ({page}) => {

    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click();
    await page.locator('nb-card').nth(3).getByRole("button").click();
});

test('locating parents elements', async ({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click();
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).click();

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click();
    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Password'}).click();
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('button', {name: 'SUBMIT'}).click();
     
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'SIGN IN'})
    .getByRole('textbox', {name: 'Email'}).click();
});

test('reusing locators', async ({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'});
    const emailField = basicForm.getByRole('textbox', {name: 'Email'});
    const passwordField = basicForm.getByRole('textbox', {name: 'Password'});
    const submitButton = basicForm.getByRole('button', {name: 'SUBMIT'});

    await emailField.fill('test@test.com')
    await passwordField.fill('123456');
    await basicForm.locator('nb-checkbox').click();
    await submitButton.click();

    await expect(emailField).toHaveValue('test@test.com')

});


test('extracting values', async ({page}) => {

    //Single test value
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'});
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsLabels).toEqual(['Option 1', 'Option 2', 'Disabled Option']);

    //input value
    const emailField = basicForm.getByRole('textbox', {name: 'Email'});
    const emailUser = 'test@test.com'
    await emailField.fill(emailUser);
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual(emailUser)

    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
});

test('asserting values', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button');

    //general assertion
    const value = 5
    expect(value).toEqual(5);

    const buttonText = await basicFormButton.textContent();
    expect(buttonText).toEqual('Submit');

    //locator assertion
    await expect(basicFormButton).toHaveText('Submit');

    //soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit');
    await basicFormButton.click();
});