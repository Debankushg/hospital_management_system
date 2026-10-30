"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { useMyAppointments } from "@/hooks/use-my-appointments";
import { BookAppointmentForm } from "./book-appointment-form";
import { MyAppointmentsTable } from "./my-appointments-table";

export function MyAppointmentsPageContent() {
  const appointments = useMyAppointments();
  const [booking, setBooking] = useState(false);

  return (
    <>
      <PageHeader
        title="My appointments"
        description="Request a doctor visit. The reception will assign an available doctor and confirm."
        actions={
          <Button onClick={() => setBooking(true)}>
            <Plus className="size-4" />
            Book appointment
          </Button>
        }
      />
      <QueryState isLoading={appointments.isLoading} error={appointments.error}>
        <MyAppointmentsTable appointments={appointments.data ?? []} />
      </QueryState>
      {booking && (
        <Modal title="Book appointment" onClose={() => setBooking(false)}>
          <BookAppointmentForm onDone={() => setBooking(false)} />
        </Modal>
      )}
    </>
  );
}
