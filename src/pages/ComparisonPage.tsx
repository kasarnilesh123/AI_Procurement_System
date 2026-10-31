import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  SlidersHorizontal,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Edit2,
  Sparkles,
  Download,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ComplianceBadge } from '../components/common/StatusBadge';
import { ScoreIndicator } from '../components/common/ScoreIndicator';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatScore } from '../utils/formatters';
import { Criterion, ComplianceStatus, VendorProposal, VendorEvaluationResult } from '../types/procurement';

export const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProject,
    currentProposals,
    evaluationResults,
    updateProposalCriterionScore,
    totalCriteriaWeight,
    autoNormalizeCurrentWeights,
    updateCriterionWeight,
  } = useProcurement();

  const [activeFilter, setActiveFilter] = useState<'all' | 'mandatory' | 'deviations'>('all');
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Score Override Modal State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState<{
    proposalId: string;
    vendorName: string;
    criterion: Criterion;
    currentScore: number;
    currentStatus: ComplianceStatus;
    notes: string;
  } | null>(null);
  const [newScore, setNewScore] = useState<number>(85);
  const [newStatus, setNewStatus] = useState<ComplianceStatus>('compliant');
  const [overrideNote, setOverrideNote] = useState<string>('');

  // Filter criteria rows
  const filteredCriteria = currentProject.criteria.filter((c: Criterion) => {
    if (activeFilter === 'mandatory') return c.isMandatory;
    if (activeFilter === 'deviations') {
      // Return criteria where at least one vendor has a deviation or non-compliance
      return currentProposals.some((p: VendorProposal) => {
        const evalItem = p.criterionEvaluations[c.id];
        return (
          evalItem &&
          (evalItem.complianceStatus === 'minor_deviation' ||
            evalItem.complianceStatus === 'non_compliant' ||
            evalItem.complianceStatus === 'not_provided')
        );
      });
    }
    return true;
  });

  const handleOpenOverride = (
    proposalId: string,
    vendorName: string,
    criterion: Criterion
  ) => {
    const proposal = currentProposals.find((p: VendorProposal) => p.id === proposalId);
    const existing = proposal?.criterionEvaluations[criterion.id] || {
      rawScore: 75,
      complianceStatus: 'compliant' as ComplianceStatus,
      notes: '',
    };
    setOverrideTarget({
      proposalId,
      vendorName,
      criterion,
      currentScore: existing.rawScore,
      currentStatus: existing.complianceStatus,
      notes: existing.notes || '',
    });
    setNewScore(existing.rawScore);
    setNewStatus(existing.complianceStatus);
    setOverrideNote(existing.notes || '');
    setOverrideModalOpen(true);
  };

  const handleSaveOverride = () => {
    if (!overrideTarget) return;
    updateProposalCriterionScore(
      overrideTarget.proposalId,
      overrideTarget.criterion.id,
      newScore,
      newStatus,
      overrideNote
    );
    setOverrideModalOpen(false);
  };

  if (currentProposals.length === 0) {
    return (
      <div className="space-y-5">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Side-by-Side Vendor Comparison Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active Project: {currentProject.code} — {currentProject.name}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/proposals')}
          >
            Add Proposals
          </Button>
        </div>

        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8 shadow-card">
          <GitCompare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Proposals Submitted Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            All predefined mock vendor data has been cleared. Add vendor information and upload RFP proposals to compare them side-by-side in this matrix.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/vendors')}
            >
              Manage Vendors
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/proposals')}
            >
              Upload Vendor Proposal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Side-by-Side Vendor Comparison Matrix
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {currentProject.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time weighted score calculation engine. Compare vendor extractions against evaluation benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant={showWeightSliders ? 'primary' : 'secondary'}
            size="sm"
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            onClick={() => setShowWeightSliders(!showWeightSliders)}
          >
            {showWeightSliders ? 'Hide Weight Controls' : 'Adjust Weights'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Award className="w-3.5 h-3.5" />}
            onClick={() => navigate('/recommendations')}
          >
            View AI Recommendation
          </Button>
        </div>
      </div>

      {/* Criteria Weight Warning Banner & Normalization */}
      {totalCriteriaWeight !== 100 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Criteria weights sum is currently <strong>{totalCriteriaWeight}%</strong> (must be 100% for valid decision support).
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-300 bg-white"
            onClick={autoNormalizeCurrentWeights}
          >
            Auto-Normalize to 100%
          </Button>
        </div>
      )}

      {/* Interactive Weight Slider Bar (Expandable) */}
      {showWeightSliders && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900">
              Real-time Criteria Weight Recalibration
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-slate-700">
                Total: {totalCriteriaWeight}%
              </span>
              <button
                onClick={autoNormalizeCurrentWeights}
                className="text-[11px] text-slate-600 hover:text-slate-900 underline"
              >
                Auto-Balance
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {currentProject.criteria.map((c: Criterion) => (
              <div key={c.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800 truncate" title={c.label}>
                    {c.label}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{c.weight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.weight}
                  onChange={(e) => updateCriterionWeight(c.id, Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none accent-slate-900"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Matrix Controls */}
      <div className="flex items-center justify-between text-xs bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-card">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-600">Filter Rows:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Criteria ({currentProject.criteria.length})
            </button>
            <button
              onClick={() => setActiveFilter('mandatory')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeFilter === 'mandatory'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mandatory Only
            </button>
            <button
              onClick={() => setActiveFilter('deviations')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeFilter === 'deviations'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Deviations & Gaps Only
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Showing <span className="font-semibold">{evaluationResults.length}</span> competing vendors
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Table Header */}
            <thead className="bg-slate-900 text-white sticky top-0 z-20 shadow-sm">
              <tr>
                {/* Left Header: Criteria & Weights */}
                <th className="p-4 w-72 min-w-[280px] bg-slate-900 border-r border-slate-800">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                      Evaluation Criteria
                    </span>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Weights sum = {totalCriteriaWeight}%
                    </p>
                  </div>
                </th>

                {/* Vendor Column Headers */}
                {evaluationResults.map((result: VendorEvaluationResult) => {
                  const isTopRank = result.rank === 1;
                  return (
                    <th
                      key={result.vendorId}
                      className={`p-4 min-w-[310px] max-w-[360px] border-r border-slate-800 ${
                        isTopRank ? 'bg-slate-850' : 'bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white truncate">
                              {result.vendorName}
                            </span>
                            {isTopRank && (
                              <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                                Rank #1
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-300 mt-0.5 block">
                            Bid: {formatCurrency(result.totalBidAmount, result.currency)}
                          </span>
                        </div>

                        {/* Overall Weighted Score Badge */}
                        <div className="text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            Weighted Score
                          </span>
                          <span
                            className={`font-mono text-lg font-bold ${
                              isTopRank ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {result.overallWeightedScore}
                          </span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* OVERALL SCORE SUMMARY ROW (Sticky Top Banner) */}
            <tbody className="border-b-2 border-slate-300 bg-slate-50/90 font-medium">
              <tr className="border-b border-slate-200">
                <td className="p-4 border-r border-slate-200 bg-slate-100 font-bold text-slate-900">
                  <div className="flex items-center justify-between">
                    <span>OVERALL WEIGHTED SCORE</span>
                    <span className="text-[10px] font-mono text-slate-500">100 Max</span>
                  </div>
                </td>
                {evaluationResults.map((result: VendorEvaluationResult) => {
                  const isTopRank = result.rank === 1;
                  return (
                    <td
                      key={result.vendorId}
                      className={`p-4 border-r border-slate-200 ${
                        isTopRank ? 'bg-emerald-50/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <ScoreIndicator score={result.overallWeightedScore} size="lg" showBar />
                          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                            Current Standing: Rank #{result.rank}
                          </span>
                        </div>
                        <Button
                          variant={isTopRank ? 'primary' : 'outline'}
                          size="sm"
                          className="text-xs"
                          onClick={() => navigate(`/proposals/${result.proposalId}/review`)}
                        >
                          Review Doc
                        </Button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>

            {/* CRITERIA ROWS */}
            <tbody className="divide-y divide-slate-200">
              {filteredCriteria.map((criterion: Criterion) => {
                return (
                  <tr key={criterion.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Left Sticky Cell: Criterion Description */}
                    <td className="p-4 border-r border-slate-200 bg-white align-top">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {criterion.label}
                          </span>
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {criterion.weight}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {criterion.description}
                        </p>
                        {criterion.isMandatory && (
                          <span className="inline-block mt-1.5 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            Mandatory Gate
                          </span>
                        )}
                        {criterion.benchmark && (
                          <div className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 font-sans">
                            <strong className="text-slate-700">Target:</strong> {criterion.benchmark}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Vendor Cells */}
                    {evaluationResults.map((result: VendorEvaluationResult) => {
                      const breakdownItem = result.criterionBreakdown.find(
                        (b) => b.criterionId === criterion.id
                      );
                      const rawScore = breakdownItem?.rawScore || 0;
                      const weightedContrib = breakdownItem?.weightedScore || 0;
                      const status = breakdownItem?.complianceStatus || 'not_provided';
                      const citation = breakdownItem?.sourceCitation || 'N/A';
                      const snippet = breakdownItem?.evidenceSnippet || 'Not Provided';

                      return (
                        <td
                          key={result.vendorId}
                          className="p-4 border-r border-slate-200 align-top space-y-2.5"
                        >
                          {/* Top cell row: Compliance badge & Raw Score + Edit action */}
                          <div className="flex items-center justify-between">
                            <ComplianceBadge status={status} />

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 font-mono">Score:</span>
                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {rawScore}/100
                              </span>
                              <button
                                onClick={() =>
                                  handleOpenOverride(result.proposalId, result.vendorName, criterion)
                                }
                                title="Override raw score"
                                className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Extracted Evidence Snippet */}
                          <div className="text-[11px] text-slate-700 bg-slate-50/80 p-2.5 rounded border border-slate-200/80 leading-relaxed font-sans">
                            <p className="line-clamp-3 italic">"{snippet}"</p>
                          </div>

                          {/* Source citation and Weighted Contribution calculation */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span className="font-mono truncate max-w-[170px]" title={citation}>
                              Ref: {citation}
                            </span>
                            <span className="font-mono font-medium text-slate-700">
                              +{weightedContrib.toFixed(1)} pts
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Score Override Modal */}
      {overrideTarget && (
        <Modal
          isOpen={overrideModalOpen}
          onClose={() => setOverrideModalOpen(false)}
          title={`Override Score: ${overrideTarget.criterion.label}`}
          description={`Vendor: ${overrideTarget.vendorName} (Weight: ${overrideTarget.criterion.weight}%)`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raw Score (0 - 100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded appearance-none accent-slate-900"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-16 text-center text-xs font-mono font-bold rounded border border-slate-300 p-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compliance Status Gate
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplianceStatus)}
                className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
              >
                <option value="compliant">Full Compliance</option>
                <option value="minor_deviation">Minor Deviation</option>
                <option value="non_compliant">Non-Compliant</option>
                <option value="not_provided">Not Provided</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluator Rationale / Audit Comment *
              </label>
              <textarea
                rows={3}
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                placeholder="Document justification for adjusting raw score..."
                className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Recalculation Impact:</span> Saving will
              instantly update the overall weighted score matrix and re-rank the vendors in the
              Recommendation Center.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveOverride}>
                Save & Recalculate Matrix
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
