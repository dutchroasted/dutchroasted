"use client";

type FreeCheckLimitNoticeProps = {
  used: number;
  limit: number;
  isLimitReached: boolean;
};

export function FreeCheckLimitNotice({ used, limit, isLimitReached }: FreeCheckLimitNoticeProps) {
  const remaining = Math.max(0, limit - used);

  return (
    <div className="mb-5 rounded-2xl border border-orange-500/25 bg-[linear-gradient(135deg,rgba(255,106,0,0.12),rgba(255,255,255,0.035))] p-4">
      <p className="font-black text-white">
        Je hebt vandaag nog {remaining} van de {limit} gratis roasts over.
      </p>
      {isLimitReached ? (
        <p className="mt-2 text-sm font-bold leading-6 text-orange-100">
          Je gratis roasts voor vandaag zijn gebruikt. Morgen staat de teller weer op vijf.
        </p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Elke geslaagde Outfit Roast gebruikt één gratis roast.
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        Voor deze MVP wordt je gratis limiet tijdelijk in je browser opgeslagen.
      </p>
    </div>
  );
}
