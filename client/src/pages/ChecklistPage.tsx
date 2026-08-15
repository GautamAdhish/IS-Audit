import ResourcePage from "../components/common/ResourcePage";
export default function ChecklistPage() {
  return (
    <ResourcePage
      title="ISO 27001 Checklist"
      subtitle="Clause-by-clause compliance assessment"
      resource="checklist"
      searchKeys={["code", "clause", "title", "description"]}
      filters={[
        {
          key: "status",
          label: "Status",
          values: ["Compliant", "Non-Compliant", "Partial", "N/A"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "clause", label: "Clause", required: true },
        { key: "title", label: "Title", required: true },
        { key: "description", label: "Description", multiline: true },
        {
          key: "status",
          label: "Status",
          options: ["Compliant", "Non-Compliant", "Partial", "N/A"],
        },
        { key: "evidence", label: "Evidence", multiline: true },
        {
          key: "auditId",
          label: "Audit",
          selectResource: "audits",
          selectLabel: "title",
        },
        {
          key: "auditor",
          label: "Auditor",
          required: true,
          selectResource: "users",
        },
      ]}
    />
  );
}
