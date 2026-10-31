import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Star,
  FileText,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Vendor } from '../types/procurement';

export const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { vendors, addVendor, updateVendor, deleteVendor, clearAllVendors, proposals } = useProcurement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);

  // Form Fields
  const [vendorName, setVendorName] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [category, setCategory] = useState('Civil & Highway Construction');
  const [rating, setRating] = useState<number>(4.5);
  const [notes, setNotes] = useState('');

  // Delete Confirm Modal State
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const resetForm = () => {
    setEditingVendorId(null);
    setVendorName('');
    setVendorCode('');
    setContactName('');
    setContactEmail('');
    setPhone('');
    setHeadquarters('');
    setCategory('Civil & Highway Construction');
    setRating(4.5);
    setNotes('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendorId(v.id);
    setVendorName(v.name);
    setVendorCode(v.code);
    setContactName(v.contactName);
    setContactEmail(v.contactEmail);
    setPhone(v.phone || '');
    setHeadquarters(v.headquarters);
    setCategory(v.category || 'Enterprise Software');
    setRating(v.rating || 4.5);
    setNotes(v.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    if (editingVendorId) {
      updateVendor(editingVendorId, {
        name: vendorName.trim(),
        code: vendorCode.trim().toUpperCase() || vendorName.trim().slice(0, 4).toUpperCase(),
        contactName: contactName.trim() || 'Primary Contact',
        contactEmail: contactEmail.trim() || 'contact@vendor.com',
        phone: phone.trim(),
        headquarters: headquarters.trim() || 'Not specified',
        category: category.trim(),
        rating,
        notes: notes.trim(),
      });
    } else {
      addVendor({
        name: vendorName.trim(),
        code: vendorCode.trim().toUpperCase() || vendorName.trim().slice(0, 4).toUpperCase(),
        contactName: contactName.trim() || 'Primary Contact',
        contactEmail: contactEmail.trim() || 'contact@vendor.com',
        phone: phone.trim(),
        headquarters: headquarters.trim() || 'Not specified',
        category: category.trim(),
        rating,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (vendorToDelete) {
      deleteVendor(vendorToDelete.id);
      setVendorToDelete(null);
    }
  };

  const handleConfirmClearAll = () => {
    clearAllVendors();
    setIsClearAllModalOpen(false);
  };

  // Categories list
  const categories = Array.from(
    new Set(vendors.map((v) => v.category || 'Civil & Highway Construction'))
  );

  // Filtered vendors
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || (v.category || 'Civil & Highway Construction') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendors Directory</h1>
            <span className="px-2 py-0.5 text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
              Manual Sourcing Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Predefined mock vendors have been deleted. Add, update, and manage all your vendor organizations,
            direct contacts, and qualifications manually.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {vendors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
              onClick={() => setIsClearAllModalOpen(true)}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Clear All Vendors
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4 text-white" />}
            onClick={handleOpenAdd}
          >
            Add Vendor Manually
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by vendor name, code, contact person, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 focus:bg-white"
          >
            <option value="all">All Categories ({vendors.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Cards Grid */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8 shadow-card">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No Matching Vendors Found' : 'No Vendors Added Yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No vendors match your search term "${searchQuery}". Clear search or add a new vendor.`
              : 'All default predefined vendor names were deleted so you have full control. Add your vendor information manually to get started.'}
          </p>
          <div className="mt-5">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleOpenAdd}
            >
              Add Your First Vendor
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => {
            const vendorProposals = proposals.filter((p) => p.vendorId === vendor.id);

            return (
              <div
                key={vendor.id}
                className="bg-white rounded-lg border border-slate-200 shadow-card hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono flex-shrink-0">
                        {vendor.code || vendor.name.slice(0, 3).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-slate-900 truncate" title={vendor.name}>
                          {vendor.name}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {vendor.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating ? vendor.rating.toFixed(1) : '4.5'}</span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-4 flex justify-center text-slate-400">👤</span>
                      <span className="font-medium truncate">{vendor.contactName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <a
                        href={`mailto:${vendor.contactEmail}`}
                        className="truncate hover:underline text-slate-700"
                      >
                        {vendor.contactEmail}
                      </a>
                    </div>

                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{vendor.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{vendor.headquarters}</span>
                    </div>

                    {vendor.category && (
                      <div className="pt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {vendor.category}
                        </span>
                      </div>
                    )}

                    {vendor.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 mt-2 line-clamp-2">
                        "{vendor.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vendorProposals.length} Proposals</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(vendor)}
                      title="Edit Vendor"
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVendorToDelete(vendor)}
                      title="Delete Vendor"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/proposals')}
                      className="text-[11px] py-1 px-2.5 h-7"
                    >
                      Add Proposal
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendorId ? 'Edit Vendor Information' : 'Add New Vendor Manually'}
        description="Enter organization credentials, point-of-contact details, and qualifications."
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor / Organization Name *
              </label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. ApexCloud Technologies Pvt Ltd"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Code / Symbol
              </label>
              <input
                type="text"
                value={vendorCode}
                onChange={(e) => setVendorCode(e.target.value.toUpperCase())}
                placeholder="e.g. APEX"
                maxLength={6}
                className="w-full text-xs rounded-md border border-slate-300 p-2 font-mono uppercase focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Civil & Highway Construction, Structural Buildings, EPC Infrastructure"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person Name & Title *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rajesh Sharma, Sales VP"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. rajesh@apexcloud.in"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters / Operating Location *
              </label>
              <input
                type="text"
                required
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Evaluator Rating (1.0 to 5.0)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none accent-slate-900 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
                  ⭐ {rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Notes / Certifications (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key certifications (ISO 27001, CMMI Level 5), past references, or notes..."
                className="w-full text-xs rounded-md border border-slate-300 p-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingVendorId ? 'Save Changes' : 'Add Vendor'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Vendor Confirmation Modal */}
      <Modal
        isOpen={Boolean(vendorToDelete)}
        onClose={() => setVendorToDelete(null)}
        title="Confirm Delete Vendor"
        description="Are you sure you want to delete this vendor organization?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{vendorToDelete?.name}</p>
              <p className="mt-0.5 text-rose-700">
                This vendor will be removed from all RFP invitations.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVendorToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleConfirmDelete}
            >
              Delete Vendor
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        title="Clear All Vendors"
        description="Permanently delete all registered vendors from the directory."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset to 0 Vendors?</p>
              <p className="mt-0.5 text-rose-700">
                This will delete all {vendors.length} vendors so you can start completely fresh.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearAllModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleConfirmClearAll}
            >
              Yes, Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default VendorsPage;
