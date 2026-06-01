# 📊 Feasibility Analysis: UniWork Sri Lanka

## 1. Problem Identification: Is this a Real Problem?
**Yes, it is a highly critical and unaddressed problem.** 
State university students in Sri Lanka represent the top academic tier of the country, yet they operate in a highly constrained socioeconomic environment. 

### The Weight of the Problem (Severity & Impact)
*   **The Inflationary Gap:** Standard government financial aid (Mahapola, Bursaries) has stagnated, while the cost of living (urban boarding house/boardim fees, data cards, food, and transport) has multiplied. Students are frequently forced to skip meals or compromise on academic resources.
*   **The Time-Constraint Dilemma:** Traditional part-time jobs (e.g., retail, fast food, call centers) demand rigid 6 to 8-hour daily shifts. State university timetables are notoriously erratic, with frequent reschedules, sudden practical sessions, and rolling exam dates. A student simply cannot commit to standard employment without sacrificing their degree.
*   **The Stigma Barrier:** There is a cultural hesitation among Sri Lankan undergraduates to engage in visible manual labor. The problem isn't a lack of willingness to work; it's a lack of a *dignified, peer-accepted platform* to do so.

**Macro Environmental Pressures**
┌────────────────────────────────────────────────────────────────────────┐
│                        THE UNDERGRADUATE TRILEMMA                      │
├───────────────────┬────────────────────────────┬───────────────────────┤
│ 1. Inflationary   │ Cost of living (boardims,  │ Fixed government aid  │
│    Pressure       │ transport, data, food)     │ (Mahapola/bursaries)  │
│                   │ skyrocketing.              │ is stagnant.          │
├───────────────────┼────────────────────────────┼───────────────────────┤
│ 2. Operational    │ Erratically rescheduled    │ Cannot commit to rigid│
│    Constraints    │ timetables, labs, exams.   │ 6-8 hour retail shifts│
├───────────────────┼────────────────────────────┼───────────────────────┤
│ 3. Socio-Cultural │ Reluctance to engage in    │ Need dignified, peer- │
│    Stigma         │ visible manual labor.      │ accepted alternatives.│
└───────────────────┴────────────────────────────┴───────────────────────┘
---

## 2. The Best Solution
The most effective intervention is a **Hyper-Local, Time-Bound Micro-Gig Marketplace**. 

Instead of traditional employment, the solution must atomize work into **1 to 5-hour tasks** (errands, digital data entry, event setups) that can be picked up entirely on demand. By strictly gating the platform to verified `.ac.lk` email addresses, the platform creates a high-trust, closed-loop community that frames these tasks as "smart youth hustling" rather than menial labor.

---

## 3. Technical Feasibility
The project is **highly feasible** to execute with a lean engineering team, provided the chosen stack prioritizes rapid mobile deployment and real-time backend processing. 

Since smartphone penetration among undergraduates is virtually 100%, a mobile-first approach is mandatory. The core technical hurdle is not the data itself, but ensuring low-latency location matching and extreme cross-device mobile responsiveness across varying screen sizes (from high-end iPhones to budget Android devices).

---

## 4. Key Techniques Required for Success
To ensure adoption and stability, the following technical implementations are non-negotiable:

*   **Strict UI/UX Consistency:** The application must maintain high-fidelity styling across all frontend components. A fragmented or clunky interface will immediately lose the trust of Gen-Z users.
*   **Geospatial Indexing:** Gigs need to be broadcasted based on proximity. The database must efficiently handle radius queries (e.g., "Find all students within 3km of the University of Moratuwa").
*   **Real-Time State Management:** When a gig is posted, nearby students need instant push notifications. When a gig is claimed, it must instantly disappear from the feed to prevent double-booking.
*   **AI-Driven Task Matching (Future Proofing):** Implementing a smart matching layer that pairs a student's past successful gigs and stated degree (e.g., assigning a software bug-fixing gig to an IT faculty student) to specific tasks.

---

## 5. System Architecture & Tech Stack
To build a scalable, modern, and performant platform, the following full-stack architecture is optimal:

### Frontend (Mobile App)
*   **Framework:** React Native 
*   **Objective:** Delivers a true cross-platform mobile experience from a single codebase while allowing for pixel-perfect, responsive frontend components.

### Backend (API & Core Logic)
*   **Framework:** FastAPI (Python)
*   **Objective:** Extremely fast, asynchronous API handling. Perfect for concurrent user requests during high-traffic periods (e.g., when a high-paying gig is suddenly broadcasted).

### Authentication & Security
*   **Provider:** Clerk
*   **Objective:** Drop-in, highly secure authentication system to easily handle `.ac.lk` email verification, session management, and JWT generation without reinventing the wheel.

### Database & Search
*   **Database:** PostgreSQL with PostGIS extension (for robust geospatial radius querying).
*   **AI Integration:** Integrating the Gemini API orchestrated via LangGraph could be used to automatically categorize unstructured user gig descriptions (e.g., parsing "Need help carrying a sofa" into category: `Physical Labor`, duration: `2 hrs`, suggested price: `LKR 2000`).

---

## 6. How to Start the Project

### Phase 1: Information Gathering & Validation
1.  **On-Ground Surveys:** Do not write code yet. Speak directly to students living in boardims around a specific target university. Ask them: *What is your absolute minimum hourly rate to do a data-entry task? What about a physical moving task?*
2.  **Supply-Side Acquisition:** Speak to 5 local small businesses or event management companies. Confirm they would be willing to pay a 10% premium to access instant, smart student labor.

### Phase 2: Technical Initialization
1.  **Environment Setup:** Spin up your preferred environment (e.g., configuring Cursor IDE for AI-assisted rapid prototyping).
2.  **Auth & Boilerplate:** Initialize the React Native project and the FastAPI backend. Connect Clerk for user onboarding. 
3.  **Database Design:** Map out the core relational models: `Users`, `Gigs`, `Transactions`, and `Reviews`.

### Phase 3: Core Module Development (MVP)
Focus strictly on the primary loop first:
*   **Module A:** Client creates a Gig (Title, Location, Payout).
*   **Module B:** Student views the Gig feed and clicks "Accept."
*   **Module C:** Simple status updates (`In Progress` -> `Completed`).

### Phase 4: Testing & Iteration
*   Ensure complete UI mobile responsiveness across the entire frontend. 
*   Run a simulated beta test with 10 friends acting as clients and 10 acting as workers before integrating real payment gateways.