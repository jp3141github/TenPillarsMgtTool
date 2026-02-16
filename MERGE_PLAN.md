# TenPillars + MS365Tools Merge — Implementation Exploration

## Current State Analysis

### TenPillarsMgtTool (Primary — React app)

| Attribute | Detail |
|-----------|--------|
| **Framework** | React 19.2 + TypeScript 5.6 + Vite 7.1 |
| **Styling** | Tailwind CSS 4.1 + shadcn/ui (50+ components) |
| **Routing** | Wouter (URL-based, but only `/` and `/404`) |
| **State** | In-component state in Dashboard.tsx (~790 lines) |
| **Persistence** | localStorage (`pillar-dashboard-data`, `pillar-dashboard-channel-messages`) |
| **Views** | 3 internal views: Pillars, TOM, Corporate Mode + floating Channel Chat panel |
| **Deployment** | Netlify (static + Express server for prod) |
| **Location** | `pillar-dashboard/client/src/` |

**What it has:**
- 10 customisable pillars with per-pillar lists (full CRUD + CSV import/export)
- 15-stage TOM section with complete vocabulary, sub-domains, tools, and artifacts
- 5-channel Teams model (I–V) with Slack-like chat simulation
- Corporate Mode (job spec → pillar mapping)
- Undo/redo (50 history), search, keyboard shortcuts
- Desktop/mobile responsive with toggle
- Theme (light/dark)

**What it lacks:**
- No Command Center / dashboard-level KPIs
- No register detail views (registers are described in TOM text, not interactive)
- No Planner/Kanban execution view
- No Automations view
- No Performance Radar / charts
- No Architecture Map / implementation checklist
- No MS365 API integration (OAuth stubs exist but unused)

---

### MS365Tools (Subordinate — vanilla HTML/JS prototype)

| Attribute | Detail |
|-----------|--------|
| **Framework** | None (single 85KB `index.html`, vanilla JS) |
| **Styling** | Tailwind CSS (CDN) + custom |
| **Routing** | JS `switchView()` function (no URL routing) |
| **State** | In-memory `tomData` object |
| **Persistence** | None (page refresh clears data) |
| **Views** | 7 views: Dashboard, Registers, ICP Detail, Planner, Automations, Performance, Architecture |
| **Deployment** | Netlify (static) |
| **Location** | `MS365Tools_20260216_041815.zip` (extracted to `/tmp/MS365Tools_extracted/`) |

**What it has (that TenPillars lacks):**
- Command Center with 4 KPI cards + activity stream
- Register grid (ICP, SDP, ORM, QACE cards) with ICP detail table
- Planner/Kanban with drag-drop (Not Started → In Progress → In Review → Complete)
- Automations console (3 simulated Power Automate flows with test buttons)
- Performance Radar (Chart.js: line, bar, doughnut, adoption metrics)
- Architecture Map (MS365 stack layers + migration checklist)
- ICP intake modal (form submission → in-memory list)

**What it lacks (that TenPillars has):**
- No pillar-based organisation
- No real persistence (not even localStorage)
- No component architecture (everything inline)
- No TOM 15-stage deep definitions (only 4 registers of the 15 stages)
- No channel chat simulation
- No Corporate Mode
- No undo/redo, CSV import/export
- No build system, no TypeScript, no component library

---

## Overlap & Drift Inventory

### Shared vocabulary (same terms, slightly different definitions)

| Term | TenPillars definition | MS365Tools definition | Drift risk |
|------|----------------------|----------------------|------------|
| ICP | "Intake Control Point" | "Intake & Change Portfolio" | **Name differs** |
| SDP | "Service Delivery Portfolio" | Same | OK |
| ORM | "Operational Run Manual" | "Operational Risk Management" | **Name differs** |
| QACE | "QA Controls Evidence" | "Quality Assurance & Controls Evidence" | Minor |
| PR | "Performance Radar" | "Performance Radar" | OK |
| RCC | "Review & Control Cycle" | "Recurring Governance Meeting" | **Name differs** |

