type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="dr-fade-in rounded-2xl border border-orange-500/30 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),rgba(255,255,255,0.035))] p-6 shadow-[0_22px_80px_rgba(255,106,0,0.12)]">
      <div className="flex items-start gap-4">
        <span className="mt-2 size-3 shrink-0 animate-ping rounded-full bg-orange-500" />
        <div>
          <p className="text-xl font-black text-white">{message}</p>
          <p className="mt-2 leading-7 text-zinc-400">
            De stylist warmt op, de roast wordt gestoomd.
          </p>
        </div>
      </div>
    </div>
  );
}
