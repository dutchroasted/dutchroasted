import { MAX_OUTFIT_IMAGE_SIZE } from "@/lib/outfitTypes";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const acceptedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

type ImageUploadProps = {
  previewUrl: string;
  onChange: (dataUrl: string, fileName: string) => void;
  onError: (message: string) => void;
};

export function ImageUpload({ previewUrl, onChange, onError }: ImageUploadProps) {
  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

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

    if (isHeicFile(file)) {
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
          throw new Error("HEIC conversion failed");
        }

        const data = (await response.json()) as { image: string };
        onChange(data.image, `${file.name.replace(/\.(heic|heif)$/i, "")}.jpg`);
      } catch {
        onError("Deze HEIC-foto kunnen we niet omzetten. Probeer een andere foto of exporteer als JPG.");
      }
      return;
    }

    readFileAsDataUrl(file, file.name);
  }

  function readFileAsDataUrl(file: Blob, name: string) {
    readBlobAsDataUrl(file)
      .then((dataUrl) => onChange(dataUrl, name))
      .catch(() => onError("Deze foto kunnen we niet lezen. Probeer een andere."));
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
        className="dr-card-hover group relative flex min-h-[23rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-orange-500/45 bg-[linear-gradient(145deg,rgba(255,106,0,0.12),rgba(255,255,255,0.035)_42%,rgba(0,0,0,0.72))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_28px_90px_rgba(0,0,0,0.35)] hover:border-orange-300 hover:shadow-[0_28px_90px_rgba(255,106,0,0.14)] sm:min-h-[30rem] sm:p-6"
      >
        {previewUrl ? (
          <div className="relative w-full">
            <img
              src={previewUrl}
              alt="Preview van je outfit"
              className="max-h-[34rem] w-full rounded-xl border border-white/10 bg-black object-contain shadow-2xl shadow-black/50"
            />
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur">
              Preview
            </span>
          </div>
        ) : (
          <div className="max-w-lg">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl font-black text-black shadow-[0_18px_60px_rgba(255,106,0,0.28)]">
              +
            </div>
            <p className="text-4xl font-black leading-none text-white sm:text-5xl">
              Drop je fit.
            </p>
            <p className="mt-4 text-lg font-semibold leading-8 text-zinc-300">
              Sleep je foto hierheen of klik om je outfit op de digitale catwalk te zetten.
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
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Upload alleen foto’s van jezelf of van iemand die hier toestemming voor heeft gegeven.
        Je foto wordt alleen gebruikt voor deze outfitcheck en niet opgeslagen door DutchRoasted.
      </p>
    </div>
  );
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
