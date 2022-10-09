import { createCanvas, loadImage, registerFont } from "canvas";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Person } from "../../types/person";

const STICKER_HEIGHT = 840;
const STICKER_WIDTH = 600;

const NAME_BOTTOM = STICKER_HEIGHT - 85;
const BIRTHDAY_BOTTOM = STICKER_HEIGHT - 45;

type EndpointError = {
  message: string;
};

export default async function stickerHandler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | EndpointError>
) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method not allowed.",
      });

      return;
    }

    const stickerConfig = JSON.parse(req.body) as Person;

    const generatePicture = () =>
      new Promise<Buffer>(async (resolve) => {
        registerFont(path.resolve("./public/fonts/Montserrat-Regular.ttf"), {
          family: "Montserrat",
        });

        registerFont(path.resolve("./public/fonts/Montserrat-Bold.ttf"), {
          family: "Montserrat Bold",
        });

        const canvas = createCanvas(STICKER_WIDTH, STICKER_HEIGHT);
        const ctx = canvas.getContext("2d");

        /* image preparation */
        ctx.clearRect(0, 0, STICKER_WIDTH, STICKER_HEIGHT);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, STICKER_WIDTH, STICKER_HEIGHT);

        /* background */
        const stickerBgPath = path.resolve(
          "./public/sticker-template/background.png"
        );
        const stickerBg = await loadImage(stickerBgPath);

        ctx.drawImage(stickerBg, 0, 0, STICKER_WIDTH, STICKER_HEIGHT);

        /* player image */
        const playerImage = await loadImage(stickerConfig.image);

        /* const PLAYER_HEIGHT = STICKER_HEIGHT * 0.8;
        const PLAYER_WIDTH = STICKER_WIDTH * 0.8;
        const PLAYER_LEFT = STICKER_WIDTH * 0.1;
        const PLAYER_TOP = STICKER_HEIGHT * 0.9; */

        ctx.drawImage(
          playerImage,
          (STICKER_WIDTH - playerImage.width) / 2,
          STICKER_HEIGHT - STICKER_HEIGHT * 0.1 - playerImage.height,
          playerImage.width,
          playerImage.height
        );

        /* position */
        const stickerPositionPath = path.resolve(
          `./public/sticker-template/pos-${stickerConfig.position}.png`
        );
        const StickerPosition = await loadImage(stickerPositionPath);

        ctx.drawImage(StickerPosition, 0, 0, STICKER_WIDTH, STICKER_HEIGHT);

        /* flag */
        const stickerFlagPath = path.resolve(
          `./public/sticker-template/flag-${stickerConfig.country}.png`
        );
        const stickerFlag = await loadImage(stickerFlagPath);

        ctx.drawImage(stickerFlag, 0, 0, STICKER_WIDTH, STICKER_HEIGHT);

        /* name */
        ctx.font = `45px 'Montserrat Bold'`;
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(stickerConfig.name, STICKER_WIDTH / 2, NAME_BOTTOM);

        /* birthday */
        ctx.font = `20px 'Montserrat Bold'`;
        ctx.fillStyle = "white";
        ctx.fillText(
          stickerConfig.birthday,
          STICKER_WIDTH / 2,
          BIRTHDAY_BOTTOM
        );

        resolve(canvas.toBuffer());
      });

    const canvasBuffer = await generatePicture();

    res.setHeader("Content-Type", "image/png");
    res.send(canvasBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error generating the picture.",
    });

    return;
  }
}
