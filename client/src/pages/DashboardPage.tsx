import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import StatCard from '../components/dashboard/StatCard';
import ComplianceChart from '../components/dashboard/ComplianceChart';
import NcTrendChart from '../components/dashboard/NcTrendChart';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';

export default function DashboardPage(){
 const [data,setData]=useState<any>({statCards:[],complianceByDepartment:[],ncTrend:[]}); const [audits,setAudits]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
 useEffect(()=>{Promise.all([api.get('/dashboard/overview'),api.get('/audits?limit=5&sort=-createdAt')]).then(([a,b])=>{setData(a.data);setAudits(b.data||[])}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
 if(loading)return <div className="p-8 text-sm text-slate-500">Loading dashboard…</div>;
 return <div><PageHeader title="Dashboard" subtitle="Live overview from the IS Audit database"/>{error&&<div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">{data.statCards.map((c:any)=><StatCard key={c.label} {...c}/>)}</div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"><ComplianceChart data={data.complianceByDepartment}/><NcTrendChart data={data.ncTrend}/></div>
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b"><h3 className="text-sm font-semibold text-slate-800">Recent Audits</h3><Link to="/audits" className="text-xs text-ink-700 hover:underline">View all</Link></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500 bg-slate-50"><th className="px-5 py-3">ID</th><th className="px-5 py-3">Title</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Auditor</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Compliance</th></tr></thead><tbody className="divide-y">{audits.map(a=><tr key={a._id}><td className="px-5 py-3 font-mono text-xs">{a.code}</td><td className="px-5 py-3 font-medium">{a.title}</td><td className="px-5 py-3">{a.department}</td><td className="px-5 py-3">{a.auditor?.name||'—'}</td><td className="px-5 py-3"><Badge label={a.status}/></td><td className="px-5 py-3">{a.compliance?`${a.compliance}%`:'—'}</td></tr>)}</tbody></table></div></div></div>
}
