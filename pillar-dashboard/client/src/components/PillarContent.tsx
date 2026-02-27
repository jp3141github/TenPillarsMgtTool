import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  ShieldAlert,
  Rocket,
  FileText,
  BarChart3,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

interface PillarSection {
  purpose: string;
  outcome: string;
  nonNegotiables: string[];
  mvpSetup: string[];
  artefacts: string[];
  signals: string[];
  failureModes: string[];
  whereItLives: string[];
}

const PILLAR_CONTENT: Record<string, PillarSection> = {
  pillar1: {
    purpose:
      'Keep the production line moving  - predictable delivery, no heroics.',
    outcome:
      "One integrated critical path across Lloyd's, Group, IFRS 17  - with explicit cut-offs and visible ownership.",
    nonNegotiables: [
      'One close plan (not 3 parallel projects).',
      'Work starts only when triaged and owned (no "drive-bys").',
      'WIP discipline  - finish before starting more.',
    ],
    mvpSetup: [
      'Intake front door + triage (ICP).',
      'Delivery board with owners, due dates, blockers (Planner).',
      'Run log + submission manifest + version registry.',
    ],
    artefacts: [
      'Close calendar + dependency tracker.',
      'Run log + submission manifest.',
      '"Current vs archive" folder structure for outputs.',
    ],
    signals: [
      'On-time %',
      'Cycle time',
      'Rerun count',
      'Late inputs',
      'WIP breaches',
    ],
    failureModes: [
      'Untriaged work.',
      'Invisible blockers.',
      '"Done" with no evidence link.',
    ],
    whereItLives: [
      'ICP in Channel II.',
      'Delivery in Channel III.',
      'Noticeboard ABCD updates in Channel I.',
    ],
  },
  pillar2: {
    purpose:
      'Make each close cheaper, safer, faster  - deliberately (not by "working harder").',
    outcome:
      'Improvements land weekly, tracked like real work, measured for impact.',
    nonNegotiables: [
      'Small weekly upgrades beat quarterly rewrites.',
      'Fix the root cause, not just the symptom.',
      'If it repeats, it gets a backlog item with an owner.',
    ],
    mvpSetup: [
      'CIP (improvement pipeline) in Lists: ideas, defects, lessons learned.',
      'TUP backlog: tooling upgrades sequenced without breaking BAU.',
      'Post-close retro cadence ("Close +7 days") with named actions.',
    ],
    artefacts: [
      'CI backlog + roadmap (ranked by risk reduction + hours saved).',
      'Lessons learned log with evidence links.',
      'Training / handover notes tied to fixes.',
    ],
    signals: [
      'Hours saved',
      'Defect trend',
      'Automation coverage %',
      'Recurring incident count down',
    ],
    failureModes: [
      "\"We'll fix it next quarter\" purgatory.",
      'No owners.',
      'No measurement.',
    ],
    whereItLives: [
      'CIP backlog + retro visibility in Channel I (Noticeboard).',
      'TUP backlog + automation progress in Channel III (Delivery).',
      'Lessons learned linked to evidence in SharePoint.',
    ],
  },
  pillar3: {
    purpose:
      'Control the narrative internally  - reduce churn, reduce pinging, speed up decisions.',
    outcome:
      'Leadership gets a stable story they can challenge and sign.',
    nonNegotiables: [
      'One published truth source (Noticeboard ABCD)  - debate happens elsewhere.',
      '"One-page story" per deliverable: what moved, why, so what, actions.',
      'Cadence beats ad-hoc chaos (daily pulse in close week, weekly RCC snapshot).',
    ],
    mvpSetup: [
      'Channel I Noticeboard posts tagged Approved / Blocked / Changed / Delivered with links back to registers/evidence.',
      'RCC minutes captured (Loop/OneNote) with actions written down.',
    ],
    artefacts: [
      'Committee pack template.',
      'Weekly exec summary + exceptions tracker.',
      'Change posts that link to Approval Framework and evidence.',
    ],
    signals: [
      'Stakeholder chase-downs down',
      'Fewer "what is this?" queries',
      'Fewer late surprises',
    ],
    failureModes: [
      'Status scattered in DMs.',
      'Threads with attachments-with-no-home.',
      'Decisions with no record.',
    ],
    whereItLives: [
      'ABCD status posts in Channel I (Noticeboard).',
      'RCC minutes and exec summaries in Channel I.',
      'Committee packs and change posts linked to SharePoint evidence.',
    ],
  },
  pillar4: {
    purpose:
      'Stop upstream data chaos becoming downstream reporting chaos.',
    outcome:
      'Every dataset has a contract: owner, cadence, versioning, checks, lineage.',
    nonNegotiables: [
      "If it isn't registered, it isn't an input.",
      'Data quality is measured and visible (not discovered at sign-off).',
      'Access, permissions, and "golden sources" are explicit.',
    ],
    mvpSetup: [
      'IOR (I/O Register): input name, owner, location, cadence, version stamp, output consumers.',
      'Minimum DQ checks: schema, completeness, reconciliations, reasonableness thresholds (pass/warn/fail).',
    ],
    artefacts: [
      'Data dictionary per feed (field definitions, units, sign conventions).',
      'Data cut-off log (late inputs recorded as managed risk).',
      'Lineage map: input \u2192 transformations \u2192 outputs.',
    ],
    signals: [
      'Late input rate',
      'DQ failures by source',
      'Time-to-detect issues',
      '"Unknown version" count = zero',
    ],
    failureModes: [
      'Spreadsheet archaeology.',
      'Silent schema changes.',
      '"Works on my machine" pipelines.',
    ],
    whereItLives: [
      'I/O Register (IOR) tracked in Channel III (Delivery).',
      'DQ check results and evidence in Channel IV (QACE).',
      'Data dictionaries and lineage maps stored in SharePoint.',
    ],
  },
  pillar5: {
    purpose:
      'Make trust automatic  - audit-ready by default, not by scramble.',
    outcome:
      'Every run produces an evidence pack, every number has lineage, every change has approval.',
    nonNegotiables: [
      'Operational Playbook + Approval Framework are mandatory for anything that hits committees/submissions.',
      '"Done" means DoD met, controls run, evidence stored, approval recorded.',
    ],
    mvpSetup: [
      'DoD per deliverable (checklist).',
      "RACI AP recorded so sign-off doesn't stall.",
      'QACE pack: controls register + evidence links + pass/warn/fail outcomes.',
    ],
    artefacts: [
      'Control checklist + results.',
      'Reconciliations and movement explanations (materiality-based).',
      'Decision/change log: what changed, why, who approved, effective run.',
    ],
    signals: [
      'Control pass rate',
      'Audit queries',
      'Time-to-produce evidence',
      '% deliverables with complete DoD + approval record',
    ],
    failureModes: [
      'Sign-off via chat only.',
      'Missing evidence links.',
      'Undocumented exceptions.',
    ],
    whereItLives: [
      'DoD checklists and QACE packs in Channel IV (QACE).',
      'RACI AP and sign-off log in Channel III (Delivery).',
      'Evidence files stored in SharePoint, linked from controls register.',
    ],
  },
  pillar6: {
    purpose:
      'Replace vibes with indicators  - make performance discussable.',
    outcome:
      'A small "Performance Radar" that shows delivery health and risk early.',
    nonNegotiables: [
      '5-10 KPIs max (anything more is theatre).',
      'Every KPI has an owner, definition, and action rule (what you do when it moves).',
    ],
    mvpSetup: [
      'PR dashboard: throughput, lateness, reruns, open issues, WIP, evidence completeness.',
      'Weekly RCC uses KPIs as standing agenda input.',
    ],
    artefacts: [
      'KPI dictionary (definitions, calculation logic, thresholds).',
      'KPI trend pack (weekly, same format, same recipients).',
      'KPI-to-action mapping ("if red then escalate to Noticeboard").',
    ],
    signals: [],
    failureModes: [
      'Vanity metrics.',
      'Inconsistent definitions.',
      'Dashboards nobody uses.',
    ],
    whereItLives: [
      'KPI snapshots broadcast in Channel I (Noticeboard).',
      'Performance Radar (PR) dashboard in Power BI / Excel.',
      'KPI trend packs fed into RCC agenda in Channel I.',
    ],
  },
  pillar7: {
    purpose:
      'Keep capacity real, reduce key-person risk, fund the right work.',
    outcome:
      'Roles are covered, onboarding is fast, training is deliberate, resourcing choices are explicit.',
    nonNegotiables: [
      'No single points of failure for critical deliverables.',
      'Time is budgeted  - BAU capacity, change capacity, contingency capacity.',
      '"Funds" (time/money) are allocated through visible prioritisation (not guilt).',
    ],
    mvpSetup: [
      'Role coverage map (primary/secondary cover).',
      'Training plan tied to ORM and QACE patterns (not random courses).',
      'Onboarding checklist that points to golden sources.',
    ],
    artefacts: [
      'Skills matrix, coverage depth, onboarding pack, handover notes.',
      'Resourcing assumptions (what BAU requires, what improvements require).',
    ],
    signals: [
      'Coverage depth',
      'Onboarding time-to-independence',
      'Overtime/overload signals',
      'Rework from handoffs',
    ],
    failureModes: [
      'Hero culture.',
      'Undocumented tribal knowledge.',
      '"We can just squeeze it in."',
    ],
    whereItLives: [
      'Role coverage and capacity planning in Channel III (Delivery).',
      'Training plans tied to ORM in Channel V.',
      'Onboarding packs and handover notes in SharePoint.',
    ],
  },
  pillar8: {
    purpose:
      'Move fast inside guardrails  - escalate by exception, zero surprises.',
    outcome:
      'Risks, dependencies, and issues are tracked to closure with clear owners and decisions.',
    nonNegotiables: [
      'Threshold-driven escalation only (no FYI spam, no stealth reds).',
      'Stop/go gates: completeness, reconciliations, movement thresholds, sign-off readiness.',
    ],
    mvpSetup: [
      'Risk & dependency register (RAG, triggers, mitigations, owner, due date).',
      'Exception register (breach, why, who accepted it, evidence link).',
    ],
    artefacts: [
      'RAG per deliverable.',
      'Decision log for accepted exceptions.',
      'Incident playbook + issue log.',
    ],
    signals: [
      '% caught by controls (vs stakeholders)',
      'Surprise incidents = 0',
      'Late dependency rate',
      'Unresolved REDs near deadline',
    ],
    failureModes: [
      'Risks in heads not registers.',
      'Issues reopened repeatedly.',
      "\"We'll explain it in committee.\"",
    ],
    whereItLives: [
      'Risk & dependency register reviewed as RCC agenda item in Channel I.',
      'Issue log and incidents routed via ICP in Channel II.',
      'Incident playbooks and recovery actions in Channel V (ORM).',
    ],
  },
  pillar9: {
    purpose:
      'Pre-wire, align, unblock  - joined-up delivery across Finance/Actuarial/Audit.',
    outcome:
      'Fewer late-stage fights because expectations and approval pathways are explicit.',
    nonNegotiables: [
      'Stakeholders know what you do (SDP), how to request it (ICP), and how it gets approved (RACI AP).',
      'Contentious items are pre-wired early (no committee ambushes).',
    ],
    mvpSetup: [
      'Stakeholder map: suppliers, consumers, approvers, SLAs/cut-offs.',
      'Queries log (audit/regulator/senior mgmt) with response SLA.',
    ],
    artefacts: [
      'Stakeholder register + RACI AP per deliverable.',
      'Dependency tracker for upstream inputs.',
      '"What changed and why" summaries linked to evidence.',
    ],
    signals: [
      'Missed dependencies',
      'Late sign-offs',
      'Rework due to unclear asks',
    ],
    failureModes: [
      'Side deals.',
      'Unmanaged expectations.',
      'Approvals by inbox archaeology.',
    ],
    whereItLives: [
      'Stakeholder register and RACI AP in Channel III (Delivery).',
      'Cross-team handoffs coordinated via CTI in Channel III.',
      'Dependency tracker and queries log in Lists.',
      '"What changed and why" summaries broadcast in Channel I (Noticeboard).',
    ],
  },
  pillar10: {
    purpose:
      'Build the tooling spine that supports fast-close without degrading controls.',
    outcome:
      'A pragmatic, supportable toolchain with clear ownership and upgrade pathway.',
    nonNegotiables: [
      'Tools serve the operating model (not the other way around).',
      'Monitoring and logging are part of "done".',
      'Changes to tech follow the same Approval Framework and evidence rules as numbers.',
    ],
    mvpSetup: [
      'Adopt the TOM tool mapping as your "default stack" (Teams, Lists, SharePoint, Planner, Power Automate, Power BI, Excel where needed).',
      'Channels I-V as the collaboration backbone (Noticeboard, ICP, Delivery, QACE, ORM).',
    ],
    artefacts: [
      'Tooling Upgrade Path (roadmap, owners, change windows).',
      'Integration map (what connects to what, where failures surface).',
      'Run monitoring checklist (what gets checked daily in close).',
    ],
    signals: [
      'Automation coverage',
      'Failure rate',
      'Mean time to recover',
      'Manual touchpoints removed',
    ],
    failureModes: [
      'Shadow tooling.',
      'Brittle one-off scripts.',
      '"It ran last month" as the test plan.',
    ],
    whereItLives: [
      'TUP (Tooling Upgrade Path) backlog in Channel III (Delivery).',
      'Automation run logs and monitoring in Channel III.',
      'Integration maps and run monitoring checklists in SharePoint.',
      'Channels I-V as the collaboration backbone across all pillars.',
    ],
  },
};

