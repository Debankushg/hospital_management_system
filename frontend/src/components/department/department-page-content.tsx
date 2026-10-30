import { PageHeader } from "@/components/layout/page-header";
import { DepartmentList } from "./department-list";

export function DepartmentPageContent() {
  return (
    <>
      <PageHeader
        title="My department"
        description="The work areas assigned to you, their members and duty times."
      />
      <DepartmentList />
    </>
  );
}
