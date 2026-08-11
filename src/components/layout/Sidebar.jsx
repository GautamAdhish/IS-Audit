import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  Target,
  ShieldAlert,
  FolderOpen,
  BarChart2,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',      path: '/dashboard',      icon: LayoutDashboard },
  { label: 'Audit Program',  path: '/audit-program',  icon: BookOpen        },
  { label: 'Audits',         path: '/audits',          icon: ClipboardList   },
  { label: 'Checklists',     path: '/checklist',       icon: CheckSquare     },
  { label: 'Findings',       path: '/findings',        icon: AlertTriangle   },
  { label: 'CAPA',           path: '/capa',            icon: Target          },
  { label: 'Risks',          path: '/risks',           icon: ShieldAlert     },
  { label: 'Documents',      path: '/evidence',        icon: FolderOpen      },
  { label: 'Reports',        path: '/reports',         icon: BarChart2       },
  { label: 'Users',          path: '/users',           icon: Users           },
  { label: 'Settings',       path: '/settings',        icon: Settings        },
];

const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`
        bg-slate-900 text-white flex flex-col
        transition-all duration-300 ease-in-out
        flex-shrink-0 relative z-20
        ${collapsed ? 'w-16' : 'w-60'}
      `}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-tight whitespace-nowrap">ISO Audit</p>
              <p className="text-xs text-slate-400 leading-tight whitespace-nowrap">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors duration-150
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="truncate">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-slate-700 flex-shrink-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-150"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;