**Decision needed:** Canonical names must be locked before merge. TenPillars' TOMSection.tsx (426 lines) is the more complete source.

### Duplicated UI patterns

| Pattern | TenPillars | MS365Tools |
|---------|-----------|------------|
| Desktop/mobile toggle | LayoutContext + toggle button | Fixed bottom-left toggle |
| Sidebar navigation | Wouter + state-based views | `switchView()` JS function |
| Channel descriptions | CHANNELS const + TOMSection accordion | Basics_MVP doc only |
| Register definitions | TOMSection text descriptions | Interactive register cards |
| Stage→tool mapping | TOMSection accordion detail | Architecture view layers |

---

## Merged Site Information Architecture

### Proposed top-level navigation (7 sections)

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR                                                     │
│                                                              │
│  1. Command Center          (new — port from MS365Tools)     │
│  2. Operate – Ten Pillars   (existing — TenPillars pillars)  │
│  3. Run the TOM – 15 Stages (existing — TenPillars TOM)     │
│  4. Teams Channels I–V      (existing — TenPillars channels) │
│  5. MS365 Implementation    (new — port from MS365Tools)     │
│  6. Registers               (new — port from MS365Tools)     │
│  7. Evidence & Controls     (new — port from MS365Tools)     │
│                                                              │
│  ── secondary ──                                             │
│  Corporate Mode             (existing — TenPillars)          │
│  Settings / Theme           (existing — TenPillars)          │
└─────────────────────────────────────────────────────────────┘
```

### Route structure (Wouter)

```
/                          → Command Center (default landing)
/pillars                   → Operate – Ten Pillars
/pillars/:id               → Single pillar detail (lists)
/tom                       → Run the TOM – 15 Stages
/tom/:stageCode            → Single stage deep-dive (future)
/channels                  → Teams Channels I–V overview
/channels/:number          → Single channel chat
/implementation            → MS365 Implementation hub
/implementation/architecture  → Architecture map
/implementation/automations   → Automations console
/implementation/planner       → Close Plan & Delivery (Kanban)
/registers                 → Register grid
/registers/:code           → Register detail (ICP, SDP, ORM, QACE, etc.)
/evidence                  → Evidence & Controls dashboard
/corporate                 → Corporate Mode
```

---

## Implementation Approach — Phase 0

### Step 0.1: Shared constants & types

**Create `pillar-dashboard/client/src/lib/tom-constants.ts`**

Extract from TOMSection.tsx into a canonical constants file:
- `TOM_STAGES` — array of 15 stage objects (code, name, channel, purpose, tools, subDomains)
- `CHANNELS` — the 5 channel definitions (currently duplicated in Dashboard.tsx and TOMSection.tsx)
- `REGISTERS` — register definitions with fields, linked stage, linked channel
- `TOM_VOCABULARY` — acronym → full name map (single source of truth for naming)
- `OPERATING_RULES` — the 4 non-negotiable rules

**Create `pillar-dashboard/client/src/lib/tom-types.ts`**

New TypeScript interfaces:
```typescript
interface TOMStage {
  code: string;           // 'ICP', 'SDP', etc.
  name: string;           // Full name
  channel: ChannelNumber; // 'I' | 'II' | 'III' | 'IV' | 'V'
  purpose: string;
  tools: string[];
  subDomains?: SubDomain[];
  operatingRules?: string[];
}

interface Register {
  id: string;
  stageCode: string;      // Links to TOMStage
  name: string;
  fields: RegisterField[];
  views?: RegisterView[];
}

interface RegisterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'status' | 'priority' | 'link';
  options?: string[];     // For select/status fields
}

interface RegisterItem {
  id: string;
  registerId: string;
  data: Record<string, string>;
  created: string;
  lastEdited: string;
}

interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  conditions?: string[];
  actions: string[];
  linkedStage: string;
}

