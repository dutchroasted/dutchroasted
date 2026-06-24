const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(request)}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    cleanupExpiredRateLimits(now);
    return;
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    );
    throw new ApiRequestError(
      `Te veel verzoeken. Probeer het over ${retryAfterSeconds} seconden opnieuw.`,
      429,
    );
  }

  current.count += 1;
}

export function enforceSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw new ApiRequestError("Ongeldige aanvraagbron.", 403);
  }

  if (originUrl.protocol !== "https:" && originUrl.protocol !== "http:") {
    throw new ApiRequestError("Ongeldige aanvraagbron.", 403);
  }

  const allowedHosts = new Set([
    new URL(request.url).host,
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
    new URL(getConfiguredOrigin()).host,
  ]);

  if (!allowedHosts.has(originUrl.host)) {
    throw new ApiRequestError("Ongeldige aanvraagbron.", 403);
  }
}

export async function readJsonWithLimit<T>(
  request: Request,
  maxBytes: number,
): Promise<T> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ApiRequestError("Het verzoek is te groot.", 413);
  }

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new ApiRequestError("Het verzoek is te groot.", 413);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiRequestError("Ongeldige JSON.", 400);
  }
}

export function jsonNoStore(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Pragma", "no-cache");

  return Response.json(body, {
    ...init,
    headers,
  });
}

export function getDataUrlByteSize(dataUrl: string) {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex < 0) {
    return Number.POSITIVE_INFINITY;
  }

  const base64 = dataUrl.slice(commaIndex + 1);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export function hasJpegSignature(dataUrl: string) {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex < 0) {
    return false;
  }

  try {
    const signature = Buffer.from(
      dataUrl.slice(commaIndex + 1, commaIndex + 17),
      "base64",
    );
    return signature.length >= 3 &&
      signature[0] === 0xff &&
      signature[1] === 0xd8 &&
      signature[2] === 0xff;
  } catch {
    return false;
  }
}

function getConfiguredOrigin() {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.outfitroaster.com",
    ).origin;
  } catch {
    return "https://www.outfitroaster.com";
  }
}

function cleanupExpiredRateLimits(now: number) {
  if (rateLimitStore.size < 1_000) {
    return;
  }

  for (const [key, value] of rateLimitStore) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}
