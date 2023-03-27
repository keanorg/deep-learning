//const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
//const randomUseragent = require('random-useragent');
//const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
const randUserAgent = require('rand-user-agent');
class PuppeteerService {

    constructor() {
        this.browser = null;
        this.page = null;
        this.pageOptions = null;
        this.waitForFunction = null;
        this.isLinkCrawlTest = null;
    }

    async initiate(countsLimitsData, isLinkCrawlTest) {
        this.pageOptions = {
            waitUntil: 'networkidle0',
            timeout: countsLimitsData.millisecondsTimeoutSourceRequestCount
        };
        this.waitForFunction =  "document.querySelectorAll('body')";
        puppeteerExtra.use(pluginStealth());
        //const browser = await puppeteerExtra.launch({ headless: false });
        this.browser = await puppeteerExtra.launch({ 
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            executablePath: '/usr/bin/google-chrome-stable', });
        this.page = await this.browser.newPage();
        
        await this.page.setRequestInterception(true);
        this.page.on('request', (request) => {
            if ([ 'script'].indexOf(request.resourceType()) !== -1) {
                request.continue();
            } else if  (['stylesheet', 'font'].indexOf(request.resourceType()) !== -1){
                request.abort();
            } else {
                request.continue();
            }
        });
        this.isLinkCrawlTest = isLinkCrawlTest;
    }

    async crawl(link) {
        //const userAgent = randomUseragent.getRandom();
        
        const agent = randUserAgent("desktop", "chrome", "windows");
        const crawlResults = { isValidPage: true, pageSource: null };

        try {
            await this.page.setUserAgent(agent);
            await this.page.setCookie({ name: 'CONSENT', value: 'YES+srp.gws-20210830-0-RC2.fr+FX+187', url: 'https://www.google.com/' });
            await this.page.goto(link, this.pageOptions);
            await this.page.waitForFunction(this.waitForFunction);
            //await this.page.waitForTimeout(1000);
            await this.page.screenshot({ path: 'example.png' });
            crawlResults.pageSource = await this.page.content();
        }
        catch (error) {
            console.log(error);
        }
        if (this.isLinkCrawlTest) {
            this.close();
        }
        return crawlResults;
    }

    close() {
        if (this.browser) {
            this.browser.close();
        }
    }
}

const puppeteerService = new PuppeteerService();
module.exports = puppeteerService;