interface KPIMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'flat';
  linkedStage?: string;
}
```

**Estimated scope:** ~200 lines of constants, ~100 lines of types.

---

### Step 0.2: Routing upgrade

**Current state:** Wouter with only `/` and `/404`. All views are state-based (`activeView` string).

**Change:** Move from state-based views to URL-based routes.

```tsx
// App.tsx — new route structure
<Router>
  <Route path="/" component={CommandCenter} />
  <Route path="/pillars" component={PillarsDashboard} />
  <Route path="/pillars/:id" component={PillarDetail} />
  <Route path="/tom" component={TOMSection} />
  <Route path="/channels" component={ChannelsOverview} />
  <Route path="/implementation" component={ImplementationHub} />
  <Route path="/implementation/architecture" component={ArchitectureMap} />
  <Route path="/implementation/automations" component={AutomationsConsole} />
  <Route path="/implementation/planner" component={PlannerKanban} />
  <Route path="/registers" component={RegisterGrid} />
  <Route path="/registers/:code" component={RegisterDetail} />
  <Route path="/evidence" component={EvidenceControls} />
  <Route path="/corporate" component={CorporateMode} />
  <Route component={NotFound} />
</Router>
```

**Impact:** Dashboard.tsx (790 lines) needs to be decomposed. Currently it owns all state and renders all views. The refactor:
1. Extract `PillarsDashboard` from Dashboard.tsx (pillar selection, list CRUD, CSV)
2. Keep `TOMSection` as-is (already a separate component)
3. Keep `CorporateMode` as-is (already separate)
4. Create new page components for the MS365Tools ports

**Risk:** Dashboard.tsx manages undo/redo history, search state, and channel messages globally. These need to move to a context provider or state management layer.

---

### Step 0.3: State management refactor

**Current:** All state lives in Dashboard.tsx via `useState` hooks. This won't scale to 7+ route-level pages.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **A. React Context** | No new deps, familiar pattern | Prop drilling for nested state, re-render concerns |
| **B. Zustand** | Tiny (1KB), simple API, good devtools | New dependency |
| **C. Jotai** | Atomic state, minimal re-renders | Learning curve |

**Recommended: Zustand** — lightest-weight store that handles the current patterns (undo/redo, persist to localStorage, cross-page state).

```typescript
// Stores needed:
// 1. pillarStore — pillars, lists, CRUD, undo/redo
// 2. channelStore — channel messages
// 3. registerStore — register items (new)
// 4. uiStore — search, active view, modals, theme, layout
```

---

### Step 0.4: Port MS365Tools views to React components

Each MS365Tools view becomes a React component. Here's the mapping and scope:

#### 1. CommandCenter (`/` — new default landing)

**Source:** MS365Tools `view-dashboard`
**Port scope:**
- 4 KPI summary cards (Open ICP items, Active risks, Close plan %, Pending approvals)
- Activity stream (recent events)
- RCC actions quick view
- "New ICP Intake" button → opens modal

**New dependencies:** None (shadcn Card, Badge, Button already available)
**Data source:** Derived from registerStore (ICP items, risk items, etc.)
**Estimated:** ~200 lines

#### 2. RegisterGrid (`/registers` — new)

**Source:** MS365Tools `view-registers`
**Port scope:**
- Card grid showing all registers (ICP, SDP, DoD, RACI AP, QACE, ORM, IOR)
- Each card: name, description, item count, status badge, link to detail
- Filterable by channel (I–V)

**Data source:** `TOM_STAGES` constants + registerStore item counts
**Estimated:** ~150 lines

#### 3. RegisterDetail (`/registers/:code` — new)

**Source:** MS365Tools `view-register-icp` (generalised for all registers)
**Port scope:**
- Dynamic table based on register field definitions
- Inline editing (reuse existing ListTable component patterns)
- Add item form/modal
- Column sorting, filtering
- View switching (All Items, My Items, Overdue)
- CSV export (reuse existing csv.ts)

**Data source:** registerStore items filtered by register code
**Estimated:** ~300 lines (much can reuse ListTable patterns)

#### 4. PlannerKanban (`/implementation/planner` — new)

**Source:** MS365Tools `view-planner`
**Port scope:**
- 4-column Kanban: Not Started | In Progress | In Review | Complete
- Drag-and-drop task cards (use @dnd-kit/core or similar)
- Task cards: title, ID, priority badge, checklist progress
- Bucket counters

**New dependencies:** `@dnd-kit/core` + `@dnd-kit/sortable` (or HTML5 drag-and-drop)
**Data source:** registerStore or separate plannerStore
**Estimated:** ~350 lines

#### 5. AutomationsConsole (`/implementation/automations` — new)

**Source:** MS365Tools `view-automations`
**Port scope:**
- 3 flow definition cards (ICP Router, Approval Framework, Evidence Auto-File)
- Flow detail: trigger, conditions, actions
- Test console with simulated log output
- "Simulate" buttons per flow

**Data source:** Static flow definitions from constants + simulated output
**Estimated:** ~250 lines

#### 6. PerformanceRadar (`/implementation/performance` or under Evidence — new)

**Source:** MS365Tools `view-performance`
**Port scope:**
- 3 Chart.js charts (line, bar, doughnut)
- Adoption metrics (progress bars)
- KPI cards

**New dependencies:** `chart.js` + `react-chartjs-2`
**Data source:** Derived from registerStore metrics (or mock data initially)
**Estimated:** ~200 lines

#### 7. ArchitectureMap (`/implementation/architecture` — new)

**Source:** MS365Tools `view-architecture`
**Port scope:**
- MS365 stack layer diagram (6 layers)
- Migration checklist (3 phases, checkboxes)
- Tool-to-stage reference matrix

**Data source:** Static from constants
**Estimated:** ~200 lines

#### 8. EvidenceControls (`/evidence` — new)

**Source:** Synthesised from MS365Tools QACE card + TenPillars QACE stage definition
**Port scope:**
- Controls register overview (pass/warn/fail stats)
- Evidence library structure (SharePoint folder tree reference)
- DoD gate checklist per deliverable
- Link-outs to SharePoint (or placeholder)

**Data source:** registerStore (QACE register items)
**Estimated:** ~250 lines

---

### Step 0.5: Sidebar refactor

**Current:** Sidebar.tsx renders pillar list, TOM toggle, Corporate toggle, channel shortcuts, and a chart.

**New sidebar structure:**
```
[Brand/Logo]

