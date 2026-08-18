import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Users,
} from "lucide-react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card, { CardBody, CardHeader } from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";

type VendorAssessmentForm = {
  vendorName: string;
  vendorCode: string;
  vendorType: string;
  serviceDescription: string;
  website: string;
  country: string;
  registrationNumber: string;
  primaryContactName: string;
  primaryContactRole: string;
  email: string;
  phone: string;
  businessOwner: string;
  procurementOwner: string;
  contractOwner: string;
  contractStartDate: string;
  contractEndDate: string;
  reviewFrequency: string;
  criticality: string;
  dataAccessLevel: string;
  hostingModel: string;
  securityCertifications: string;
  insuranceCoverage: string;
  lastAssessmentDate: string;
  nextReviewDate: string;
  inherentRisk: string;
  controlEffectiveness: string;
  residualRisk: string;
  assessmentResult: string;
  keyFindings: string;
  remediationPlan: string;
  approvalStatus: string;
  approverName: string;
  approvalDate: string;
  notes: string;
};

type VendorAssessmentRecord = VendorAssessmentForm & {
  id: string;
  submittedAt: string;
};

const storageKey = "is_audit_vendor_assessments";

const initialForm: VendorAssessmentForm = {
  vendorName: "",
  vendorCode: "",
  vendorType: "Software",
  serviceDescription: "",
  website: "",
  country: "",
  registrationNumber: "",
  primaryContactName: "",
  primaryContactRole: "",
  email: "",
  phone: "",
  businessOwner: "",
  procurementOwner: "",
  contractOwner: "",
  contractStartDate: "",
  contractEndDate: "",
  reviewFrequency: "Annual",
  criticality: "High",
  dataAccessLevel: "Internal",
  hostingModel: "SaaS",
  securityCertifications: "",
  insuranceCoverage: "",
  lastAssessmentDate: "",
  nextReviewDate: "",
  inherentRisk: "High",
  controlEffectiveness: "Adequate",
  residualRisk: "Medium",
  assessmentResult: "Approved",
  keyFindings: "",
  remediationPlan: "",
  approvalStatus: "Pending",
  approverName: "",
  approvalDate: "",
  notes: "",
};

const selectClasses =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white";
const inputClasses =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white";

const optionGroups = {
  vendorType: [
    "Software",
    "Service",
    "Consulting",
    "Logistics",
    "Manufacturing",
    "Financial",
    "Other",
  ],
  reviewFrequency: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "Ad Hoc"],
  criticality: ["Critical", "High", "Medium", "Low"],
  dataAccessLevel: [
    "None",
    "Internal",
    "Confidential",
    "PII",
    "Payment Data",
    "PHI",
  ],
  hostingModel: ["SaaS", "Cloud Hosted", "On-Premise", "Hybrid", "Other"],
  inherentRisk: ["Critical", "High", "Medium", "Low"],
  controlEffectiveness: ["Strong", "Adequate", "Weak"],
  residualRisk: ["Critical", "High", "Medium", "Low"],
  assessmentResult: [
    "Approved",
    "Approved with Conditions",
    "Remediation Required",
    "Hold",
    "Terminate",
  ],
  approvalStatus: ["Pending", "Approved", "Rejected"],
};

