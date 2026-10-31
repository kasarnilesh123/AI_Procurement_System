import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProcurementReport, VendorEvaluationResult, Criterion } from '../types/procurement';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ReportsPage: React.FC = () => {
  const {
    reports,
    currentProject,
    recommendedVendor,
    evaluationResults,
    generateReport,
    settings,
  } = useProcurement();

  const [selectedReport, setSelectedReport] = useState<ProcurementReport | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [newReportType, setNewReportType] = useState<ProcurementReport['type']>('executive_summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let title = '';
      if (newReportType === 'executive_summary') {
        title = `Executive RFP Award Recommendation Brief - ${currentProject.code}`;
      } else if (newReportType === 'comparison_matrix') {
        title = `Side-by-Side Multi-Vendor Scoring Matrix - ${currentProject.code}`;
      } else if (newReportType === 'compliance_audit') {
        title = `Audit Trail & AI Extraction Verification Log - ${currentProject.code}`;
      } else {
        title = `Total Cost of Ownership (TCO) Commercial Analysis - ${currentProject.code}`;
      }
      generateReport(title, newReportType);
      setIsGenerating(false);
    }, 600);
  };

  const handleOpenPreview = (report: ProcurementReport) => {
    setSelectedReport(report);
    setIsPreviewModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-card">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Procurement Reports & Audit Briefs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generated committee evaluation reports, side-by-side matrices, and audit-ready verification logs.
          </p>
        </div>

        {/* Generate Report Quick Action */}
        <div className="flex items-center gap-2">
          <select
            value={newReportType}
            onChange={(e) => setNewReportType(e.target.value as ProcurementReport['type'])}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
          >
            <option value="executive_summary">Executive Award Brief (PDF)</option>
            <option value="comparison_matrix">Comparison Matrix (XLSX)</option>
            <option value="compliance_audit">Audit Verification Log (PDF)</option>
            <option value="commercial_breakdown">TCO Cost Breakdown (PDF)</option>
          </select>
          <Button
            variant="primary"
            size="sm"
            loading={isGenerating}
            icon={<PlusCircle className="w-3.5 h-3.5 text-white" />}
            onClick={handleCreateReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Available Documents & Exports ({reports.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Audit Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Report Title & Type</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Vendor Scope</th>
                <th className="px-4 py-3">Generated Date</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((rep: ProcurementReport) => (
                <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-slate-100 border border-slate-200 text-slate-700 flex-shrink-0">
                        {rep.format === 'XLSX' ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-700" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block truncate max-w-sm">
                          {rep.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-slate-400">
                          {rep.type.replace('_', ' ')} • {rep.fileSize}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-slate-700 block">{rep.projectCode}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                      {rep.projectName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium truncate max-w-[180px]">
                    {rep.vendorName}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
                    {formatDate(rep.generatedDate)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                        rep.format === 'XLSX'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {rep.format}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {rep.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenPreview(rep)}
                      >
                        Preview & Print
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => {
                          alert(`Simulated download: ${rep.title}.${rep.format.toLowerCase()}`);
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Preview Modal */}
      {selectedReport && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={`Report Document Preview: ${selectedReport.title}`}
          maxWidth="3xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-400 font-mono">
                Generated via ProcureAI Decision Engine
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5" />}
                  onClick={handlePrint}
                >
                  Print Report Document
                </Button>
              </div>
            </div>
          }
        >
          {/* Formal Corporate Printable Document Structure */}
          <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-xs text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500">
                  CONFIDENTIAL PROCUREMENT EVALUATION REPORT
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  {selectedReport.title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Project Code: <span className="font-mono font-bold">{currentProject.code}</span> — {currentProject.name}
                </p>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <span className="font-mono text-slate-500 block">Date: {formatDate(selectedReport.generatedDate)}</span>
                <span className="text-slate-500 block">Author: {settings.profile.name}</span>
                <span className="text-slate-500 block">{settings.organization.orgName}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                1. Executive Summary & Recommended Award
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                The Procurement Evaluation Committee, in conjunction with the automated proposal
                extraction engine, completed a multi-criteria weighted assessment for RFP{' '}
                <strong>{currentProject.code}</strong>. Based on technical compliance, total cost of
                ownership, SLA commitments, and regulatory risk,{' '}
                <strong>{recommendedVendor?.vendorName || 'ApexCloud Solutions Inc.'}</strong> has been
                determined as the best-value candidate with a composite weighted score of{' '}
                <strong>{recommendedVendor?.overallWeightedScore || 88.4}/100</strong>.
              </p>
            </div>

            {/* Ranking Breakdown Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                2. Vendor Ranking & Commercial Summary
              </h3>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Rank</th>
                    <th className="p-2">Vendor Name</th>
                    <th className="p-2 text-right">Commercial Bid</th>
                    <th className="p-2 text-right">Weighted Score</th>
                    <th className="p-2">Recommendation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {evaluationResults.map((v: VendorEvaluationResult) => (
                    <tr key={v.vendorId} className={v.rank === 1 ? 'bg-emerald-50/40 font-semibold' : ''}>
                      <td className="p-2 font-mono">#{v.rank}</td>
                      <td className="p-2">{v.vendorName}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(v.totalBidAmount)}</td>
                      <td className="p-2 text-right font-mono">{v.overallWeightedScore} / 100</td>
                      <td className="p-2 text-slate-600">
                        {v.rank === 1 ? 'Award Recommended' : 'Acceptable Alternative'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Evaluation Criteria Audit */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                3. Criteria Weighting Distribution
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {currentProject.criteria.map((c: Criterion) => (
                  <div key={c.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-medium text-slate-700 block truncate">{c.label}</span>
                    <span className="font-mono font-bold text-slate-900">{c.weight}% Weight</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formal Committee Sign-Off Lines */}
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                4. Evaluation Committee Certification
              </h3>
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-4">
                  <div className="border-b border-slate-400 pb-1">
                    <span className="text-slate-900 font-semibold">{settings.profile.name}</span>
                  </div>
                  <span className="text-slate-500 block text-[11px]">
                    Procurement Committee Chair / {settings.profile.title}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-slate-400 pb-1">
                    <span className="text-slate-900 font-semibold">David Thorne</span>
                  </div>
                  <span className="text-slate-500 block text-[11px]">
                    Technical Evaluation Lead / Strategic Sourcing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
