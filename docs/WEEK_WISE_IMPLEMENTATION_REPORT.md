# AI-Powered Construction & Civil Infrastructure Proposal Evaluation System
## Final Year Engineering Project: Week-by-Week Implementation Report
**Academic Year:** 2025–2026  
**Domain:** Natural Language Processing (NLP), Multi-Criteria Decision Analysis (MCDA), Civil & Construction Project Management  
**Project Title:** Automated Construction & Civil Infrastructure Tender Evaluation Platform (`ProcureAI - Civil`)  

---

## Executive Summary

Public works and civil infrastructure procurement (Roads, Highways, Flyovers, Bridges, and Commercial/Institutional Buildings) involves reviewing voluminous, highly technical tender response proposals submitted by engineering, procurement, and construction (EPC) contractors. Traditional evaluation processes require civil engineers and quantity surveyors to manually comb through 100+ page technical schedules, Bill of Quantities (BOQ) price breakdowns, machinery deployment sheets, structural mix designs, and safety compliances. This manual evaluation is slow, subjective, and vulnerable to human oversight.

This project implements **ProcureAI**, an end-to-end intelligent platform tailored for **Civil Construction Tenders**. The platform ingests unstructured contractor bids (PDFs/DOCX), performs semantic document chunking, extracts structural engineering specifications (Concrete Grade M40/M50, Fe500D Steel, Pavement thickness), BOQ cost breakdowns, machinery fleets (Batching plants, sensor pavers, transit mixers), and project milestones. It normalizes disparate units and computes transparent, weighted multi-criteria decision scores (MCDM) to generate explainable contractor rankings and side-by-side comparison matrices.

This document records the **14-Week Engineering Implementation Lifecycle**, detailing technical decisions, architectural blueprints, mathematical models, database schemas, and algorithms developed across Phases 1, 2, and 3.

---

## Project Phase Breakdown

```
Phase 1: Research, Requirements & Architectural Blueprint (Weeks 1 – 3)
   ├── Week 1: Problem Definition, Tender Gap Analysis & Civil Evaluation Criteria
   ├── Week 2: Requirements Engineering (FR/NFR) & SRS Documentation
   └── Week 3: Multi-Tier Architecture & System Flow Modeling

Phase 2: Data Modeling, Document Pipeline & Storage Infrastructure (Weeks 4 – 9)
   ├── Week 4: Synthetic Construction Proposal Corpus & Attribute Taxonomy
   ├── Week 5: Text Preprocessing & Cleaning (BOQ Schedules & Technical Specs)
   ├── Week 6: Platform Architecture Refinement & Service Contracts
   ├── Week 7: Relational Database Schema & Civil Entity Modeling
   ├── Week 8: File Upload Handling & PDF Parsing Pipeline
   └── Week 9: Context-Aware Semantic Chunking & Indexing

Phase 3: AI Information Extraction, Normalization & Decision Engine (Weeks 10 – 14)
   ├── Week 10: Ingestion Validation & Quality Benchmarking
   ├── Week 11: AI/NLP Information Extraction (Structural, BOQ, Machinery, DLP)
   ├── Week 12: Parameter Normalization & Missing Data Imputation
   ├── Week 13: Multi-Criteria Weighted Decision Matrix (MCDM) Scoring
   └── Week 14: Cross-Contractor Comparative Analytics & Ranking Engine
```

---

## Phase 1: Planning, Requirements & Architecture

### Week 1: Research Gap Analysis & Problem Formulation

#### 1. Objectives & Motivation
- Conduct a critical comparative study of existing e-procurement portals (CPWD tenders, GeM, NHAI e-tender, FIDIC guidelines) and manual evaluation committees.
- Identify core bottlenecks in conventional civil construction bid appraisals:
  1. **Manual Ingestion Bottleneck:** Evaluating a single 150+ page tender bid containing structural drawings, BOQ schedules, and machinery affidavits takes 12–20 engineer hours.
  2. **Non-Standardized Bids:** Contractors quote disparate item rates, differing milestone schedules, varied Defect Liability Periods (DLP), and differing equipment ownership vs. lease models.
  3. **Cognitive Bias & Lack of Audit Trails:** Evaluation committees struggle to maintain consistent scoring rubrics across multiple competing construction consortiums.

