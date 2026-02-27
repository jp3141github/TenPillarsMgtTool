import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Hash,
  Link2,
  Layers,
} from 'lucide-react';

/* ───────── Data ───────── */

interface PillarData {
  id: string;
  icon: string;
  name: string;
  purpose: string;
  outcome: string;
  nonNegotiables: string[];
  signals: string[];
  stages: string[]; // linked stage codes
}

const PILLARS: PillarData[] = [
  {
    id: 'pillar1',
    icon: '📋',
    name: 'BAU (Deadlines)',
    purpose: 'Keep the production line moving - predictable delivery, no heroics.',
    outcome: "One integrated critical path across Lloyd's, Group, IFRS 17 with explicit cut-offs and visible ownership.",
    nonNegotiables: [
      'One close plan (not 3 parallel projects).',
      'Work starts only when triaged and owned.',
      'WIP discipline - finish before starting more.',
    ],
    signals: ['On-time %', 'Cycle time', 'Rerun count', 'Late inputs', 'WIP breaches'],
    stages: ['ICP', 'SDP', 'ORM', 'RCC'],
  },
  {
    id: 'pillar2',
    icon: '💻',
    name: 'C.I. (Dev)',
    purpose: 'Make each close cheaper, safer, faster - deliberately.',
    outcome: 'Improvements land weekly, tracked like real work, measured for impact.',
    nonNegotiables: [
      'Small weekly upgrades beat quarterly rewrites.',
      'Fix the root cause, not just the symptom.',
      'If it repeats, it gets a backlog item with an owner.',
    ],
    signals: ['Hours saved', 'Defect trend', 'Automation coverage %', 'Recurring incident count'],
    stages: ['CIP', 'TUP', 'Automation'],
  },
  {
    id: 'pillar3',
    icon: '💬',
    name: 'Comms (Internal)',
    purpose: 'Control the narrative internally - reduce churn, speed up decisions.',
    outcome: 'Leadership gets a stable story they can challenge and sign.',
    nonNegotiables: [
      'One published truth source (Noticeboard ABCD).',
      '"One-page story" per deliverable: what moved, why, so what, actions.',
      'Cadence beats ad-hoc chaos.',
    ],
    signals: ['Stakeholder chase-downs', 'Late surprises', '"What is this?" queries'],
    stages: ['RCC', 'SDP', 'PR'],
  },
  {
    id: 'pillar4',
    icon: '📊',
    name: 'Data',
    purpose: 'Stop upstream data chaos becoming downstream reporting chaos.',
    outcome: 'Every dataset has a contract: owner, cadence, versioning, checks, lineage.',
    nonNegotiables: [
      "If it isn't registered, it isn't an input.",
      'Data quality is measured and visible.',
      'Access, permissions, and golden sources are explicit.',
    ],
    signals: ['Late input rate', 'DQ failures by source', 'Time-to-detect issues'],
    stages: ['IOR', 'QACE', 'WPM'],
  },
  {
    id: 'pillar5',
    icon: '📋',
    name: 'Doc / Gov / Ctrls',
    purpose: 'Make trust automatic - audit-ready by default, not by scramble.',
    outcome: 'Every run produces an evidence pack, every number has lineage, every change has approval.',
    nonNegotiables: [
      'Operational Playbook + Approval Framework are mandatory.',
      '"Done" means DoD met, controls run, evidence stored, approval recorded.',
    ],
    signals: ['Control pass rate', 'Audit queries', 'Time-to-produce evidence'],
    stages: ['DoD', 'RACI AP', 'QACE'],
  },
  {
    id: 'pillar6',
    icon: '📈',
    name: 'KPIs',
    purpose: 'Replace vibes with indicators - make performance discussable.',
    outcome: 'A small Performance Radar that shows delivery health and risk early.',
    nonNegotiables: [
      '5-10 KPIs max (anything more is theatre).',
      'Every KPI has an owner, definition, and action rule.',
    ],
    signals: ['KPI coverage', 'Trend visibility', 'Action-to-threshold ratio'],
    stages: ['PR', 'RCC', 'AL'],
  },
  {
    id: 'pillar7',
    icon: '👥',
    name: 'People (Funds)',
    purpose: 'Keep capacity real, reduce key-person risk, fund the right work.',
    outcome: 'Roles are covered, onboarding is fast, training is deliberate.',
    nonNegotiables: [
      'No single points of failure for critical deliverables.',
      'Time is budgeted - BAU, change, and contingency capacity.',
    ],
    signals: ['Coverage depth', 'Onboarding time', 'Overtime signals', 'Rework from handoffs'],
    stages: ['ORM', 'SDP', 'CTI'],
  },
  {
    id: 'pillar8',
    icon: '⚠️',
    name: 'Risk Mgt',
    purpose: 'Move fast inside guardrails - escalate by exception, zero surprises.',
    outcome: 'Risks, dependencies, and issues tracked to closure with clear owners.',
    nonNegotiables: [
      'Threshold-driven escalation only.',
      'Stop/go gates: completeness, reconciliations, movement thresholds.',
    ],
    signals: ['% caught by controls', 'Surprise incidents = 0', 'Late dependency rate'],
    stages: ['IOR', 'QACE', 'RCC'],
  },
  {
    id: 'pillar9',
    icon: '🤝',
    name: 'Stakeholders',
    purpose: 'Pre-wire, align, unblock - joined-up delivery across Finance/Actuarial/Audit.',
    outcome: 'Fewer late-stage fights because expectations and approval pathways are explicit.',
    nonNegotiables: [
      'Stakeholders know what you do (SDP), how to request it (ICP), how it gets approved (RACI AP).',
      'Contentious items are pre-wired early.',
    ],
    signals: ['Missed dependencies', 'Late sign-offs', 'Rework from unclear asks'],
    stages: ['SDP', 'ICP', 'RACI AP', 'CTI'],
  },
  {
    id: 'pillar10',
    icon: '🔧',
    name: 'Tech',
    purpose: 'Build the tooling spine that supports fast-close without degrading controls.',
    outcome: 'A pragmatic, supportable toolchain with clear ownership and upgrade pathway.',
    nonNegotiables: [
      'Tools serve the operating model (not the other way around).',
      'Monitoring and logging are part of "done".',
    ],
    signals: ['Automation coverage', 'Failure rate', 'MTTR', 'Manual touchpoints removed'],
    stages: ['Automation', 'TUP', 'WPM'],
  },
];

