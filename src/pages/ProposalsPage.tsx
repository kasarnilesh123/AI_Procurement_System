import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  RefreshCw,
  GitCompare,
  FileCheck,
  Eye,
  SlidersHorizontal,
  Trash2,
  Building2,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ProcessingBadge } from '../components/common/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { VendorProposal, Vendor, ProposalField } from '../types/procurement';

const MANUAL_VENDOR_ID = '__manual_vendor__';

export const ProposalsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    proposals,
    currentProject,
    vendors,
    simulateProposalUpload,
    deleteProposal,
  } = useProcurement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('all');
  const [proposalToDelete, setProposalToDelete] = useState<VendorProposal | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [vendorId, setVendorId] = useState<string>(vendors[0]?.id || MANUAL_VENDOR_ID);
  const [manualVendorName, setManualVendorName] = useState('');
  const [bidAmount, setBidAmount] = useState<number>(13000000);
  const [proposalTitle, setProposalTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStep, setUploadProgressStep] = useState('');
  const [uploadProgressPct, setUploadProgressPct] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter proposals for current project or all
  const filteredProposals = proposals.filter((prop: VendorProposal) => {
    const matchesProject = prop.projectId === currentProject.id;
    const matchesSearch =
      prop.proposalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendorFilter === 'all' || prop.vendorId === selectedVendorFilter;
    return matchesProject && matchesSearch && matchesVendor;
  });

  const vendorFilterOptions = new Map(vendors.map((vendor) => [vendor.id, vendor.name]));
  proposals
    .filter((proposal) => proposal.projectId === currentProject.id)
    .forEach((proposal) => {
      if (!vendorFilterOptions.has(proposal.vendorId)) {
        vendorFilterOptions.set(proposal.vendorId, proposal.vendorName);
      }
    });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVendor = vendors.find((v: Vendor) => v.id === vendorId);
    const resolvedVendorName =
      vendorId === MANUAL_VENDOR_ID ? manualVendorName.trim() : selectedVendor?.name;
    const resolvedVendorId =
      vendorId === MANUAL_VENDOR_ID
        ? `manual:${resolvedVendorName?.toLocaleLowerCase()}`
        : selectedVendor?.id;

    if (!resolvedVendorName || !resolvedVendorId) return;

    const fileName = uploadFile
      ? uploadFile.name
      : `${resolvedVendorName.replace(/\s+/g, '_')}_Proposal_RFP_Response.pdf`;
    const title =
      proposalTitle || `${resolvedVendorName} - Official Technical & Commercial Response`;

    setIsUploading(true);
    setIsSuccess(false);

    try {
      await simulateProposalUpload(
        fileName,
        uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '18.2 MB',
        resolvedVendorId,
        resolvedVendorName,
        title,
        bidAmount,
        (step: string, pct: number) => {
          setUploadProgressStep(step);
          setUploadProgressPct(pct);
        }
      );

      setIsSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSuccess(false);
        setUploadFile(null);
        setProposalTitle('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!proposalToDelete) return;
    deleteProposal(proposalToDelete.id);
    setProposalToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Proposals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest vendor RFP responses (PDF/DOCX), trigger automated AI extraction, and audit parsed criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Building2 className="w-3.5 h-3.5 text-slate-700" />}
            onClick={() => navigate('/vendors')}
          >
            Manage Vendors ({vendors.length})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<GitCompare className="w-3.5 h-3.5" />}
            onClick={() => navigate('/compare')}
          >
            Compare All in Matrix
          </Button>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Upload & Extract Vendor Proposal
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Target: {currentProject.code} ({currentProject.name})
          </span>
        </div>

        {isUploading ? (
          <div className="py-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-800">
              {isSuccess ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-in zoom-in" />
              ) : (
                <RefreshCw className="w-6 h-6 text-slate-700 animate-spin" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {isSuccess
                  ? 'Extraction Pipeline Completed!'
                  : 'Automated Extraction Pipeline In Progress'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">{uploadProgressStep}</p>
            </div>

            {/* Stages Pipeline Visualization */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-4">
              <span className={uploadProgressPct >= 20 ? 'text-emerald-700 font-semibold' : ''}>
                1. Uploaded
              </span>
              <span>&rarr;</span>
              <span className={uploadProgressPct >= 45 ? 'text-emerald-700 font-semibold' : ''}>
                2. OCR & Layout
              </span>
              <span>&rarr;</span>
              <span className={uploadProgressPct >= 70 ? 'text-emerald-700 font-semibold' : ''}>
                3. Entity Extraction
              </span>
              <span>&rarr;</span>
              <span className={uploadProgressPct >= 100 ? 'text-emerald-700 font-semibold' : ''}>
                4. Ready for Review
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 ${
                  isSuccess ? 'bg-emerald-500' : 'bg-slate-900'
                }`}
                style={{ width: `${uploadProgressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{uploadProgressPct}% Complete</span>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Drop Area */}
              <div className="md:col-span-1 border-2 border-dashed border-slate-300 rounded-lg p-5 text-center bg-slate-50/50 hover:border-slate-400 transition-colors flex flex-col justify-center items-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Choose Proposal File</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF or DOCX (up to 50MB)</p>
                <label className="mt-2.5">
                  <span className="px-3 py-1 text-xs font-medium bg-white border border-slate-300 rounded shadow-xs hover:bg-slate-50 cursor-pointer inline-block">
                    Browse File
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                        setProposalTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                  />
                </label>
                {uploadFile && (
                  <p className="mt-2 text-[11px] font-mono text-emerald-700 truncate max-w-full">
                    ✓ {uploadFile.name}
                  </p>
                )}
              </div>

              {/* Form Metadata Fields */}
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vendor Entity *
                    </label>
                    <select
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      required
                      className="w-full text-xs rounded-md border border-slate-300 bg-white p-2 focus:ring-1 focus:ring-slate-900"
                    >
                      {vendors.map((v: Vendor) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                      <option value={MANUAL_VENDOR_ID}>Enter a vendor manually...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Bid Amount (INR ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full text-xs rounded-md border border-slate-300 p-2 font-mono font-medium focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {vendorId === MANUAL_VENDOR_ID && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      value={manualVendorName}
                      onChange={(e) => setManualVendorName(e.target.value)}
                      placeholder="Enter the company or contractor name"
                      pattern=".*\S.*"
                      required
                      className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proposal Document Title
                  </label>
                  <input
                    type="text"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    placeholder="e.g. ApexCloud Solutions Comprehensive RFP Response v2.4"
                    className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    The platform performs OCR, structured clause extraction, and automated benchmark scoring.
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<UploadCloud className="w-3.5 h-3.5" />}
                  >
                    Simulate Upload & Extraction
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Filter and Search Bar for Proposals */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search proposals by vendor or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Vendor:</span>
          <select
            value={selectedVendorFilter}
            onChange={(e) => setSelectedVendorFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800"
          >
            <option value="all">All Vendors</option>
            {Array.from(vendorFilterOptions, ([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proposals List Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {currentProject.code} Evaluation Group
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Vendor / Proposal Title</th>
                <th className="px-4 py-3">Source File</th>
                <th className="px-4 py-3 text-right">Commercial Bid</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">AI Extraction Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No proposals found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((prop: VendorProposal) => {
                  const unverifiedFields = Object.values(prop.fields).filter(
                    (f: ProposalField) => f.status === 'needs_review'
                  ).length;

                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 block">
                          {prop.vendorName}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {prop.proposalTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="font-mono text-[11px] truncate max-w-[170px]">
                            {prop.fileName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {prop.fileSize}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(prop.totalBidAmount, prop.currency)}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                        {formatDate(prop.submissionDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <ProcessingBadge status={prop.status} />
                          {unverifiedFields > 0 ? (
                            <span className="text-[10px] text-amber-700 font-medium block">
                              {unverifiedFields} fields need review
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-medium block">
                              All fields verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Eye className="w-3.5 h-3.5 text-slate-600" />}
                            onClick={() => navigate(`/proposals/${prop.id}/review`)}
                          >
                            Review Extraction
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                            onClick={() => setProposalToDelete(prop)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={proposalToDelete !== null}
        onClose={() => setProposalToDelete(null)}
        title="Delete vendor proposal?"
        description="This action cannot be undone."
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setProposalToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Delete Proposal
            </Button>
          </>
        }
      >
        {proposalToDelete && (
          <p className="text-sm text-slate-700">
            Delete <span className="font-semibold">{proposalToDelete.proposalTitle}</span> from{' '}
            <span className="font-semibold">{proposalToDelete.vendorName}</span>? Its proposal
            details will be removed from this browser.
          </p>
        )}
      </Modal>
    </div>
  );
};
