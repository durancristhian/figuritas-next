import chromium from "chrome-aws-lambda";
import { readFileSync } from "fs";
import { join } from "path";
import playwright from "playwright-core";

export const generatePdf = async (stickers: { buffer: Buffer }[]) =>
  new Promise<Buffer | string>(async (resolve) => {
    const options =
      process.env.NODE_ENV === "production"
        ? {
            args: [
              ...chromium.args,
              "--hide-scrollbars",
              "--disable-web-security",
            ],
            executablePath: await chromium.executablePath,
            headless: true,
          }
        : {};

    const browser = await playwright.chromium.launch(options);

    let page = await browser.newPage();

    await page.setViewportSize({ width: 2480, height: 3508 });

    const css = readFileSync(
      join(process.cwd(), "public", "print-playwright.css"),
      "utf8"
    );

    const html = `
          <style>
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
      waitUntil: "networkidle",
    });

    const buffer = await page.pdf({
      format: "A4",
    });

    resolve(buffer);

    await browser.close();
  });
