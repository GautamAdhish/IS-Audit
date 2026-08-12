import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import { capas } from '../data/capaData';
import { Plus, Search } from 'lucide-react';

const CapaPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Open', 'In Progress', 'Verified', 'Closed'];

  const filtered = capas.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="CAPA"
        subtitle="Corrective and Preventive Actions"
        action={<Button icon={<Plus className="w-4 h-4" />}>New CAPA</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search CAPA…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                ${statusFilter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader
              title={c.title}
              subtitle={`${c.id} · Finding: ${c.findingId}`}
              action={
                <div className="flex items-center gap-2">
                  <Badge label={c.priority} />
                  <Badge label={c.status} />
                </div>
              }
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Root Cause</p>
                  <p className="text-sm text-slate-700">{c.rootCause}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Corrective Action</p>
                  <p className="text-sm text-slate-700">{c.correctiveAction}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Preventive Action</p>
                  <p className="text-sm text-slate-700">{c.preventiveAction}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Owner</p>
                  <p className="text-xs font-semibold text-slate-700">{c.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Due Date</p>
                  <p className="text-xs font-semibold text-slate-700">{c.dueDate}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No CAPA records match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default CapaPage;
