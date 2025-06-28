import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    // Navigate to the base URL before each test
    await page.goto('http://localhost:4200/');

});

test.describe('form layouts page',  () => {
    test.beforeEach(async ({page}) => {

        await page.getByText('forms').click();
        await page.getByText('Form layouts').click();

    });

    test('input fields', async ({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@test.com', {delay: 250})

        //Generic Input Assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test@test.com')
        
        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test@test.com')
    });
});