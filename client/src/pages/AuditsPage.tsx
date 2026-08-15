import ResourcePage from "../components/common/ResourcePage";
export default function AuditsPage() {
  return (
    <ResourcePage
      title="Audits"
      subtitle="Plan, execute and monitor information-security audits"
      resource="audits"
      searchKeys={["code", "title", "department", "auditor"]}
      filters={[
        {
          key: "status",
          label: "Status",
          values: ["Planned", "In Progress", "Completed", "Overdue"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "title", label: "Title", required: true },
        { key: "department", label: "Department", required: true },
        {
          key: "auditor",
          label: "Auditor",
          required: true,
          selectResource: "users",
        },
        {
          key: "status",
          label: "Status",
          options: ["Planned", "In Progress", "Completed", "Overdue"],
        },
        { key: "startDate", label: "Start Date", type: "date", required: true },
        { key: "endDate", label: "End Date", type: "date", required: true },
        { key: "compliance", label: "Compliance %", type: "number" },
      ]}
    />
  );
}
