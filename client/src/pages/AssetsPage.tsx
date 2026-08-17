import { useEffect, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import ResourcePage from "../components/common/ResourcePage";
import { api } from "../lib/api";

export default function AssetsPage() {
  const [preview, setPreview] = useState<{
    name: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const openPreview = async (row: any) => {
    const token = localStorage.getItem("is_audit_token");
    const response = await fetch(`/api/assets/${row._id}/photo`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Preview failed");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    setPreview((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return {
        name: row.photoName || row.assetName || "asset-photo",
        url,
      };
    });
  };

  return (
    <>
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
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  void openPreview(row);
                }}
                className="p-2 text-slate-400 hover:text-ink-700 rounded"
                title="Preview photo"
              >
                <Eye className="w-4 h-4" />
              </button>
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
            </div>
          ) : null
        }
      />

      {preview && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="font-semibold text-slate-900">Photo Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {preview.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center p-4 sm:p-6">
              <img
                src={preview.url}
                alt={preview.name}
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain bg-white shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