Command Center        (link → /)
Operate – Pillars     (link → /pillars, expandable to show 10 pillars)
Run the TOM           (link → /tom)
Teams Channels        (link → /channels, expandable to show I–V)
MS365 Implementation  (link → /implementation, expandable submenu)
  ├─ Architecture
  ├─ Automations
  └─ Planner
Registers             (link → /registers)
Evidence & Controls   (link → /evidence)

── secondary ──
Corporate Mode        (link → /corporate)
[Theme toggle]
[Layout toggle]
[Storage stats]
```

**Estimated:** Sidebar.tsx rewrite ~250 lines (currently ~similar).

---

### Step 0.6: De-duplication rule enforcement

**Principle:** Every concept has exactly one "home page". Everywhere else is a link + 1-line summary.

| Concept | Home page | Cross-linked from |
|---------|-----------|-------------------|
| ICP definition & rules | `/tom` → ICP accordion | `/registers/icp` (link back), Command Center (count card) |
| Register field defs | `/registers/:code` | `/tom` stage accordion (link), `/evidence` (link) |
| Channel purpose | `/channels` overview | `/tom` (channel badge), Sidebar (icons) |
| Tool mapping | `/implementation/architecture` | `/tom` stage detail (tools list) |
| Evidence requirements | `/evidence` | `/tom` QACE accordion (link), `/registers/qace` (link) |
| Operating rules | `/tom` header banner | Command Center footer reminder |

---

## Implementation Approach — Phase 1 (Governed)

### Step 1.1: Replace localStorage with MS365 Lists/SharePoint

**Current persistence:** `localStorage` with JSON serialisation.

**Target persistence:**
- **Registers** → Microsoft Lists (via Graph API)
- **Evidence files** → SharePoint Document Libraries (via Graph API)
- **Channel messages** → Teams Channel Messages (via Graph API, or keep local for simulation)

**Technical requirements:**
- MSAL.js v2 integration (React wrapper: `@azure/msal-react`)
- Azure AD app registration (already stubbed in `const.ts` with `VITE_OAUTH_PORTAL_URL`)
- Microsoft Graph SDK (`@microsoft/microsoft-graph-client`)
- Permissions: `Sites.ReadWrite.All`, `Lists.ReadWrite`, `Files.ReadWrite.All`, `Team.ReadBasic.All`

**Architecture:**
```
React App
  → MSAL Auth Provider (silent token acquisition)
    → Graph Client (bearer token)
      → SharePoint Site → Lists (registers)
      → SharePoint Site → Document Libraries (evidence)
      → Teams → Channels (messages, optional)
      → Planner → Plans/Buckets/Tasks (execution)
