import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, CheckSquare,
  AlertTriangle, Target, ShieldAlert, FolderOpen,
  BarChart2, Users, Settings, Shield,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',     path: '/dashboard',     icon: LayoutDashboard },
  { label: 'Audit Program', path: '/audit-program', icon: BookOpen        },
  { label: 'Audits',        path: '/audits',         icon: ClipboardList   },
  { label: 'Checklists',    path: '/checklist',      icon: CheckSquare     },
  { label: 'Findings',      path: '/findings',       icon: AlertTriangle   },
  { label: 'CAPA',          path: '/capa',           icon: Target          },
  { label: 'Risks',         path: '/risks',          icon: ShieldAlert     },
  { label: 'Documents',     path: '/evidence',       icon: FolderOpen      },
  { label: 'Reports',       path: '/reports',        icon: BarChart2       },
  { label: 'Users',         path: '/users',          icon: Users           },
  { label: 'Settings',      path: '/settings',       icon: Settings        },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => (
  <aside
    className={`
      h-full bg-slate-900 flex flex-col transition-all duration-300
      w-[85vw] max-w-[18rem] lg:w-auto
      ${collapsed ? 'lg:w-16' : 'lg:w-60'}
    `}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700 shrink-0">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
        <Shield className="w-4 h-4 text-white" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-none truncate">IS Audit</p>
          <p className="text-[10px] text-slate-400 leading-none mt-0.5 truncate">Management System</p>
        </div>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
      {navItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
            ${isActive
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }
            ${collapsed ? 'justify-center' : ''}`
          }
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </nav>

    {/* Collapse toggle */}
    <div className="border-t border-slate-700 p-2 shrink-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  </aside>
);

export default Sidebar;
