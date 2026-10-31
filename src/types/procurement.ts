export type ProjectStatus = 
  | 'draft' 
  | 'in_evaluation' 
  | 'comparison_ready' 
  | 'recommended' 
  | 'awarded';

export type ComplianceStatus = 
  | 'compliant' 
  | 'minor_deviation' 
  | 'non_compliant' 
  | 'not_provided';

export type FieldVerificationStatus = 
  | 'verified' 
  | 'needs_review';

export type ProposalProcessingStatus = 
  | 'uploaded' 
  | 'processing' 
  | 'ready_for_review' 
  | 'evaluated';

export interface Criterion {
  id: string;
  key: string;
  label: string;
  description: string;
  weight: number; // percentage, e.g. 25 means 25%
  maxScore: number; // default 100
  isMandatory: boolean;
  benchmark?: string;
}

export interface ProposalField {
  id: string;
  key: string;
  label: string;
  category: 'commercial' | 'technical' | 'timeline' | 'compliance' | 'legal' | 'sla';
  extractedValue: string;
  numericValue?: number;
  confidenceScore: number; // 0-100
  sourceCitation: string; // e.g. "Section 4.2, p.14"
  sourcePage: number;
  status: FieldVerificationStatus;
  notes?: string;
}

export interface CriterionEvaluation {
  criterionId: string;
  rawScore: number; // 0-100
  complianceStatus: ComplianceStatus;
  notes: string;
  sourceCitation: string;
  evidenceSnippet: string;
  manualOverride?: boolean;
}

export interface VendorProposal {
  id: string;
  projectId: string;
  vendorId: string;
  vendorName: string;
  proposalTitle: string;
  submissionDate: string;
  fileName: string;
  fileSize: string;
  status: ProposalProcessingStatus;
  processingStep?: string;
  processingProgress?: number;
  totalBidAmount: number;
  currency: string;
  deliveryTimelineWeeks: number;
  warrantyMonths: number;
  paymentTerms: string;
  certifications: string[];
  assumptions: string[];
  fields: Record<string, ProposalField>;
  criterionEvaluations: Record<string, CriterionEvaluation>;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  headquarters: string;
  rating: number; // 1-5
  totalProposals: number;
  phone?: string;
  category?: string;
  notes?: string;
}

export interface ProjectRequirement {
  id: string;
  category: 'technical' | 'commercial' | 'sla' | 'compliance';
  title: string;
  description: string;
  isMandatory: boolean;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  category: string;
  department: string;
  budget: number;
  currency: string;
  deadline: string;
  createdDate: string;
  status: ProjectStatus;
  progress: number; // 0-100
  owner: string;
  description: string;
  requirements: ProjectRequirement[];
  criteria: Criterion[];
  invitedVendorIds: string[];
}

export interface VendorEvaluationResult {
  vendorId: string;
  vendorName: string;
  proposalId: string;
  totalBidAmount: number;
  currency: string;
  overallWeightedScore: number; // 0-100
  rank: number;
  criterionBreakdown: {
    criterionId: string;
    criterionKey: string;
    criterionLabel: string;
    weight: number;
    rawScore: number;
    weightedScore: number;
    complianceStatus: ComplianceStatus;
    evidenceSnippet: string;
    sourceCitation: string;
  }[];
  keyReasons: string[];
  technicalStrengths: {
    title: string;
    detail: string;
    citation: string;
  }[];
  commercialAdvantages: {
    title: string;
    detail: string;
    savingVsBudget: string;
  }[];
  risks: {
    severity: 'low' | 'medium' | 'high';
    title: string;
    mitigation: string;
  }[];
  missingInformation: {
    item: string;
    impact: string;
  }[];
}

export interface RecommendationSummary {
  projectId: string;
  recommendedVendorId: string;
  recommendedVendorName: string;
  confidenceScore: number;
  generatedAt: string;
  decisionDisclaimer: string;
  evaluationResults: VendorEvaluationResult[];
}

export interface ProcurementReport {
  id: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  vendorName: string;
  title: string;
  type: 'executive_summary' | 'comparison_matrix' | 'compliance_audit' | 'commercial_breakdown';
  generatedDate: string;
  status: 'Ready' | 'Generated' | 'Archived';
  fileSize: string;
  format: 'PDF' | 'XLSX';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  type: 'extraction' | 'verification' | 'weight_change' | 'recommendation' | 'upload' | 'project' | 'deletion';
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    title: string;
    department: string;
    authorityLimit: number;
  };
  organization: {
    orgName: string;
    fiscalYearStart: string;
    defaultCurrency: string;
    strictComplianceCheck: boolean;
  };
  evaluationPreferences: {
    scoringScale: '100_point' | '10_point';
    autoNormalizeWeights: boolean;
    requireTwoSignoffs: boolean;
    aiExtractionConfidenceThreshold: number;
  };
  notifications: {
    proposalUploaded: boolean;
    reviewCompleted: boolean;
    weightChangeAudited: boolean;
    recommendationReady: boolean;
  };
  appearance: {
    tableDensity: 'compact' | 'comfortable';
    highContrastBadges: boolean;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  organization: string;
  authorityLimit: number;
  currency: string;
  avatarColor?: string;
}