```

**Migration path:**
1. Add MSAL provider wrapping the app
2. Create `graphClient.ts` service layer
3. Create `listService.ts` — CRUD operations on Lists
4. Create `evidenceService.ts` — file upload/download on SharePoint
5. Swap `storage.ts` calls with service layer calls
6. Keep localStorage as offline fallback / demo mode

**Demo mode toggle:** When no MSAL config is present, fall back to localStorage with a banner: "Demo Mode — data stored locally only."

---

### Step 1.2: Register audit trail

Once Lists are the source:
- Every edit creates a List item version (built-in SharePoint versioning)
- `Modified By` and `Modified` columns auto-populated
- Custom `AuditLog` list for cross-register events

---

## Implementation Approach — Phase 2 (Maturity)

### Step 2.1: Power Automate integration

- Replace simulated flows with real Power Automate triggers
- ICP intake form → Power Automate → creates List item + Teams notification
- Evidence auto-file → Power Automate → moves attachments to SharePoint `/Evidence/` folder
- Approval framework → Power Automate approval actions

### Step 2.2: Power BI Performance Radar

- Embed Power BI reports via `powerbi-client-react`
- Data source: Microsoft Lists (direct connector)
- Dashboards: Close timeliness, Exception volumes, Control pass rate, Adoption metrics

### Step 2.3: Automated controls

- Evidence completeness checks (Power Automate scheduled flow)
- Reminder notifications for overdue items
- DoD gate enforcement (block status change without evidence link)

---

## File Impact Assessment (Phase 0)

### Files to modify

| File | Change | Complexity |
|------|--------|------------|
| `client/src/App.tsx` | Replace single-route with multi-route structure | Medium |
| `client/src/pages/Dashboard.tsx` | Decompose into PillarsDashboard; extract state to stores | High (790 lines) |
| `client/src/components/Sidebar.tsx` | Rewrite navigation to match new IA | Medium |
| `client/src/components/TOMSection.tsx` | Extract constants to shared file; add cross-links | Low |
| `client/src/lib/types.ts` | Add Register, RegisterItem, AutomationFlow, KPIMetric types | Low |
| `client/src/lib/storage.ts` | Add register and planner persistence; prep for Graph swap | Medium |

### Files to create

| File | Purpose | Est. lines |
|------|---------|------------|
| `client/src/lib/tom-constants.ts` | Canonical TOM vocabulary, stages, channels, registers | ~200 |
| `client/src/lib/tom-types.ts` | TypeScript interfaces for TOM domain | ~100 |
| `client/src/stores/pillarStore.ts` | Zustand store for pillars + lists + undo/redo | ~150 |
| `client/src/stores/channelStore.ts` | Zustand store for channel messages | ~60 |
| `client/src/stores/registerStore.ts` | Zustand store for register items | ~150 |
| `client/src/stores/uiStore.ts` | Zustand store for UI state (search, modals, layout) | ~80 |
| `client/src/pages/CommandCenter.tsx` | KPI dashboard + activity stream | ~200 |
| `client/src/pages/PillarsDashboard.tsx` | Extracted from Dashboard.tsx | ~400 |
| `client/src/pages/ChannelsOverview.tsx` | Channel I–V overview with links to chat | ~150 |
| `client/src/pages/ImplementationHub.tsx` | MS365 implementation landing | ~100 |
| `client/src/pages/RegisterGrid.tsx` | Register card grid | ~150 |
| `client/src/pages/RegisterDetail.tsx` | Dynamic register table | ~300 |
| `client/src/pages/EvidenceControls.tsx` | QACE + evidence dashboard | ~250 |
| `client/src/components/ArchitectureMap.tsx` | MS365 stack diagram + checklist | ~200 |
| `client/src/components/AutomationsConsole.tsx` | Flow defs + test console | ~250 |
| `client/src/components/PlannerKanban.tsx` | Drag-drop Kanban board | ~350 |
| `client/src/components/PerformanceRadar.tsx` | Chart.js dashboards | ~200 |
| `client/src/components/IntakeModal.tsx` | ICP intake form (port from MS365Tools) | ~120 |
| `client/src/components/KPICard.tsx` | Reusable KPI summary card | ~40 |
| `client/src/components/ActivityStream.tsx` | Recent activity list | ~80 |

### New dependencies (Phase 0)

| Package | Purpose | Size |
|---------|---------|------|
| `zustand` | State management | ~1KB |
| `chart.js` + `react-chartjs-2` | Performance Radar charts | ~60KB |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Kanban drag-drop | ~15KB |

### New dependencies (Phase 1)

| Package | Purpose | Size |
|---------|---------|------|
| `@azure/msal-browser` + `@azure/msal-react` | Azure AD auth | ~35KB |
| `@microsoft/microsoft-graph-client` | Graph API | ~20KB |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dashboard.tsx decomposition breaks undo/redo | High | Extract undo/redo to Zustand middleware before decomposing |
| Vocabulary naming inconsistency (ICP, ORM, RCC) | Medium | Lock canonical names in tom-constants.ts first, use everywhere |
| Chart.js bundle size | Low | Tree-shake unused chart types; lazy-load Performance page |
| Kanban DnD complexity | Medium | Start with HTML5 native DnD; upgrade to @dnd-kit if needed |
| MSAL integration scope creep | High | Phase 1 only; Phase 0 stays on localStorage |
| Mobile layout regression | Medium | Test every new page in mobile mode; keep existing responsive patterns |

---

## Sequencing (recommended order within Phase 0)

```
 1. Create tom-constants.ts + tom-types.ts (foundation — everything depends on this)
 2. Add Zustand; create stores; migrate Dashboard.tsx state
 3. Refactor routing (App.tsx → multi-route)
 4. Decompose Dashboard.tsx → PillarsDashboard.tsx
 5. Refactor Sidebar.tsx for new nav
 6. Port CommandCenter (new default landing page)
 7. Port RegisterGrid + RegisterDetail
 8. Port ArchitectureMap
 9. Port AutomationsConsole
10. Port PlannerKanban (+ add dnd-kit)
11. Port PerformanceRadar (+ add chart.js)
12. Create EvidenceControls page
13. Wire cross-links (de-duplication rule enforcement)
14. QA pass: verify every concept has exactly one home page
```

---

## Open Questions (to resolve before implementation)

1. **Canonical TOM names:** Which names win? (e.g., ICP = "Intake Control Point" or "Intake & Change Portfolio"?)
2. **State management:** Zustand vs React Context? (Zustand recommended but adds a dependency)
3. **Kanban DnD library:** @dnd-kit vs HTML5 native? (native is zero-dep but less polished)
4. **Performance Radar charts:** Chart.js vs Recharts? (Chart.js matches MS365Tools; Recharts is more React-native)
5. **Demo mode label:** How prominently should "Demo Mode" be displayed when running without MS365?
6. **Pillar lists vs Registers:** Are the existing pillar-based lists (free-form tables) separate from TOM registers, or should registers replace them?
7. **Channel chat persistence:** Keep localStorage for chat, or drop it in favour of future Teams API?
