import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { api } from "../lib/api";
import { Upload, Download, FileText } from "lucide-react";
export default function EvidencePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    Promise.all([
      api.get("/evidence?limit=100&sort=-uploadedDate"),
      api.get("/audits?limit=100"),
    ])
      .then(([e, a]) => {
        setRows(e.data || []);
        setAudits(a.data || []);
      })
      .catch((e) => setError(e.message));
  }, []);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const title = prompt("Document title", file.name);
    if (!title) return;
    const auditId = prompt(
      `Audit ID (${audits.map((a) => a.code).join(", ")})`,
    );
    const audit = audits.find((a) => a.code === auditId || a._id === auditId);
    if (!audit) return alert("Please enter a valid audit code.");
    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("type", "Record");
    form.append("relatedAudit", audit._id);
    form.append("tags", "uploaded");
    setBusy(true);
    try {
      const r = await api.post("/evidence", form);
      setRows((x) => [r.data, ...x]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const download = async (row: any) => {
    try {
      await api.download(
        `/evidence/${row._id}/download`,
        row.fileName || row.title || "evidence",
      );
    } catch (err: any) {
      setError(err.message);
    }
  };
  const filtered = rows.filter(
    (r) =>
      (type === "All" || r.type === type) &&
      (!search ||
        `${r.title} ${r.tags?.join(" ")} ${r.uploadedBy?.name}`
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <div>
      <PageHeader
        title="Documents & Evidence"
        subtitle={`${rows.length} documents stored`}
        action={
          <>
            <Button
              icon={<Upload className="w-4 h-4" />}
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Document
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={upload}
            />
          </>
        }
      />
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents, tags…"
          className="max-w-sm w-full px-3 py-2 text-sm bg-white border rounded-lg"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            "All",
            "Policy",
            "Procedure",
            "Record",
            "Report",
            "Certificate",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${type === t ? "bg-ink-800 text-white" : "bg-white text-slate-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((r) => (
          <div key={r._id} className="bg-white rounded-xl border p-4">
            <div className="flex justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center">
                <FileText className="w-4 h-4 text-ink-700" />
              </div>
              <Badge label={r.type} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{r.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {r.uploadedBy?.name || "—"} · {r.fileSize || "—"}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Audit: {r.relatedAudit?.code || "—"}
            </p>
            {r.fileName ? (
              <button
                type="button"
                onClick={() => download(r)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-ink-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            ) : (
              <span className="mt-3 inline-flex items-center text-xs text-slate-400">
                No file attached
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
