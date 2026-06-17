type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message = "Er ging iets mis. Probeer het opnieuw." }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5">
      <p className="font-bold text-red-100">{message}</p>
    </div>
  );
}
