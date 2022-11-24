import puppeteer from "puppeteer";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const getBrowser = () =>
  IS_PRODUCTION
    ? puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`,
      })
    : puppeteer.launch();
