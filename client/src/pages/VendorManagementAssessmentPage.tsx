import ResourcePage from "../components/common/ResourcePage";

export default function VendorManagementAssessmentPage() {
  return (
    <ResourcePage
      title="Vendor Management"
      subtitle="Vendor profiles, risk posture, and approval status — saved directly to the database"
      resource="vendors"
      searchKeys={[
        "vendorName",
        "serviceDescription",
        "country",
        "primaryContactName",
        "email",
      ]}
      filters={[
        {
          key: "criticality",
          label: "Criticality",
          values: ["Critical", "High", "Medium", "Low"],
        },
        {
          key: "residualRisk",
          label: "Residual Risk",
          values: ["Critical", "High", "Medium", "Low"],
        },
        {
          key: "approvalStatus",
          label: "Approval",
          values: ["Pending", "Approved", "Rejected"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "vendorName", label: "Vendor Name", required: true },
        {
          key: "vendorType",
          label: "Vendor Type",
          options: [
            "Software",
            "Service",
            "Consulting",
            "Logistics",
            "Manufacturing",
            "Financial",
            "Other",
          ],
        },
        {
          key: "serviceDescription",
          label: "Service Description",
          required: true,
          multiline: true,
          hiddenInTable: true,
        },
        { key: "website", label: "Website", hiddenInTable: true },
        { key: "country", label: "Country / Region" },
        {
          key: "primaryContactName",
          label: "Primary Contact",
          required: true,
        },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", hiddenInTable: true },
        {
          key: "businessOwner",
          label: "Business Owner",
          required: true,
          selectResource: "users",
        },
        {
          key: "contractEndDate",
          label: "Contract End",
          type: "date",
          hiddenInTable: true,
        },
        {
          key: "nextReviewDate",
          label: "Next Review",
          type: "date",
          hiddenInTable: true,
        },
        {
          key: "criticality",
          label: "Criticality",
          options: ["Critical", "High", "Medium", "Low"],
        },
        {
          key: "dataAccessLevel",
          label: "Data Access",
          options: [
            "None",
            "Internal",
            "Confidential",
            "PII",
            "Payment Data",
            "PHI",
          ],
          hiddenInTable: true,
        },
        {
          key: "hostingModel",
          label: "Hosting Model",
          options: ["SaaS", "Cloud Hosted", "On-Premise", "Hybrid", "Other"],
          hiddenInTable: true,
        },
        {
          key: "inherentRisk",
          label: "Inherent Risk",
          options: ["Critical", "High", "Medium", "Low"],
          required: true,
          hiddenInTable: true,
        },
        {
          key: "controlEffectiveness",
          label: "Control Effectiveness",
          options: ["Strong", "Adequate", "Weak"],
          required: true,
          hiddenInTable: true,
        },
        {
          key: "residualRisk",
          label: "Residual Risk",
          hiddenInForm: true,
        },
        {
          key: "assessmentResult",
          label: "Assessment Result",
          options: [
            "Approved",
            "Approved with Conditions",
            "Remediation Required",
            "Hold",
            "Terminate",
          ],
          hiddenInTable: true,
        },
        {
          key: "approvalStatus",
          label: "Approval",
          options: ["Pending", "Approved", "Rejected"],
        },
        { key: "notes", label: "Notes", multiline: true, hiddenInTable: true },
      ]}
    />
  );
}
