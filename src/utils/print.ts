import { readFileSync } from "fs";
import { join } from "path";

let chrome: any = {};
let puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("@sparticuz/chromium");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

export const generatePdf = async (stickers: { buffer: Buffer }[]) =>
  new Promise<Buffer | string>(async (resolve) => {
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    }

    const browser = await puppeteer.launch(options);

    let page = await browser.newPage();

    await page.setViewport({ width: 2480, height: 3508 });

    const css = readFileSync(
      join(process.cwd(), "public", "print-pupeteer.css"),
      "utf8"
    );

    const Montserrat = readFileSync(
      join(process.cwd(), "public", "fonts", "Montserrat-Bold.ttf"),
      { encoding: "base64" }
    );

    const html = `
          <style>
            @font-face {
              font-family: "Montserrat";
              src: url("data:font/ttf;base64,${Montserrat}");
            }

            ${css}
          </style>
          <div class="grid">
            ${stickers
              .map(
                (sticker) => `<div class="sticker-container">
                  <img
                    class="sticker"
                    src="data:image/png;base64,${sticker.buffer.toString(
                      "base64"
                    )}"
                  />
                </div>`
              )
              .join("")}
          </div>
        `;

    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "load", "networkidle0", "networkidle2"],
    });

    const buffer = await page.pdf({
      format: "A4",
    });

    resolve(buffer);

    await browser.close();
  });