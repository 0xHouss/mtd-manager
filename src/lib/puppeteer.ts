import { Browser, Page, launch } from "puppeteer";
import config from "./config";

export async function createPage(browser: Browser) {
    const page = await browser.newPage()

    await optimizePage(page)
    
    return page
}

export async function optimizePage(page: Page) {
    page.setDefaultNavigationTimeout(0);
    
    await page.setViewport({ width: 1200, height: 750 });
    await page.setRequestInterception(true);
    await page.setCacheEnabled(false)

    page.on('request', (request) => {
        if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
            request.respond({ status: 200, body: 'aborted' })
        } else {
            request.continue();
        }
    });
}

export async function startBrowser() {
    const args = []
    if (config.NO_SANDBOX) args.push("--no-sandbox")

    const browser = await launch({ headless: config.HEADLESS, args });
    const pages = await browser.pages()
    const page = pages[0]

    await optimizePage(page)

    return { browser, page }
}