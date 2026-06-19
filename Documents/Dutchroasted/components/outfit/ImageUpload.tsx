"use client";

import { useRef, useState } from "react";
import { MAX_OUTFIT_IMAGE_SIZE } from "@/lib/outfitTypes";
<<<<<<< HEAD
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import { analytics } from "@/lib/analytics";
=======
import {
  compressImageToJpegDataUrl,
  getDataUrlByteSize,
} from "@/lib/clientImageCompression";
>>>>>>> a7da14b (Add Stripe premium subscriptions)

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const acceptedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

type ImageUploadProps = {
  previewUrl: string;
<<<<<<< HEAD
  disabled: boolean;
  onChange: (dataUrl: string, fileName: string) => void;
  onError: (message: string) => void;
  onProcessingChange: (isProcessing: boolean) => void;
=======
  disabled?: boolean;
  onChange: (dataUrl: string, fileName: string) => void;
  onError: (message: string) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
>>>>>>> a7da14b (Add Stripe premium subscriptions)
};

export function ImageUpload({
  previewUrl,
<<<<<<< HEAD
  disabled,
=======
  disabled = false,
>>>>>>> a7da14b (Add Stripe premium subscriptions)
  onChange,
  onError,
  onProcessingChange,
}: ImageUploadProps) {
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
<<<<<<< HEAD
  const processingLockRef = useRef(false);

  async function handleFile(file: File | undefined) {
    if (!file || disabled || processingLockRef.current) {
      return;
    }

    console.info("[Outfit upload] original file size:", formatByteSize(file.size));
=======
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const processingLockRef = useRef(false);

  async function handleFile(file: File | undefined) {
    if (!file || disabled || isConvertingHeic || processingLockRef.current) {
      return;
    }

    console.info("[Outfit Roaster] Originele bestandsgrootte:", formatBytes(file.size));
>>>>>>> a7da14b (Add Stripe premium subscriptions)

    const lowerName = file.name.toLowerCase();
    const hasAcceptedType = acceptedTypes.includes(file.type);
    const hasAcceptedExtension = acceptedExtensions.some((extension) => lowerName.endsWith(extension));

    if (!hasAcceptedType && !hasAcceptedExtension) {
      onError("Upload een jpg, png, webp of heic bestand.");
      return;
    }

    if (file.size > MAX_OUTFIT_IMAGE_SIZE) {
      onError("Je foto is te groot. Maximaal 10 MB.");
      return;
    }

    processingLockRef.current = true;
    setIsProcessingFile(true);
    onProcessingChange?.(true);

    if (isHeicFile(file)) {
      processingLockRef.current = true;
      onProcessingChange(true);
      setIsConvertingHeic(true);

      let convertedImage: string;
      try {
        onError("");
        const heicDataUrl = await readBlobAsDataUrl(file);
        const response = await fetch("/api/convert-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: heicDataUrl }),
        });

        if (!response.ok) {
          throw new Error(`HEIC conversion failed with status ${response.status}`);
        }

        const data = (await response.json()) as { image: string };
<<<<<<< HEAD
        convertedImage = data.image;
        console.info(
          "[Outfit upload] converted JPEG data URL size:",
          formatByteSize(getDataUrlByteSize(convertedImage)),
        );
      } catch {
        onError("Het omzetten van de HEIC-foto naar JPEG is mislukt. Exporteer de foto als JPG en probeer opnieuw.");
        processingLockRef.current = false;
        setIsConvertingHeic(false);
        onProcessingChange(false);
        return;
      }

      try {
        const compressedImage = await compressWithRetry(convertedImage);
        analytics.outfitUpload(file.type || "image/heic", file.size);
        onChange(compressedImage, `${file.name.replace(/\.(heic|heif)$/i, "")}.jpg`);
      } catch {
        onError("De HEIC-foto is omgezet, maar comprimeren mislukte ook bij de tweede poging.");
      } finally {
        processingLockRef.current = false;
        setIsConvertingHeic(false);
        onProcessingChange(false);
=======
        console.info(
          "[Outfit Roaster] Omgezette JPEG data-URL:",
          formatBytes(getDataUrlByteSize(data.image)),
        );
        const compressedImage = await compressWithRetry(data.image);
        logCompressedSize(compressedImage);
        onChange(compressedImage, `${file.name.replace(/\.(heic|heif)$/i, "")}.jpg`);
      } catch (error) {
        console.error("[Outfit Roaster] HEIC-stap mislukt:", error);
        onError(
          error instanceof ImageProcessingError
            ? error.message
            : "De HEIC-foto kon niet worden omgezet naar JPEG. Probeer een andere foto.",
        );
      } finally {
        processingLockRef.current = false;
        setIsProcessingFile(false);
        setIsConvertingHeic(false);
        onProcessingChange?.(false);
>>>>>>> a7da14b (Add Stripe premium subscriptions)
      }
      return;
    }

    try {
      onError("");
<<<<<<< HEAD
      processingLockRef.current = true;
      onProcessingChange(true);
      const compressedImage = await compressWithRetry(file);
      analytics.outfitUpload(file.type, file.size);
      onChange(compressedImage, file.name.replace(/\.(jpg|jpeg|png|webp)$/i, ".jpg"));
    } catch {
      onError("Het comprimeren van deze foto is mislukt, ook na een tweede poging. Probeer een andere foto.");
    } finally {
      processingLockRef.current = false;
      onProcessingChange(false);
=======
      const compressedImage = await compressWithRetry(file);
      console.info(
        "[Outfit Roaster] Omgezette JPEG data-URL:",
        formatBytes(getDataUrlByteSize(compressedImage)),
      );
      logCompressedSize(compressedImage);
      onChange(compressedImage, file.name.replace(/\.(jpg|jpeg|png|webp)$/i, ".jpg"));
    } catch (error) {
      console.error("[Outfit Roaster] Compressiestap mislukt:", error);
      onError(
        error instanceof ImageProcessingError
          ? error.message
          : "De foto kon niet worden gecomprimeerd. Probeer een ander bestand.",
      );
    } finally {
      processingLockRef.current = false;
      setIsProcessingFile(false);
      onProcessingChange?.(false);
>>>>>>> a7da14b (Add Stripe premium subscriptions)
    }
  }

  async function compressWithRetry(input: File | string) {
    try {
      return await compressAndLog(input);
    } catch (error) {
      console.warn("[Outfit upload] compression failed; retrying at 900px / quality 0.65.", error);
      return compressAndLog(input, { maxDimension: 900, quality: 0.65 });
    }
  }

  async function compressAndLog(
    input: File | string,
    options?: { maxDimension: number; quality: number },
  ) {
    const compressedImage = await compressImageToJpegDataUrl(input, {
      ...options,
      onConverted: (convertedImage) => {
        console.info(
          "[Outfit upload] converted JPEG data URL size:",
          formatByteSize(getDataUrlByteSize(convertedImage)),
        );
      },
    });
    console.info(
      "[Outfit upload] compressed data URL size:",
      formatByteSize(getDataUrlByteSize(compressedImage)),
    );
    return compressedImage;
  }

  function readBlobAsDataUrl(file: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Invalid file result"));
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  return (
    <div>
      <label
        htmlFor="outfit-image"
<<<<<<< HEAD
        aria-disabled={disabled || isConvertingHeic}
        className={`dr-card-hover group relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed border-orange-400/40 bg-[radial-gradient(circle_at_50%_20%,rgba(255,129,40,0.22),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,106,0,0.04)_45%,rgba(0,0,0,0.62))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_28px_90px_rgba(0,0,0,0.35)] sm:min-h-[28rem] sm:p-6 ${
          disabled || isConvertingHeic
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-orange-300 hover:shadow-[0_28px_90px_rgba(255,106,0,0.2)]"
=======
        aria-disabled={disabled || isProcessingFile}
        className={`dr-card-hover group relative flex min-h-[23rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-orange-500/45 bg-[linear-gradient(145deg,rgba(255,106,0,0.12),rgba(255,255,255,0.035)_42%,rgba(0,0,0,0.72))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_28px_90px_rgba(0,0,0,0.35)] sm:min-h-[30rem] sm:p-6 ${
          disabled || isProcessingFile
            ? "cursor-not-allowed opacity-65"
            : "cursor-pointer hover:border-orange-300 hover:shadow-[0_28px_90px_rgba(255,106,0,0.14)]"
>>>>>>> a7da14b (Add Stripe premium subscriptions)
        }`}
      >
        {isConvertingHeic ? (
          <div className="max-w-lg">
            <div className="mx-auto mb-6 size-12 animate-pulse rounded-2xl bg-orange-500 shadow-[0_18px_60px_rgba(255,106,0,0.28)]" />
            <p className="text-3xl font-black text-white">Foto wordt omgezet...</p>
            <p className="mt-3 leading-7 text-zinc-400">
              HEIC wordt klaargemaakt voor preview en outfitcheck.
            </p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full">
            <img
              src={previewUrl}
              alt="Preview van je outfit"
              className="max-h-[32rem] w-full rounded-[1.25rem] border border-white/10 bg-black object-contain shadow-2xl shadow-black/50"
            />
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur">
              Preview
            </span>
          </div>
        ) : (
          <div className="max-w-lg">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.6rem] border border-orange-200/40 bg-orange-400 text-4xl font-black text-black shadow-[0_18px_70px_rgba(255,106,0,0.35)] transition duration-300 group-hover:rotate-3 group-hover:scale-105">
              ↑
            </div>
            <p className="text-4xl font-black leading-[0.9] tracking-[-0.05em] text-white sm:text-5xl">
              Drop. Roast. Deel.
            </p>
            <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-zinc-300 sm:text-lg">
              Sleep je outfitfoto hierheen of tik om je digitale catwalk te openen.
            </p>
            <p className="mt-6 inline-flex rounded-full border border-orange-500/35 bg-black/50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
              JPG, PNG, WEBP of HEIC · max 10 MB
            </p>
          </div>
        )}
      </label>
      <input
        id="outfit-image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        className="sr-only"
<<<<<<< HEAD
        disabled={disabled || isConvertingHeic}
=======
        disabled={disabled || isProcessingFile}
>>>>>>> a7da14b (Add Stripe premium subscriptions)
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <p className="mt-3 px-1 text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">
        Upload alleen foto’s van jezelf of van iemand die hier toestemming voor heeft gegeven.
        Je foto wordt alleen gebruikt voor deze outfitcheck en niet opgeslagen door Outfit Roaster.
      </p>
    </div>
  );
}

class ImageProcessingError extends Error {}

async function compressWithRetry(input: File | string) {
  try {
    return await compressImageToJpegDataUrl(input);
  } catch (firstError) {
    console.warn(
      "[Outfit Roaster] Eerste compressie mislukt, retry op 900px / 0.65:",
      firstError,
    );

    try {
      return await compressImageToJpegDataUrl(input, {
        maxDimension: 900,
        quality: 0.65,
      });
    } catch (retryError) {
      console.error("[Outfit Roaster] Tweede compressie mislukt:", retryError);
      throw new ImageProcessingError(
        "De foto kon ook na een tweede compressiepoging niet worden verwerkt.",
      );
    }
  }
}

function logCompressedSize(image: string) {
  console.info(
    "[Outfit Roaster] Gecomprimeerde data-URL:",
    formatBytes(getDataUrlByteSize(image)),
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function isHeicFile(file: File) {
  const lowerName = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    lowerName.endsWith(".heic") ||
    lowerName.endsWith(".heif")
  );
}

function getDataUrlByteSize(dataUrl: string) {
  const base64 = dataUrl.split(",", 2)[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function formatByteSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB (${bytes} bytes)`;
}
