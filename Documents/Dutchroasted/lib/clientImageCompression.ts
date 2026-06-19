const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.75;
const CONVERSION_QUALITY = 0.92;

<<<<<<< HEAD
type CompressionOptions = {
  maxDimension?: number;
  quality?: number;
  onConverted?: (dataUrl: string) => void;
=======
type ImageCompressionOptions = {
  maxDimension?: number;
  quality?: number;
>>>>>>> a7da14b (Add Stripe premium subscriptions)
};

export async function compressImageToJpegDataUrl(
  input: File | string,
<<<<<<< HEAD
  options: CompressionOptions = {},
) {
=======
  options: ImageCompressionOptions = {},
) {
  const maxDimension = options.maxDimension ?? MAX_IMAGE_DIMENSION;
  const quality = options.quality ?? JPEG_QUALITY;
>>>>>>> a7da14b (Add Stripe premium subscriptions)
  const sourceDataUrl = typeof input === "string" ? input : await readFileAsDataUrl(input);
  const image = await loadImage(sourceDataUrl);
  const { width, height } = getResizedDimensions(
    image.width,
    image.height,
<<<<<<< HEAD
    options.maxDimension ?? MAX_IMAGE_DIMENSION,
=======
    maxDimension,
>>>>>>> a7da14b (Add Stripe premium subscriptions)
  );
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

<<<<<<< HEAD
  const convertedDataUrl = canvas.toDataURL("image/jpeg", CONVERSION_QUALITY);
  options.onConverted?.(convertedDataUrl);

  return canvas.toDataURL("image/jpeg", options.quality ?? JPEG_QUALITY);
}

=======
  const compressedImage = canvas.toDataURL("image/jpeg", quality);
  if (!compressedImage.startsWith("data:image/jpeg;base64,")) {
    throw new Error("Canvas returned an invalid JPEG");
  }

  return compressedImage;
}

export function getDataUrlByteSize(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

>>>>>>> a7da14b (Add Stripe premium subscriptions)
function getResizedDimensions(width: number, height: number, maxDimension: number) {
  const longestSide = Math.max(width, height);

  if (longestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function readFileAsDataUrl(file: File) {
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

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = dataUrl;
  });
}
