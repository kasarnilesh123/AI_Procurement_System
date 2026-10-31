import React from 'react';
import { Badge } from '../ui/Badge';
import { ComplianceStatus, FieldVerificationStatus, ProjectStatus, ProposalProcessingStatus } from '../../types/procurement';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Check, Clock, FileCheck } from 'lucide-react';

interface ComplianceBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'md';
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'compliant':
      return (
        <Badge variant="success" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          Compliant
        </Badge>
      );
    case 'minor_deviation':
      return (
        <Badge variant="warning" size={size} icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
          Minor Deviation
        </Badge>
      );
    case 'non_compliant':
      return (
        <Badge variant="danger" size={size} icon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}>
          Non-Compliant
        </Badge>
      );
    case 'not_provided':
    default:
      return (
        <Badge variant="neutral" size={size} icon={<HelpCircle className="w-3.5 h-3.5 text-slate-500" />}>
          Not Provided
        </Badge>
      );
  }
};

interface VerificationBadgeProps {
  status: FieldVerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'sm' }) => {
  if (status === 'verified') {
    return (
      <Badge variant="success" size={size} icon={<Check className="w-3 h-3 text-emerald-600" />}>
        Verified
      </Badge>
    );
  }
  return (
    <Badge variant="warning" size={size} icon={<Clock className="w-3 h-3 text-amber-600" />}>
      Needs Review
    </Badge>
  );
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'comparison_ready':
      return (
        <Badge variant="accent" size={size} icon={<FileCheck className="w-3.5 h-3.5 text-sky-600" />}>
          Comparison Ready
        </Badge>
      );
    case 'recommended':
      return (
        <Badge variant="success" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          Recommendation Ready
        </Badge>
      );
    case 'in_evaluation':
      return (
        <Badge variant="neutral" size={size} icon={<Clock className="w-3.5 h-3.5 text-slate-600" />}>
          In Evaluation
        </Badge>
      );
    case 'awarded':
      return (
        <Badge variant="success" size={size}>
          Contract Awarded
        </Badge>
      );
    case 'draft':
    default:
      return (
        <Badge variant="neutral" size={size}>
          Draft
        </Badge>
      );
  }
};

interface ProcessingBadgeProps {
  status: ProposalProcessingStatus;
  size?: 'sm' | 'md';
}

export const ProcessingBadge: React.FC<ProcessingBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'ready_for_review':
      return (
        <Badge variant="success" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          Ready for Review
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="accent" size={size} icon={<Clock className="w-3.5 h-3.5 text-sky-600 animate-spin" />}>
          AI Parsing...
        </Badge>
      );
    case 'uploaded':
      return (
        <Badge variant="neutral" size={size}>
          Uploaded
        </Badge>
      );
    case 'evaluated':
    default:
      return (
        <Badge variant="success" size={size}>
          Evaluated
        </Badge>
      );
  }
};
