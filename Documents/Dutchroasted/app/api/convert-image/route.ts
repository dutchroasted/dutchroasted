import { convertHeicDataUrlToJpeg, isHeicDataUrl } from "@/lib/imageConversion";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { image?: unknown };

    if (typeof body.image !== "string" || !isHeicDataUrl(body.image)) {
      return Response.json({ error: "Invalid HEIC image" }, { status: 400 });
    }

    const image = await convertHeicDataUrlToJpeg(body.image);

    return Response.json({ image });
  } catch (error) {
    console.error("HEIC conversion error:", error);
    return Response.json(
      { error: "Could not convert HEIC image" },
      { status: 500 },
    );
  }
}