interface StageData {
  id: number;
  code: string;
  name: string;
  purpose: string;
  mvpSetup: string;
  output: string;
  channel: string;
  channelNumber: string;
}

const STAGES: StageData[] = [
  { id: 1, code: 'ICP', name: 'Intake Control Point', purpose: 'Single front door for work; triage, prioritise, log, route.', mvpSetup: 'Teams channel + Forms → Lists.', output: 'Intake log + priority queue', channel: 'ICP', channelNumber: 'II' },
  { id: 2, code: 'SDP', name: 'Service Delivery Portfolio', purpose: 'Defines what the team delivers, when, and to what standard.', mvpSetup: 'SharePoint page + Lists catalogue.', output: 'Service catalogue + cadence', channel: 'Delivery', channelNumber: 'III' },
  { id: 3, code: 'DoD', name: 'Definition of Done', purpose: 'Quality gate. "Finished" ≠ "pressed run".', mvpSetup: 'DoD checklist per deliverable in Lists.', output: 'DoD checklist per deliverable', channel: 'QACE', channelNumber: 'IV' },
  { id: 4, code: 'RACI AP', name: 'RACI + Approval Pathway', purpose: 'Ownership + route to signature.', mvpSetup: 'Lists-based RACI per deliverable.', output: 'Approval map + escalation path', channel: 'Delivery', channelNumber: 'III' },
  { id: 5, code: 'QACE', name: 'QA Controls Evidence', purpose: 'Controls framework + evidence bundle. Audit-ready by default.', mvpSetup: 'Controls register in Lists; evidence in SharePoint.', output: 'Control pack + evidence links', channel: 'QACE', channelNumber: 'IV' },
  { id: 6, code: 'ORM', name: 'Operational Run Manual', purpose: 'Runbooks that make delivery repeatable and trainable.', mvpSetup: 'SharePoint runbook pages per process.', output: 'Runbook + exception playbooks', channel: 'ORM', channelNumber: 'V' },
  { id: 7, code: 'IOR', name: 'I/O Register', purpose: 'Data lineage: what came in, from where, versioned when, what went out.', mvpSetup: 'Lists register with owner, cadence, version stamp.', output: 'Traceability register', channel: 'Delivery', channelNumber: 'III' },
  { id: 8, code: 'WPM', name: 'Workflow Process Maps', purpose: 'Visual end-to-end process maps and handoffs.', mvpSetup: 'Visio/PowerPoint maps in SharePoint.', output: 'Process maps + handoff definitions', channel: 'ORM', channelNumber: 'V' },
  { id: 9, code: 'RCC', name: 'Review & Control Cycle', purpose: 'Governance cadence: plan → review → controls → sign-off → retro.', mvpSetup: 'Teams meeting series + minutes in Loop/OneNote.', output: 'Calendar + gate checklist', channel: 'Noticeboard', channelNumber: 'I' },
  { id: 10, code: 'PR', name: 'Performance Radar', purpose: 'High-signal KPIs: timeliness, quality, rework, throughput.', mvpSetup: 'KPI cockpit in Power BI or Excel (5-10 metrics).', output: 'KPI dashboard + thresholds', channel: 'Noticeboard', channelNumber: 'I' },
  { id: 11, code: 'Automation', name: 'Automation', purpose: 'Removes repeatable manual work; adds monitoring/logging.', mvpSetup: 'Power Automate: Forms → Lists → Teams.', output: 'Automated steps + run logs', channel: 'Delivery', channelNumber: 'III' },
  { id: 12, code: 'TUP', name: 'Tooling Upgrade Path', purpose: 'Roadmap for toolchain upgrades; manages tech debt.', mvpSetup: 'Planner board with owners and statuses.', output: 'Sequenced upgrade roadmap', channel: 'Delivery', channelNumber: 'III' },
  { id: 13, code: 'AL', name: 'Analytics Layer', purpose: 'Standard metrics + variance/driver views for decisions.', mvpSetup: 'Analysis outputs in SharePoint with versioning.', output: 'Curated dataset + insights', channel: 'Delivery', channelNumber: 'III' },
  { id: 14, code: 'CTI', name: 'Cross-Team Integration', purpose: 'Contracts with other teams: definitions, calendars, handoffs.', mvpSetup: 'Shared dependency list + Teams shared channel.', output: 'Interface agreements + dependency map', channel: 'Delivery', channelNumber: 'III' },
  { id: 15, code: 'CIP', name: 'CI Pipeline', purpose: 'Structured continuous improvement: capture → prioritise → ship → measure.', mvpSetup: 'Improvements backlog in Lists + retro cadence.', output: 'Change backlog + release cycle', channel: 'Noticeboard', channelNumber: 'I' },
];

