import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  Award,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { StatCard } from '../components/common/StatCard';
import { ProjectStatusBadge, VerificationBadge } from '../components/common/StatusBadge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Project, VendorProposal, ActivityLogItem, ProposalField } from '../types/procurement';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    proposals,
    activityLogs,
    currentProject,
    evaluationResults,
    recommendedVendor,
    totalCriteriaWeight,
    setSelectedProjectId,
  } = useProcurement();

  // Metrics
  const activeEvaluations = projects.filter((p: Project) => p.status === 'in_evaluation').length;
  const comparisonReady = projects.filter((p: Project) => p.status === 'comparison_ready').length;
  const completedEvaluations = projects.filter((p: Project) => p.status === 'recommended' || p.status === 'awarded').length;
  const proposalsUnderReview = proposals.filter((p: VendorProposal) => p.status === 'ready_for_review').length;
  const totalContractPipeline = projects.reduce((acc: number, p: Project) => acc + p.budget, 0);

  // Unverified fields across current proposals
  const pendingVerificationCount = proposals.reduce((acc: number, prop: VendorProposal) => {
    const unverified = Object.values(prop.fields).filter((f: ProposalField) => f.status === 'needs_review').length;
    return acc + unverified;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Procurement Evaluation Command Center
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Q4 Sourcing Cycle
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            AI-assisted extraction, side-by-side weighted scoring, and explainable decision support
            for multi-vendor RFP selections.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={<GitCompare className="w-4 h-4 text-slate-700" />}
            onClick={() => navigate('/compare')}
          >
            Open Comparison Matrix
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Award className="w-4 h-4 text-white" />}
            onClick={() => navigate('/recommendations')}
          >
            Recommendation Center
          </Button>
        </div>
      </div>

      {/* Criteria Weight Alert if not 100% */}
      {totalCriteriaWeight !== 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Attention Required:</strong> Active project (<strong>{currentProject.code}</strong>) evaluation criteria weights currently total{' '}
              <strong className="font-mono">{totalCriteriaWeight}%</strong>. Total must equal exactly 100% for valid scoring.
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="border-amber-300 text-amber-900 bg-white hover:bg-amber-100/50"
            onClick={() => navigate('/criteria')}
          >
            Adjust Criteria Weights
          </Button>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Evaluations"
          value={activeEvaluations + comparisonReady}
          subValue={`${comparisonReady} ready for matrix scoring`}
          icon={<Clock className="w-4 h-4 text-slate-600" />}
          trend={{ value: '+2 this month', isPositive: true }}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          label="Proposals In Review"
          value={proposalsUnderReview}
          subValue={`${pendingVerificationCount} fields need review`}
          icon={<FileText className="w-4 h-4 text-slate-600" />}
          onClick={() => navigate('/proposals')}
        />
        <StatCard
          label="Completed Evaluations"
          value={completedEvaluations}
          subValue="Awarded or recommended"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          trend={{ value: '100% audit compliant', isPositive: true }}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          label="Total Evaluation Envelope"
          value={formatCurrency(totalContractPipeline)}
          subValue="Across 3 active projects"
          icon={<TrendingUp className="w-4 h-4 text-slate-600" />}
        />
      </div>

      {/* Active Evaluation Highlight Card */}
      {recommendedVendor && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-card">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Leading Recommendation
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-semibold text-slate-700">{currentProject.code}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {recommendedVendor.vendorName}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Weighted Score</span>
              <p className="text-2xl font-mono font-bold text-emerald-700">
                {recommendedVendor.overallWeightedScore}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Commercial Bid</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                {formatCurrency(recommendedVendor.totalBidAmount)}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {recommendedVendor.commercialAdvantages[0]?.savingVsBudget || 'Within budget'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Top Strength</span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                {recommendedVendor.technicalStrengths[0]?.title || 'Architecture Conformance'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-mono">
                Ref: {recommendedVendor.technicalStrengths[0]?.citation || 'Proposal Doc'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Risk Assessment</span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                {recommendedVendor.risks[0]?.title || 'No critical risks flagged'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {recommendedVendor.risks[0]?.mitigation || 'Verified against compliance baseline'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Evaluated against {currentProject.criteria.length} weighted criteria with {proposals.filter((p: VendorProposal) => p.projectId === currentProject.id).length} competing proposals.
            </span>
            <button
              onClick={() => navigate('/recommendations')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 group"
            >
              View Full Recommendation Rationale <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Split: Recent Procurement Projects Table & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Procurement Projects */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Procurement Projects Under Evaluation</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a project to switch evaluation workspace</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              View All ({projects.length})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Project / Code</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Budget</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((proj: Project) => {
                  const isCurrent = proj.id === currentProject.id;
                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-slate-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" title="Active Workspace" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                              {proj.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">{proj.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{proj.category}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-800">
                        {formatCurrency(proj.budget)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{formatDate(proj.deadline)}</td>
                      <td className="px-4 py-3.5">
                        <ProjectStatusBadge status={proj.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            navigate('/compare');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 shadow-xs"
                        >
                          Evaluate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Audit & Activity Feed */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-card p-4 flex flex-col">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Live Audit & Extraction Trail</h3>
            <span className="text-[10px] font-mono text-slate-400">Verifiable Logs</span>
          </div>

          <div className="space-y-3.5 mt-3.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {activityLogs.slice(0, 6).map((act: ActivityLogItem) => (
              <div key={act.id} className="text-xs border-l-2 border-slate-200 pl-3 py-0.5">
                <p className="font-medium text-slate-800 leading-snug">{act.action}</p>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span className="truncate max-w-[140px] text-slate-600 font-mono">{act.target}</span>
                  <span className="text-slate-400">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-auto">
            <button
              onClick={() => navigate('/reports')}
              className="w-full py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium text-center hover:bg-slate-50 rounded"
            >
              Export Audit Trail &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
