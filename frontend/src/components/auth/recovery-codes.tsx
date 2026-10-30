export function RecoveryCodes({ codes }: { codes: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">
        Save these one-time recovery codes somewhere safe. Each can be used once if you lose access to your
        authenticator app. <strong>They will not be shown again.</strong>
      </p>
      <ul className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 font-mono text-sm">
        {codes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
