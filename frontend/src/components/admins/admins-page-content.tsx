"use client";

import { ArrowUpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { useAdmins } from "@/hooks/use-admins";
import type { AdminWithAssignments } from "@/types/admin.types";
import { AdminsTable } from "./admins-table";
import { CreateAdminForm } from "./create-admin-form";
import { DemoteAdminForm } from "./demote-admin-form";
import { EditAssignmentsForm } from "./edit-assignments-form";
import { PromoteUserForm } from "./promote-user-form";

type ModalState =
  | { type: "create" }
  | { type: "promote" }
  | { type: "edit"; admin: AdminWithAssignments }
  | { type: "demote"; admin: AdminWithAssignments }
  | null;

export function AdminsPageContent() {
  const admins = useAdmins();
  const [modal, setModal] = useState<ModalState>(null);
  const close = () => setModal(null);

  return (
    <>
      <PageHeader
        title="Admins"
        description="Make anyone an admin and assign the work they are responsible for."
        actions={
          <>
            <Button variant="secondary" onClick={() => setModal({ type: "promote" })}>
              <ArrowUpCircle className="size-4" />
              Promote existing user
            </Button>
            <Button onClick={() => setModal({ type: "create" })}>
              <Plus className="size-4" />
              New admin
            </Button>
          </>
        }
      />
      <QueryState isLoading={admins.isLoading} error={admins.error}>
        <AdminsTable
          admins={admins.data ?? []}
          onEdit={(admin) => setModal({ type: "edit", admin })}
          onDemote={(admin) => setModal({ type: "demote", admin })}
        />
      </QueryState>

      {modal?.type === "create" && (
        <Modal title="New admin" onClose={close}>
          <CreateAdminForm onDone={close} />
        </Modal>
      )}
      {modal?.type === "promote" && (
        <Modal title="Promote user to admin" onClose={close}>
          <PromoteUserForm onDone={close} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title={`Work assigned to ${modal.admin.fullName}`} onClose={close}>
          <EditAssignmentsForm admin={modal.admin} onDone={close} />
        </Modal>
      )}
      {modal?.type === "demote" && (
        <Modal title="Remove admin rights" onClose={close}>
          <DemoteAdminForm admin={modal.admin} onDone={close} />
        </Modal>
      )}
    </>
  );
}
