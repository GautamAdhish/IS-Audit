import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import { audits } from '../data/auditData';
import { Plus, Search } from 'lucide-react';

const AuditsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Planned', 'In Progress', 'Completed', 'Overdue'];

  const filtered = audits.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()) ||
      a.auditor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Audits"
        subtitle={`${audits.length} total audits`}
        action={<Button icon={<Plus className="w-4 h-4" />}>New Audit</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audits…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                ${statusFilter === s
                  ? 'bg-ink-800 text-white border-ink-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Auditor</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date Range</th>
                <th className="px-5 py-3 font-medium">Compliance</th>
                <th className="px-5 py-3 font-medium">Findings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{audit.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800 max-w-[220px] truncate">{audit.title}</td>
                  <td className="px-5 py-3 text-slate-600">{audit.department}</td>
                  <td className="px-5 py-3 text-slate-600">{audit.auditor}</td>
                  <td className="px-5 py-3"><Badge label={audit.status} /></td>
                  <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {audit.startDate} → {audit.endDate}
                  </td>
                  <td className="px-5 py-3 min-w-[130px]">
                    {audit.compliance > 0
                      ? <ProgressBar value={audit.compliance} size="sm" />
                      : <span className="text-slate-400 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-slate-600 text-center">{audit.findings || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No audits match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditsPage;
