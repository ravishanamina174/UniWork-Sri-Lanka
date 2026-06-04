# 🎓 Final Year Project (FYP) Research & Development Roadmap

This document outlines the systematic academic research, empirical validation, and technical implementation framework for **UniWork Sri Lanka** as a software engineering Final Year Project.

---

## 📅 Academic Milestone Pipeline

[ Literature Review ] ──> [ Empirical Surveys ] ──> [ Architecture & Design ] ──> [ MVP Development ] ──> [ Evaluation & Paper ]


### 🔍 Phase 1: Literature Review & Gap Analysis
*   **Target Domains:** Location-based mobile crowdsourcing, peer-to-peer algorithmic trust architectures, and micro-task allocation optimization in developing economies.
*   **The Research Gap:** Existing global platforms (e.g., Fiverr, TaskRabbit) fail to address the specific volatility of Sri Lankan state university schedules, hyper-local geofenced safety demands, and localized cash/escrow compliance (CBSL regulations).

### 📊 Phase 2: Empirical Field Research (Surveys)
To ground this project in data, two parallel data collection pipelines will be established:
1.  **The Supply Side (Undergraduates):** Quantitative assessment of monthly financial deficits vs. free hours, mapping the willingness to perform tasks against prevailing social stigmas.
2.  **The Demand Side (Clients/SMEs):** Qualitative evaluation of the localized need for on-demand digital/physical labor and willingness to pay a premium for a secure, verified student network.
*   *Target Sample Size:* $N \ge 100$ verified responses per segment to establish statistical significance.

### 🏗️ Phase 3: Architectural Topology & Engineering
The platform will be engineered as a scalable, low-latency ecosystem optimized for constrained mobile network packages:

*   **Frontend Client:** React Native / Expo for high-fidelity, cross-device mobile responsive components.
*   **Backend Engine:** FastAPI (Python) for rapid, asynchronous geospatial queries ($5\text{km}$ radius indexing via PostgreSQL + PostGIS).
*   **Security & Auth:** Clerk integration restricting access strictly to verified `*.ac.lk` institutional domains paired with liveness checks.

### 📝 Phase 4: Formal Research Paper Structure
The final thesis paper will strictly follow the academic **IMRAD** format:

1.  **Introduction:** Contextualizing the economic necessity, urban boarding hardships, and scheduling constraints of state university undergraduates.
2.  **Methodology:** Documenting the system architecture, geospatial processing logic, and the "Buddy System" safety engine.
3.  **Results & Evaluation:** Presenting statistical survey data, system latency benchmarks, and mobile responsive performance metrics on low-bandwidth networks.
4.  **Discussion & Compliance:** Critiquing the legal parameters regarding the Personal Data Protection Act (PDPA) and Central Bank of Sri Lanka (CBSL) escrow alignments.

---

## ⚖️ Key Academic Writing Rules
*   **Objective Voice:** Maintain an objective, third-person perspective throughout the document (e.g., replace *"We implemented"* with *"The framework was implemented"*).
*   **Empirical Justification:** Every core UX and architecture decision (such as mandatory dual-student pairings for physical tasks) must be explicitly mapped back to a specific data point from the empirical survey phase.