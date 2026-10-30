import { Avatar } from "./avatar";

/** Avatar with a name and a secondary line: the standard "person" cell in tables. */
export function PersonCell({ name, sub }: { name: string; sub?: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{name}</p>
        {sub && <p className="truncate text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}
