import ResourcePage from "../components/common/ResourcePage";
export default function CapaPage() {
  return (
    <ResourcePage
      title="CAPA"
      subtitle="Corrective and Preventive Actions"
      resource="capas"
      searchKeys={["code", "title", "owner"]}
      filters={[
        {
          key: "status",
          label: "Status",
          values: ["Open", "In Progress", "Verified", "Closed"],
        },
        {
          key: "priority",
          label: "Priority",
          values: ["High", "Medium", "Low"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "title", label: "Title", required: true },
        {
          key: "findingId",
          label: "Finding",
          required: true,
          selectResource: "findings",
          selectLabel: "title",
        },
        {
          key: "owner",
          label: "Owner",
          required: true,
          selectResource: "users",
        },
        { key: "dueDate", label: "Due Date", type: "date", required: true },
        {
          key: "status",
          label: "Status",
          options: ["Open", "In Progress", "Verified", "Closed"],
        },
        {
          key: "priority",
          label: "Priority",
          options: ["High", "Medium", "Low"],
        },
        {
          key: "rootCause",
          label: "Root Cause",
          required: true,
          multiline: true,
        },
        {
          key: "correctiveAction",
          label: "Corrective Action",
          required: true,
          multiline: true,
        },
        {
          key: "preventiveAction",
          label: "Preventive Action",
          required: true,
          multiline: true,
        },
      ]}
    />
  );
}
