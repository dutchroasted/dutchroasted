type FreeLimitNoticeProps = {
  used: number;
  limit: number | null;
  isLimitReached: boolean;
  isAuthenticated?: boolean;
  plan?: string;
  unlimited?: boolean;
};

export function FreeLimitNotice({
  used,
  limit,
  isLimitReached,
  isAuthenticated = false,
  plan = "free",
  unlimited = false,
}: FreeLimitNoticeProps) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        isLimitReached
          ? "border-orange-500/40 bg-orange-500/[0.09]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {unlimited ? (
            <p className="font-black text-white">
              Je zit op {plan}. Roast zoveel als je tekst aankan.
            </p>
          ) : (
            <p className="font-black text-white">
              Je hebt vandaag nog {Math.max(0, (limit ?? 5) - used)} van de {limit ?? 5} gratis roasts over.
            </p>
          )}
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {isAuthenticated
              ? "Je gebruik wordt bijgehouden in je Outfit Roaster-profiel."
              : "Voor deze MVP wordt je gratis limiet tijdelijk in je browser opgeslagen."}
          </p>
          {!isAuthenticated ? (
            <p className="mt-2 text-sm font-bold leading-6 text-orange-200">
              Maak gratis een account om je gebruik beter bij te houden.
            </p>
          ) : null}
          {isLimitReached ? (
            <p className="mt-3 font-bold leading-7 text-orange-200">
              Je gratis roasts voor vandaag zijn op. Met actief Premium krijg je Pro Analyse.
            </p>
          ) : null}
        </div>

        {isLimitReached ? (
          <a
            href="/pricing"
            className="shrink-0 rounded-md bg-orange-500 px-4 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400"
          >
            Bekijk Premium
          </a>
        ) : null}
      </div>
    </div>
  );
}
