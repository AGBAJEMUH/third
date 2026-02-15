const { chromium } = require('playwright');
const path = require('path');

async function captureLoggedInPages() {
    const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    try {
        console.log('Navigating to register page...');
        await page.goto('http://localhost:3000/register');

        console.log('Filling registration form...');
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('input[placeholder="John Doe"]', 'Showcase User');
        await page.fill('input[placeholder="you@example.com"]', uniqueEmail);
        await page.fill('input[placeholder="••••••••"]', 'password123');

        console.log('Submitting registration...');
        await page.click('button[type="submit"]');

        // Wait for navigation to workspace
        console.log('Waiting for workspace navigation...');
        await page.waitForURL('**/workspace', { timeout: 30000 });
        console.log('Successfully reached workspace.');

        await page.screenshot({ path: 'C:\\Users\\Temp.DESKTOP-LQGRAS0.000\\.gemini\\antigravity\\brain\\637ad9f7-6bd1-411c-8c62-41da373f6cab\\workspace_active.png' });
        console.log('Workspace screenshot captured.');

        // Create a new mind map
        console.log('Opening "New Mind Map" modal...');
        await page.click('button:has-text("+ New Mind Map")');
        await page.fill('input[placeholder="Enter mind map title..."]', 'Showcase Project');

        console.log('Creating mind map...');
        await page.click('button:has-text("Create")');

        // Wait for navigation to editor
        console.log('Waiting for editor navigation...');
        await page.waitForURL('**/workspace/*', { timeout: 30000 });
        console.log('Successfully reached editor.');

        // Wait for canvas to draw
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'C:\\Users\\Temp.DESKTOP-LQGRAS0.000\\.gemini\\antigravity\\brain\\637ad9f7-6bd1-411c-8c62-41da373f6cab\\editor_active.png' });
        console.log('Editor screenshot captured.');

    } catch (error) {
        console.error('Error during verification:', error);
        await page.screenshot({ path: 'C:\\Users\\Temp.DESKTOP-LQGRAS0.000\\.gemini\\antigravity\\brain\\637ad9f7-6bd1-411c-c8c62-41da373f6cab\\error_state.png' });
    } finally {
        await browser.close();
    }
}

captureLoggedInPages();
