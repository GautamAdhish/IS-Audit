import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import { Save } from 'lucide-react';

const SettingsPage: React.FC = () => (
  <div>
    <PageHeader
      title="Settings"
      subtitle="System configuration and preferences"
      action={<Button icon={<Save className="w-4 h-4" />}>Save Changes</Button>}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Organisation */}
      <Card>
        <CardHeader title="Organisation" subtitle="Basic information about your organisation" />
        <CardBody>
          <div className="space-y-4">
            {[
              { label: 'Organisation Name', value: 'Acme Corp Pty Ltd', type: 'text' },
              { label: 'Industry',          value: 'Information Technology', type: 'text' },
              { label: 'Primary Standard',  value: 'ISO/IEC 27001:2022', type: 'text' },
              { label: 'Audit Cycle',       value: 'Annual', type: 'text' },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500/40 focus:bg-white transition"
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" subtitle="Configure when you receive alerts" />
        <CardBody>
          <div className="space-y-3">
            {[
              { label: 'Audit overdue alerts',       enabled: true  },
              { label: 'New finding assigned',        enabled: true  },
              { label: 'CAPA due date reminders',     enabled: true  },
              { label: 'Weekly compliance digest',    enabled: false },
              { label: 'New user registrations',      enabled: false },
              { label: 'Document uploads',            enabled: true  },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{pref.label}</span>
                <div
                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors cursor-pointer ${pref.enabled ? 'bg-ink-800' : 'bg-slate-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pref.enabled ? 'translate-x-4' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Audit Parameters */}
      <Card>
        <CardHeader title="Audit Parameters" subtitle="Default values for new audits" />
        <CardBody>
          <div className="space-y-4">
            {[
              { label: 'Default Audit Duration (days)', value: '10' },
              { label: 'CAPA Resolution SLA (days)',    value: '30' },
              { label: 'Major NC Escalation Threshold', value: '5'  },
              { label: 'Risk Score Alert Threshold',    value: '12' },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                <input
                  type="number"
                  defaultValue={field.value}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500/40 focus:bg-white transition"
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader title="Danger Zone" subtitle="Irreversible actions — proceed with caution" />
        <CardBody>
          <div className="space-y-3">
            {['Export All Data', 'Archive Completed Audits', 'Reset Dashboard Widgets'].map((action) => (
              <div key={action} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{action}</span>
                <Button variant="secondary" size="sm">{action.split(' ')[0]}</Button>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-red-700 font-medium">Delete All Records</span>
              <Button variant="danger" size="sm">Delete</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
);

export default SettingsPage;