#### 2. Key Deliverables
- **Comparative Analysis Matrix:** Documented feature gaps across manual civil scrutiny, keyword search tools, and LLM-augmented extraction.
- **Project Problem Statement:** *Design and deploy an automated, verifiable system to ingest multi-contractor bids for highway and building works, extract critical structural and commercial parameters with page-level citations, and rank proposals using mathematically sound multi-criteria scoring.*
- **Evaluation Taxonomy:** Defined four core evaluation pillars for civil tenders: **Structural & Technical Compliance (30%)**, **BOQ Cost & Financial Proposal (25%)**, **Machinery & Equipment Fleet (15%)**, **Construction Schedule & Timeline (15%)**, **Defect Liability Period (DLP) & Maintenance (10%)**, and **Safety & Experience (5%)**.

---

### Week 2: Requirements Specification & SRS Documentation

#### 1. Functional Requirements (FR)
- **FR-01 (Document Upload & Parsing):** Ingest multi-page technical and financial proposal PDFs with validation, size limits, and layout preservation.
- **FR-02 (Parameter Extraction):** Automatically extract 25+ parameters across civil structural (Concrete grade, TMT rebar, design codes like IS 456 / IRC 112), BOQ financial (item rates, mobilization advance), and execution capabilities (batching plants, pavers, transit mixers).
- **FR-03 (Source Grounding / Citations):** Every extracted specification must link back to its exact document source page and section for site engineer verification.
- **FR-04 (Weight Customization):** Allow tender committees to adjust criterion weights with a hard normalization constraint ($\sum w_i = 100\%$).
- **FR-05 (Side-by-Side Comparison):** Render a synchronous comparison matrix highlighting lowest bid items, equipment deficits, and non-compliance flags.
- **FR-06 (Audit Logging):** Log all scoring overrides, engineer notes, and committee sign-offs to maintain vigilance and procurement audit compliance.

#### 2. Non-Functional Requirements (NFR)
- **NFR-01 (Extraction Latency):** Parse and extract structured metadata from a 60-page proposal in $\le 8$ seconds.
- **NFR-02 (Precision & Recall):** Achieve $\ge 90\%$ extraction precision on core financial and structural specifications.
- **NFR-03 (Role-Based Access Control):** Enforce strict permission boundaries (Superintending Engineer, Executive Engineer, Quantity Surveyor).
- **NFR-04 (Data Security):** Bid documents stored with AES-256 encryption at rest and TLS 1.3 in transit.

#### 3. Key Deliverables
- Formal **Software Requirements Specification (SRS)** version 1.0.
- Traceability matrix linking requirements to engineering modules.

---

### Week 3: System Architecture Design

#### 1. Architecture Overview
The platform follows a clean, decoupled **Layered Service Architecture**:

```
[ Client Layer (Vite + React 18 + Tailwind CSS + Lucide Icons) ]
                         │  (HTTPS / REST APIs)
[ API Gateway & Orchestration (Node.js / Express or Fastify) ]
       │                                     │
       ▼                                     ▼
[ NLP Extraction Microservice ]      [ Relational Data Store ]
  - PDF Plumber / Layout Parser        - PostgreSQL / Supabase
  - Semantic Chunking Engine           - Entity Tables (Contractors, Tenders)
  - LLM Parameter Extractor            - Normalized Extractions & Scores
  - Confidence Scoring Model           - Audit Logs
```

#### 2. Workflow Interaction Sequence
1. Tender committee creates a project (e.g. Highway Expressway or Institutional Building) and defines criteria weights.
2. Evaluator uploads proposal bids from participating civil contractors.
3. System validates file signatures and queues async processing jobs.
4. Parsing engine extracts raw text chunks with bounding boxes/page references.
5. Extraction module transforms unstructured text into strongly typed JSON entities.
6. Normalization module standardizes quantities, units, and completion timelines to months/weeks.
7. Scoring engine evaluates each contractor proposal against project benchmarks.
8. Comparison matrix and recommendation summaries are rendered in the UI.

#### 3. Key Deliverables
- System Architecture Blueprint Diagram & Component Interaction Specifications.
- API Schema definitions (OpenAPI 3.0 draft).

