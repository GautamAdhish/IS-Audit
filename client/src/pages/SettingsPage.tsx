import React, { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card, { CardHeader, CardBody } from "../components/common/Card";
import { Save } from "lucide-react";
import { api } from "../lib/api";
export default function SettingsPage() {
  const [s, setS] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/settings")
      .then((r) => setS(r.data))
      .catch((e) => setError(e.message));
  }, []);
  if (!s)
    return <div className="p-8 text-sm text-slate-500">Loading settings…</div>;
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const body = {
      organisationName: fd.get("organisationName"),
      industry: fd.get("industry"),
      primaryStandard: fd.get("primaryStandard"),
      auditCycle: fd.get("auditCycle"),
      auditParameters: {
        defaultAuditDurationDays: Number(fd.get("defaultAuditDurationDays")),
        capaResolutionSlaDays: Number(fd.get("capaResolutionSlaDays")),
        majorNcEscalationThreshold: Number(
          fd.get("majorNcEscalationThreshold"),
        ),
        riskScoreAlertThreshold: Number(fd.get("riskScoreAlertThreshold")),
      },
    };
    try {
      const r = await api.patch("/settings", body);
      setS(r.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="System configuration and preferences"
      />
      <form onSubmit={save}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Organisation" subtitle="Basic information" />
            <CardBody>
              <div className="space-y-4">
                {[
                  ["organisationName", "Organisation Name"],
                  ["industry", "Industry"],
                  ["primaryStandard", "Primary Standard"],
                  ["auditCycle", "Audit Cycle"],
                ].map(([k, l]) => (
                  <div key={k}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {l}
                    </label>
                    <input
                      name={k}
                      defaultValue={s[k]}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="Audit Parameters"
              subtitle="Defaults for new audits"
            />
            <CardBody>
              <div className="space-y-4">
                {[
                  ["defaultAuditDurationDays", "Default Audit Duration (days)"],
                  ["capaResolutionSlaDays", "CAPA Resolution SLA (days)"],
                  [
                    "majorNcEscalationThreshold",
                    "Major NC Escalation Threshold",
                  ],
                  ["riskScoreAlertThreshold", "Risk Score Alert Threshold"],
                ].map(([k, l]) => (
                  <div key={k}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {l}
                    </label>
                    <input
                      name={k}
                      type="number"
                      defaultValue={s.auditParameters?.[k]}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            icon={<Save className="w-4 h-4" />}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
