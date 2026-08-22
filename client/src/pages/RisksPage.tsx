import { ShieldAlert } from "lucide-react";
import ResourcePage from "../components/common/ResourcePage";
export default function RisksPage() {
  return (
    <ResourcePage
      title="Risk Register"
      subtitle="Identify, assess and treat information-security risks"
      resource="risks"
      icon={ShieldAlert}
      searchKeys={["code", "title", "category", "owner"]}
      filters={[
        {
          key: "level",
          label: "Level",
          values: ["Critical", "High", "Medium", "Low"],
        },
        {
          key: "status",
          label: "Status",
          values: ["Open", "Mitigated", "Accepted", "Closed"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "title", label: "Title", required: true },
        { key: "category", label: "Category", required: true },
        {
          key: "likelihood",
          label: "Likelihood",
          type: "number",
          required: true,
        },
        { key: "impact", label: "Impact", type: "number", required: true },
        { key: "level", label: "Level", hiddenInTable: true },
        { key: "riskScore", label: "Score", hiddenInTable: true },
        {
          key: "owner",
          label: "Owner",
          required: true,
          selectResource: "users",
        },
        {
          key: "status",
          label: "Status",
          options: ["Open", "Mitigated", "Accepted", "Closed"],
        },
        { key: "mitigationPlan", label: "Mitigation Plan", multiline: true },
      ]}
    />
  );
}