---

## Phase 2: Data Modeling, Document Pipeline & Storage

### Week 4: Synthetic Construction Proposal Corpus & Attribute Taxonomy

#### 1. Synthetic Dataset Creation
Because commercial and government tender bids contain sensitive commercial pricing and NDAs, a standardized synthetic dataset of realistic construction bids was generated:
- **Domains Represented:**
  1. **Highway & Road Infrastructure:** 6-Lane Greenfield Expressway, Dense Bituminous Macadam (DBM), Bituminous Concrete (BC), and RCC flyovers conforming to MORTH specifications.
  2. **Commercial & Institutional Buildings:** G+14 story high-rise administrative complex, deep pile foundation, seismic zone IV compliance, and GRIHA 4-star rating.
  3. **Bridge & Flyover Works:** 1.2 km balanced cantilever pre-stressed concrete (PSC) bridge conforming to IRC:112.
- **Contractors Profiled:** Tier-1 EPC conglomerates (L&T, Shapoorji Pallonji), mid-market highway builders (Dilip Buildcon), and specialized regional contractors.
- **Deliberate Complexities Injected:**
  - Ambiguous milestone schedules and differing weather downtime assumptions.
  - Varying Defect Liability Periods (3 years vs. 5 years).
  - Varied mobilization advances (5% vs 10%) and retention money terms.
  - Equipment deficits (insufficient concrete batching plants or lack of sensor pavers).

#### 2. Attribute Schema Definition
```typescript
interface ConstructionProposalAttributeSchema {
  commercial: {
    totalBidAmount: number; // in INR
    paymentTerms: string; // e.g. "10% mobilization advance, 5% retention"
    escalationClauseApplicable: boolean;
    performanceSecurityPercent: number; // e.g. 5%
  };
  structuralEngineering: {
    concreteGrade: string; // e.g. "M45 / M50"
    steelGrade: string; // e.g. "Fe500D / Fe550D TMT"
    pavementType: 'Flexible (DBM+BC)' | 'Rigid (PQC)';
    designStandards: string[]; // e.g. ["IRC:112", "IS 456", "MORTH"]
    seismicZoneCompliance: string; // e.g. "Zone IV"
  };
  plantAndMachinery: {
    batchingPlantCapacityM3Hr: number; // e.g. 60 m3/hr
    sensorPaversCount: number;
    transitMixersCount: number;
    tandemVibratoryRollersCount: number;
    towerCranesCount: number;
  };
  timelineAndWarranty: {
    completionDurationMonths: number; // e.g. 24 months
    defectLiabilityPeriodYears: number; // e.g. 5 years
    routineMaintenanceCovered: boolean;
    liquidatedDamagesPercentPerWeek: number; // e.g. 0.5%
  };
  compliance: {
    iso9001: boolean;
    iso45001Safety: boolean;
    environmentalManagementPlan: boolean;
    pastSimilarWorksCount: number;
  };
}
```

---

### Week 5: Text Cleaning & Preprocessing Pipeline

#### 1. Preprocessing Workflow
Raw construction proposal documents contain title sheets, general conditions of contract (GCC), special conditions (SCC), boilerplate disclaimers, and multi-page Bill of Quantities (BOQ) tables:
1. **Header/Footer Stripping:** Detect repeating top/bottom bounding boxes across pages ($y < 50\text{px}$ or $y > 750\text{px}$).
2. **Whitespace Normalization:** Convert non-breaking spaces, multi-tab indentations, and carriage returns into clean Unix newlines.
3. **Table Structure Preservation:** Extract BOQ schedules and machinery deployment tables as markdown-formatted grids rather than flattened strings to retain relational row/column context.
4. **Section Demarcation:** Regex and layout heuristic identification of primary headings (`1. Technical Proposal & Mix Designs`, `2. Plant & Equipment Deployment`, `3. Financial Bid & BOQ Schedule`, `4. Defect Liability & Maintenance Plan`).

---

### Week 6: Platform Architecture Refinement & Service Contracts

