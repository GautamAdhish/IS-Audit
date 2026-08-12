import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import ComplianceChart from '../components/dashboard/ComplianceChart';
import NcTrendChart from '../components/dashboard/NcTrendChart';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import { statCards } from '../data/dashboardData';
import { audits } from '../data/auditData';

const DashboardPage: React.FC = () => (
  <div>
    <PageHeader
      title="Dashboard"
      subtitle="ISO Audit Management — Overview for Q1 2024"
    />

    {/* Stat Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>

    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <ComplianceChart />
      <NcTrendChart />
    </div>

    {/* Recent Audits */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Recent Audits</h3>
        <a href="/audits" className="text-xs text-blue-600 hover:underline font-medium">View all</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Auditor</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {audits.slice(0, 5).map((audit) => (
              <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{audit.id}</td>
                <td className="px-5 py-3 font-medium text-slate-800">{audit.title}</td>
                <td className="px-5 py-3 text-slate-600">{audit.department}</td>
                <td className="px-5 py-3 text-slate-600">{audit.auditor}</td>
                <td className="px-5 py-3"><Badge label={audit.status} /></td>
                <td className="px-5 py-3 text-slate-600">
                  {audit.compliance > 0 ? `${audit.compliance}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DashboardPage;
