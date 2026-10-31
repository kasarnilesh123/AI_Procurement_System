import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  GitCompare,
  SlidersHorizontal,
  Award,
  FileBarChart,
  Settings,
  Building2,
  ChevronDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { useAuth } from '../../context/AuthContext';
import { formatCompactRupee } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    currentProject,
    totalCriteriaWeight,
    vendors,
  } = useProcurement();

  const { currentUser, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Procurement Projects', icon: FolderKanban },
    { to: '/vendors', label: 'Vendors Directory', icon: Building2, badge: vendors.length },
    { to: '/proposals', label: 'Vendor Proposals', icon: FileText },
    { to: '/compare', label: 'Compare Vendors', icon: GitCompare },
    { to: '/criteria', label: 'Evaluation Criteria', icon: SlidersHorizontal },
    { to: '/recommendations', label: 'Recommendations', icon: Award },
    { to: '/reports', label: 'Reports', icon: FileBarChart },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = currentUser?.name || 'Authorized Evaluator';
  const displayRole = currentUser?.role || 'Procurement Specialist';
  const displayInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300 select-none flex-shrink-0">
      {/* Brand & Platform Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-600/90 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-inner">
          <Layers className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>ProcureAI</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
              India
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Vendor Proposal Evaluator</p>
        </div>
      </div>

      {/* Global Project Switcher */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Active RFP Context
        </label>
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-100 rounded-md border border-slate-700 py-2 pl-2.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium truncate cursor-pointer"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-slate-900 text-slate-200">
                {proj.code} - {proj.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {/* Quick project meta indicator */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className="truncate">{currentProject.department}</span>
          {totalCriteriaWeight === 100 ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> Weights 100%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-400 font-mono font-medium">
              <AlertTriangle className="w-3 h-3" /> {totalCriteriaWeight}%
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Core Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-xs border-l-2 border-emerald-400 pl-2.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Trust & Compliance Badge */}
      <div className="px-3 py-2.5 mx-3 mb-2 rounded-md bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Decision Support Only</span>
        </div>
        <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">
          Audit-logged explainable AI. Human signoff required.
        </p>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border border-slate-700 flex-shrink-0 ${
              currentUser?.avatarColor || 'bg-slate-700'
            }`}
          >
            {displayInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{displayName}</p>
            <p className="text-[10px] font-mono text-emerald-400 truncate">
              {currentUser ? `Limit: ${formatCompactRupee(currentUser.authorityLimit)}` : displayRole}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out of enterprise account"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
