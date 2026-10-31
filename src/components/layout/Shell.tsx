import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useProcurement } from '../../context/ProcurementContext';
import { UploadCloud, FileCheck, CheckCircle2 } from 'lucide-react';

const MANUAL_VENDOR_ID = '__manual_vendor__';

export const Shell: React.FC = () => {
  const { simulateProposalUpload, currentProject, vendors } = useProcurement();

  // Quick Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || MANUAL_VENDOR_ID);
  const [manualVendorName, setManualVendorName] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>(12500000);
  const [proposalTitle, setProposalTitle] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleStartUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundVendor = vendors.find((v) => v.id === selectedVendorId);
    const resolvedVendorName = foundVendor ? foundVendor.name : (manualVendorName.trim() || 'Manual Vendor');
    const resolvedVendorId = foundVendor ? foundVendor.id : MANUAL_VENDOR_ID;

    if (!resolvedVendorName) return;

    const fileName = uploadFile ? uploadFile.name : `${resolvedVendorName.replace(/\s+/g, '_')}_Proposal_PRJ.pdf`;
    const title = proposalTitle || `${resolvedVendorName} - Technical & Commercial Response`;

    setIsProcessing(true);
    try {
      await simulateProposalUpload(
        fileName,
        uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '15.4 MB',
        resolvedVendorId,
        resolvedVendorName,
        title,
        bidAmount,
        (step, pct) => {
          setCurrentStep(step);
          setProgressPct(pct);
        }
      );
      setUploadSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setProposalTitle('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenUploadModal={() => setIsUploadModalOpen(true)} />

        <main className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Upload Proposal Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => !isProcessing && setIsUploadModalOpen(false)}
        title="Upload Vendor Proposal Document"
        description={`Target Project: ${currentProject.code} — ${currentProject.name}`}
        maxWidth="lg"
      >
        {isProcessing ? (
          <div className="py-8 px-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-800">
              {uploadSuccess ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-in zoom-in" />
              ) : (
                <UploadCloud className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {uploadSuccess ? 'AI Extraction Completed Successfully!' : 'Processing Proposal Document'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">{currentStep}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 ${
                  uploadSuccess ? 'bg-emerald-500' : 'bg-slate-900'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{progressPct}% Complete</span>
          </div>
        ) : (
          <form onSubmit={handleStartUpload} className="space-y-4">
            {/* File Drag and Drop Simulation */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop RFP response (PDF, DOCX, XLSX)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Maximum file size: 50MB</p>
              <label className="mt-3 inline-block">
                <span className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md shadow-xs hover:bg-slate-50 cursor-pointer">
                  Browse Local File
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.xlsx"
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
                <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">{uploadFile.name}</span>
                  <span className="text-slate-400">({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Vendor Entity *
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full text-xs rounded-md border border-slate-300 bg-white py-2 px-2.5 focus:ring-1 focus:ring-slate-900"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                  <option value={MANUAL_VENDOR_ID}>Enter vendor manually...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total Bid Amount (INR ₹) *
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full text-xs rounded-md border border-slate-300 bg-white py-2 px-2.5 font-mono focus:ring-1 focus:ring-slate-900"
                  placeholder="e.g. 12500000"
                  required
                />
              </div>
            </div>

            {(selectedVendorId === MANUAL_VENDOR_ID || vendors.length === 0) && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Vendor / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={manualVendorName}
                  onChange={(e) => setManualVendorName(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  className="w-full text-xs rounded-md border border-slate-300 bg-white py-2 px-2.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Proposal Title
              </label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 bg-white py-2 px-2.5 focus:ring-1 focus:ring-slate-900"
                placeholder="e.g. ApexCloud Solutions Comprehensive RFP Response v2.4"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={<UploadCloud className="w-3.5 h-3.5" />}
              >
                Start AI Extraction Pipeline
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
