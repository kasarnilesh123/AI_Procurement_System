import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Project,
  Criterion,
  Vendor,
  VendorProposal,
  VendorEvaluationResult,
  ProcurementReport,
  ActivityLogItem,
  UserSettings,
  ProposalField,
  CriterionEvaluation,
  ComplianceStatus
} from '../types/procurement';
import {
  MOCK_PROJECTS,
  MOCK_VENDORS,
  MOCK_PROPOSALS,
  MOCK_REPORTS,
  MOCK_ACTIVITY,
  INITIAL_SETTINGS,
  INITIAL_CRITERIA_DEFAULT
} from '../data/mockData';
import { evaluateProposals, normalizeWeights, calculateTotalWeight } from '../utils/calculations';

interface ProcurementContextType {
  projects: Project[];
  selectedProjectId: string;
  currentProject: Project;
  vendors: Vendor[];
  proposals: VendorProposal[];
  currentProposals: VendorProposal[];
  evaluationResults: VendorEvaluationResult[];
  recommendedVendor: VendorEvaluationResult | undefined;
  reports: ProcurementReport[];
  activityLogs: ActivityLogItem[];
  settings: UserSettings;
  totalCriteriaWeight: number;
  setSelectedProjectId: (id: string) => void;
  addVendor: (vendorData: {
    name: string;
    code?: string;
    contactName?: string;
    contactEmail?: string;
    headquarters?: string;
    rating?: number;
    phone?: string;
    category?: string;
    notes?: string;
  }) => Vendor;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  deleteVendor: (vendorId: string) => void;
  clearAllVendors: () => void;
  createProject: (projectData: {
    name: string;
    code: string;
    category: string;
    department: string;
    budget: number;
    currency: string;
    deadline: string;
    description: string;
    requirements: Project['requirements'];
    criteria: Criterion[];
    invitedVendorIds: string[];
  }) => Project;
  updateProjectCriteria: (projectId: string, criteria: Criterion[]) => void;
  updateCriterionWeight: (criterionId: string, weight: number) => void;
  autoNormalizeCurrentWeights: () => void;
  updateProposalField: (
    proposalId: string,
    fieldKey: string,
    updates: Partial<ProposalField>
  ) => void;
  deleteProposal: (proposalId: string) => void;
  updateProposalCriterionScore: (
    proposalId: string,
    criterionId: string,
    rawScore: number,
    complianceStatus?: ComplianceStatus,
    notes?: string
  ) => void;
  simulateProposalUpload: (
    fileName: string,
    fileSize: string,
    vendorId: string,
    vendorName: string,
    proposalTitle: string,
    bidAmount: number,
    onProgress?: (step: string, progress: number) => void
  ) => Promise<VendorProposal>;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addActivityLog: (action: string, target: string, type: ActivityLogItem['type']) => void;
  signOffRecommendation: (notes: string, approver: string) => void;
  generateReport: (title: string, type: ProcurementReport['type']) => ProcurementReport;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('procure_ai_manual_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>('prj-089');

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('procure_ai_manual_vendors');
    return saved ? JSON.parse(saved) : MOCK_VENDORS;
  });

  const [proposals, setProposals] = useState<VendorProposal[]>(() => {
    const saved = localStorage.getItem('procure_ai_manual_proposals');
    return saved ? JSON.parse(saved) : MOCK_PROPOSALS;
  });

  const [reports, setReports] = useState<ProcurementReport[]>(() => {
    const saved = localStorage.getItem('procure_ai_manual_reports');
    return saved ? JSON.parse(saved) : MOCK_REPORTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('procure_ai_manual_activity');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITY;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('procure_ai_manual_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('procure_ai_manual_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('procure_ai_manual_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('procure_ai_manual_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('procure_ai_manual_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('procure_ai_manual_activity', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('procure_ai_manual_settings', JSON.stringify(settings));
  }, [settings]);


  // Derived current project
  const currentProject = useMemo(() => {
    const found = projects.find(p => p.id === selectedProjectId);
    return found || projects[0] || MOCK_PROJECTS[0];
  }, [projects, selectedProjectId]);

  // Derived current proposals for selected project
  const currentProposals = useMemo(() => {
    return proposals.filter(p => p.projectId === selectedProjectId);
  }, [proposals, selectedProjectId]);

  // Total weight check for current project
  const totalCriteriaWeight = useMemo(() => {
    return calculateTotalWeight(currentProject.criteria);
  }, [currentProject.criteria]);

  // Dynamic evaluation results based on real weighted scoring calculation
  const evaluationResults = useMemo(() => {
    if (!currentProject || currentProposals.length === 0) return [];
    return evaluateProposals(currentProject.criteria, currentProposals, currentProject.budget);
  }, [currentProject, currentProposals]);

  const recommendedVendor = useMemo(() => {
    return evaluationResults.length > 0 ? evaluationResults[0] : undefined;
  }, [evaluationResults]);

  const addActivityLog = (action: string, target: string, type: ActivityLogItem['type']) => {
    const newItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: settings.profile.name,
      action,
      target,
      type,
    };
    setActivityLogs(prev => [newItem, ...prev]);
  };

  const addVendor = (vendorData: {
    name: string;
    code?: string;
    contactName?: string;
    contactEmail?: string;
    headquarters?: string;
    rating?: number;
    phone?: string;
    category?: string;
    notes?: string;
  }): Vendor => {
    const cleanName = vendorData.name.trim();
    const newVendor: Vendor = {
      id: `vnd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      code: vendorData.code?.trim().toUpperCase() || cleanName.slice(0, 4).toUpperCase(),
      contactName: vendorData.contactName?.trim() || 'Primary Contact',
      contactEmail: vendorData.contactEmail?.trim() || 'contact@vendor.com',
      headquarters: vendorData.headquarters?.trim() || 'Headquarters not provided',
      rating: vendorData.rating || 4.5,
      totalProposals: 0,
      phone: vendorData.phone?.trim() || '',
      category: vendorData.category?.trim() || 'Enterprise Vendor',
      notes: vendorData.notes?.trim() || '',
    };
    setVendors(prev => [newVendor, ...prev]);
    addActivityLog(`Added vendor manually: ${newVendor.name}`, newVendor.code, 'verification');
    return newVendor;
  };

  const updateVendor = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors(prev =>
      prev.map(v => (v.id === vendorId ? { ...v, ...updates } : v))
    );
    if (updates.name) {
      setProposals(prev =>
        prev.map(p => (p.vendorId === vendorId ? { ...p, vendorName: updates.name! } : p))
      );
    }
    addActivityLog(`Updated vendor details`, vendorId, 'verification');
  };

  const deleteVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    setProjects(prev =>
      prev.map(p => ({
        ...p,
        invitedVendorIds: p.invitedVendorIds.filter(id => id !== vendorId),
      }))
    );
    addActivityLog(`Deleted vendor: ${vendor?.name || vendorId}`, vendorId, 'deletion');
  };

  const clearAllVendors = () => {
    setVendors([]);
    addActivityLog('Cleared all vendors from system', 'All Vendors', 'deletion');
  };

  const createProject = (projectData: {
    name: string;
    code: string;
    category: string;
    department: string;
    budget: number;
    currency: string;
    deadline: string;
    description: string;
    requirements: Project['requirements'];
    criteria: Criterion[];
    invitedVendorIds: string[];
  }): Project => {
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'in_evaluation',
      progress: 25,
      owner: settings.profile.name,
    };
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    addActivityLog(`Created new procurement project`, newProject.name, 'project');
    return newProject;
  };

  const updateProjectCriteria = (projectId: string, newCriteria: Criterion[]) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, criteria: newCriteria } : p))
    );
    addActivityLog('Updated evaluation criteria and weights', currentProject.code, 'weight_change');
  };

  const updateCriterionWeight = (criterionId: string, weight: number) => {
    const updatedCriteria = currentProject.criteria.map(c =>
      c.id === criterionId ? { ...c, weight: Math.max(0, weight) } : c
    );
    updateProjectCriteria(currentProject.id, updatedCriteria);
  };

  const autoNormalizeCurrentWeights = () => {
    const normalized = normalizeWeights(currentProject.criteria);
    updateProjectCriteria(currentProject.id, normalized);
    addActivityLog('Auto-normalized criteria weights to 100%', currentProject.code, 'weight_change');
  };

  const updateProposalField = (
    proposalId: string,
    fieldKey: string,
    updates: Partial<ProposalField>
  ) => {
    setProposals(prev =>
      prev.map(prop => {
        if (prop.id !== proposalId) return prop;
        const currentField = prop.fields[fieldKey];
        if (!currentField) return prop;
        return {
          ...prop,
          fields: {
            ...prop.fields,
            [fieldKey]: {
              ...currentField,
              ...updates,
            },
          },
        };
      })
    );
    addActivityLog(`Updated and verified proposal field: ${fieldKey}`, proposalId, 'verification');
  };

  const deleteProposal = (proposalId: string) => {
    const proposal = proposals.find(prop => prop.id === proposalId);
    if (!proposal) return;

    setProposals(prev => prev.filter(prop => prop.id !== proposalId));
    addActivityLog(
      'Deleted vendor proposal',
      `${proposal.vendorName}: ${proposal.proposalTitle}`,
      'deletion'
    );
  };

  const updateProposalCriterionScore = (
    proposalId: string,
    criterionId: string,
    rawScore: number,
    complianceStatus?: ComplianceStatus,
    notes?: string
  ) => {
    setProposals(prev =>
      prev.map(prop => {
        if (prop.id !== proposalId) return prop;
        const existing = prop.criterionEvaluations[criterionId] || {
          criterionId,
          rawScore: 0,
          complianceStatus: 'compliant',
          notes: '',
          sourceCitation: 'Manual Override',
          evidenceSnippet: 'Evaluator manual score revision.',
        };
        return {
          ...prop,
          criterionEvaluations: {
            ...prop.criterionEvaluations,
            [criterionId]: {
              ...existing,
              rawScore,
              complianceStatus: complianceStatus || existing.complianceStatus,
              notes: notes || existing.notes,
              manualOverride: true,
            },
          },
        };
      })
    );
    addActivityLog(`Manual score override for criterion ${criterionId}`, proposalId, 'verification');
  };

  const simulateProposalUpload = async (
    fileName: string,
    fileSize: string,
    vendorId: string,
    vendorName: string,
    proposalTitle: string,
    bidAmount: number,
    onProgress?: (step: string, progress: number) => void
  ): Promise<VendorProposal> => {
    const steps = [
      { step: 'Uploading encrypted document archive...', pct: 20 },
      { step: 'Running OCR & Layout analysis (p.1 - p.54)...', pct: 45 },
      { step: 'AI Clause Extraction & Entity identification...', pct: 70 },
      { step: 'Benchmarking against RFP evaluation criteria...', pct: 90 },
      { step: 'Extraction complete. Ready for committee review.', pct: 100 },
    ];

    // Ensure vendor entity exists or register it automatically
    let activeVendorId = vendorId;
    let activeVendorName = vendorName;
    const existingVendor = vendors.find(
      v => v.id === vendorId || (v.name && v.name.toLowerCase() === vendorName.toLowerCase())
    );

    if (existingVendor) {
      activeVendorId = existingVendor.id;
      activeVendorName = existingVendor.name;
      setVendors(prev =>
        prev.map(v => (v.id === existingVendor.id ? { ...v, totalProposals: v.totalProposals + 1 } : v))
      );
    } else if (vendorName && vendorName.trim()) {
      const cleanVendorName = vendorName.trim();
      const newV: Vendor = {
        id: `vnd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: cleanVendorName,
        code: cleanVendorName.slice(0, 4).toUpperCase(),
        contactName: 'Primary Contact',
        contactEmail: `${cleanVendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}@vendor.com`,
        headquarters: 'India',
        rating: 4.5,
        totalProposals: 1,
        phone: '',
        category: 'Enterprise Vendor',
        notes: 'Added via proposal submission',
      };
      setVendors(prev => [newV, ...prev]);
      activeVendorId = newV.id;
      activeVendorName = newV.name;
    }

    // Auto-invite to selected project if not already present
    setProjects(prev =>
      prev.map(p => {
        if (p.id === selectedProjectId && !p.invitedVendorIds.includes(activeVendorId)) {
          return { ...p, invitedVendorIds: [...p.invitedVendorIds, activeVendorId] };
        }
        return p;
      })
    );

    const newProposal: VendorProposal = {
      id: `prop-${Date.now()}`,
      projectId: selectedProjectId,
      vendorId: activeVendorId,
      vendorName: activeVendorName,
      proposalTitle,
      submissionDate: new Date().toISOString().split('T')[0],
      fileName,
      fileSize,
      status: 'ready_for_review',
      totalBidAmount: bidAmount,
      currency: currentProject.currency,
      deliveryTimelineWeeks: 18,
      warrantyMonths: 24,
      paymentTerms: '30% Mobilization, 40% UAT, 30% Go-Live',
      certifications: ['SOC 2 Type II', 'ISO 27001'],
      assumptions: [
        'Dedicated network connectivity provided by client.',
        'Standard implementation sandbox available on Day 1.',
      ],
      fields: {
        pricing: {
          id: `f-${Date.now()}-1`,
          key: 'pricing',
          label: 'Total Commercial Bid',
          category: 'commercial',
          extractedValue: `$${bidAmount.toLocaleString()}`,
          numericValue: bidAmount,
          confidenceScore: 97,
          sourceCitation: 'Executive Summary, Page 3',
          sourcePage: 3,
          status: 'verified',
        },
        timeline: {
          id: `f-${Date.now()}-2`,
          key: 'timeline',
          label: 'Delivery Timeline',
          category: 'timeline',
          extractedValue: '18 Weeks to Production Go-Live',
          numericValue: 18,
          confidenceScore: 94,
          sourceCitation: 'Project Schedule, Page 12',
          sourcePage: 12,
          status: 'verified',
        },
        warranty: {
          id: `f-${Date.now()}-3`,
          key: 'warranty',
          label: 'Warranty Period',
          category: 'sla',
          extractedValue: '24 Months Full Engineering Support',
          numericValue: 24,
          confidenceScore: 92,
          sourceCitation: 'SLA Addendum, Page 22',
          sourcePage: 22,
          status: 'verified',
        },
      },
      criterionEvaluations: {
        'crit-tech': {
          criterionId: 'crit-tech',
          rawScore: 88,
          complianceStatus: 'compliant',
          notes: 'Standard architecture compliant with core functional specifications.',
          sourceCitation: 'Section 3.1, p.10',
          evidenceSnippet: 'Meets modular deployment specifications with standard microservices.',
        },
        'crit-cost': {
          criterionId: 'crit-cost',
          rawScore: Math.round(Math.max(60, Math.min(98, 100 - ((bidAmount - currentProject.budget) / currentProject.budget) * 50))),
          complianceStatus: bidAmount <= currentProject.budget ? 'compliant' : 'minor_deviation',
          notes: `Bid amount $${bidAmount.toLocaleString()} evaluated against budget $${currentProject.budget.toLocaleString()}`,
          sourceCitation: 'Section 5.0, p.25',
          evidenceSnippet: 'Fixed fee milestone pricing.',
        },
        'crit-quality': {
          criterionId: 'crit-quality',
          rawScore: 85,
          complianceStatus: 'compliant',
          notes: 'Standard 99.95% uptime availability.',
          sourceCitation: 'Section 4.2, p.15',
          evidenceSnippet: 'Multi-AZ cloud redundancy with automated health checks.',
        },
        'crit-delivery': {
          criterionId: 'crit-delivery',
          rawScore: 82,
          complianceStatus: 'compliant',
          notes: '18-week schedule meets target.',
          sourceCitation: 'Section 2.1, p.8',
          evidenceSnippet: 'Agile milestone plan with 2-week sprint cadences.',
        },
        'crit-warranty': {
          criterionId: 'crit-warranty',
          rawScore: 85,
          complianceStatus: 'compliant',
          notes: '24 months defect warranty.',
          sourceCitation: 'Section 6.1, p.20',
          evidenceSnippet: 'Full defect remediation and quarterly maintenance releases included.',
        },
        'crit-exp': {
          criterionId: 'crit-exp',
          rawScore: 80,
          complianceStatus: 'compliant',
          notes: '8 verified enterprise references provided.',
          sourceCitation: 'Section 1.2, p.4',
          evidenceSnippet: 'Demonstrated past performance across medium and large installations.',
        },
        'crit-risk': {
          criterionId: 'crit-risk',
          rawScore: 82,
          complianceStatus: 'compliant',
          notes: 'SOC 2 Type II and ISO 27001 verified.',
          sourceCitation: 'Section 7.0, p.28',
          evidenceSnippet: 'Current third-party audit reports attached.',
        },
      },
    };

    setProposals(prev => [newProposal, ...prev]);
    addActivityLog(`Uploaded proposal and extracted fields for ${vendorName}`, newProposal.proposalTitle, 'upload');
    return newProposal;
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      profile: { ...prev.profile, ...(newSettings.profile || {}) },
      organization: { ...prev.organization, ...(newSettings.organization || {}) },
      evaluationPreferences: { ...prev.evaluationPreferences, ...(newSettings.evaluationPreferences || {}) },
      notifications: { ...prev.notifications, ...(newSettings.notifications || {}) },
      appearance: { ...prev.appearance, ...(newSettings.appearance || {}) },
    }));
  };

  const signOffRecommendation = (notes: string, approver: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === selectedProjectId ? { ...p, status: 'recommended', progress: 100 } : p))
    );
    addActivityLog(`Committee sign-off completed by ${approver}: "${notes}"`, currentProject.code, 'recommendation');
  };

  const generateReport = (title: string, type: ProcurementReport['type']): ProcurementReport => {
    const newReport: ProcurementReport = {
      id: `rep-${Date.now()}`,
      projectId: currentProject.id,
      projectName: currentProject.name,
      projectCode: currentProject.code,
      vendorName: recommendedVendor?.vendorName || 'Evaluated Vendors',
      title,
      type,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'Ready',
      fileSize: '3.1 MB',
      format: type === 'comparison_matrix' ? 'XLSX' : 'PDF',
    };
    setReports(prev => [newReport, ...prev]);
    addActivityLog(`Generated evaluation report: ${title}`, currentProject.code, 'recommendation');
    return newReport;
  };

  return (
    <ProcurementContext.Provider
      value={{
        projects,
        selectedProjectId,
        currentProject,
        vendors,
        proposals,
        currentProposals,
        evaluationResults,
        recommendedVendor,
        reports,
        activityLogs,
        settings,
        totalCriteriaWeight,
        setSelectedProjectId,
        addVendor,
        updateVendor,
        deleteVendor,
        clearAllVendors,
        createProject,
        updateProjectCriteria,
        updateCriterionWeight,
        autoNormalizeCurrentWeights,
        updateProposalField,
        deleteProposal,
        updateProposalCriterionScore,
        simulateProposalUpload,
        updateSettings,
        addActivityLog,
        signOffRecommendation,
        generateReport,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
