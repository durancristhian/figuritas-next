import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { Person } from "../../types/person";

let chrome: any = {};
let puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("@sparticuz/chromium");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

type EndpointError = {
  message: string;
};

export default async function stickerHandler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | string | EndpointError>
) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method not allowed.",
      });

      return;
    }

    const stickerConfig = JSON.parse(req.body) as Person;

    const generatePicture = async () =>
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

        await page.setViewport({ width: 600, height: 840 });

        const css = readFileSync(
          join(process.cwd(), "public", "sticker-pupeteer.css"),
          "utf8"
        );

        const cardBg = readFileSync(
          join(process.cwd(), "public", "sticker-template", "background.png"),
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
          waitUntil: [
            "domcontentloaded",
            "load",
            "networkidle0",
            "networkidle2",
          ],
        });

        const buffer = await page.screenshot({
          encoding: "binary",
        });

        resolve(buffer);

        await browser.close();
      });

    const fileBuffer = await generatePicture();

    res.setHeader("Content-Type", "image/png");
    res.send(fileBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error generating the picture.",
    });

    return;
  }
}
