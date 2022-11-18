import type { NextApiRequest, NextApiResponse } from "next";
import { generatePicture } from "../../src/utils/sticker";
import { Person } from "../../types/person";

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

    const fileBuffer = await generatePicture(stickerConfig);

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
