import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { users } from '../data/usersData';
import { Plus, Search, User } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} team members`}
        action={<Button icon={<Plus className="w-4 h-4" />}>Add User</Button>}
      />

      <div className="relative flex-1 max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Role</span>
                <Badge label={u.role} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Status</span>
                <Badge label={u.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Department</span>
                <span className="text-xs font-medium text-slate-700">{u.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Audits Assigned</span>
                <span className="text-xs font-bold text-slate-800">{u.auditsAssigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Last Login</span>
                <span className="text-xs text-slate-500">{u.lastLogin}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
