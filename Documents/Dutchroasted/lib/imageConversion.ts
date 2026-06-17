import sharp from "sharp";
import convert from "heic-convert";

const dataUrlPattern = /^data:(image\/(?:heic|heif|jpeg|jpg|png|webp));base64,(.+)$/;

export function isHeicDataUrl(dataUrl: string) {
  return dataUrl.startsWith("data:image/heic") || dataUrl.startsWith("data:image/heif");
}

export async function convertHeicDataUrlToJpeg(dataUrl: string) {
  const match = dataUrl.match(dataUrlPattern);
  if (!match) {
    throw new Error("Invalid image data URL");
  }

  const mimeType = match[1];
  if (mimeType !== "image/heic" && mimeType !== "image/heif") {
    return dataUrl;
  }

  const input = Buffer.from(match[2], "base64");
  let output: Buffer;

  try {
    output = await sharp(input)
      .rotate()
      .jpeg({ quality: 88 })
      .toBuffer();
  } catch (sharpError) {
    console.warn("Sharp HEIC conversion failed, trying heic-convert fallback:", sharpError);
    const fallbackOutput = await convert({
      buffer: input,
      format: "JPEG",
      quality: 0.88,
    });
    output =
      fallbackOutput instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(fallbackOutput))
        : Buffer.from(fallbackOutput);
  }

  return `data:image/jpeg;base64,${output.toString("base64")}`;
}
