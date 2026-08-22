import React, { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card, { CardHeader, CardBody } from "../components/common/Card";
import FormField from "../components/common/FormField";
import Input from "../components/common/Input";
import Alert from "../components/common/Alert";
import LoadingState from "../components/common/LoadingState";
import { Save } from "lucide-react";
import { api } from "../lib/api";

const ORG_FIELDS: [string, string][] = [
  ["organisationName", "Organisation Name"],
  ["industry", "Industry"],
  ["primaryStandard", "Primary Standard"],
  ["auditCycle", "Audit Cycle"],
];

const AUDIT_PARAM_FIELDS: [string, string][] = [
  ["defaultAuditDurationDays", "Default Audit Duration (days)"],
  ["capaResolutionSlaDays", "CAPA Resolution SLA (days)"],
  ["majorNcEscalationThreshold", "Major NC Escalation Threshold"],
  ["riskScoreAlertThreshold", "Risk Score Alert Threshold"],
];

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

  if (!s) return <LoadingState message="Loading settings…" />;

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
                {ORG_FIELDS.map(([k, l]) => (
                  <FormField key={k} label={l}>
                    <Input name={k} defaultValue={s[k]} />
                  </FormField>
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
                {AUDIT_PARAM_FIELDS.map(([k, l]) => (
                  <FormField key={k} label={l}>
                    <Input
                      name={k}
                      type="number"
                      defaultValue={s.auditParameters?.[k]}
                    />
                  </FormField>
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
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
    </div>
  );
}
