import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[40rem] text-left text-sm", className)} {...props} />
      </div>
    </div>
  );
}

export const THead = (props: ComponentProps<"thead">) => (
  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium uppercase tracking-wide text-slate-500" {...props} />
);

export const Th = ({ className, ...props }: ComponentProps<"th">) => (
  <th className={cn("px-4 py-3 font-medium", className)} {...props} />
);

export const Tr = ({ className, ...props }: ComponentProps<"tr">) => (
  <tr className={cn("border-t border-slate-100 transition-colors first:border-t-0 hover:bg-slate-50/60", className)} {...props} />
);

export const Td = ({ className, ...props }: ComponentProps<"td">) => (
  <td className={cn("px-4 py-3.5 align-middle", className)} {...props} />
);

/** Right-aligned group of row action buttons. */
export const RowActions = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex flex-wrap items-center justify-end gap-2", className)} {...props} />
);
