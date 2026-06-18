export function LoadingState() {
  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/[0.08] p-5">
      <div className="flex items-center gap-4">
        <span className="size-3 animate-ping rounded-full bg-orange-500" />
        <p className="font-bold text-orange-100">Outfit Roaster is je tekst aan het fileren...</p>
      </div>
    </div>
  );
}
