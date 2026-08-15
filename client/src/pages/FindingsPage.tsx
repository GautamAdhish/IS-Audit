import ResourcePage from "../components/common/ResourcePage";
export default function FindingsPage() {
  return (
    <ResourcePage
      title="Findings"
      subtitle="Track nonconformities, observations and remediation deadlines"
      resource="findings"
      searchKeys={["code", "title", "department", "assignee"]}
      filters={[
        {
          key: "severity",
          label: "Severity",
          values: ["Major", "Minor", "Observation"],
        },
        {
          key: "status",
          label: "Status",
          values: ["Open", "In Review", "Closed"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "title", label: "Title", required: true },
        { key: "department", label: "Department", required: true },
        {
          key: "auditId",
          label: "Audit",
          required: true,
          selectResource: "audits",
          selectLabel: "title",
        },
        {
          key: "severity",
          label: "Severity",
          options: ["Major", "Minor", "Observation"],
          required: true,
        },
        {
          key: "status",
          label: "Status",
          options: ["Open", "In Review", "Closed"],
        },
        {
          key: "assignee",
          label: "Assignee",
          required: true,
          selectResource: "users",
        },
        { key: "dateFound", label: "Date Found", type: "date", required: true },
        { key: "dueDate", label: "Due Date", type: "date", required: true },
        { key: "description", label: "Description", multiline: true },
      ]}
    />
  );
}
