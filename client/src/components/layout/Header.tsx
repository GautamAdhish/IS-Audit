import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, CheckCheck, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';

interface HeaderProps {
  onMenuToggle: () => void;
}

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  tone: 'warning' | 'info' | 'success';
  path: string;
};

type NotificationSettings = {
  auditOverdueAlerts?: boolean;
  newFindingAssigned?: boolean;
  capaDueDateReminders?: boolean;
  weeklyComplianceDigest?: boolean;
  documentUploads?: boolean;
  newUserRegistrations?: boolean;
};

const msPerDay = 1000 * 60 * 60 * 24;

const formatRelativeTime = (date: string | Date) => {
  const target = new Date(date);
  const diffMs = target.getTime() - Date.now();
  const diffDays = Math.round(diffMs / msPerDay);

  if (diffDays === 0) return 'due today';
  if (diffDays === 1) return 'due tomorrow';
  if (diffDays > 1) return `due in ${diffDays} days`;
  if (diffDays === -1) return '1 day overdue';
  return `${Math.abs(diffDays)} days overdue`;
};

const buildNotifications = (audits: any[], findings: any[], capas: any[], settings: NotificationSettings = {}) => {
  const items: NotificationItem[] = [];
  const now = new Date();

  if (settings.auditOverdueAlerts !== false) {
    audits.forEach((audit) => {
      const endDate = audit?.endDate ? new Date(audit.endDate) : null;
      if (!endDate || audit.status === 'Completed') return;

      const overdueDays = Math.max(0, Math.ceil((now.getTime() - endDate.getTime()) / msPerDay));
      if (endDate < now || audit.status === 'Overdue') {
        items.push({
          id: `audit-${audit._id || audit.code}`,
          title: 'Audit overdue',
          message: `${audit.title || 'Audit'} is ${overdueDays || 1} day${overdueDays === 1 ? '' : 's'} overdue.`,
          time: formatRelativeTime(endDate),
          read: false,
          tone: 'warning',
          path: '/audits',
        });
      }
    });
  }

  if (settings.newFindingAssigned !== false) {
    findings.forEach((finding) => {
      if (!finding?.dueDate || finding.status === 'Closed') return;

      const dueDate = new Date(finding.dueDate);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / msPerDay);
      if (diffDays <= 7 || dueDate < now) {
        items.push({
          id: `finding-${finding._id || finding.code}`,
          title: 'Finding due soon',
          message: `${finding.title || 'Finding'} • ${formatRelativeTime(dueDate)}.`,
          time: formatRelativeTime(dueDate),
          read: false,
          tone: diffDays < 0 ? 'warning' : 'info',
          path: '/findings',
        });
      }
    });
  }

  if (settings.capaDueDateReminders !== false) {
    capas.forEach((capa) => {
      if (!capa?.dueDate || capa.status === 'Closed') return;

      const dueDate = new Date(capa.dueDate);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / msPerDay);
      if (diffDays <= 7 || dueDate < now) {
        items.push({
          id: `capa-${capa._id || capa.code}`,
          title: 'CAPA due',
          message: `${capa.title || 'CAPA'} • ${formatRelativeTime(dueDate)}.`,
          time: formatRelativeTime(dueDate),
          read: false,
          tone: diffDays < 0 ? 'warning' : 'success',
          path: '/capa',
        });
      }
    });
  }

  return items;
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({});

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('is_audit_notifications') || '{}');
    const normalizeSaved = (items: NotificationItem[]) =>
      items.filter((item) => item && item.id).map((item) => ({ ...item, read: Boolean(savedState[item.id]) }));

    const load = async () => {
      try {
        const [settingsRes, auditsRes, findingsRes, capasRes] = await Promise.all([
          api.get('/settings'),
          api.get('/audits?limit=100&sort=-createdAt'),
          api.get('/findings?limit=100&sort=-createdAt'),
          api.get('/capas?limit=100&sort=-createdAt'),
        ]);

        const nextSettings = settingsRes?.data?.notifications || {};
        const liveNotifications = buildNotifications(
          auditsRes?.data || [],
          findingsRes?.data || [],
          capasRes?.data || [],
          nextSettings
        );

        const hydrated = normalizeSaved(liveNotifications);
        setSettings(nextSettings);
        setNotifications(hydrated);
      } catch {
        setNotifications([]);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!notifications.length) return;
    const state = Object.fromEntries(notifications.map((item) => [item.id, item.read]));
    localStorage.setItem('is_audit_notifications', JSON.stringify(state));
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    setIsNotificationsOpen(false);
    navigate(item.path);
  };

  const toneStyles = {
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const toneIcons = {
    warning: AlertTriangle,
    info: FileText,
    success: CheckCheck,
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-sm relative hidden sm:flex items-center">
        <Search className="absolute left-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search audits, findings…"
          className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brass-500/40 focus:border-brass-500/60 focus:bg-white transition"
        />
      </div>

      <div className="flex-1" />

      <div className="relative" ref={panelRef}>
        <button
          type="button"
          onClick={() => setIsNotificationsOpen((open) => !open)}
          className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[9px] text-white grid place-items-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isNotificationsOpen && (
          <div className="absolute right-0 top-11 w-[22rem] bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <p className="text-[11px] text-slate-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-medium text-ink-700 hover:text-ink-900"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-5 text-sm text-slate-500">No active alerts</div>
              ) : (
                notifications.map((item) => {
                  const Icon = toneIcons[item.tone];

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        item.read ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-0.5 rounded-lg border p-1.5 ${toneStyles[item.tone]}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                            {!item.read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                          </div>
                          <p className="mt-1 text-xs text-slate-600 leading-5">{item.message}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div className="w-8 h-8 rounded-full bg-brass-500 flex items-center justify-center text-white">
          <User className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-400 leading-none mt-0.5">{user?.role || ''}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="text-xs text-slate-500 hover:text-red-600 px-2">
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
