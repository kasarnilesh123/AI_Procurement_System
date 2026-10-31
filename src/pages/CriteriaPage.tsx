import React, { useState } from 'react';
import {
  SlidersHorizontal,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Layers,
  HelpCircle,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { WeightSlider } from '../components/common/WeightSlider';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Criterion } from '../types/procurement';
import { INITIAL_CRITERIA_DEFAULT } from '../data/mockData';

export const CriteriaPage: React.FC = () => {
  const {
    currentProject,
    totalCriteriaWeight,
    updateCriterionWeight,
    updateProjectCriteria,
    autoNormalizeCurrentWeights,
  } = useProcurement();

  // Add Criterion Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newWeight, setNewWeight] = useState(10);
  const [newBenchmark, setNewBenchmark] = useState('');
  const [newMandatory, setNewMandatory] = useState(false);

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    const newCrit: Criterion = {
      id: `crit-${Date.now()}`,
      key: newLabel.toLowerCase().replace(/\s+/g, '_'),
      label: newLabel,
      description: newDescription,
      weight: newWeight,
      maxScore: 100,
      isMandatory: newMandatory,
      benchmark: newBenchmark || undefined,
    };
    updateProjectCriteria(currentProject.id, [...currentProject.criteria, newCrit]);
    setIsAddModalOpen(false);
    setNewLabel('');
    setNewDescription('');
    setNewBenchmark('');
  };

  const handleRemoveCriterion = (id: string) => {
    const updated = currentProject.criteria.filter((c: Criterion) => c.id !== id);
    updateProjectCriteria(currentProject.id, updated);
  };

  const handleResetDefaults = () => {
    updateProjectCriteria(currentProject.id, INITIAL_CRITERIA_DEFAULT);
  };

  const handleApplyTemplate = (type: 'balanced' | 'tech_heavy' | 'cost_driven') => {
    let templateWeights: Record<string, number> = {};
    if (type === 'balanced') {
      templateWeights = {
        'crit-tech': 20,
        'crit-cost': 20,
        'crit-quality': 15,
        'crit-delivery': 15,
        'crit-warranty': 10,
        'crit-exp': 10,
        'crit-risk': 10,
      };
    } else if (type === 'tech_heavy') {
      templateWeights = {
        'crit-tech': 35,
        'crit-cost': 15,
        'crit-quality': 20,
        'crit-delivery': 10,
        'crit-warranty': 5,
        'crit-exp': 5,
        'crit-risk': 10,
      };
    } else if (type === 'cost_driven') {
      templateWeights = {
        'crit-tech': 15,
        'crit-cost': 40,
        'crit-quality': 15,
        'crit-delivery': 10,
        'crit-warranty': 5,
        'crit-exp': 10,
        'crit-risk': 5,
      };
    }

    const updated = currentProject.criteria.map((c: Criterion) => ({
      ...c,
      weight: templateWeights[c.id] !== undefined ? templateWeights[c.id] : c.weight,
    }));
    updateProjectCriteria(currentProject.id, updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Evaluation Criteria & Weight Configuration
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {currentProject.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure RFP scoring rubrics and weighted mathematical distribution. Total MUST equal 100%.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Criterion
          </Button>
        </div>
      </div>

      {/* Validation Status & Templates Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Total Weight Status Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold border flex items-center gap-2 ${
              totalCriteriaWeight === 100
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {totalCriteriaWeight === 100 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>Total Criteria Weight: {totalCriteriaWeight}% / 100%</span>
          </div>

          {totalCriteriaWeight !== 100 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={autoNormalizeCurrentWeights}
            >
              Auto-Balance Proportions to 100%
            </Button>
          )}
        </div>

        {/* Quick Industry Templates */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium text-slate-500">Apply Template:</span>
          <button
            onClick={() => handleApplyTemplate('balanced')}
            className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Balanced (30/30/40)
          </button>
          <button
            onClick={() => handleApplyTemplate('tech_heavy')}
            className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Technical Focus
          </button>
          <button
            onClick={() => handleApplyTemplate('cost_driven')}
            className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Cost Sensitive
          </button>
        </div>
      </div>

      {/* Criteria Weight Sliders Grid */}
      <div className="space-y-3">
        {currentProject.criteria.map((criterion: Criterion) => (
          <div key={criterion.id} className="relative group">
            <WeightSlider
              criterion={criterion}
              onChange={(newWeight) => updateCriterionWeight(criterion.id, newWeight)}
            />
            {!criterion.isMandatory && currentProject.criteria.length > 3 && (
              <button
                onClick={() => handleRemoveCriterion(criterion.id)}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 rounded"
                title="Remove criterion"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Scoring Rubrics & Audit Governance Guidelines */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card p-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Standard Enterprise Scoring Rubric Definitions
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 text-xs">
          <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200">
            <span className="font-bold text-emerald-800 block">90 - 100: Exceeds Benchmark</span>
            <p className="text-slate-600 mt-1 text-[11px]">
              Substantially surpasses requirements with verifiable historical track record and warranties.
            </p>
          </div>
          <div className="p-3 bg-sky-50/60 rounded border border-sky-200">
            <span className="font-bold text-sky-800 block">75 - 89: Full Compliance</span>
            <p className="text-slate-600 mt-1 text-[11px]">
              Completely satisfies specifications with standard commercial terms and verified evidence.
            </p>
          </div>
          <div className="p-3 bg-amber-50/60 rounded border border-amber-200">
            <span className="font-bold text-amber-800 block">50 - 74: Minor Deviation</span>
            <p className="text-slate-600 mt-1 text-[11px]">
              Permissible variance or partial fulfillment subject to pre-award contractual negotiation.
            </p>
          </div>
          <div className="p-3 bg-rose-50/60 rounded border border-rose-200">
            <span className="font-bold text-rose-800 block">&lt; 50: Non-Compliant</span>
            <p className="text-slate-600 mt-1 text-[11px]">
              Fails mandatory criteria gate, missing critical audit documentation, or unmitigated risk.
            </p>
          </div>
        </div>
      </div>

      {/* Add Custom Criterion Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Evaluation Criterion"
        description="Introduce tailored evaluation parameters such as ESG, Data Sovereignty, or Custom SLAs."
      >
        <form onSubmit={handleAddCriterion} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Criterion Name *
            </label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. ESG & Carbon Neutrality Commitment"
              className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Scoring Objective
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Explain how proposals will be evaluated against this standard..."
              className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Weight (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full text-xs rounded border border-slate-300 p-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Benchmark
              </label>
              <input
                type="text"
                value={newBenchmark}
                onChange={(e) => setNewBenchmark(e.target.value)}
                placeholder="e.g. Scope 1 & 2 carbon neutral by 2028"
                className="w-full text-xs rounded border border-slate-300 p-2"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newMandatory}
              onChange={(e) => setNewMandatory(e.target.checked)}
              className="rounded border-slate-300 text-slate-900"
            />
            <span className="text-slate-700 font-medium">
              Mandatory Gate (Failing this criterion triggers high-severity risk flag)
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Criterion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
