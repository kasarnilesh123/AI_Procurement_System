import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Save,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Edit3,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { VerificationBadge } from '../components/common/StatusBadge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ProposalField, FieldVerificationStatus, VendorProposal } from '../types/procurement';

export const ProposalReviewPage: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const { proposals, updateProposalField, currentProject } = useProcurement();

  // Find target proposal or fallback to first
  const proposal =
    proposals.find((p: VendorProposal) => p.id === proposalId) || proposals[0];

  const [activePage, setActivePage] = useState<number>(14);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeHighlightKey, setActiveHighlightKey] = useState<string>('pricing');
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Proposal not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/proposals')}>
          Return to Proposals
        </Button>
      </div>
    );
  }

  const fieldsList: ProposalField[] = Object.values(proposal.fields);

  const handleToggleVerification = (field: ProposalField) => {
    const nextStatus: FieldVerificationStatus =
      field.status === 'verified' ? 'needs_review' : 'verified';
    updateProposalField(proposal.id, field.key, { status: nextStatus });
  };

  const handleStartEdit = (field: ProposalField) => {
    setEditingFieldKey(field.key);
    setEditValue(field.extractedValue);
  };

  const handleSaveEdit = (fieldKey: string) => {
    updateProposalField(proposal.id, fieldKey, {
      extractedValue: editValue,
      status: 'verified',
    });
    setEditingFieldKey(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleSelectFieldCitation = (field: ProposalField) => {
    setActiveHighlightKey(field.key);
    if (field.sourcePage) {
      setActivePage(field.sourcePage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={() => navigate('/proposals')}
          >
            Proposals
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{proposal.vendorName}</span>
              <span className="text-xs text-slate-400 font-mono">({proposal.fileName})</span>
            </div>
            <p className="text-[11px] text-slate-500">{proposal.proposalTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved & Verified
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<FileCheck className="w-3.5 h-3.5" />}
            onClick={() => {
              // mark all as verified
              fieldsList.forEach((f: ProposalField) => {
                updateProposalField(proposal.id, f.key, { status: 'verified' });
              });
              setSaveToast(true);
              setTimeout(() => setSaveToast(false), 2000);
            }}
          >
            Verify All Fields
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/compare')}
          >
            Proceed to Comparison Matrix
          </Button>
        </div>
      </div>

      {/* Split-Screen Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-190px)] min-h-[620px]">
        {/* Left Pane: Document Preview Area (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-lg border border-slate-800 shadow-card flex flex-col overflow-hidden text-slate-200">
          {/* Document Toolbar */}
          <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px] truncate max-w-[140px]">
                {proposal.fileName}
              </span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage((p: number) => Math.max(1, p - 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-300">
                Page {activePage} of 68
              </span>
              <button
                onClick={() => setActivePage((p: number) => Math.min(68, p + 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => setZoomLevel((z: number) => Math.max(75, z - 10))}
                className="p-1 hover:bg-slate-800 rounded"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z: number) => Math.min(150, z + 10))}
                className="p-1 hover:bg-slate-800 rounded"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulated Rendered PDF Page View */}
          <div className="flex-1 bg-slate-800/80 p-4 overflow-y-auto flex items-center justify-center">
            <div
              className="bg-white text-slate-900 shadow-2xl rounded p-6 w-full max-w-[480px] min-h-[580px] font-sans text-xs border border-slate-300 transition-all select-text"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                    {proposal.vendorName}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">
                    RFP Response: Section 4 - Technical & Commercial Architecture
                  </h4>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Page {activePage}</span>
              </div>

              {/* Document Body Snippets with Highlight */}
              <div className="mt-4 space-y-3.5 leading-relaxed text-[11px] text-slate-700">
                <p>
                  <strong>4.1 Executive Overview:</strong> The proposed solution leverages enterprise-grade
                  cloud microservices orchestration, resilient container clustering, and automated
                  failover telemetry.
                </p>

                {/* Highlight box corresponding to current citation */}
                <div className="p-2.5 rounded bg-amber-50/80 border-l-4 border-amber-500 text-slate-900 shadow-xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-800 block mb-0.5">
                    ★ AI Extracted Clause (Cited Section)
                  </span>
                  <p className="font-medium text-[11px] text-slate-800">
                    "{proposal.fields[activeHighlightKey]?.extractedValue ||
                      'The contractor guarantees 99.99% multi-region high availability with dedicated SLA credits and 1-hour P1 resolution time.'}"
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Source: {proposal.fields[activeHighlightKey]?.sourceCitation || `Page ${activePage}`}
                  </span>
                </div>

                <p>
                  <strong>4.2 Deployment Governance & Uptime:</strong> In accordance with RFP requirements,
                  our service management framework complies with ISO/IEC 20000 standards. Real-time health
                  endpoints are exposed via Prometheus format for automated compliance reporting.
                </p>

                <p>
                  <strong>4.3 SLA Compensations & Financial Penalties:</strong> Failure to satisfy the
                  contractual monthly availability threshold results in liquidated credits credited against
                  the subsequent quarter billing cycle.
                </p>

                <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>CONFIDENTIAL - PROPRIETARY SUBMISSION</span>
                  <span>{proposal.vendorName} © 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer helper */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Click any citation on the right to jump to the verified page.</span>
            <span className="font-mono text-emerald-400">PDF OCR Validated</span>
          </div>
        </div>

        {/* Right Pane: Extracted Information & Verification Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-card flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Extracted Clauses & Entity Fields
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review extracted values, audit source page citations, and mark fields as Verified.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Verification Progress
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {fieldsList.filter((f: ProposalField) => f.status === 'verified').length} / {fieldsList.length} Verified
              </span>
            </div>
          </div>

          {/* Fields List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {fieldsList.map((field: ProposalField) => {
              const isEditing = editingFieldKey === field.key;
              const isHighlighted = activeHighlightKey === field.key;

              return (
                <div
                  key={field.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isHighlighted
                      ? 'border-slate-800 bg-slate-50/60 shadow-xs ring-1 ring-slate-800'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{field.label}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {field.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {field.confidenceScore}% Confidence
                        </span>
                      </div>

                      {/* Source Citation link */}
                      <button
                        onClick={() => handleSelectFieldCitation(field)}
                        className="mt-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 group text-left"
                      >
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span className="underline decoration-slate-300 group-hover:decoration-slate-800">
                          Source: {field.sourceCitation}
                        </span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    </div>

                    {/* Verification Toggle & Edit */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleVerification(field)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                          field.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to toggle verification status"
                      >
                        {field.status === 'verified' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Needs Review</span>
                          </>
                        )}
                      </button>

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(field)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="Edit extracted value"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Extracted Value Display or Editable Input */}
                  <div className="mt-2.5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-xs rounded border border-slate-400 p-2 focus:ring-1 focus:ring-slate-900 bg-white"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingFieldKey(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Save className="w-3 h-3" />}
                            onClick={() => handleSaveEdit(field.key)}
                          >
                            Save & Verify
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200/80 font-medium">
                        {field.extractedValue}
                      </p>
                    )}
                  </div>

                  {field.notes && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-slate-100/70 p-2 rounded border border-slate-200/60">
                      <span className="font-semibold text-slate-700">Audit Note:</span> {field.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Extracted Assumptions & Legal terms */}
          {proposal.assumptions && proposal.assumptions.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Extracted Vendor Assumptions & Contingencies
              </span>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                {proposal.assumptions.map((assump: string, i: number) => (
                  <li key={i}>{assump}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