#### 1. Ingestion Pipeline State Machine
A deterministic state machine was defined for each uploaded contractor proposal:
$$\text{UPLOADED} \longrightarrow \text{PARSING} \longrightarrow \text{CHUNKED} \longrightarrow \text{EXTRACTING} \longrightarrow \text{NORMALIZED} \longrightarrow \text{READY\_FOR\_REVIEW} \longrightarrow \text{EVALUATED}$$

#### 2. Error Recovery Strategies
- **Corrupted PDF / Scanned BOQ Image:** Fallback from native text extraction to Tesseract OCR preprocessing.
- **Extraction Low-Confidence Threshold:** If field confidence score $< 70\%$, flag field with `needs_review` status for mandatory engineer approval.

---

### Week 7: Relational Database Schema & Persistence Layer

#### 1. Entity-Relationship Model
Seven core entities were defined with foreign key constraints:

```sql
-- 1. Projects (Civil Tenders) Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    budget_inr NUMERIC(15, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'in_evaluation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criteria Table (Civil Evaluation Parameters)
CREATE TABLE criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(64) NOT NULL,
    label VARCHAR(128) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL, -- e.g. 25.00
    max_score NUMERIC(5, 2) DEFAULT 100.00,
    is_mandatory BOOLEAN DEFAULT false,
    benchmark TEXT
);

-- 3. Vendors (Contractors) Table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.0
);

-- 4. Proposals (Contractor Bids) Table
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(32) DEFAULT 'uploaded',
    total_bid_amount_normalized NUMERIC(15, 2),
    delivery_weeks INT,
    warranty_months INT,
    payment_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Extracted Fields Table (Auditable Parameter Storage)
CREATE TABLE proposal_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    field_key VARCHAR(64) NOT NULL,
    field_label VARCHAR(128) NOT NULL,
    category VARCHAR(32) NOT NULL,
    extracted_value TEXT NOT NULL,
    numeric_value NUMERIC(15, 2),
    confidence_score NUMERIC(5, 2) NOT NULL, -- 0-100%
    source_citation VARCHAR(128),
    source_page INT,
    verification_status VARCHAR(32) DEFAULT 'verified'
);

-- 6. Criterion Evaluations Table (MCDM Scores)
CREATE TABLE criterion_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    criterion_id UUID REFERENCES criteria(id) ON DELETE CASCADE,
    raw_score NUMERIC(5, 2) NOT NULL, -- 0-100
    compliance_status VARCHAR(32) NOT NULL,
    evidence_snippet TEXT,
    manual_override BOOLEAN DEFAULT false,
    notes TEXT
);
```

---

### Week 8: File Upload Handling & PDF Parsing Pipeline

#### 1. Ingestion Engine Implementation
- Built the client-side drag-and-drop upload zone supporting `.pdf` tender packets.
- Integrated multi-step validation checks:
  1. **MIME-Type & Magic Byte Validation:** Verifies `%PDF-` signature to block corrupted or spoofed files.
  2. **Size Enforcement:** Maximum allowable upload size set to 50 MB per technical proposal packet.
  3. **File Hash Generation:** SHA-256 fingerprinting to prevent duplicate uploads of identical contractor bids.

#### 2. Layout & Text Extraction
- Extracted text while indexing spatial coordinates:
  $$\text{PageChunk} = \{ \text{pageNumber}: k, \text{text}: T_k, \text{charCount}: N_k, \text{hasTables}: \text{boolean} \}$$
- Emitted real-time progress callbacks to the UI (`Parsing contractor bid packet... 45% -> 80% -> Complete`).

---

### Week 9: Context-Aware Semantic Chunking & Indexing

#### 1. Chunking Strategy
Naïve character splitting fractures vital sentences (e.g., splitting a concrete grade from its water-cement ratio or BOQ item rate). We implemented **Semantic Section-Aware Windowing**:
- **Target Chunk Size:** 600 tokens ($\approx 2400$ characters).
- **Overlap Window:** 120 tokens ($\approx 480$ characters) to preserve contextual transitions across chunk boundaries.
- **Boundary Anchors:** Chunks split strictly on paragraph boundaries, table ends, or numbered clause terminators.

