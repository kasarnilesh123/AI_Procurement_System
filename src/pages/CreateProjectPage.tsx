import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  FileCheck2,
  Layers,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { Criterion, ProjectRequirement, Vendor } from '../types/procurement';
import { INITIAL_CRITERIA_DEFAULT } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { normalizeWeights, calculateTotalWeight } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const STEPS = [
  { id: 1, title: 'Project Information', desc: 'Scope, budget & timeline' },
  { id: 2, title: 'Requirements', desc: 'Technical & SLA thresholds' },
  { id: 3, title: 'Evaluation Criteria', desc: 'Weights totaling 100%' },
  { id: 4, title: 'Invited Vendors', desc: 'Bidding participants' },
  { id: 5, title: 'Review & Launch', desc: 'Audit & initialize RFP' },
];

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject, vendors, addVendor } = useProcurement();

  const [currentStep, setCurrentStep] = useState(1);

  // Inline Vendor Creation in Step 4
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorContact, setNewVendorContact] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [newVendorHQ, setNewVendorHQ] = useState('');

  // Form State
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    code: `PRJ-2024-${Math.floor(100 + Math.random() * 900)}`,
    category: 'Highway & Road Infrastructure',
    department: 'Roads & Infrastructure Works Board',
    budget: 85000000,
    currency: 'INR',
    deadline: '2026-12-15',
    description: '',
  });

  const [requirements, setRequirements] = useState<ProjectRequirement[]>([
    {
      id: 'req-init-1',
      category: 'technical',
      title: 'Scalable Microservices Architecture',
      description: 'Vendor platform must support multi-region containerized failover.',
      isMandatory: true,
    },
    {
      id: 'req-init-2',
      category: 'compliance',
      title: 'SOC 2 Type II & ISO 27001 Certification',
      description: 'Audit report dated within the past 12 months required.',
      isMandatory: true,
    },
  ]);

  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqDesc, setNewReqDesc] = useState('');
  const [newReqCategory, setNewReqCategory] = useState<ProjectRequirement['category']>('technical');
  const [newReqMandatory, setNewReqMandatory] = useState(true);

  // Criteria State
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL_CRITERIA_DEFAULT);

  // Selected Vendors
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  // Calculated weights
  const totalWeight = calculateTotalWeight(criteria);

  const handleUpdateCriterionWeight = (id: string, weight: number) => {
    setCriteria((prev: Criterion[]) =>
      prev.map((c: Criterion) => (c.id === id ? { ...c, weight: Math.max(0, Math.min(100, weight)) } : c))
    );
  };

  const handleAutoNormalize = () => {
    setCriteria(normalizeWeights(criteria));
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle) return;
    const item: ProjectRequirement = {
      id: `req-${Date.now()}`,
      category: newReqCategory,
      title: newReqTitle,
      description: newReqDesc,
      isMandatory: newReqMandatory,
    };
    setRequirements((prev: ProjectRequirement[]) => [...prev, item]);
    setNewReqTitle('');
    setNewReqDesc('');
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements((prev: ProjectRequirement[]) => prev.filter((r: ProjectRequirement) => r.id !== id));
  };

  const handleToggleVendor = (vendorId: string) => {
    setSelectedVendorIds((prev: string[]) =>
      prev.includes(vendorId) ? prev.filter((id: string) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const handleCreateVendorInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;
    const created = addVendor({
      name: newVendorName.trim(),
      contactName: newVendorContact.trim() || 'Primary Contact',
      contactEmail: newVendorEmail.trim() || 'vendor@example.com',
      headquarters: newVendorHQ.trim() || 'Not specified',
    });
    setSelectedVendorIds((prev) => [...prev, created.id]);
    setNewVendorName('');
    setNewVendorContact('');
    setNewVendorEmail('');
    setNewVendorHQ('');
    setShowAddVendorModal(false);
  };

  const handleSubmit = () => {
    if (totalWeight !== 100) {
      alert('Criteria weights must equal exactly 100% before creating the project.');
      return;
    }
    const created = createProject({
      name: projectInfo.name || 'Enterprise RFP Evaluation',
      code: projectInfo.code,
      category: projectInfo.category,
      department: projectInfo.department,
      budget: projectInfo.budget,
      currency: projectInfo.currency,
      deadline: projectInfo.deadline,
      description: projectInfo.description || 'Enterprise procurement evaluation project.',
      requirements,
      criteria,
      invitedVendorIds: selectedVendorIds,
    });
    navigate('/compare');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Initialize Procurement Project
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step-by-step setup for proposal ingestion, evaluation criteria weighting, and vendor comparison.
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-card">
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`flex flex-col p-2 rounded-md transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 cursor-pointer'
                    : 'text-slate-400 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-slate-900'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : step.id}
                  </span>
                  <span className="text-[11px] font-semibold truncate">{step.title}</span>
                </div>
                <span
                  className={`text-[9px] mt-0.5 truncate hidden sm:block ${
                    isCurrent ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6 min-h-[420px]">
        {/* STEP 1: Project Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Step 1: Project Information</h2>
              <p className="text-xs text-slate-500">
                Define the procurement initiative's core scope, fiscal allocation, and target deadline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                  placeholder="e.g. Next-Gen Enterprise Cloud ERP & Analytics Suite"
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Tracking Code
                </label>
                <input
                  type="text"
                  value={projectInfo.code}
                  onChange={(e) => setProjectInfo({ ...projectInfo, code: e.target.value })}
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 font-mono focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Procurement Category
                </label>
                <select
                  value={projectInfo.category}
                  onChange={(e) => setProjectInfo({ ...projectInfo, category: e.target.value })}
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 bg-white focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Highway & Road Infrastructure">Highway & Road Infrastructure</option>
                  <option value="Commercial & Institutional Building">Commercial & Institutional Building</option>
                  <option value="Bridge & Flyover Works">Bridge & Flyover Works</option>
                  <option value="Residential & Housing Project">Residential & Housing Project</option>
                  <option value="Metro & Rail Civil Infrastructure">Metro & Rail Civil Infrastructure</option>
                  <option value="Water Supply & Drainage Works">Water Supply & Drainage Works</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Budget Envelope (INR ₹) *
                </label>
                <input
                  type="number"
                  value={projectInfo.budget}
                  onChange={(e) => setProjectInfo({ ...projectInfo, budget: Number(e.target.value) })}
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 font-mono font-medium focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  value={projectInfo.deadline}
                  onChange={(e) => setProjectInfo({ ...projectInfo, deadline: e.target.value })}
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 font-mono focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Scope & Evaluation Rationale
                </label>
                <textarea
                  rows={3}
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  placeholder="Summarize the procurement objectives, key stakeholder concerns, and critical success metrics..."
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Requirements */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Step 2: Define RFP Requirements</h2>
              <p className="text-xs text-slate-500">
                Specify technical benchmarks, mandatory compliance gates, and service level agreements.
              </p>
            </div>

            {/* List of requirements */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {requirements.map((req: ProjectRequirement) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{req.title}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {req.category}
                      </span>
                      {req.isMandatory && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{req.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveRequirement(req.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new requirement */}
            <form
              onSubmit={handleAddRequirement}
              className="p-3.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/80 space-y-3"
            >
              <span className="text-xs font-semibold text-slate-800 block">
                + Add Project Requirement
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Requirement Title (e.g. 99.99% Multi-Region SLA)"
                    value={newReqTitle}
                    onChange={(e) => setNewReqTitle(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <select
                    value={newReqCategory}
                    onChange={(e) =>
                      setNewReqCategory(e.target.value as ProjectRequirement['category'])
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
                  >
                    <option value="technical">Technical</option>
                    <option value="commercial">Commercial</option>
                    <option value="sla">SLA</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Requirement details or verification criteria..."
                  value={newReqDesc}
                  onChange={(e) => setNewReqDesc(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 p-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReqMandatory}
                    onChange={(e) => setNewReqMandatory(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span>Mark as Mandatory Gate (Non-compliance flags risk)</span>
                </label>
                <Button type="submit" variant="secondary" size="sm">
                  Add Requirement
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Evaluation Criteria & Weights */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Step 3: Evaluation Criteria & Weighted Scoring
                </h2>
                <p className="text-xs text-slate-500">
                  Define weights across all technical, commercial, quality, and risk factors. Total MUST equal 100%.
                </p>
              </div>

              {/* Total weight pill & Normalize button */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    totalWeight === 100
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {totalWeight === 100 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>Total: {totalWeight}% / 100%</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoNormalize}
                  title="Scale all weights proportionally to 100%"
                >
                  Auto-Balance to 100%
                </Button>
              </div>
            </div>

            {totalWeight !== 100 && (
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>
                  Current criteria sum is <strong>{totalWeight}%</strong>. You must achieve exactly <strong>100%</strong> before proceeding to the next step.
                </span>
                <button
                  onClick={handleAutoNormalize}
                  className="font-semibold underline ml-2 hover:text-amber-950"
                >
                  Normalize Now
                </button>
              </div>
            )}

            {/* Criteria weight inputs list */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {criteria.map((c: Criterion) => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{c.label}</span>
                      {c.isMandatory && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase font-medium">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={c.weight}
                      onChange={(e) => handleUpdateCriterionWeight(c.id, Number(e.target.value))}
                      className="w-24 sm:w-36 h-1.5 bg-slate-200 rounded-lg appearance-none accent-slate-900"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={c.weight}
                        onChange={(e) =>
                          handleUpdateCriterionWeight(c.id, Number(e.target.value))
                        }
                        className="w-14 text-right text-xs font-mono font-bold rounded border border-slate-300 py-1 px-1.5 pr-4"
                      />
                      <span className="absolute right-1.5 top-1 text-[11px] text-slate-400 font-mono">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Vendors */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 4: Invited Vendors</h2>
                <p className="text-xs text-slate-500">
                  Select or register vendor organizations participating in this evaluation.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddVendorModal(true)}
              >
                Add Vendor Manually
              </Button>
            </div>

            {vendors.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 border border-slate-200 rounded-lg">
                <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">No Vendors Registered Yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  All predefined vendors were removed. Add your participating vendor organizations manually.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddVendorModal(true)}
                >
                  Add Vendor Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vendors.map((vendor: Vendor) => {
                  const isSelected = selectedVendorIds.includes(vendor.id);
                  return (
                    <div
                      key={vendor.id}
                      onClick={() => handleToggleVendor(vendor.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Building2
                            className={`w-4 h-4 ${
                              isSelected ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          />
                          <span className="font-semibold text-xs text-slate-900">{vendor.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by div
                          className="rounded border-slate-300 text-slate-900 mt-0.5"
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <p>
                          <span className="text-slate-400">HQ:</span> {vendor.headquarters}
                        </p>
                        <p>
                          <span className="text-slate-400">Contact:</span> {vendor.contactName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Note:</span> You can upload proposal
              documents for each invited vendor after creating the project or from the Vendor Proposals screen.
            </div>
          </div>
        )}

        {/* STEP 5: Review & Launch */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Step 5: Review & Initialize RFP</h2>
              <p className="text-xs text-slate-500">
                Confirm procurement parameters before opening proposal extraction and evaluation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Project</span>
                <p className="font-bold text-slate-900 text-sm">
                  {projectInfo.name || 'Untitled Project'}
                </p>
                <p className="font-mono text-slate-500">{projectInfo.code}</p>
                <p className="text-slate-600">{projectInfo.category}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Financial</span>
                <p className="font-bold text-slate-900 text-sm font-mono">
                  {formatCurrency(projectInfo.budget, projectInfo.currency)}
                </p>
                <p className="text-slate-500">Deadline: {projectInfo.deadline}</p>
                <p className="text-slate-600">{selectedVendorIds.length} Invited Vendors</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Evaluation Criteria Weights (Total: {totalWeight}%)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {criteria.map((c: Criterion) => (
                  <div key={c.id} className="p-2 bg-white rounded border border-slate-200">
                    <p className="text-[11px] text-slate-600 truncate">{c.label}</p>
                    <p className="font-bold font-mono text-slate-900">{c.weight}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                All verification criteria validated. Project is ready for immediate proposal document ingestion.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Navigation Footer Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentStep === 1}
          icon={<ChevronLeft className="w-4 h-4" />}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        >
          Previous Step
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => {
                if (currentStep === 1 && !projectInfo.name) {
                  alert('Please enter a Project Title.');
                  return;
                }
                if (currentStep === 3 && totalWeight !== 100) {
                  alert('Total criteria weights must equal exactly 100% to continue.');
                  return;
                }
                setCurrentStep((prev) => Math.min(5, prev + 1));
              }}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<FileCheck2 className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Launch Evaluation Project
            </Button>
          )}
        </div>
      </div>

      {/* Inline Add Vendor Modal */}
      <Modal
        isOpen={showAddVendorModal}
        onClose={() => setShowAddVendorModal(false)}
        title="Add Vendor Manually"
        description="Add a new participating vendor organization to this project evaluation."
        maxWidth="md"
      >
        <form onSubmit={handleCreateVendorInline} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor / Organization Name *
            </label>
            <input
              type="text"
              required
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              placeholder="e.g. Skyline Tech Solutions"
              className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={newVendorContact}
                onChange={(e) => setNewVendorContact(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={newVendorEmail}
                onChange={(e) => setNewVendorEmail(e.target.value)}
                placeholder="e.g. contact@skyline.in"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headquarters / City
            </label>
            <input
              type="text"
              value={newVendorHQ}
              onChange={(e) => setNewVendorHQ(e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka"
              className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddVendorModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add & Select Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
