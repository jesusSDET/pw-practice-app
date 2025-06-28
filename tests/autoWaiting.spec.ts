import {test, expect} from '@playwright/test'; 

test.beforeEach(async ({page}) => {
    // Navigate to the base URL before each test
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();

});

test('auto waiting for AJAX requests', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element

    // const text = await successButton.textContent()

    // await successButton.waitFor({state: 'attached'})
    // const text = await successButton.allTextContents()
    
    

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
});

test('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element
    // await page.waitForSelector('.bg-success')

    //wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
});

