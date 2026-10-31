import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  FileText,
  Sliders,
  GitCompare,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Code,
  Calculator,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

interface WeekMilestone {
  week: number;
  phase: string;
  phaseNumber: number;
  title: string;
  category: 'Planning' | 'Data & Storage' | 'AI & Algorithms' | 'UI & Analytics';
  summary: string;
  tasks: string[];
  deliverables: string[];
  linkRoute?: string;
  linkLabel?: string;
  codeSnippet?: string;
}

const WEEK_DATA: WeekMilestone[] = [
  {
    week: 1,
    phase: 'Phase 1: Inception & Analysis',
    phaseNumber: 1,
    title: 'Research Gap Analysis & Problem Definition',
    category: 'Planning',
    summary:
      'Evaluated existing vendor evaluation methods, identified procurement bottlenecks, and defined the proposed AI-driven solution.',
    tasks: [
      'Conducted research gap analysis by comparing existing commercial & manual vendor evaluation approaches.',
      'Identified critical limitations in current procurement and proposal comparison systems (latency, subjective bias, format divergence).',
      'Finalized the proposed automated solution and mapped out key product features.',
      'Defined initial evaluation parameters for multi-criteria vendor proposal comparison.',
    ],
    deliverables: [
      'Problem Statement Document',
      'Vendor Evaluation Gap Matrix',
      'Proposed Solution Architecture Draft',
    ],
    linkRoute: '/criteria',
    linkLabel: 'View Evaluation Parameters',
  },
  {
    week: 2,
    phase: 'Phase 1: Inception & Analysis',
    phaseNumber: 1,
    title: 'Project Scope, Requirements Engineering & SRS',
    category: 'Planning',
    summary:
      'Defined functional & non-functional requirements and prepared the Software Requirement Specification (SRS).',
    tasks: [
      'Finalized project boundaries, modular scope, and user roles (Evaluator, Auditor, Admin).',
      'Defined 10 functional requirements (FR1-FR10) and 6 non-functional requirements (performance, auditability, security).',
      'Formulated structured vendor proposal evaluation criteria across technical, financial, and SLA categories.',
      'Prepared and finalized the Software Requirement Specification (SRS) document.',
    ],
    deliverables: [
      'Software Requirements Specification (SRS v1.0)',
      'Requirements Traceability Matrix',
      'Procurement User Persona Profiles',
    ],
    linkRoute: '/criteria',
    linkLabel: 'Inspect Project Scope & Criteria',
  },
  {
    week: 3,
    phase: 'Phase 1: Inception & Analysis',
    phaseNumber: 1,
    title: 'System Architecture & Interaction Design',
    category: 'Planning',
    summary:
      'Designed layered multi-tier architecture spanning frontend, backend API, database, and AI service layers.',
    tasks: [
      'Started designing the system architecture following decoupled service boundaries.',
      'Defined overall workflow from PDF upload to parameter extraction, normalization, and scoring.',
      'Planned frontend (React/Vite), backend (REST APIs), database (relational schemas), and AI integration.',
      'Prepared the initial architectural diagrams and data flow blueprints for the proposed system.',
    ],
    deliverables: [
      'System Architecture Blueprint Diagram',
      'Data Flow Diagram (DFD Level 0 & Level 1)',
      'Service Contract & API Specification',
    ],
  },
  {
    week: 4,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Synthetic Proposal Corpus & Metadata Taxonomy',
    category: 'Data & Storage',
    summary:
      'Created realistic synthetic vendor proposal documents and standardized metadata and attribute taxonomies.',
    tasks: [
      'Prepared sample and synthetic vendor proposal documents across highway, road, bridge, and high-rise building construction domains.',
      'Defined proposal document categories (EPC road contracts, building structural bids) and mandatory metadata.',
      'Standardized civil structural, BOQ financial, equipment fleet, and safety compliance attributes.',
      'Organized structured proposal data formats for downstream OCR and NLP evaluation.',
    ],
    deliverables: [
      'Synthetic Proposal Corpus (PDFs & JSON manifests)',
      'Attribute Taxonomy Specification',
      'Vendor Profile Metadata Schema',
    ],
    linkRoute: '/vendors',
    linkLabel: 'View Vendor Directory',
  },
  {
    week: 5,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Text Cleaning, Preprocessing & Feature Extraction',
    category: 'Data & Storage',
    summary:
      'Engineered text sanitization, layout removal, and extraction of structured commercial/technical parameters.',
    tasks: [
      'Implemented cleaning and preprocessing routines on collected vendor proposal documents.',
      'Structured technical, commercial, and compliance records from unstructured proposal text.',
      'Identified high-discriminant attributes required for fair and objective vendor cross-comparison.',
      'Prepared the benchmark dataset for subsequent AI-based processing and model testing.',
    ],
    deliverables: [
      'Document Preprocessing Pipeline',
      'Structured Proposal Feature Dataset',
      'Table & Layout Normalization Scripts',
    ],
    linkRoute: '/proposals',
    linkLabel: 'Explore Proposals Data',
  },
  {
    week: 6,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Platform Architecture Refinement & Service Contracts',
    category: 'Planning',
    summary:
      'Finalized complete platform architecture including document ingestion, NLP pipelines, and UI dashboard.',
    tasks: [
      'Designed the complete system architecture for the proposed platform.',
      'Defined document ingestion, AI/NLP processing, database persistence, and frontend dashboard components.',
      'Planned and formalized asynchronous inter-module interactions and event lifecycles.',
      'Refined the architectural specifications according to the real-world vendor evaluation workflow.',
    ],
    deliverables: [
      'Comprehensive Platform Architecture Specification',
      'Asynchronous Ingestion Pipeline Flow',
      'Component Boundary Definitions',
    ],
  },
  {
    week: 7,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Relational Database Schema & Storage Modeling',
    category: 'Data & Storage',
    summary:
      'Designed relational database schema for storing projects, proposals, criteria, extracted fields, and evaluation scores.',
    tasks: [
      'Designed the database structure for persisting vendor profiles and proposal documents.',
      'Defined relational tables for extracted parameters, evaluation criteria, and weighted vendor scores.',
      'Planned secure storage and indexing of side-by-side comparison results and audit logs.',
      'Mapped the relational database schema directly with the overall system architecture.',
    ],
    deliverables: [
      'Database ER Diagram (Entity-Relationship)',
      'PostgreSQL / Relational DDL Schema Scripts',
      'Data Access Object (DAO) Interfaces',
    ],
    codeSnippet: `-- Schema snippet
CREATE TABLE proposal_fields (
  id UUID PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id),
  field_key VARCHAR(64) NOT NULL,
  extracted_value TEXT NOT NULL,
  confidence_score NUMERIC(5,2),
  source_citation VARCHAR(128)
);`,
  },
  {
    week: 8,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Proposal Upload & Document Parsing Pipeline',
    category: 'Data & Storage',
    summary:
      'Implemented secure drag-and-drop document upload, file format verification, and PDF layout extraction.',
    tasks: [
      'Implemented vendor proposal upload functionality with file type and size validation.',
      'Built multi-page PDF/document validation and duplicate hash detection.',
      'Implemented text, table, and layout extraction pipeline from proposal files.',
      'Tested the initial document processing workflow using sample vendor proposals.',
    ],
    deliverables: [
      'Proposal Upload Component',
      'Document Validation & Parsing Service',
      'Multi-Page Layout Extraction Module',
    ],
    linkRoute: '/proposals',
    linkLabel: 'Test Proposal Upload & Ingestion',
  },
  {
    week: 9,
    phase: 'Phase 2: Data Pipeline & Storage',
    phaseNumber: 2,
    title: 'Semantic Document Chunking & Indexing',
    category: 'Data & Storage',
    summary:
      'Built context-preserving semantic chunking with overlap and metadata indexing for long proposal documents.',
    tasks: [
      'Implemented document chunking algorithms tailored for long, multi-section proposal documents.',
      'Organized document metadata (section headings, page numbers) linked with each chunk.',
      'Developed semantic representation and indexing of proposal segments for accurate retrieval.',
      'Prepared indexed proposal chunks for AI/NLP extraction models.',
    ],
    deliverables: [
      'Semantic Chunking Engine (600 token window with overlap)',
      'Chunk Metadata Indexing Service',
      'Context Preservation Validation Script',
    ],
  },
  {
    week: 10,
    phase: 'Phase 3: AI Engine & Decision Models',
    phaseNumber: 3,
    title: 'Ingestion & Retrieval Quality Validation',
    category: 'AI & Algorithms',
    summary:
      'Validated extraction accuracy and retrieval precision across sample bids; diagnosed and resolved parsing errors.',
    tasks: [
      'Validated document extraction and retrieval accuracy using 15+ sample vendor proposals.',
      'Audited fidelity of extracted text, pricing tables, and SLA clauses against source documents.',
      'Identified errors in layout interpretation and table border extraction.',
      'Refined the extraction and retrieval pipeline based on diagnostic validation metrics.',
    ],
    deliverables: [
      'Extraction Quality Benchmark Report',
      'Precision/Recall Test Suite',
      'Refined Parser & OCR Recovery Module',
    ],
  },
  {
    week: 11,
    phase: 'Phase 3: AI Engine & Decision Models',
    phaseNumber: 3,
    title: 'AI/NLP Parameter Extraction Engine',
    category: 'AI & Algorithms',
    summary:
      'Engineered AI models to extract commercial terms, technical specifications, warranties, and compliance checklists.',
    tasks: [
      'Implemented AI/NLP-based extraction of vendor proposal information using structured prompts.',
      'Extracted technical capabilities, cloud architectures, and commercial pricing schedules.',
      'Captured delivery timelines, warranty periods, and regulatory certifications (ISO, SOC 2).',
      'Structured extracted parameters into standardized schema objects with page citations.',
    ],
    deliverables: [
      'AI Extraction Service with Confidence Scoring',
      'Commercial & Technical Extraction Parsers',
      'Source Page Grounding & Citation Resolver',
    ],
    linkRoute: '/proposals',
    linkLabel: 'Review Extracted Fields in UI',
  },
  {
    week: 12,
    phase: 'Phase 3: AI Engine & Decision Models',
    phaseNumber: 3,
    title: 'Parameter Normalization & Criteria Mapping',
    category: 'AI & Algorithms',
    summary:
      'Standardized disparate currencies (to INR), timelines (to weeks), and mapped attributes to project criteria.',
    tasks: [
      'Developed data normalization routines for heterogeneous vendor proposal parameters.',
      'Standardized varied formats (USD/EUR to INR, days/months to weeks) for apple-to-apple comparison.',
      'Mapped normalized attributes directly to predefined evaluation criteria.',
      'Implemented robust handling of missing, ambiguous, and outlier proposal values.',
    ],
    deliverables: [
      'Parameter Normalization Engine',
      'Currency & Timeline Unit Converter',
      'Criteria Attribute Mapping Matrix',
    ],
  },
  {
    week: 13,
    phase: 'Phase 3: AI Engine & Decision Models',
    phaseNumber: 3,
    title: 'Multi-Criteria Weighted Evaluation Framework (MCDM)',
    category: 'AI & Algorithms',
    summary:
      'Implemented Simple Additive Weighting (SAW) scoring engine across technical, financial, and compliance criteria.',
    tasks: [
      'Implemented the weighted evaluation framework (MCDM) for vendor proposal scoring.',
      'Defined technical, commercial, and compliance criteria with configurable weight percentages (sum = 100%).',
      'Calculated criterion-wise raw scores and weighted contributions for each evaluated vendor.',
      'Configured composite score computation and compliance disqualification checks.',
    ],
    deliverables: [
      'MCDM Weighted Scoring Algorithm',
      'Weight Validation Constraint (∑wi = 100%)',
      'Criterion-wise Score Breakdown Engine',
    ],
    linkRoute: '/criteria',
    linkLabel: 'Adjust Weights & Criteria',
  },
  {
    week: 14,
    phase: 'Phase 3: AI Engine & Decision Models',
    phaseNumber: 3,
    title: 'Cross-Vendor Comparison Matrix & Recommendation Engine',
    category: 'UI & Analytics',
    summary:
      'Developed side-by-side comparative matrices, automated vendor ranking, and audit-ready recommendations.',
    tasks: [
      'Developed the cross-vendor comparison engine using normalized proposal extractions.',
      'Generated parameter-wise scoring matrices with difference highlights and outlier detection.',
      'Compared technical vs commercial trade-offs across participating vendors.',
      'Prepared executive recommendations, L1 ranking, and audit-ready evaluation summaries.',
    ],
    deliverables: [
      'Side-by-Side Comparison Matrix View',
      'Pareto Trade-Off Analytics Module',
      'Executive Recommendation & Audit Log Generator',
    ],
    linkRoute: '/compare',
    linkLabel: 'Launch Comparison Matrix',
  },
];

