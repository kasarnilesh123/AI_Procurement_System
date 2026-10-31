# ProcureAI: AI-Assisted Vendor Selection & Procurement Intelligence System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Automated Construction & Civil Infrastructure Tender Evaluation Platform**  
> Streamlines proposal parsing, Multi-Criteria Decision-Making (MCDM) weighted evaluation, vendor compliance checks, and comparative bid analytics.

---

## 🌟 Key Highlights & Features

- **Automated Tender & Proposal Ingestion**: Parses complex construction proposals, technical specifications, Bill of Quantities (BOQ), and equipment fleet declarations.
- **MCDM Weighted Evaluation Engine**: Dynamic scoring with customizable weights across Financial Competitiveness, Technical Compliance, Quality & Safety, and Delivery Schedule.
- **Side-by-Side Vendor Comparison Matrix**: In-depth benchmarking of contractor bids (e.g., L&T, Shapoorji Pallonji, Dilip Buildcon, Afcons).
- **Interactive Weekly Implementation Tracker**: Built-in 14-week engineering breakdown with live interactive simulators for System Architecture, Relational ERD, Normalization Engine, and MCDM Calculator.
- **Executive PDF Tender Reporting**: One-click generation of audit-ready tender evaluation and award recommendation reports.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Tooling & Build**: Vite, PostCSS, ESLint
- **Visuals & Charts**: Custom dynamic data visualization and responsive layout

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/kasarnilesh123/AI_Procurement_System.git

# Navigate to project folder
cd AI_Procurement_System

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Repository Structure

```text
├── docs/                      # 14-week technical & academic documentation
├── sample_proposals/          # Real-world benchmark civil construction bids
├── src/
│   ├── components/            # UI components, layout shell, indicators
│   ├── context/               # Authentication & Procurement state management
│   ├── data/                  # Realistic tender, vendor, and evaluation datasets
│   ├── pages/                 # Full feature views (Dashboard, Proposals, Comparison, etc.)
│   ├── types/                 # TypeScript interfaces and domain models
│   └── utils/                 # Calculations, MCDM scoring, and formatters
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📄 Documentation

For the detailed 14-week academic report and system architecture specifications, please refer to:
- [docs/WEEK_WISE_IMPLEMENTATION_REPORT.md](./docs/WEEK_WISE_IMPLEMENTATION_REPORT.md)
- [PROJECT_IMPLEMENTATION_REPORT.md](./PROJECT_IMPLEMENTATION_REPORT.md)