export default function VendorManagementAssessmentPage() {
  const [form, setForm] = useState<VendorAssessmentForm>(initialForm);
  const [submitted, setSubmitted] = useState<VendorAssessmentRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSubmitted(parsed);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(submitted));
  }, [submitted]);

  const recentAssessment = useMemo(() => submitted[0] ?? null, [submitted]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const record: VendorAssessmentRecord = {
      ...form,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };

    setSubmitted((current) => [record, ...current]);
    setMessage(`Saved assessment for ${form.vendorName || "vendor"}.`);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        title="Vendor Management & Assessment"
        subtitle="Capture vendor profile details, risk posture, controls, and approval status in one place."
      />

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader
            title="Vendor Profile"
            subtitle="Core business and contact information"
            action={<Building2 className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <div className="text-lg font-semibold text-ink-900">
              {form.vendorName || "No vendor selected"}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {form.vendorType} • {form.country || "Country not set"}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Assessment Status"
            subtitle="Current decision and risk view"
            action={<ShieldCheck className="w-4 h-4 text-slate-400" />}
          />
          <CardBody className="flex items-center justify-between gap-4">
            <div>
              <Badge label={form.assessmentResult} />
              <p className="mt-2 text-sm text-slate-500">
                Inherent risk: {form.inherentRisk} | Residual risk:{" "}
                {form.residualRisk}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Review Timeline"
            subtitle="Contract and assessment cadence"
            action={<CalendarRange className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <p className="text-sm text-slate-500">Contract end</p>
            <p className="text-base font-semibold text-ink-900">
              {form.contractEndDate || "Not provided"}
            </p>
            <p className="mt-3 text-sm text-slate-500">Next review</p>
            <p className="text-base font-semibold text-ink-900">
              {form.nextReviewDate || "Not scheduled"}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <Card>
          <CardHeader
            title="Vendor Assessment Form"
            subtitle="Complete the fields below to document onboarding or periodic vendor review"
            action={<ClipboardList className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Vendor Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Identify the supplier and the service they provide.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Vendor Name *
                    </span>
                    <input
                      name="vendorName"
                      value={form.vendorName}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Vendor Code *
                    </span>
                    <input
                      name="vendorCode"
                      value={form.vendorCode}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Vendor Type
                    </span>
                    <select
                      name="vendorType"
                      value={form.vendorType}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.vendorType.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Website
                    </span>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Service Description *
                    </span>
                    <textarea
                      name="serviceDescription"
                      value={form.serviceDescription}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Country / Region
                    </span>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Registration Number
                    </span>
                    <input
                      name="registrationNumber"
                      value={form.registrationNumber}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Contacts and Ownership
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Capture the people responsible for the relationship and
                    control follow-up.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Primary Contact Name *
                    </span>
                    <input
                      name="primaryContactName"
                      value={form.primaryContactName}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Primary Contact Role
                    </span>
                    <input
                      name="primaryContactRole"
                      value={form.primaryContactRole}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Email *
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Phone
                    </span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Business Owner *
                    </span>
                    <input
                      name="businessOwner"
                      value={form.businessOwner}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Procurement Owner
                    </span>
                    <input
                      name="procurementOwner"
                      value={form.procurementOwner}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Contract Owner *
                    </span>
                    <input
                      name="contractOwner"
                      value={form.contractOwner}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Contract and Access
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Record the commercial relationship and how much access the
                    vendor has.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Contract Start Date
                    </span>
                    <input
                      name="contractStartDate"
                      type="date"
                      value={form.contractStartDate}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Contract End Date
                    </span>
                    <input
                      name="contractEndDate"
                      type="date"
                      value={form.contractEndDate}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Review Frequency
                    </span>
                    <select
                      name="reviewFrequency"
                      value={form.reviewFrequency}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.reviewFrequency.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Criticality
                    </span>
                    <select
                      name="criticality"
                      value={form.criticality}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.criticality.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Data Access Level
                    </span>
                    <select
                      name="dataAccessLevel"
                      value={form.dataAccessLevel}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.dataAccessLevel.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Hosting Model
                    </span>
                    <select
                      name="hostingModel"
                      value={form.hostingModel}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.hostingModel.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Security Certifications
                    </span>
                    <input
                      name="securityCertifications"
                      value={form.securityCertifications}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="ISO 27001, SOC 2, PCI DSS, etc."
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Insurance Coverage
                    </span>
                    <input
                      name="insuranceCoverage"
                      value={form.insuranceCoverage}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Cyber liability, professional indemnity, etc."
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Risk Assessment and Approval
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Document findings, remediation, and final approval status.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Last Assessment Date
                    </span>
                    <input
                      name="lastAssessmentDate"
                      type="date"
                      value={form.lastAssessmentDate}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Next Review Date
                    </span>
                    <input
                      name="nextReviewDate"
                      type="date"
                      value={form.nextReviewDate}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Inherent Risk
                    </span>
                    <select
                      name="inherentRisk"
                      value={form.inherentRisk}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.inherentRisk.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Control Effectiveness
                    </span>
                    <select
                      name="controlEffectiveness"
                      value={form.controlEffectiveness}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.controlEffectiveness.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Residual Risk
                    </span>
                    <select
                      name="residualRisk"
                      value={form.residualRisk}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.residualRisk.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Assessment Result
                    </span>
                    <select
                      name="assessmentResult"
                      value={form.assessmentResult}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.assessmentResult.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Key Findings
                    </span>
                    <textarea
                      name="keyFindings"
                      value={form.keyFindings}
                      onChange={handleChange}
                      rows={4}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Remediation Plan
                    </span>
                    <textarea
                      name="remediationPlan"
                      value={form.remediationPlan}
                      onChange={handleChange}
                      rows={4}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Approval Status
                    </span>
                    <select
                      name="approvalStatus"
                      value={form.approvalStatus}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {optionGroups.approvalStatus.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Approver Name
                    </span>
                    <input
                      name="approverName"
                      value={form.approverName}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-slate-600">
                      Approval Date
                    </span>
                    <input
                      name="approvalDate"
                      type="date"
                      value={form.approvalDate}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="block text-xs font-medium text-slate-600">
                      Notes
                    </span>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      className={inputClasses}
                    />
                  </label>
                </div>
              </section>

              <div className="flex flex-wrap justify-end gap-3 border-t border-ink-900/8 pt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setForm(initialForm)}
                >
                  Clear Form
                </Button>
                <Button type="submit">Save Assessment</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Assessment Snapshot"
              subtitle="Live highlights from the form"
              action={<CheckCircle2 className="w-4 h-4 text-slate-400" />}
            />
            <CardBody className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Criticality</span>
                <Badge label={form.criticality} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Data access</span>
                <span className="font-medium text-ink-900">
                  {form.dataAccessLevel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Review cadence</span>
                <span className="font-medium text-ink-900">
                  {form.reviewFrequency}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Assessment records</span>
                <span className="font-medium text-ink-900">
                  {submitted.length}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Recent Submission"
              subtitle="Latest saved assessment"
              action={<Users className="w-4 h-4 text-slate-400" />}
            />
            <CardBody>
              {recentAssessment ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Vendor
                    </p>
                    <p className="font-medium text-ink-900">
                      {recentAssessment.vendorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Result
                    </p>
                    <Badge label={recentAssessment.assessmentResult} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Saved at
                    </p>
                    <p className="font-medium text-ink-900">
                      {new Date(recentAssessment.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No vendor assessments have been saved yet.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
