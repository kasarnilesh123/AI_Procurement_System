import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  IndianRupee,
  TrendingDown,
  Layers,
  FileCheck2,
  Share2,
  Download,
  GitCompare,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ScoreIndicator } from '../components/common/ScoreIndicator';
import { ComplianceBadge } from '../components/common/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { VendorEvaluationResult } from '../types/procurement';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProject,
    evaluationResults,
    recommendedVendor,
    totalCriteriaWeight,
    signOffRecommendation,
    generateReport,
    settings,
  } = useProcurement();

  const [activeVendorTab, setActiveVendorTab] = useState<string>(
    recommendedVendor?.vendorId || evaluationResults[0]?.vendorId || ''
  );

  // Signoff Modal State
  const [signOffModalOpen, setSignOffModalOpen] = useState(false);
  const [approverNotes, setApproverNotes] = useState(
    'Procurement Committee reviewed weighted scores and technical compliance audits. Concur with ApexCloud award recommendation subject to standard SLA warranty provisions.'
  );
  const [approverName, setApproverName] = useState(settings.profile.name);
  const [signedOff, setSignedOff] = useState(currentProject.status === 'recommended');

  const selectedVendorResult =
    evaluationResults.find((r: VendorEvaluationResult) => r.vendorId === activeVendorTab) || recommendedVendor || evaluationResults[0];

  if (!recommendedVendor) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8">
        <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Proposals Evaluated Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please upload and extract at least one proposal for project {currentProject.code} to generate
          explainable vendor recommendations.
        </p>
        <Button
          variant="primary"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/proposals')}
        >
          Go to Proposals
        </Button>
      </div>
    );
  }

  const handleSignOffSubmit = () => {
    signOffRecommendation(approverNotes, approverName);
    setSignedOff(true);
    setSignOffModalOpen(false);
  };

  const handleExportBrief = () => {
    generateReport(
      `Executive Award Recommendation Brief - ${recommendedVendor.vendorName}`,
      'executive_summary'
    );
    navigate('/reports');
  };

  return (
    <div className="space-y-6">
      {/* Governance & Human-in-the-loop Mandate Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-4 border border-slate-800 shadow-card flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Procurement Decision Support Advisory
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              This recommendation is deterministically computed based on verified proposal extractions and
              configured multi-criteria weights. All findings link to auditable document citations without
              extrapolated evidence. <strong>Final contract award authority rests solely with the authorized human evaluation committee.</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportBrief}
          >
            Export Brief
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FileCheck2 className="w-3.5 h-3.5" />}
            onClick={() => setSignOffModalOpen(true)}
          >
            {signedOff ? 'Committee Signed Off' : 'Committee Sign-Off'}
          </Button>
        </div>
      </div>

      {/* Top Hero Banner: Leading Recommended Vendor */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> Top Recommended Vendor
              </span>
              <span className="text-xs font-mono text-slate-400">|</span>
              <span className="text-xs text-slate-500">Project: {currentProject.code}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
              {recommendedVendor.vendorName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated across {currentProject.criteria.length} weighted criteria against{' '}
              {evaluationResults.length - 1} competing vendor bids.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-50 px-5 py-3.5 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Overall Weighted Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-mono font-bold text-emerald-700">
                  {recommendedVendor.overallWeightedScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Commercial Bid
              </span>
              <span className="text-lg font-mono font-bold text-slate-900 mt-0.5 block">
                {formatCurrency(recommendedVendor.totalBidAmount, recommendedVendor.currency)}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                {recommendedVendor.commercialAdvantages[0]?.savingVsBudget || 'Within budget'}
              </span>
            </div>
          </div>
        </div>

        {/* Key Reasons Grid */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Executive Summary & Rationale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {recommendedVendor.keyReasons.map((reason: string, i: number) => (
              <div
                key={i}
                className="p-3 rounded-md bg-slate-50/80 border border-slate-200/70 text-xs text-slate-800 flex items-start gap-2"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competing Vendors Tab Selector for Deep Dives */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <span className="text-xs font-semibold text-slate-500 mr-2">Vendor Detail:</span>
        {evaluationResults.map((result: VendorEvaluationResult) => (
          <button
            key={result.vendorId}
            onClick={() => setActiveVendorTab(result.vendorId)}
            className={`px-3.5 py-1.5 rounded-t-md text-xs font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeVendorTab === result.vendorId
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{result.vendorName}</span>
            <span
              className={`font-mono text-[11px] px-1.5 py-0.2 rounded ${
                result.rank === 1
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              #{result.rank} ({result.overallWeightedScore})
            </span>
          </button>
        ))}
      </div>

      {/* Deep Explainable Analysis for Selected Vendor */}
      {selectedVendorResult && (
        <div className="space-y-6">
          {/* 4-Quadrant Explainable Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Technical Strengths */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Technical Strengths</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  {selectedVendorResult.technicalStrengths.length} Verified
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedVendorResult.technicalStrengths.map((str: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{str.title}</span>
                      <span className="font-mono text-[10px] text-slate-500">Ref: {str.citation}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{str.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Commercial Advantages */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Commercial & Financial Position</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {formatCurrency(selectedVendorResult.totalBidAmount, selectedVendorResult.currency)}
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedVendorResult.commercialAdvantages.map((comm: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{comm.title}</span>
                      <span className="font-mono text-[10px] font-bold text-emerald-700">
                        {comm.savingVsBudget}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{comm.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Risks & Contractual Mitigations */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Identified Risks & Mitigations</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedVendorResult.risks.length} Flags
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedVendorResult.risks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No critical risk deviations detected.
                  </p>
                ) : (
                  selectedVendorResult.risks.map((risk: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{risk.title}</span>
                        <span
                          className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.2 rounded border ${
                            risk.severity === 'high'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {risk.severity} Risk
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1.5 text-[11px]">
                        <strong className="text-slate-800">Recommended Mitigation:</strong> {risk.mitigation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. Missing Information & Information Gaps */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Missing Information & Document Gaps
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedVendorResult.missingInformation.length} Gaps
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedVendorResult.missingInformation.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <span>Complete documentation provided. Zero gaps flagged.</span>
                  </div>
                ) : (
                  selectedVendorResult.missingInformation.map((gap: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md bg-amber-50/50 border border-amber-200/70 text-xs"
                    >
                      <span className="font-bold text-amber-900 block">
                        Not Provided: {gap.item}
                      </span>
                      <p className="text-amber-800 mt-1 text-[11px] leading-relaxed">
                        {gap.impact}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Criterion-Wise Score Breakdown Matrix Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Criterion-Wise Score Breakdown & Comparative Weights
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed contribution breakdown for {selectedVendorResult.vendorName}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<GitCompare className="w-3.5 h-3.5" />}
                onClick={() => navigate('/compare')}
              >
                Open Side-by-Side Matrix
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Criterion</th>
                    <th className="px-4 py-3 text-center">Weight</th>
                    <th className="px-4 py-3 text-center">Raw Score</th>
                    <th className="px-4 py-3 text-right">Weighted Points</th>
                    <th className="px-4 py-3">Compliance Status</th>
                    <th className="px-4 py-3">Evidence Source Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedVendorResult.criterionBreakdown.map((item: any) => (
                    <tr key={item.criterionId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.criterionLabel}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">
                        {item.weight}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.rawScore}/100
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        +{item.weightedScore.toFixed(1)} pts
                      </td>
                      <td className="px-4 py-3">
                        <ComplianceBadge status={item.complianceStatus} />
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {item.sourceCitation}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-slate-900">COMPOSITE SCORE</td>
                    <td className="px-4 py-3 text-center font-mono">{totalCriteriaWeight}%</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-800 text-sm">
                      {selectedVendorResult.overallWeightedScore} / 100
                    </td>
                    <td colSpan={2} className="px-4 py-3 text-right font-normal text-slate-500">
                      Rank #{selectedVendorResult.rank} Standing
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Human Committee Sign-Off Modal */}
      <Modal
        isOpen={signOffModalOpen}
        onClose={() => setSignOffModalOpen(false)}
        title="Formal Procurement Committee Sign-Off"
        description="Verify audit adherence and certify recommendation before contract negotiation."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Award Candidate</span>
            <p className="text-sm font-bold text-slate-900">{recommendedVendor.vendorName}</p>
            <p className="font-mono text-slate-600">
              Composite Score: {recommendedVendor.overallWeightedScore}/100 | Bid: {formatCurrency(recommendedVendor.totalBidAmount)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorized Committee Lead
            </label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Committee Review Notes & Directives *
            </label>
            <textarea
              rows={4}
              value={approverNotes}
              onChange={(e) => setApproverNotes(e.target.value)}
              className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Signature registers into immutable audit log with timestamp {new Date().toLocaleDateString()}.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setSignOffModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSignOffSubmit}>
              Execute Committee Sign-Off
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
