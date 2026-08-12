import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { findings } from '../data/findingsData';
import { Plus, Search } from 'lucide-react';

const FindingsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const severities = ['All', 'Major', 'Minor', 'Observation'];

  const filtered = findings.filter((f) => {
    const matchSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.assignee.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'All' || f.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <div>
      <PageHeader
        title="Findings"
        subtitle={`${findings.length} total findings`}
        action={<Button icon={<Plus className="w-4 h-4" />}>Log Finding</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search findings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                ${severityFilter === s
                  ? 'bg-ink-800 text-white border-ink-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Assignee</th>
                <th className="px-5 py-3 font-medium">Date Found</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{f.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800 max-w-[220px] truncate" title={f.title}>{f.title}</td>
                  <td className="px-5 py-3 text-slate-600">{f.department}</td>
                  <td className="px-5 py-3"><Badge label={f.severity} /></td>
                  <td className="px-5 py-3"><Badge label={f.status} /></td>
                  <td className="px-5 py-3 text-slate-600">{f.assignee}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{f.dateFound}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{f.dueDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No findings match your search.
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

export default FindingsPage;
