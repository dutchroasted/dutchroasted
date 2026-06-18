type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-400/70 bg-[linear-gradient(135deg,#ff7a00,#e11919)] text-lg font-black text-black shadow-[0_0_34px_rgba(255,106,0,0.38)]">
        <span className="absolute inset-x-2 top-2 h-px bg-white/45" />
        OR
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-base font-black tracking-wide text-white sm:text-lg">
            Outfit <span className="text-orange-500">Roaster</span>
          </span>
          <span className="mt-1 hidden text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 sm:block">
            Roast your fit
          </span>
        </span>
      ) : null}
    </span>
  );
}
