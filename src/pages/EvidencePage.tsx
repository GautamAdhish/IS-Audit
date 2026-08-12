import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { evidences } from '../data/evidenceData';
import { Upload, Search, FileText, Award, BookOpen, ClipboardList, BarChart2 } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  Policy:      <BookOpen className="w-4 h-4 text-blue-500" />,
  Procedure:   <ClipboardList className="w-4 h-4 text-purple-500" />,
  Record:      <FileText className="w-4 h-4 text-green-500" />,
  Report:      <BarChart2 className="w-4 h-4 text-amber-500" />,
  Certificate: <Award className="w-4 h-4 text-indigo-500" />,
};

const EvidencePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Policy', 'Procedure', 'Record', 'Report', 'Certificate'];

  const filtered = evidences.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'All' || e.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <PageHeader
        title="Documents & Evidence"
        subtitle={`${evidences.length} documents uploaded`}
        action={<Button icon={<Upload className="w-4 h-4" />}>Upload Document</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                ${typeFilter === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                {typeIcons[e.type]}
              </div>
              <Badge label={e.type} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
              {e.title}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {e.uploadedBy} · {e.uploadedDate} · {e.fileSize}
            </p>
            <div className="flex flex-wrap gap-1">
              {e.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            No documents match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidencePage;
