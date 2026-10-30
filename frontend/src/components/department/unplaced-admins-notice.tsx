import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { ROUTES } from "@/config/routes.config";
import type { UnplacedAdmin } from "@/types/department.types";

/** Super admin only: admins without a profession cannot be placed in a department list. */
export function UnplacedAdminsNotice({ admins }: { admins: UnplacedAdmin[] }) {
  return (
    <div className="mb-6">
      <Alert tone="info">
        <strong>{admins.map((a) => a.fullName).join(", ")}</strong>{" "}
        {admins.length === 1 ? "is an admin with no profession set, so they are" : "are admins with no profession set, so they are"}{" "}
        not listed in any department. Choose what they work as under{" "}
        <Link href={ROUTES.admins} className="font-medium underline">
          Admins → Edit work
        </Link>
        .
      </Alert>
    </div>
  );
}
