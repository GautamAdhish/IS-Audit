import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import { isoChecklist } from '../data/checklistData';

const ChecklistPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Compliant', 'Non-Compliant', 'Partial', 'N/A'];

  const filtered = isoChecklist.filter(
    (item) => statusFilter === 'All' || item.status === statusFilter
  );

  const summary = {
    compliant: isoChecklist.filter((i) => i.status === 'Compliant').length,
    nonCompliant: isoChecklist.filter((i) => i.status === 'Non-Compliant').length,
    partial: isoChecklist.filter((i) => i.status === 'Partial').length,
    na: isoChecklist.filter((i) => i.status === 'N/A').length,
  };

  return (
    <div>
      <PageHeader
        title="ISO 27001 Checklist"
        subtitle="Clause-by-clause compliance assessment"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Compliant',     count: summary.compliant,    color: 'bg-green-50  border-green-200  text-green-700'  },
          { label: 'Non-Compliant', count: summary.nonCompliant, color: 'bg-red-50    border-red-200    text-red-700'    },
          { label: 'Partial',       count: summary.partial,      color: 'bg-amber-50  border-amber-200  text-amber-700'  },
          { label: 'N/A',           count: summary.na,           color: 'bg-gray-50   border-gray-200   text-gray-600'   },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 font-medium w-16">Clause</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Evidence</th>
                <th className="px-5 py-3 font-medium">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-slate-600">{item.clause}</td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                  </td>
                  <td className="px-5 py-3"><Badge label={item.status} /></td>
                  <td className="px-5 py-3 text-xs text-slate-500 max-w-[180px]">{item.evidence}</td>
                  <td className="px-5 py-3 text-slate-600 text-xs">{item.auditor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
