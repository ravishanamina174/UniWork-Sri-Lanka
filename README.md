# UniWork Sri Lanka 🇱🇰
### University Students Micro-Gig & Errand Marketplace

UniWork is a mobile-first marketplace purpose-built to connect Sri Lankan state university undergraduates with short-term digital and physical tasks. The platform enables students to earn a flexible income that adapts to their unpredictable academic schedules, entirely bypassing the rigid commitments of traditional part-time employment.

---

## 📌 Core Concept

State university students in Sri Lanka are often academically elite but financially constrained. Due to unpredictable timetables, exam shifts, and campus disruptions, standard shift-based retail jobs (e.g., supermarkets, fast food) are highly impractical. 

**UniWork solves this fragmentation by offering micro-gigs that take anywhere from 1 to 5 hours to complete.**

### The Macro Gaps We Solve:
*   **Socioeconomic Push:** Government bursaries (such as Mahapola) no longer absorb the inflationary spikes in urban boarding (boardim) fees, food, and transport.
*   **Geographic Density:** State universities function as massive localized ecosystems. Thousands of students live clustered within a 2km radius of campus gates, making hyper-local, physical errands uniquely logistically efficient.
*   **Dignity of Labor Shift:** In Sri Lanka, minor casual labor can carry a social stigma for university undergraduates. UniWork intentionally rebrands these tasks as an **"Academic Micro-Consultancy & Youth Hustle Network"**, framing errands as smart entrepreneurship.

---

## 🛠️ Supported Gig Ecosystem

The platform splits workflows into two distinct operational pipelines:

| 💻 Digital Tasks | 🏃‍♂️ Physical & Event Logistics |
| :--- | :--- |
| • Graphic Design & UI Wireframing | • Corporate Event Operations & Hosting |
| • Sinhala/Tamil/English Localization | • SIM Card Activation & Promotion Drives |
| • Data Entry & AI Model Labeling | • Brand Mascot Performance |
| • Basic Software Bug Fixing | • Floral Decoration & Setup |
| • Social Media Content Creation | • Boarding House Furniture Shifting |
| • Academic Peer Tutoring | • Painting, Cleaning & Grass Cutting |

---

## 🔒 Safety, Security & Trust Architecture

Because the safety of undergraduate students is paramount, the platform is engineered with defensive guardrails to prevent exploitation and physical danger.

*   **Closed Academic Ecosystem:** Registrations are strictly restricted. Users must authenticate using a verified university email (`.ac.lk`) or complete a manual student ID verification paired with a real-time facial liveness check.
*   **The "Buddy System" Engine:** For physical tasks occurring off-campus (e.g., furniture shifting, cleaning, late-night event setups), the architecture mandates or rewards **Team Gigs**, requiring two verified students to accept the task together.
*   **Geofenced Safety Monitoring:** When a student marks a physical gig as "Started," the mobile app initializes foreground location tracking, giving students an instant toggle to share a live encrypted tracking link with emergency contacts or student union representatives.
*   **Two-Way Blind Ratings:** Mutual reviews are calculated blindly upon task closure. Low-rated posters are immediately quarantined and banned automatically by the system backend.

---

## 🏗️ Technical Architecture & Stack

The platform's infrastructure is optimized to maintain low-latency geo-queries and function seamlessly on mid-to-entry-tier mobile devices running on constrained mobile data packages.

[ React Native Client App ] 
     /                     \
(LankaQR Payment)        (FastAPI / Node.js Engine)
/

[Commercial Bank Escrow]    [Geo-Query DB / Redis Cache] ---> Push Notification


*   **Frontend:** Cross-platform mobile client built using **React Native / Expo**, heavily performance-optimized, featuring high-fidelity UI/UX mirroring modern design standards, minimalist typography, and extreme data-saving asset compression.
*   **Backend Engine:** High-performance REST/WebSocket API optimized for rapid geo-location indexing (e.g., PostgreSQL with PostGIS or Redis Geo) to instantly calculate and trigger push notifications for matching gigs within a strict **5km radius** of a campus hub.
* **Automated Escrow Pipeline:** To build complete trust, money is handled through a secure transactional workflow:
    $$\text{Client Posts Task }\& \text{ Deposits Funds} \longrightarrow \text{Bank API Holds in Escrow} \longrightarrow \text{Task Completed} \longrightarrow \text{Instant Payout}$$

---

## 💼 Monetization Engine

The platform remains **100% free forever for all verified university students**. Revenue generation is shifted entirely to the commercial and operational supply side:

1.  **B2C Commission Model:** A flat **10% to 15% service premium** is added on top of the task budget paid by private individuals posting general household errands.
2.  **B2B Premium Tier:** Corporate clients, event management agencies, and tech companies pay premium placement fees to pin bulk task requests (e.g., deploying 30 students to act as brand ambassadors at an exhibition).
3.  **Targeted Corporate Sponsorships:** Native, non-intrusive ad placements and sponsored student challenges financed by local telecom operators, banking entities, and educational providers looking to capture youth market share.
4.  **Escrow Float Management:** Accumulation of minor operational interest on cash balances securely held within the banking network's digital escrow wallets during multi-day tasks.

---

## ⚖️ Legal & Compliance Framework

*   **Central Bank of Sri Lanka (CBSL) Alignment:** To avoid the heavy regulatory complexities of operating as a payment intermediary, the platform integrates directly with licensed commercial bank APIs to route funds directly via **LankaQR / JustPay** protocol into third-party escrow nodes.
*   **Labor Law Mitigations:** The platform's Terms of Service explicitly define all students as independent gig workers / freelancers and not employees of either the marketplace or the client, completely mitigating EPF, ETF, and minimum wage legal liabilities.
*   **Personal Data Protection Act (PDPA):** National Identity Details, phone numbers, and exact structural addresses are completely encrypted in transit and at rest, remaining completely hidden from employers until a contract is formally locked and accepted.

---

## 🚀 Go-To-Market & Scalability Roadmap

State university networks require an organic, grassroots deployment pipeline over heavy digital ad spend.

### Phase 1: Seed the Supply (Weeks 1 - 4)
Acquire 50 to 100 guaranteed, fully funded digital tasks (translation, basic layout design, data entry) from partner software startups and marketing agencies *before* launching the student application to prevent an "empty dashboard" bounce rate.

### Phase 2: Structural Alliances (Weeks 5 - 8)
Engage directly with the **Faculty Student Unions** and student clubs within major universities. By presenting UniWork as an essential student-welfare tool built to lower drop-out rates caused by financial hardship, the platform gains organic institutional backing.

### Phase 3: The Ambassador Network (Weeks 9 - 12)
Appoint prominent final-year undergraduates and student leaders as Campus Ambassadors, incentivizing them with micro-bonuses for every student who completes their first verified gig.

### Phase 4: Controlled Hyper-Local Pilot
Rather than an island-wide rollout, operations will launch as a isolated beta test restricted to **one single campus cluster** (e.g., University of Moratuwa for digital/technical tasks or University of Colombo for creative/event tasks) utilizing digital-only gigs initially to stress-test the bank escrow infrastructure before expanding to high-risk physical errands.