const CHANNEL_BADGE: Record<string, string> = {
  'I': '#8b5cf6',
  'II': '#3b82f6',
  'III': '#10b981',
  'IV': '#f59e0b',
  'V': '#f43f5e',
};

/* ───────── Collapsible Section ───────── */

function Callout({
  title,
  icon,
  children,
  defaultOpen = false,
  accentColor,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{ borderLeft: `3px solid ${accentColor || '#6366f1'}` }}
      className="mb-2 rounded-r-md bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted/40 transition-colors rounded-r-md"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        )}
        {icon}
        <span>{title}</span>
      </button>
      {open && <div className="px-4 pb-3 pt-0 text-sm">{children}</div>}
    </div>
  );
}

/* ───────── Pillar Note ───────── */

function PillarNote({ pillar }: { pillar: PillarData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
        )}
        <span className="text-lg">{pillar.icon}</span>
        <span className="font-semibold text-foreground text-sm">
          {pillar.name}
        </span>
        <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
          {pillar.stages.length} stages linked
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border/50 space-y-3 text-sm">
          {/* Purpose */}
          <p className="text-muted-foreground italic">{pillar.purpose}</p>

          {/* Outcome */}
          <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Outcome
            </span>
            <p className="text-foreground mt-0.5">{pillar.outcome}</p>
          </div>

          {/* Non-negotiables */}
          <div>
            <p className="font-semibold text-foreground mb-1">Non-negotiables</p>
            <ul className="space-y-1 pl-1">
              {pillar.nonNegotiables.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Signals */}
          <div>
            <p className="font-semibold text-foreground mb-1">Signals</p>
            <div className="flex flex-wrap gap-1.5">
              {pillar.signals.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground border border-border"
                >
                  <Hash className="w-2.5 h-2.5" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Linked stages */}
          <div>
            <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> Linked Stages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pillar.stages.map((code) => {
                const stage = STAGES.find(s => s.code === code);
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary border border-primary/20"
                  >
                    {code}
                    {stage && (
                      <span className="text-muted-foreground font-normal">
                        - {stage.name}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Stage Row ───────── */

function StageRow({ stage }: { stage: StageData }) {
  const [open, setOpen] = useState(false);
  const color = CHANNEL_BADGE[stage.channelNumber] || '#6366f1';

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        )}
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white shrink-0"
          style={{ background: color }}
        >
          {stage.id}
        </span>
        <span className="font-semibold text-foreground text-sm">
          {stage.code}
        </span>
        <span className="text-muted-foreground text-sm hidden sm:inline">
          {stage.name}
        </span>
        <span
          className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{ background: `${color}20`, color }}
        >
          Ch {stage.channelNumber}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-border/50 space-y-2 text-sm">
          <p className="text-muted-foreground italic">{stage.purpose}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                MVP Setup
              </p>
              <p className="text-foreground">{stage.mvpSetup}</p>
            </div>
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Primary Output
              </p>
              <p className="text-foreground">{stage.output}</p>
            </div>
          </div>
          {/* Back-links: which pillars reference this stage */}
          {(() => {
            const linked = PILLARS.filter(p => p.stages.includes(stage.code));
            if (linked.length === 0) return null;
            return (
              <div>
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                  <Link2 className="w-3 h-3" /> Referenced by
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {linked.map(p => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground border border-border"
                    >
                      {p.icon} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/* ───────── Main Component ───────── */

export default function ObsidianFramework() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title block - Obsidian note style */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>framework / ten-pillars-fifteen-stages</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          10 Pillars & 15 Stages Framework
        </h1>
        <p className="text-muted-foreground text-sm">
          A single-page reference linking the 10 operating priorities (pillars) to the
          15-stage implementation checklist (TOM). Pillars answer <em>"why / what good
          looks like"</em>; stages answer <em>"how it runs day-to-day"</em>.
        </p>
      </div>

      {/* Operating Rules callout */}
      <Callout
        title="Operating Rules (Non-Negotiable)"
        accentColor="#6366f1"
        defaultOpen
      >
        <div className="space-y-1.5 text-muted-foreground">
          <p>
            <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-foreground">Lists</code>{' '}
            = system-of-record
          </p>
          <p>
            <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-foreground">SharePoint</code>{' '}
            = system-of-evidence
          </p>
          <p>
            <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-foreground">Teams</code>{' '}
            = system-of-engagement
          </p>
          <p className="text-xs italic pt-1 border-t border-border mt-2">
            Everything else is plumbing.
          </p>
        </div>
      </Callout>

      {/* Channels quick reference */}
      <Callout title="Teams Channels" accentColor="#3b82f6" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { n: 'I', label: 'Noticeboard' },
            { n: 'II', label: 'ICP' },
            { n: 'III', label: 'Delivery' },
            { n: 'IV', label: 'QACE' },
            { n: 'V', label: 'ORM' },
          ].map(ch => (
            <div
              key={ch.n}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 bg-muted/50 border border-border"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: CHANNEL_BADGE[ch.n] }}
              >
                {ch.n}
              </span>
              <span className="text-xs font-medium text-foreground">{ch.label}</span>
            </div>
          ))}
        </div>
      </Callout>

      {/* ─── 10 Pillars ─── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">
            10
          </span>
          Pillars
        </h2>
        <p className="text-sm text-muted-foreground">
          The operating priorities - click to expand details and see linked stages.
        </p>
        <div className="space-y-2">
          {PILLARS.map(pillar => (
            <PillarNote key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>

      {/* ─── 15 Stages ─── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">
            15
          </span>
          Stages (TOM)
        </h2>
        <p className="text-sm text-muted-foreground">
          The implementation checklist - each stage maps to a Teams channel and produces concrete artefacts.
        </p>
        <div className="space-y-2">
          {STAGES.map(stage => (
            <StageRow key={stage.id} stage={stage} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-lg border border-dashed border-border bg-muted/30 text-center p-4">
        <p className="text-sm text-muted-foreground italic">
          Run an actuarial reporting production line that hits timetables, keeps
          quality tight, makes governance automatic, and sells the story upward
          with confidence.
        </p>
      </div>
    </div>
  );
}
