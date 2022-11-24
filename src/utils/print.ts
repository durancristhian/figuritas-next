import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

export const generatePdf = async (stickers: { buffer: Buffer }[]) =>
  new Promise<Buffer | string>(async (resolve) => {
    const options =
      process.env.VERCEL_ENV === "production"
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

    const css = `
      html,
      body {
        line-height: 1;
        margin: 0;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .grid {
        display: flex;
        flex-wrap: wrap;
      }

      .sticker-container {
        height: calc(100vh / 4);
        padding: 1px;
        width: calc(100vw / 4);
      }

      .sticker {
        display: block;
        height: 100%;
        margin: 0 auto;
        width: 100%;
      }
    `;

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
