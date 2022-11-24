import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { Browser } from "puppeteer";
import { getBrowser } from "../../src/utils/get-browser";
import { Person } from "../../types/person";

type EndpointError = {
  message: string;
};

export default async function stickerHandler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | string | EndpointError>
) {
  let browser = null;

  try {
    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method not allowed.",
      });

      return;
    }

    const stickerConfig = JSON.parse(req.body) as Person;

    browser = await getBrowser();

    const fileBuffer = await generatePicture(browser, stickerConfig);

    res.setHeader("Content-Type", "image/png");
    res.send(fileBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error generating the picture.",
    });
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

const generatePicture = async (browser: Browser, stickerConfig: Person) =>
  new Promise<Buffer | string>(async (resolve) => {
    let page = await browser.newPage();

    await page.setViewport({ width: 600, height: 840 });

    const css = `
      html,
      body {
        font-family: "Montserrat" !important;
        line-height: 1;
        margin: 0;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .card {
        height: 840px;
        margin: 0 auto;
        position: relative;
        width: 600px;
      }

      .background,
      .flag,
      .information {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }

      .background {
        z-index: 0;
      }

      .playerImage {
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        bottom: 10%;
        filter: drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff)
          drop-shadow(-3px -3px 0 #fff) drop-shadow(3px 3px 0 #fff);
        height: 80%;
        left: 12%;
        position: absolute;
        width: 76%;
        z-index: 1;
      }

      .information {
        z-index: 2;
      }

      .flag {
        z-index: 3;
      }

      .name {
        bottom: 80px;
        color: #111;
        font-size: 45px;
        font-weight: bold;
        left: 0;
        position: absolute;
        text-align: center;
        text-transform: uppercase;
        width: 100%;
        z-index: 4;
      }

      .birthday {
        bottom: 40px;
        color: white;
        font-size: 20px;
        font-weight: bold;
        left: 0;
        position: absolute;
        text-align: center;
        width: 100%;
        z-index: 5;
      }
    `;

    const cardBg = readFileSync(
      join(process.cwd(), "public", "sticker-template", "background.jpg"),
      { encoding: "base64" }
    );

    const information = readFileSync(
      join(
        process.cwd(),
        "public",
        "sticker-template",
        `pos-${stickerConfig.position}.png`
      ),
      { encoding: "base64" }
    );

    const flag = readFileSync(
      join(
        process.cwd(),
        "public",
        "sticker-template",
        `flag-${stickerConfig.country}.png`
      ),
      { encoding: "base64" }
    );

    const Montserrat = readFileSync(
      join(process.cwd(), "public", "fonts", "Montserrat-Bold.woff2"),
      { encoding: "base64" }
    );

    const html = `
      <style>
        @font-face {
          font-family: "Montserrat";
          src: url("data:font/ttf;base64,${Montserrat}");
        
        ${css}
      </style>
      <div class="card">
        <div class="background" style="background-image:url('data:image/png;base64,${cardBg}')"></div>
        <div class="playerImage" style="background-image:url('${stickerConfig.image}')"></div>
        <div class="information" style="background-image:url('data:image/png;base64,${information}')"></div>
        <div class="flag" style="background-image:url('data:image/png;base64,${flag}')"></div>
        <div class="name">${stickerConfig.name}</div>
        <div class="birthday">${stickerConfig.birthday}</div>
      </div>
    `;

    await page.setContent(html, {
      waitUntil: "networkidle2",
    });

    const buffer = await page.screenshot();

    resolve(buffer);

    await browser.close();
  });
