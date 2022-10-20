import chromium from "chrome-aws-lambda";
import fs from "fs";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import path from "path";
import puppeteer from "puppeteer-core";

type EndpointError = {
  message: string;
};

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(
    error,
    _req: NextApiRequest,
    res: NextApiResponse<Buffer | string | EndpointError>
  ) {
    console.log(error);

    res.status(501).json({
      message: `Error generating the pdf. ${error.message}`,
    });
  },
  onNoMatch(_req: NextApiRequest, res) {
    res.status(405).json({
      message: "Method not allowed.",
    });
  },
});

apiRoute.use(upload.array("images"));

apiRoute.post(
  async (
    req: NextApiRequest,
    res: NextApiResponse<Buffer | string | EndpointError>
  ) => {
    // @ts-ignore
    const stickers: { buffer: Buffer }[] = req.files || [];

    const generatePdf = async () =>
      new Promise<Buffer | string>(async (resolve) => {
        const browser = await puppeteer.launch(
          process.env.NODE_ENV === "production"
            ? {
                args: chromium.args,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
              }
            : {}
        );

        let page = await browser.newPage();

        await page.setViewport({ width: 2480, height: 3508 });

        const css = fs.readFileSync(
          path.join(process.cwd(), "public", "print-pupeteer.css"),
          "utf8"
        );

        const Montserrat = fs.readFileSync(
          path.join(process.cwd(), "public", "fonts", "Montserrat-Bold.ttf"),
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
          waitUntil: [
            "domcontentloaded",
            "load",
            "networkidle0",
            "networkidle2",
          ],
        });

        const buffer = await page.pdf({
          format: "A4",
        });

        resolve(buffer);

        await browser.close();
      });

    const fileBuffer = await generatePdf();

    res.setHeader("Content-Type", "application/pdf");
    res.send(fileBuffer);
  }
);

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};