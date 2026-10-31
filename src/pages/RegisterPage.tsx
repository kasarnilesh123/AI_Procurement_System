import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Mail,
  Building,
  Briefcase,
  IndianRupee,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatCompactRupee } from '../utils/formatters';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: 'Tata Enterprise Sourcing Consortium',
    department: 'Strategic Sourcing & Vendor Governance',
    role: 'Senior Procurement Manager',
    authorityLimit: 20000000, // ₹2.00 Crore default
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!formData.name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid corporate work email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Enterprise Procurement Ethics & Confidentiality terms.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        organization: formData.organization,
        authorityLimit: Number(formData.authorityLimit),
      });

      setIsSubmitting(false);

      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Failed to complete registration.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white shadow-sm mb-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Enterprise Account Registration
        </h1>
        <p className="mt-1 text-xs text-slate-600 font-medium max-w-md mx-auto">
          Set up an authorized evaluator profile for RFP reviews, vendor scoring & decision support
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-xl">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base font-bold text-slate-900">Procurement Officer Credentials</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All evaluations and score overrides are digitally tied to your delegated authority
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya.sharma@enterprise.corp"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Enterprise Organization & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enterprise Organization *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Global Sourcing Consortium"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Business Unit *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  <option value="Strategic Sourcing & Vendor Governance">Strategic Sourcing & Vendor Governance</option>
                  <option value="Enterprise Architecture & Cloud">Enterprise Architecture & Cloud</option>
                  <option value="Information Security & Compliance">Information Security & Compliance</option>
                  <option value="Corporate Legal & Risk">Corporate Legal & Risk</option>
                  <option value="Finance & Commercial Audit">Finance & Commercial Audit</option>
                  <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                </select>
              </div>
            </div>

            {/* Role & Delegated Authority Limit in Rupees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Procurement Role / Designation *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Technical Evaluator"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Delegated Authority Limit (INR ₹) *
                  </label>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {formatCompactRupee(Number(formData.authorityLimit) || 0)}
                  </span>
                </div>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="number"
                    step="500000"
                    min="100000"
                    required
                    value={formData.authorityLimit}
                    onChange={(e) => setFormData({ ...formData, authorityLimit: Number(e.target.value) })}
                    placeholder="20000000"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Formatted: {formatCurrency(Number(formData.authorityLimit) || 0, 'INR')}
                </p>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Ethics statement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 mt-0.5"
                />
                <span className="leading-relaxed">
                  I certify that all evaluations and scoring weights assigned comply with the corporate
                  Procurement Code of Ethics and I maintain zero conflict of interest with invited vendors.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering evaluator account...</span>
              ) : (
                <>
                  <span>Create Account & Enter Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already registered in your enterprise directory?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Sign in to your account &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Security / Compliance Footnote */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          <p>
            Delegated financial authority limits are governed by Enterprise Procurement Bylaws.
          </p>
        </div>
      </div>
    </div>
  );
};