export const WeeklyTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject, proposals } = useProcurement();
  const criteria = currentProject.criteria || [];

  const [activeTab, setActiveTab] = useState<'roadmap' | 'architecture' | 'schema' | 'calculator' | 'report'>('roadmap');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 13: true, 14: true });
  const [copiedSql, setCopiedSql] = useState(false);

  // Live MCDM Calculator state (Simulator for Week 13)
  const [calcTechWeight, setCalcTechWeight] = useState(40);
  const [calcCommWeight, setCalcCommWeight] = useState(30);
  const [calcSlaWeight, setCalcSlaWeight] = useState(15);
  const [calcCompWeight, setCalcCompWeight] = useState(15);

  const totalSimWeight = calcTechWeight + calcCommWeight + calcSlaWeight + calcCompWeight;

  const toggleExpand = (w: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [w]: !prev[w] }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    WEEK_DATA.forEach((w) => (allExpanded[w.week] = true));
    setExpandedWeeks(allExpanded);
  };

  const collapseAll = () => {
    setExpandedWeeks({});
  };

  const filteredWeeks = WEEK_DATA.filter((w) => {
    const matchesPhase = selectedPhaseFilter === 'all' || w.phaseNumber === selectedPhaseFilter;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tasks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.deliverables.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPhase && matchesSearch;
  });

  const handleCopySql = () => {
    const sqlContent = `-- ProcureAI Relational Database Schema (Week 7 Implementation)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  budget_inr NUMERIC(15, 2) NOT NULL,
  status VARCHAR(32) DEFAULT 'in_evaluation'
);

CREATE TABLE criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  key VARCHAR(64) NOT NULL,
  label VARCHAR(128) NOT NULL,
  weight NUMERIC(5, 2) NOT NULL,
  max_score NUMERIC(5, 2) DEFAULT 100.00
);

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  total_bid_amount_normalized NUMERIC(15, 2),
  status VARCHAR(32) DEFAULT 'evaluated'
);

CREATE TABLE proposal_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  field_key VARCHAR(64) NOT NULL,
  category VARCHAR(32) NOT NULL,
  extracted_value TEXT NOT NULL,
  confidence_score NUMERIC(5, 2),
  source_citation VARCHAR(128)
);`;
    navigator.clipboard.writeText(sqlContent);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Capstone Project Lifecycle
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Weeks 1 – 14 Complete
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Weekly Implementation & Engineering Roadmap</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Step-by-step record of development, architectural blueprints, mathematical scoring models, and
              interactive verification modules for the AI-Powered Vendor Proposal Evaluation Platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/compare')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <GitCompare className="w-4 h-4" />
              <span>Launch Week 14 Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>View Academic Report</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[11px] font-medium text-slate-400">Total Milestones</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">14 / 14 Weeks</div>
            <div className="text-[10px] text-slate-400">100% Phase 1–3 Complete</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[11px] font-medium text-slate-400">Target Domain</div>
            <div className="text-xl font-bold text-sky-400 mt-0.5">Civil Tender AI</div>
            <div className="text-[10px] text-slate-400">Roads, Bridges, High-Rise & Public Works</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[11px] font-medium text-slate-400">Active Proposals</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{proposals.length} Proposals</div>
            <div className="text-[10px] text-slate-400">Under RFP: {currentProject.code}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[11px] font-medium text-slate-400">Evaluation Criteria</div>
            <div className="text-xl font-bold text-purple-400 mt-0.5">{criteria.length} Criteria</div>
            <div className="text-[10px] text-slate-400">SAW Normalized Weights</div>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Roadmap (1–14)</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture & Data Flow (W3 & W6)</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schema'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Schema & Models (W7)</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>MCDM Scoring Simulator (W13)</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'report'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Academic Report & Logbook</span>
        </button>
      </div>

      {/* TAB 1: WEEKLY ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {/* Controls: Search, Phase Filter, Expand/Collapse */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search weeks, tasks, deliverables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md border border-slate-700 text-xs">
                <button
                  onClick={() => setSelectedPhaseFilter('all')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedPhaseFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedPhaseFilter(1)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedPhaseFilter === 1
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phase 1 (W1–3)
                </button>
                <button
                  onClick={() => setSelectedPhaseFilter(2)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedPhaseFilter === 2
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phase 2 (W4–9)
                </button>
                <button
                  onClick={() => setSelectedPhaseFilter(3)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedPhaseFilter === 3
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phase 3 (W10–14)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={expandAll}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                Expand All
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={collapseAll}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Weeks Accordion List */}
          <div className="space-y-3">
            {filteredWeeks.map((item) => {
              const isExpanded = !!expandedWeeks[item.week];
              const phaseColor =
                item.phaseNumber === 1
                  ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300'
                  : item.phaseNumber === 2
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                  : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300';

              return (
                <div
                  key={item.week}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-700"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(item.week)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Wk</span>
                        <span className="text-sm font-extrabold text-white font-mono leading-none">
                          {item.week}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${phaseColor}`}>
                            {item.phase}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            {item.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Implemented
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 truncate">{item.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      {item.linkRoute && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(item.linkRoute!);
                          }}
                          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 text-xs font-medium transition-all"
                        >
                          <span>{item.linkLabel || 'Test Module'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                      <div className="p-1 rounded text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                      {/* Tasks Accomplished */}
                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tasks Completed & Engineering Actions</span>
                        </h4>
                        <ul className="space-y-1.5 pl-1">
                          {item.tasks.map((task, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                              <span className="leading-relaxed">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deliverables */}
                      <div className="pt-2 border-t border-slate-800/60">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Key Deliverables & Artifacts</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.deliverables.map((deliv, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-800/80 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-md font-mono"
                            >
                              📄 {deliv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Optional Code or Schema Snippet */}
                      {item.codeSnippet && (
                        <div className="pt-2 border-t border-slate-800/60">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                            <span className="font-mono flex items-center gap-1">
                              <Code className="w-3.5 h-3.5 text-amber-400" />
                              <span>Implementation Snippet</span>
                            </span>
                          </div>
                          <pre className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
                            {item.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* Action Button inside card */}
                      {item.linkRoute && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => navigate(item.linkRoute!)}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                          >
                            <span>Open {item.linkLabel || 'Feature Page'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE & DATA FLOW */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>Platform Layered Architecture (Week 3 & Week 6 Specification)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decoupled multi-tier pipeline connecting Document Ingestion, Semantic NLP Chunking, Relational
                  Storage, and Multi-Criteria Evaluation.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SRS Architecture v2.0
              </span>
            </div>

            {/* Architecture Visual Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
              {/* Layer 1 */}
              <div className="bg-slate-950 border border-indigo-900/60 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-800">
                    Tier 1: Presentation
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Client Dashboard</h4>
                <p className="text-xs text-slate-400">
                  Built with React 18, Vite, TypeScript, and Tailwind CSS. Provides procurement managers with:
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Drag-and-drop RFP Proposal Ingestion</li>
                  <li>• Interactive Criteria Weight Config</li>
                  <li>• Side-by-side Matrix Diff Viewer</li>
                  <li>• AI Citation Grounding & Overrides</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="bg-slate-950 border border-sky-900/60 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-950 text-sky-300 rounded border border-sky-800">
                    Tier 2: Ingestion & Parser
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Document Pipeline</h4>
                <p className="text-xs text-slate-400">
                  Handles multi-page PDF/DOCX ingestion and text extraction (Week 8 & 9):
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Magic-byte & MIME validation</li>
                  <li>• Text & Table layout preservation</li>
                  <li>• Semantic Chunking (600 tokens)</li>
                  <li>• Context overlap window (120 tok)</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="bg-slate-950 border border-purple-900/60 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                    Tier 3: AI/NLP Engine
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Extraction & Norm</h4>
                <p className="text-xs text-slate-400">
                  Extracts and standardizes unstructured vendor terms (Week 11 & 12):
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Commercial, SLA & Tech parameter parsing</li>
                  <li>• Confidence Scoring ($C \ge 85\%$)</li>
                  <li>• Currency normalization to INR</li>
                  <li>• Timeline conversion to weeks</li>
                </ul>
              </div>

              {/* Layer 4 */}
              <div className="bg-slate-950 border border-emerald-900/60 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                    Tier 4: Decision Engine
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">MCDM Evaluation</h4>
                <p className="text-xs text-slate-400">
                  Computes deterministic rankings and trade-off matrices (Week 13 & 14):
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Simple Additive Weighting [Sv = Σ (wi × svi)]</li>
                  <li>• Mandatory compliance gating</li>
                  <li>• L1 ranking & trade-off rationale</li>
                  <li>• Audit trail logging</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dataflow Sequence Step-by-Step */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              End-to-End Pipeline Execution Lifecycle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: '01', title: 'Upload & Validation', desc: 'PDF integrity check, SHA-256 hash' },
                { step: '02', title: 'Chunking & Index', desc: '600 token windows with page metadata' },
                { step: '03', title: 'NLP Extraction', desc: 'Technical & financial attribute parsing' },
                { step: '04', title: 'Unit Normalization', desc: 'Standardize to INR, weeks, SLA ratio' },
                { step: '05', title: 'MCDM Scoring', desc: 'Weighted ranking and L1 recommendation' },
              ].map((s) => (
                <div key={s.step} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                  <h5 className="text-xs font-bold text-white mt-2">{s.title}</h5>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMA & MODELS */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-sky-400" />
                  <span>Relational Database Architecture (Week 7 Implementation)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized entity structure modeling Projects, Vendors, Proposals, Extracted Fields, and
                  Evaluations.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied SQL DDL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Full SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            {/* Entity Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2">
                  <span>projects</span>
                  <span className="font-mono text-[10px] text-slate-400">Primary Entity</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• code: VARCHAR(32) UNIQUE</div>
                  <div>• name: VARCHAR(255)</div>
                  <div>• department: VARCHAR(128)</div>
                  <div>• budget_inr: NUMERIC(15,2)</div>
                  <div>• status: VARCHAR(32)</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-400 border-b border-slate-800 pb-2">
                  <span>criteria</span>
                  <span className="font-mono text-[10px] text-slate-400">Evaluation Metric</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• project_id: UUID (FK)</div>
                  <div>• key: VARCHAR(64)</div>
                  <div>• label: VARCHAR(128)</div>
                  <div>• weight: NUMERIC(5,2)</div>
                  <div>• is_mandatory: BOOLEAN</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-slate-800 pb-2">
                  <span>proposals</span>
                  <span className="font-mono text-[10px] text-slate-400">Vendor Submission</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• project_id: UUID (FK)</div>
                  <div>• vendor_id: UUID (FK)</div>
                  <div>• file_name: VARCHAR(255)</div>
                  <div>• total_bid_amount: NUMERIC</div>
                  <div>• delivery_weeks: INT</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-400 border-b border-slate-800 pb-2">
                  <span>proposal_fields</span>
                  <span className="font-mono text-[10px] text-slate-400">Extracted Values</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• proposal_id: UUID (FK)</div>
                  <div>• category: VARCHAR(32)</div>
                  <div>• extracted_value: TEXT</div>
                  <div>• confidence_score: NUMERIC</div>
                  <div>• source_citation: VARCHAR</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400 border-b border-slate-800 pb-2">
                  <span>criterion_evaluations</span>
                  <span className="font-mono text-[10px] text-slate-400">Scoring Matrix</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• proposal_id: UUID (FK)</div>
                  <div>• criterion_id: UUID (FK)</div>
                  <div>• raw_score: NUMERIC(5,2)</div>
                  <div>• compliance_status: VARCHAR</div>
                  <div>• manual_override: BOOLEAN</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-400 border-b border-slate-800 pb-2">
                  <span>vendors</span>
                  <span className="font-mono text-[10px] text-slate-400">Supplier Profiles</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• id: UUID (PK)</div>
                  <div>• code: VARCHAR(32)</div>
                  <div>• name: VARCHAR(255)</div>
                  <div>• rating: NUMERIC(3,2)</div>
                  <div>• contact_email: VARCHAR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE MCDM SCORING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <span>Interactive MCDM Simple Additive Weighting Simulator (Week 13)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust criteria weights in real-time to observe how the composite score equation Sv = Σ wi · svi re-ranks vendors dynamically.
                </p>
              </div>

              <div
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                  totalSimWeight === 100
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700 text-rose-300'
                }`}
              >
                <span>Total Weights: {totalSimWeight}%</span>
                {totalSimWeight === 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span>(Must equal 100%)</span>
                )}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Technical Capability</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcTechWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={calcTechWeight}
                  onChange={(e) => setCalcTechWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Design codes, M45/M50 grade & steel</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">BOQ Financial Bid</span>
                  <span className="font-mono text-sky-400 font-bold">{calcCommWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={calcCommWeight}
                  onChange={(e) => setCalcCommWeight(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">BOQ items, escalation & advance</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Machinery & Timeline</span>
                  <span className="font-mono text-amber-400 font-bold">{calcSlaWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={calcSlaWeight}
                  onChange={(e) => setCalcSlaWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Batching plants, pavers & months</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Safety & DLP Warranty</span>
                  <span className="font-mono text-purple-400 font-bold">{calcCompWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={calcCompWeight}
                  onChange={(e) => setCalcCompWeight(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">ISO 45001 & 5-year DLP maintenance</span>
              </div>
            </div>

            {/* Live Simulated Vendor Rankings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulated Real-Time Contractor Tender Rankings
              </h4>

              <div className="space-y-2">
                {[
                  {
                    name: 'Larsen & Toubro (L&T) Construction',
                    scores: { tech: 94, comm: 79, sla: 92, comp: 96 },
                    bid: '₹184.50 Cr',
                  },
                  {
                    name: 'Shapoorji Pallonji Engineering & Construction',
                    scores: { tech: 88, comm: 87, sla: 88, comp: 91 },
                    bid: '₹174.20 Cr',
                  },
                  {
                    name: 'Dilip Buildcon Limited (DBL)',
                    scores: { tech: 83, comm: 93, sla: 85, comp: 88 },
                    bid: '₹162.80 Cr',
                  },
                ]
                  .map((vendor) => {
                    const normTotal = totalSimWeight === 0 ? 1 : totalSimWeight;
                    const composite =
                      (vendor.scores.tech * calcTechWeight +
                        vendor.scores.comm * calcCommWeight +
                        vendor.scores.sla * calcSlaWeight +
                        vendor.scores.comp * calcCompWeight) /
                      normTotal;

                    return { ...vendor, composite: Math.round(composite * 10) / 10 };
                  })
                  .sort((a, b) => b.composite - a.composite)
                  .map((vendor, idx) => (
                    <div
                      key={vendor.name}
                      className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                            idx === 0
                              ? 'bg-amber-500 text-slate-950'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-950'
                              : 'bg-amber-800 text-amber-200'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{vendor.name}</span>
                            {idx === 0 && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
                                Recommended L1
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Bid: {vendor.bid} • Tech: {vendor.scores.tech}% • Comm: {vendor.scores.comm}%
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-emerald-400">
                          {vendor.composite}%
                        </div>
                        <div className="text-[10px] text-slate-400">Composite Score</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACADEMIC REPORT & LOGBOOK EXPORT */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Capstone Project Weekly Logbook Summary</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Academic record for project thesis, weekly committee reviews, and viva defense evaluation.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Week</th>
                    <th className="py-2.5 px-3">Phase</th>
                    <th className="py-2.5 px-3">Tasks Completed</th>
                    <th className="py-2.5 px-3">Key Deliverables</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {WEEK_DATA.map((w) => (
                    <tr key={w.week} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-mono font-bold text-white">W{w.week}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">{w.phase.split(':')[0]}</td>
                      <td className="py-2 px-3 text-slate-200">{w.title}</td>
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                        {w.deliverables[0]}
                      </td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="text-white font-semibold">📁 Repository Documentation Reference</div>
              <p>
                The complete in-depth documentation report containing all mathematical formulations, benchmark
                evaluations, and architecture schemas has been generated at:{' '}
                <code className="text-emerald-400 font-mono">docs/WEEK_WISE_IMPLEMENTATION_REPORT.md</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