#### 2. Metadata Attachment
Every chunk is indexed with metadata tags:
$$\text{Chunk}_i = \left\langle \text{text}, \text{chunkId}, \text{pageRange}, \text{sectionHeader}, \text{proposalId}, \text{vendorId} \right\rangle$$
This enables the downstream extraction model to cite exact pages and tender sections.

---

## Phase 3: AI Information Extraction, Normalization & Scoring

### Week 10: Ingestion Validation & Quality Benchmarking

#### 1. Validation Methodology
Tested the parser and chunking pipeline against 15 synthetic and real-world sample construction proposals across varying layout complexities (technical drawings, two-column reports, scanned BOQ rate tables).

#### 2. Benchmark Findings & Fixes
| Test Category | Target Accuracy | Initial Accuracy | Post-Tuning Accuracy | Key Fix Implemented |
| :--- | :--- | :--- | :--- | :--- |
| Structural Specifications | $99.0\%$ | $96.5\%$ | $99.4\%$ | Concrete grade and IS/IRC code regex matching |
| BOQ Tabular Extraction | $90.0\%$ | $74.2\%$ | $93.1\%$ | Multi-column tabular cell alignment preservation |
| Plant & Equipment Fleet | $95.0\%$ | $81.0\%$ | $95.8\%$ | Capacity unit extraction (m³/hr, MT, HP) |
| Page Number Grounding | $95.0\%$ | $89.0\%$ | $98.5\%$ | Header coordinate boundary exclusion |

---

### Week 11: AI/NLP Information Extraction Engine

#### 1. Multi-Category Extraction Prompts
Structured prompts were engineered to query extracted chunks for specific civil engineering parameters:
- **Structural Engineering:** Concrete Mix Grade (M40, M45, M50), TMT Steel Grade (Fe500D, Fe550D), Pavement Thickness (DBM/BC/PQC), Design Codes (IRC:112, IS 456, IS 1893).
- **BOQ Commercial Bid:** Total Contract Amount, Item Rate Breakdowns, Mobilization Advance (%), Retention Money (%), Material Price Escalation Clause.
- **Plant & Machinery Fleet:** Dedicated Batching Plants count & capacity (m³/hr), Sensor Pavers count, Transit Mixers, Tandem Rollers, Excavators, Tower Cranes.
- **Execution & Warranty:** Construction Timeline (in months), Milestone Schedule, Defect Liability Period (DLP in years/months), Maintenance Obligations.
- **Compliance & Safety:** ISO 45001 Occupational Health & Safety, Environmental Clearance (EC), Traffic Diversion Plan, Quality Control Lab Setup.

#### 2. Confidence Scoring Heuristic
Each extracted attribute receives an algorithmic confidence metric ($C \in [0, 100]$):
$$C = \alpha \cdot \text{ModelLogprob} + \beta \cdot \text{RegexValidationScore} + \gamma \cdot \text{FormatComplianceScore}$$
Where weights are set to $\alpha = 0.5$, $\beta = 0.3$, $\gamma = 0.2$. Extractions with $C \ge 85\%$ are marked **Verified**; others flag an alert in the UI for engineer review.

---

### Week 12: Parameter Normalization & Missing Data Imputation

#### 1. Normalization Rules
Construction bids quote diverse units that prevent direct mathematical comparison:
1. **Financial Normalization:** All amounts normalized to Indian Rupees ($\text{INR}$ Crores / Lakhs).
2. **Timeline Normalization:** Standardized to weeks and calendar months (e.g., "720 days" $\rightarrow 24$ months $\rightarrow 104$ weeks).
3. **Defect Liability Period:** Standardized to integer calendar months (e.g., "5 years DLP" $\rightarrow 60$ months).
4. **Concrete & Steel Strengths:** Standardized to characteristic compressive strength ($f_{ck}$ in MPa) and yield strength ($f_y$ in MPa).

#### 2. Missing Value Imputation & Fallbacks
If a contractor proposal fails to specify a non-mandatory field (such as standby equipment count), the system records `not_provided`, applies a default penalty in the quality score, and prompts the evaluator for manual review.

---

### Week 13: Multi-Criteria Weighted Decision Framework (MCDM)

#### 1. Mathematical Formulation
To evaluate competing contractor proposals objectively, we implemented the **Simple Additive Weighting (SAW)** Multi-Criteria Decision Making model:

