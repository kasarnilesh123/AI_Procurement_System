import React, { useState } from 'react';
import {
  User,
  Building,
  Sliders,
  Bell,
  Palette,
  Save,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useProcurement();

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'evaluation' | 'notifications' | 'appearance'>('profile');
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-card">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure procurement authority limits, organizational parameters, evaluation policies, and display settings.
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> Settings Saved Successfully
          </span>
        )}
      </div>

      {/* Main Settings Card with Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'organization'
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Organization</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'evaluation'
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Evaluation Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-2 text-xs font-semibold rounded-t border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'appearance'
                ? 'border-slate-900 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Procurement Officer Profile</h3>
                <p className="text-slate-500">Identity details for sign-off certifications and audit trails.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.profile.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, name: e.target.value },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, email: e.target.value },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.profile.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, title: e.target.value },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delegated Authority Limit (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.profile.authorityLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, authorityLimit: Number(e.target.value) },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ORGANIZATION TAB */}
          {activeTab === 'organization' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Organization & Fiscal Governance</h3>
                <p className="text-slate-500">Global sourcing consortium settings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Legal Name</label>
                  <input
                    type="text"
                    value={formData.organization.orgName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization: { ...formData.organization, orgName: e.target.value },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Base Currency</label>
                  <select
                    value={formData.organization.defaultCurrency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization: { ...formData.organization, defaultCurrency: e.target.value },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CHF">CHF (Fr) - Swiss Franc</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={formData.organization.strictComplianceCheck}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organization: { ...formData.organization, strictComplianceCheck: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-slate-900"
                />
                <span className="text-slate-700 font-medium">
                  Enforce Strict Compliance: Require ISO 45001 safety certification and Environmental Clearance (EC) for civil works RFPs
                </span>
              </label>
            </div>
          )}

          {/* EVALUATION PREFERENCES TAB */}
          {activeTab === 'evaluation' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Evaluation Engine Settings</h3>
                <p className="text-slate-500">Rules controlling scoring math and AI extraction strictness.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scoring Scale</label>
                  <select
                    value={formData.evaluationPreferences.scoringScale}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        evaluationPreferences: {
                          ...formData.evaluationPreferences,
                          scoringScale: e.target.value as any,
                        },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="100_point">100-Point Standard Scale (0.0 - 100.0)</option>
                    <option value="10_point">10-Point Metric Scale (0.0 - 10.0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    AI Extraction Confidence Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={formData.evaluationPreferences.aiExtractionConfidenceThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        evaluationPreferences: {
                          ...formData.evaluationPreferences,
                          aiExtractionConfidenceThreshold: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs rounded border border-slate-300 p-2.5 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Extractions below this threshold will automatically be marked as "Needs Review".
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.evaluationPreferences.autoNormalizeWeights}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        evaluationPreferences: {
                          ...formData.evaluationPreferences,
                          autoNormalizeWeights: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-normalize criteria weights if slider adjustment does not equal 100%
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.evaluationPreferences.requireTwoSignoffs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        evaluationPreferences: {
                          ...formData.evaluationPreferences,
                          requireTwoSignoffs: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span className="text-slate-700 font-medium">
                    Require two committee member approvals for contracts exceeding ₹1,00,00,000 (₹1 Cr)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Procurement Activity Notifications</h3>
                <p className="text-slate-500">Configure notifications delivered to the command center.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.proposalUploaded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, proposalUploaded: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Proposal Upload & OCR Complete</span>
                    <span className="text-slate-500 text-[11px]">Notify when a vendor proposal finishes AI clause extraction.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.weightChangeAudited}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, weightChangeAudited: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Criteria Weight Modifications</span>
                    <span className="text-slate-500 text-[11px]">Log audit events when any evaluator alters criteria weights.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.recommendationReady}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, recommendationReady: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Recommendation Ready Alert</span>
                    <span className="text-slate-500 text-[11px]">Notify committee members when all bids are extracted and ranked.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Interface Density & Display</h3>
                <p className="text-slate-500">Fine-tune data table row spacing and readability.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matrix Density</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        appearance: { ...formData.appearance, tableDensity: 'compact' },
                      })
                    }
                    className={`p-3 rounded border text-left ${
                      formData.appearance.tableDensity === 'compact'
                        ? 'border-slate-900 bg-slate-50 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    <span className="block font-semibold">Compact (High Information Density)</span>
                    <span className="text-[11px] text-slate-500 font-normal">Optimal for large matrices with 5+ vendors</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        appearance: { ...formData.appearance, tableDensity: 'comfortable' },
                      })
                    }
                    className={`p-3 rounded border text-left ${
                      formData.appearance.tableDensity === 'comfortable'
                        ? 'border-slate-900 bg-slate-50 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    <span className="block font-semibold">Comfortable</span>
                    <span className="text-[11px] text-slate-500 font-normal">Standard spacing with larger cell padding</span>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.appearance.highContrastBadges}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearance: { ...formData.appearance, highContrastBadges: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-slate-900"
                />
                <span className="text-slate-700 font-medium">
                  High contrast borders on compliance status indicators
                </span>
              </label>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
            >
              Save Configuration Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
