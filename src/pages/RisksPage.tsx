import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { risks } from '../data/riskData';
import { Plus, Search } from 'lucide-react';

const RisksPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const levels = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = risks.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'All' || r.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const riskColor = (score: number) => {
    if (score >= 15) return 'text-red-600 font-bold';
    if (score >= 10) return 'text-orange-600 font-semibold';
    if (score >= 6)  return 'text-amber-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div>
      <PageHeader
        title="Risk Register"
        subtitle={`${risks.length} identified risks`}
        action={<Button icon={<Plus className="w-4 h-4" />}>Add Risk</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search risks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                ${levelFilter === l
                  ? 'bg-ink-800 text-white border-ink-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              {l}
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
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Level</th>
                <th className="px-5 py-3 font-medium">Likelihood</th>
                <th className="px-5 py-3 font-medium">Impact</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800 max-w-[200px] truncate" title={r.title}>{r.title}</td>
                  <td className="px-5 py-3 text-slate-600 text-xs">{r.category}</td>
                  <td className="px-5 py-3"><Badge label={r.level} /></td>
                  <td className="px-5 py-3 text-center text-slate-600">{r.likelihood}</td>
                  <td className="px-5 py-3 text-center text-slate-600">{r.impact}</td>
                  <td className={`px-5 py-3 text-center ${riskColor(r.riskScore)}`}>{r.riskScore}</td>
                  <td className="px-5 py-3"><Badge label={r.status} /></td>
                  <td className="px-5 py-3 text-slate-600">{r.owner}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No risks match your search.
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

export default RisksPage;
