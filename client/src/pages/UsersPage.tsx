import ResourcePage from "../components/common/ResourcePage";
export default function UsersPage() {
  return (
    <ResourcePage
      title="Users"
      subtitle="Manage auditors, auditees and system access"
      resource="users"
      searchKeys={["code", "name", "email", "department"]}
      filters={[
        {
          key: "role",
          label: "Role",
          values: ["Admin", "Lead Auditor", "Auditor", "Auditee", "Viewer"],
        },
        { key: "status", label: "Status", values: ["Active", "Inactive"] },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "name", label: "Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        {
          key: "password",
          label: "Password",
          type: "password",
          required: true,
          hiddenInTable: true,
          hiddenInForm: false,
        },
        {
          key: "role",
          label: "Role",
          options: ["Admin", "Lead Auditor", "Auditor", "Auditee", "Viewer"],
        },
        { key: "department", label: "Department", required: true },
        { key: "status", label: "Status", options: ["Active", "Inactive"] },
        { key: "lastLogin", label: "Last Login", hiddenInTable: true },
      ]}
    />
  );
}
