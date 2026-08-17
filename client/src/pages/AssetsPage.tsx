import { Download } from "lucide-react";
import ResourcePage from "../components/common/ResourcePage";
import { api } from "../lib/api";

export default function AssetsPage() {
  return (
    <ResourcePage
      title="Assets"
      subtitle="Asset inventory and assessment records with photo evidence"
      resource="assets"
      searchKeys={[
        "code",
        "assetName",
        "assetTag",
        "location",
        "department",
        "notes",
      ]}
      filters={[
        {
          key: "category",
          label: "Category",
          values: [
            "Hardware",
            "Equipment",
            "Facility",
            "Vehicle",
            "Tool",
            "Other",
          ],
        },
        {
          key: "condition",
          label: "Condition",
          values: ["Excellent", "Good", "Fair", "Poor"],
        },
        {
          key: "assessmentStatus",
          label: "Assessment Status",
          values: ["Pass", "Needs Review", "Non-Compliant", "Retired"],
        },
      ]}
      fields={[
        { key: "code", label: "ID", hiddenInTable: true },
        { key: "assetName", label: "Asset Name", required: true },
        { key: "assetTag", label: "Asset Tag", required: true },
        {
          key: "category",
          label: "Category",
          options: [
            "Hardware",
            "Equipment",
            "Facility",
            "Vehicle",
            "Tool",
            "Other",
          ],
          required: true,
        },
        { key: "location", label: "Location", required: true },
        { key: "department", label: "Department", required: true },
        {
          key: "condition",
          label: "Condition",
          options: ["Excellent", "Good", "Fair", "Poor"],
          required: true,
        },
        {
          key: "assessmentStatus",
          label: "Assessment Status",
          options: ["Pass", "Needs Review", "Non-Compliant", "Retired"],
          required: true,
        },
        {
          key: "assessedBy",
          label: "Assessed By",
          required: true,
          selectResource: "users",
        },
        {
          key: "assessmentDate",
          label: "Assessment Date",
          type: "date",
          required: true,
        },
        { key: "notes", label: "Assessment Notes", multiline: true },
        {
          key: "photo",
          label: "Asset Photo",
          type: "file",
          accept: ".png,.jpg,.jpeg",
          required: true,
          hiddenInTable: true,
        },
        { key: "photoName", label: "Photo File", hiddenInForm: true },
        { key: "photoSize", label: "Photo Size", hiddenInForm: true },
      ]}
      rowActions={(row) =>
        row.photoName ? (
          <button
            type="button"
            onClick={() =>
              api.download(`/assets/${row._id}/photo`, row.photoName)
            }
            className="p-2 text-slate-400 hover:text-ink-700 rounded"
            title="Download photo"
          >
            <Download className="w-4 h-4" />
          </button>
        ) : null
      }
    />
  );
}
