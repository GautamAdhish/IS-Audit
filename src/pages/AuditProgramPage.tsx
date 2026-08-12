import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { audits } from '../data/auditData';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AuditProgramPage: React.FC = () => {
  const departments = [...new Set(audits.map((a) => a.department))];
  const completedCount = audits.filter((a) => a.status === 'Completed').length;
  const progressPct = Math.round((completedCount / audits.length) * 100);

  return (
    <div>
      <PageHeader
        title="Audit Program"
        subtitle="Annual audit schedule — 2024"
      />

      {/* Progress summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Annual Program Progress</p>
          <span className="text-sm font-bold text-ink-700">{completedCount}/{audits.length} completed</span>
        </div>
        <ProgressBar value={progressPct} />
      </div>

      {/* Calendar-style grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-36">Department</th>
                {months.map((m) => (
                  <th key={m} className="px-3 py-3 text-center font-medium text-slate-500 min-w-[64px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => (
                <tr key={dept} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-700">{dept}</td>
                  {months.map((m, mi) => {
                    const monthAudits = audits.filter((a) => {
                      const startMonth = new Date(a.startDate).getMonth();
                      return a.department === dept && startMonth === mi;
                    });
                    return (
                      <td key={m} className="px-2 py-2 text-center">
                        {monthAudits.length > 0 ? (
                          <div className="flex flex-col gap-0.5 items-center">
                            {monthAudits.map((a) => (
                              <span key={a.id} title={a.title}>
                                <Badge label={a.status} />
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-200">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditProgramPage;
