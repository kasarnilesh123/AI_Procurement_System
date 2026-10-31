import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  FolderKanban,
  ArrowUpDown,
  ArrowRight,
  GitCompare,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ProjectStatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Project, ProjectStatus, VendorProposal } from '../types/procurement';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProjectId, proposals } = useProcurement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'budget' | 'progress' | 'name'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(projects.map((p: Project) => p.category));
    return Array.from(set);
  }, [projects]);

  // Filtered & sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p: Project) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a: Project, b: Project) => {
        let cmp = 0;
        if (sortBy === 'deadline') {
          cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else if (sortBy === 'budget') {
          cmp = a.budget - b.budget;
        } else if (sortBy === 'progress') {
          cmp = a.progress - b.progress;
        } else if (sortBy === 'name') {
          cmp = a.name.localeCompare(b.name);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [projects, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const toggleSort = (field: 'deadline' | 'budget' | 'progress' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Procurement Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-vendor RFPs, track evaluation milestones, and review extraction progress.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<PlusCircle className="w-4 h-4 text-white" />}
          onClick={() => navigate('/projects/new')}
        >
          Create Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by project name, code (PRJ-...), or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_evaluation">In Evaluation</option>
              <option value="comparison_ready">Comparison Ready</option>
              <option value="recommended">Recommended</option>
              <option value="awarded">Contract Awarded</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Project & Code</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-center">Vendors</th>
                <th
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('budget')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Budget Envelope</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('progress')}
                >
                  <div className="flex items-center gap-1">
                    <span>Progress</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('deadline')}
                >
                  <div className="flex items-center gap-1">
                    <span>Deadline</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-700">No procurement projects found</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p: Project) => {
                  const projProposals = proposals.filter((prop: VendorProposal) => prop.projectId === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="max-w-xs">
                          <span className="font-semibold text-slate-900 block truncate">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-500">{p.code}</span>
                            <span className="text-[10px] text-slate-400 truncate">
                              • {p.department}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-medium text-xs bg-slate-100 text-slate-700 border border-slate-200">
                          {projProposals.length} Submitted
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900">
                        {formatCurrency(p.budget, p.currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                            <span>Evaluation</span>
                            <span className="font-mono font-medium">{p.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-slate-800 transition-all duration-300"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                        {formatDate(p.deadline)}
                      </td>
                      <td className="px-4 py-3.5">
                        <ProjectStatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              navigate('/compare');
                            }}
                            title="Side-by-side comparison"
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 border border-slate-200 shadow-xs"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              navigate('/criteria');
                            }}
                            title="Configure criteria"
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 border border-slate-200 shadow-xs"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="py-1 px-2.5 text-xs"
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              navigate('/recommendations');
                            }}
                          >
                            Select
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
    </div>
  );
};