const sectionConfig = [
  {
    key: 'purpose' as const,
    label: 'Purpose',
    icon: Target,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    type: 'text',
  },
  {
    key: 'outcome' as const,
    label: 'Outcome',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    type: 'text',
  },
  {
    key: 'nonNegotiables' as const,
    label: 'Non-negotiables',
    icon: ShieldAlert,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    type: 'list',
  },
  {
    key: 'mvpSetup' as const,
    label: 'MVP Setup',
    icon: Rocket,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    type: 'list',
  },
  {
    key: 'artefacts' as const,
    label: 'Artefacts',
    icon: FileText,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    type: 'list',
  },
  {
    key: 'signals' as const,
    label: 'Signals (KPIs)',
    icon: BarChart3,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    type: 'badges',
  },
  {
    key: 'failureModes' as const,
    label: 'Failure Modes',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    type: 'list',
  },
  {
    key: 'whereItLives' as const,
    label: 'Where It Lives',
    icon: MapPin,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    type: 'list',
  },
];

interface PillarContentProps {
  pillarId: string;
  pillarName: string;
  pillarIcon: string;
  pillarColor: string;
  isMobile?: boolean;
}

export default function PillarContent({
  pillarId,
  pillarName,
  pillarIcon,
  pillarColor,
  isMobile = false,
}: PillarContentProps) {
  const [expanded, setExpanded] = useState(true);
  const content = PILLAR_CONTENT[pillarId];

  if (!content) return null;

  return (
    <Card className="border-l-4 mb-4" style={{ borderLeftColor: pillarColor }}>
      <div
        className={`flex items-center justify-between cursor-pointer ${isMobile ? 'px-3 py-2' : 'px-6 py-3'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{pillarIcon}</span>
          <div>
            <h2 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
              {pillarName}
            </h2>
            <p className="text-sm text-muted-foreground">{content.purpose}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <CardContent className={isMobile ? 'px-3 pb-3 pt-0' : 'px-6 pb-6 pt-0'}>
          <Separator className="mb-4" />

          {/* Outcome banner */}
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Outcome
                </span>
                <p className="text-sm text-emerald-900 dark:text-emerald-100 mt-0.5">
                  {content.outcome}
                </p>
              </div>
            </div>
          </div>

          {/* Accordion sections */}
          <Accordion
            type="multiple"
            defaultValue={['nonNegotiables', 'mvpSetup', 'artefacts', 'signals', 'failureModes', 'whereItLives']}
            className="space-y-2"
          >
            {sectionConfig
              .filter(
                (s) =>
                  s.key !== 'purpose' &&
                  s.key !== 'outcome'
              )
              .map((section) => {
                const value = content[section.key];
                if (
                  !value ||
                  (Array.isArray(value) && value.length === 0)
                )
                  return null;

                const Icon = section.icon;

                return (
                  <AccordionItem
                    key={section.key}
                    value={section.key}
                    className={`rounded-lg border ${section.bgColor} px-3`}
                  >
                    <AccordionTrigger className="hover:no-underline py-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${section.color}`} />
                        <span className={`text-sm font-medium ${section.color}`}>
                          {section.label}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pt-0">
                      {section.type === 'text' && typeof value === 'string' ? (
                        <p className="text-sm text-foreground/80 pl-6">
                          {value}
                        </p>
                      ) : section.type === 'badges' && Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-2 pl-6">
                          {value.map((item, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : Array.isArray(value) ? (
                        <ul className="space-y-1.5 pl-6">
                          {value.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-foreground/80 flex items-start gap-2"
                            >
                              <span className="text-muted-foreground mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-current" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Global operating-rule banner shown on the homepage / above pillar content.
 */
export function OperatingRuleBanner({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-border bg-card ${isMobile ? 'p-3 mb-3' : 'p-4 mb-5'}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Operating Rule
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            <strong>Lists</strong> = system-of-record &nbsp;|&nbsp;{' '}
            <strong>SharePoint</strong> = system-of-evidence &nbsp;|&nbsp;{' '}
            <strong>Teams</strong> = system-of-engagement
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Global footer with the punchline that ties the 10 pillars together.
 */
export function GlobalFooter({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-dashed border-border bg-muted/30 text-center ${isMobile ? 'p-3 mt-4' : 'p-4 mt-6'}`}
    >
      <p className="text-sm text-muted-foreground italic">
        Run an actuarial reporting production line that hits timetables, keeps
        quality tight, makes governance automatic, and sells the story upward
        with confidence.
      </p>
    </div>
  );
}