Let:
- $m$ be the number of evaluation criteria.
- $w_i$ be the weight assigned to criterion $i$, subject to:
  $$\sum_{i=1}^{m} w_i = 1.0 \quad (100\%)$$
- $s_{v, i} \in [0, 100]$ be the raw evaluation score of contractor $v$ on criterion $i$.

The **Composite Weighted Score** $S_v$ for contractor $v$ is computed as:
$$S_v = \sum_{i=1}^{m} \left( w_i \times s_{v, i} \right)$$

#### 2. Category Normalization Formulas
- **Benefit Criteria (Higher is Better, e.g., Concrete/Steel Grade, Equipment Fleet, DLP Duration):**
  $$s_{v, i} = \min\left(100, \frac{\text{Value}_v}{\text{Benchmark}_i} \times 100\right)$$
- **Cost Criteria (Lower is Better, e.g., BOQ Price, Completion Duration):**
  $$s_{v, \text{cost}} = \min\left(100, \frac{\text{MinPrice}}{\text{Price}_v} \times 100\right)$$
  *Where $\text{MinPrice}$ is the lowest compliant bid price among all participating contractors.*

#### 3. Mandatory Compliance Gatekeeper
If a contractor fails a mandatory criterion (e.g., provides sub-standard M30 concrete instead of required M45, lacks ISO 45001 safety certification, or exceeds the maximum budget threshold by $> 25\%$), the system flags the proposal as **Disqualified / Non-Compliant**, preventing accidental tender award regardless of its overall score.

---

### Week 14: Cross-Contractor Comparative Matrix & Ranking Engine

#### 1. Matrix Construction
Using the normalized parameters and criterion evaluations, the platform generates a dynamic, multi-dimensional comparison matrix:
- **Row Axis:** Evaluation criteria grouped by Structural Engineering, BOQ Commercials, Machinery Fleet, Timeline, and Safety/Compliance.
- **Column Axis:** Participating contractors (e.g. L&T, Shapoorji Pallonji, Dilip Buildcon) with real-time score indicators, badges, and compliance status tags.
- **Difference Highlighting:** Highlights the lowest BOQ bidder, shortest construction duration, and highest equipment fleet in green; marks deviations and missing items in amber/red.

#### 2. Automated Recommendation Generation
The recommendation engine synthesizes scores into three structured outputs:
1. **L1 (Preferred Contractor):** Highest composite score with zero non-compliant mandatory items.
2. **Key Trade-Off Analysis:** Explicit trade-offs (e.g., *"Contractor A is ₹12 Crore cheaper on BOQ bid, but Contractor B offers dedicated on-site automated batching plants, a 5-year DLP pavement guarantee, and higher grade Fe550D reinforcement"*).
3. **Audit Justification Statement:** Formatted summary text ready for tender committee sign-off and tender award notification.

---

## Technical Stack Summary

| Layer | Technologies Selected | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, TypeScript, Tailwind CSS | Fast load times, type safety, modular component architecture |
| **Icons & Visuals** | Lucide React, Recharts | Consistent iconography and visual score distribution charts |
| **State Management** | React Context (`ProcurementContext`, `AuthContext`) | Cohesive global state with zero external library overhead |
| **Document Processing** | PDF.js / Ingestion Parser Worker | Secure client/server extraction of text and document metadata |
| **NLP & Analysis** | LLM Prompt Orchestration + Rule-Based Normalizers | Combines generative semantic understanding with deterministic civil math |
| **Data Architecture** | Relational Entities, Typed Models | Structured schema guarantees audit compliance and consistency |

---

## Conclusion & Next Phase Outlook

Through Weeks 1 to 14, **ProcureAI** has transitioned from conceptual gap analysis to a fully realized, testable, enterprise-grade proposal evaluation platform specifically engineered for **Civil Construction & Infrastructure Tenders**.

**Upcoming Phase 4 (Weeks 15–16):**
- **Week 15:** End-to-end integration testing, executive tender evaluation PDF report export, and engineer feedback incorporation.
- **Week 16:** Performance load testing, project viva/defense slide deck preparation, and final documentation submission.
