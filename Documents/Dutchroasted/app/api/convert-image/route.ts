import {
  convertHeicDataUrlToJpeg,
  hasHeicSignature,
  isHeicDataUrl,
} from "@/lib/imageConversion";
import {
  ApiRequestError,
  enforceRateLimit,
  enforceSameOrigin,
  getDataUrlByteSize,
  jsonNoStore,
  readJsonWithLimit,
} from "@/lib/apiSecurity";

const MAX_HEIC_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = 14 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    enforceRateLimit(request, "convert-image", 8, 60_000);
    const body = await readJsonWithLimit<{ image?: unknown }>(
      request,
      MAX_REQUEST_BYTES,
    );

    if (
      typeof body.image === "string" &&
      getDataUrlByteSize(body.image) > MAX_HEIC_BYTES
    ) {
      return jsonNoStore(
        { error: "De HEIC-afbeelding is te groot. Maximaal 10 MB." },
        { status: 413 },
      );
    }

    if (
      typeof body.image !== "string" ||
      !isHeicDataUrl(body.image) ||
      !hasHeicSignature(body.image)
    ) {
      return jsonNoStore(
        { error: "Ongeldige HEIC-afbeelding." },
        { status: 400 },
      );
    }

    const image = await convertHeicDataUrlToJpeg(body.image);

    return jsonNoStore({ image });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    console.error("HEIC conversion error:", error);
    return jsonNoStore(
      { error: "Could not convert HEIC image" },
      { status: 500 },
    );
  }
}
