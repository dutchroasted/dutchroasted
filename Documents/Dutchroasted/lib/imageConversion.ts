import convert from "heic-convert";

const dataUrlPattern = /^data:(image\/(?:heic|heif|jpeg|jpg|png|webp));base64,(.+)$/;

export function isHeicDataUrl(dataUrl: string) {
  return dataUrl.startsWith("data:image/heic") || dataUrl.startsWith("data:image/heif");
}

export function hasHeicSignature(dataUrl: string) {
  const match = dataUrl.match(dataUrlPattern);
  if (!match) {
    return false;
  }

  try {
    const header = Buffer.from(match[2].slice(0, 32), "base64");
    if (header.length < 12 || header.toString("ascii", 4, 8) !== "ftyp") {
      return false;
    }

    const brand = header.toString("ascii", 8, 12);
    return ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"]
      .includes(brand);
  } catch {
    return false;
  }
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

  const output = await convert({
    buffer: input,
    format: "JPEG",
    quality: 0.88,
  });

  const jpegBuffer =
    output instanceof ArrayBuffer
      ? Buffer.from(new Uint8Array(output))
      : Buffer.from(output);

  return `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`;
}
