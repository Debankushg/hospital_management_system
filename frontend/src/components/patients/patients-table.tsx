import { Badge } from "@/components/ui/badge";
import { PersonCell } from "@/components/ui/person-cell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, THead, Table, Td, Th, Tr } from "@/components/ui/table";
import type { Patient } from "@/types/patient.types";
import { ageFromDob } from "@/utils/age.util";
import { formatDate } from "@/utils/format-date.util";

interface PatientsTableProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
}

export function PatientsTable({ patients, onView }: PatientsTableProps) {
  if (!patients.length) return <EmptyState message="No patients found." />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Patient</Th>
          <Th>Phone</Th>
          <Th>Gender</Th>
          <Th>Age</Th>
          <Th>Blood group</Th>
          <Th>Registered</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {patients.map((p) => (
          <Tr key={p.id}>
            <Td>
<PersonCell name={p.fullName} sub={p.email} />
</Td>
            <Td>{p.phone ?? "–"}</Td>
            <Td className="capitalize">{p.gender ?? "–"}</Td>
            <Td>{ageFromDob(p.dateOfBirth) ?? "–"}</Td>
            <Td>{p.bloodGroup ?? "–"}</Td>
            <Td>{formatDate(p.createdAt)}</Td>
            <Td>
              <Badge tone={p.isActive ? "green" : "red"}>{p.isActive ? "Active" : "Inactive"}</Badge>
            </Td>
            <Td className="text-right">
<RowActions>
              <Button variant="secondary" size="sm" onClick={() => onView(p)}>
                View
              </Button>
            </RowActions>
</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
