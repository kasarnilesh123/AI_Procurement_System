import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  UploadCloud,
  PlusCircle,
  AlertCircle,
  LogOut,
  User,
  ChevronDown,
  Shield,
  IndianRupee,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useProcurement } from '../../context/ProcurementContext';
import { useAuth } from '../../context/AuthContext';
import { ProjectStatusBadge } from '../common/StatusBadge';
import { formatCompactRupee } from '../../utils/formatters';

interface HeaderProps {
  onOpenUploadModal?: () => void;
  onOpenCreateProjectModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUploadModal,
  onOpenCreateProjectModal,
}) => {
  const navigate = useNavigate();
  const { currentProject, totalCriteriaWeight, activityLogs } = useProcurement();
  const { currentUser, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Project title & Context Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
            {currentProject.code}
          </span>
          <h1 className="text-sm font-semibold text-slate-900 truncate max-w-md hidden md:block">
            {currentProject.name}
          </h1>
        </div>

        <ProjectStatusBadge status={currentProject.status} />

        {totalCriteriaWeight !== 100 && (
          <button
            onClick={() => navigate('/criteria')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium hover:bg-amber-100 transition-colors"
            title="Criteria weights must sum to exactly 100%"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Weights sum: {totalCriteriaWeight}% (Needs 100%)</span>
          </button>
        )}
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center gap-3">
        {/* Quick action buttons */}
        <Button
          variant="secondary"
          size="sm"
          icon={<UploadCloud className="w-3.5 h-3.5 text-slate-600" />}
          onClick={onOpenUploadModal || (() => navigate('/proposals'))}
        >
          Upload Proposal
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<PlusCircle className="w-3.5 h-3.5 text-white" />}
          onClick={onOpenCreateProjectModal || (() => navigate('/projects/new'))}
        >
          New Evaluation
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-modal border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Recent Procurement Activity</span>
                <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                    <p className="font-medium text-slate-800">{log.action}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span className="truncate max-w-[150px]">{log.target}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/reports');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  View Full Audit Logs &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Menu */}
        {currentUser && (
          <div className="relative border-l border-slate-200 pl-3 ml-1">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <div
                className={`w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                  currentUser.avatarColor || 'bg-slate-800'
                }`}
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-mono font-medium text-emerald-700">
                  Limit: {formatCompactRupee(currentUser.authorityLimit)}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-modal border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-600">Authority Limit:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatCompactRupee(currentUser.authorityLimit)}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2 border-b border-slate-100 text-[11px] text-slate-500">
                  Sign out before changing evaluator accounts.
                </div>
                <div className="px-2 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
