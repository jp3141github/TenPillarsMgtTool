import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface TOMStage {
  id: number;
  code: string;
  name: string;
  purpose: string;
  hardOpinion?: string;
  mvpSetup: string;
  artefacts?: string;
  livesIn: string;
  tools: string;
  channel: string;
  channelNumber: string;
  subDomains?: { label: string; detail: string }[];
}

const CHANNEL_COLORS: Record<string, string> = {
  'I': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  'II': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'III': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'IV': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'V': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

const CHANNELS = [
  { number: 'I', name: 'Noticeboard (ABCD)', description: 'Exec-facing broadcast layer, the published truth with links out.' },
  { number: 'II', name: 'ICP', description: 'The only front door. If it isn\'t logged, it isn\'t real work.' },
  { number: 'III', name: 'Delivery', description: 'Production floor (Planner/tasks, blockers, WIP discipline).' },
  { number: 'IV', name: 'QACE', description: 'Controls and evidence. No "trust me bro".' },
  { number: 'V', name: 'ORM', description: 'Runbooks, recovery playbooks, "how to not die at close".' },
];

const TOM_STAGES: TOMStage[] = [
  {
    id: 1,
    code: 'ICP',
    name: 'Intake Control Point',
    purpose: 'Single front door. Stops drive-bys and forces prioritisation decisions into daylight.',
    hardOpinion: 'If ICP is porous, your "operating model" is fan-fiction.',
    mvpSetup: 'Teams channel + Forms \u2192 Lists. One Requests list with triage fields (urgency, decision, owner, due, status).',
    artefacts: 'Requests Register (and routing tags like "Incident", "Change", "Ad-hoc").',
    livesIn: 'Channel II',
    tools: 'Teams, Forms, Lists',
    channel: 'ICP',
    channelNumber: 'II',
  },
  {
    id: 2,
    code: 'SDP',
    name: 'Service Delivery Portfolio',
    purpose: 'The team\'s contracted scope (services, deliverables, cadence, consumers). Prevents "helpful to death".',
    mvpSetup: 'SharePoint page + Lists catalogue ("what we do", who for, when, SLA/cut-offs).',
    artefacts: 'Service catalogue, stakeholder map (light), comms rhythm anchored to RCC + Noticeboard.',
    livesIn: 'Channel III (surfaced/pinned), stored in SharePoint + Lists',
    tools: 'Lists, SharePoint',
    channel: 'Delivery',
    channelNumber: 'III',
  },
  {
    id: 3,
    code: 'DoD',
    name: 'Definition of Done',
    purpose: 'Quality gate. "Finished" does not mean "pressed run".',
    mvpSetup: 'DoD checklist per deliverable in Lists; evidence dropped into a SharePoint folder structure; manual tick-off is fine at MVP.',
    artefacts: 'DoD checklist, link to evidence pack, sign-off readiness flags.',
    livesIn: 'Channel IV (because DoD without evidence is theatre)',
    tools: 'Lists, SharePoint',
    channel: 'QACE',
    channelNumber: 'IV',
  },
  {
    id: 4,
    code: 'RACI AP',
    name: 'RACI + Approval Pathway',
    purpose: 'Ownership + the route to signature. Removes "someone should review this" limbo.',
    mvpSetup: 'Lists-based RACI per deliverable (Responsible/Accountable/Consulted/Informed + approver), with sign-off recorded (who/when).',
    artefacts: 'RACI matrix, sign-off log.',
    livesIn: 'Channel III (operationally used daily)',
    tools: 'Lists',
    channel: 'Delivery',
    channelNumber: 'III',
    subDomains: [
      {
        label: 'Change Management',
        detail: 'Change Log in Lists with impact assessment fields (downstream affected, rerun Y/N, control impact, approver, effective run) and evidence links.',
      },
    ],
  },
  {
    id: 5,
    code: 'QACE',
    name: 'QA Controls Evidence',
    purpose: 'Controls framework plus the evidence bundle proving it happened. Audit-ready by default.',
    mvpSetup: 'Controls register in Lists; evidence files in SharePoint; Excel only where it\'s the tool. Pass/Warn/Fail outcomes visible.',
    artefacts: 'Control checklist + outputs, reconciliations, tolerances, remediation notes, links to decision log.',
    livesIn: 'Channel IV',
    tools: 'Lists, SharePoint, Excel',
    channel: 'QACE',
    channelNumber: 'IV',
  },
  {
    id: 6,
    code: 'ORM',
    name: 'Operational Run Manual',
    purpose: 'Runbooks that make delivery repeatable, trainable, resilient. Reduces key-person risk.',
    mvpSetup: 'SharePoint "runbook pages" per process: inputs, steps, outputs, failure modes, escalation, recovery actions.',
    livesIn: 'Channel V',
    tools: 'SharePoint',
    channel: 'ORM',
    channelNumber: 'V',
    subDomains: [
      {
        label: 'Knowledge Management',
        detail: 'A structured knowledge spine (ORM + IOR + QACE patterns + AL interpretation + "known weirdness"). Golden-source rule + tagging.',
      },
      {
        label: 'Incident Management',
        detail: 'Incident playbook + severity model; Issue Log in Lists; incidents routed via ICP with fast tagging.',
      },
    ],
  },
  {
    id: 7,
    code: 'IOR',
    name: 'I/O Register',
    purpose: 'Data lineage with teeth: what came in, from where, owned by whom, versioned when, what went out.',
    mvpSetup: 'Lists register: input name, owner, location, cadence, version stamp, output consumers.',
    livesIn: 'Channel III',
    tools: 'Lists',
    channel: 'Delivery',
    channelNumber: 'III',
    subDomains: [
      {
        label: 'Risk Management',
        detail: 'Risk & Dependency Register in Lists (risk, RAG, trigger, mitigation, owner, due) reviewed as RCC agenda item; escalation rule for RED near deadline.',
      },
    ],
  },
  {
    id: 8,
    code: 'WPM',
    name: 'Workflow Process Maps',
    purpose: 'Visual end-to-end process maps, handoffs, control points. Makes complexity visible and debateable.',
    mvpSetup: 'Visio or PowerPoint maps stored in SharePoint, findable, versioned. That\'s the MVP bar.',
    artefacts: 'End-to-end maps + swimlanes, control points, handoff definitions.',
    livesIn: 'Channel V',
    tools: 'SharePoint, Visio, PowerPoint',
    channel: 'ORM',
    channelNumber: 'V',
  },
  {
    id: 9,
    code: 'RCC',
    name: 'Review & Control Cycle',
    purpose: 'Governance cadence that forces issues to surface early, not at deadline.',
    mvpSetup: 'Teams meeting series + minutes captured (Loop/OneNote) + actions written down.',
    artefacts: 'Meeting minutes, action log, review cadence schedule.',
    livesIn: 'Channel I (executive-facing control)',
    tools: 'Teams, Loop, OneNote',
    channel: 'Noticeboard',
    channelNumber: 'I',
    subDomains: [
      {
        label: 'Governance Scope',
        detail: 'Change review, risk review, incident oversight, stakeholder snapshot rhythm, retro timing.',
      },
    ],
  },
  {
    id: 10,
    code: 'PR',
    name: 'Performance Radar',
    purpose: 'Small set of operational indicators that tells you if delivery is healthy (not vibes).',
    mvpSetup: 'Basic KPI cockpit in Power BI or Excel (5\u201310 metrics).',
    artefacts: 'Timeliness, defects/rework, late changes, reruns, bottlenecks by stage.',
    livesIn: 'Channel I (broadcast)',
    tools: 'Power BI, Excel',
    channel: 'Noticeboard',
    channelNumber: 'I',
  },
  {
    id: 11,
    code: 'Automation',
    name: 'Automation',
    purpose: 'Remove repeatable manual effort with controls, logging, monitoring \u2014 speed up without breaking governance.',
    mvpSetup: 'Power Automate "lite": Forms \u2192 Lists (optionally post to Teams). Build the control skeleton first.',
    artefacts: 'Run logs, rerun tracking, automated notifications, basic monitoring hooks.',
    livesIn: 'Channel III',
    tools: 'Teams, Forms, Lists, Power Automate',
    channel: 'Delivery',
    channelNumber: 'III',
  },
  {
    id: 12,
    code: 'TUP',
    name: 'Tooling Upgrade Path',
    purpose: 'Controlled roadmap for improving tools/infrastructure without breaking production.',
    mvpSetup: 'Planner board for tooling upgrades with owners and statuses.',
    artefacts: 'Backlog, sequencing, dependencies, release notes per upgrade.',
    livesIn: 'Channel III',
    tools: 'Planner',
    channel: 'Delivery',
    channelNumber: 'III',
  },
  {
    id: 13,
    code: 'AL',
    name: 'Analytics Layer',
    purpose: 'Turns outputs into decision-grade insight (movement, drivers, "so what").',
    mvpSetup: 'Analysis outputs stored centrally in SharePoint with versioning and a clear "current" folder.',
    artefacts: 'Movement commentary, MI pack outputs, interpretive notes linked into ORM knowledge spine.',
    livesIn: 'Channel III',
    tools: 'SharePoint, Excel',
    channel: 'Delivery',
    channelNumber: 'III',
  },
  {
    id: 14,
    code: 'CTI',
    name: 'Cross-Team Integration',
    purpose: 'Operating contract with adjacent teams (Finance etc.) \u2014 prevents handoff chaos becoming a monthly sport.',
    mvpSetup: 'Shared dependency list + Teams shared channel for cross-team asks and handoffs.',
    artefacts: 'Dependency tracker, SLAs/cut-offs, escalation path, "definitions" page for disputed numbers.',
    livesIn: 'Channel III',
    tools: 'Teams, Lists',
    channel: 'Delivery',
    channelNumber: 'III',
  },
  {
    id: 15,
    code: 'CIP',
    name: 'CI Pipeline',
    purpose: 'Continuous improvement that doesn\'t rely on heroics (capture, size, implement safely, measure).',
    mvpSetup: 'Improvements backlog in Lists + retro cadence ("Close +7 days") + weekly grooming (Now/Next/Parked).',
    artefacts: 'Improvements register, retro actions log.',
    livesIn: 'Channel I (visibility + accountability)',
    tools: 'Lists',
    channel: 'Noticeboard',
    channelNumber: 'I',
    subDomains: [
      {
        label: 'Control Hook',
        detail: '"No retro \u2192 no green on PR". Forces the behaviour loop.',
      },
    ],
  },
];

interface TOMSectionProps {
  onOpenChannel?: (channelNumber: string) => void;
}

export default function TOMSection({ onOpenChannel }: TOMSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Target Operating Model (TOM)</h2>
        <p className="text-muted-foreground mt-1">Level 1 MVP &mdash; 15-stage implementation checklist</p>
      </div>

      {/* Operating Rules */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Operating Rules (Non-Negotiable)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Badge variant="outline" className="shrink-0 h-6">Lists</Badge>
            <span className="text-muted-foreground">System-of-record</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="shrink-0 h-6">SharePoint</Badge>
            <span className="text-muted-foreground">System-of-evidence</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="shrink-0 h-6">Teams</Badge>
            <span className="text-muted-foreground">System-of-engagement</span>
          </div>
          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
            Everything else is plumbing.
          </p>
        </CardContent>
      </Card>

      {/* MVP Goal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Level 1 MVP Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            One front door, one register, one task board, one evidence home &mdash;
            kill drive-bys, kill lost work, kill undocumented sign-off.
          </p>
        </CardContent>
      </Card>

      {/* Channel Layout */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Teams Channel Layout</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map(ch => (
            <Card
              key={ch.number}
              className="relative overflow-hidden cursor-pointer transition-shadow hover:shadow-md hover:ring-1 hover:ring-primary/30"
              onClick={() => onOpenChannel?.(ch.number)}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${CHANNEL_COLORS[ch.number]?.split(' ')[0] || 'bg-primary'}`} />
              <CardContent className="pt-4 pl-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={CHANNEL_COLORS[ch.number]}>
                    {ch.number}
                  </Badge>
                  <span className="font-semibold text-sm text-foreground">{ch.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{ch.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm italic text-muted-foreground mt-3">
          ABCD = Approved / Blocked / Changed / Delivered
        </p>
      </div>

      {/* 15 Stages */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">The 15 Stages</h3>
        <Accordion type="multiple" className="space-y-3">
          {TOM_STAGES.map(stage => (
            <AccordionItem
              key={stage.id}
              value={`stage-${stage.id}`}
              className="border rounded-lg px-0 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {stage.id}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-semibold text-sm text-foreground">
                      {stage.code} &mdash; {stage.name}
                    </span>
                    <Badge className={`${CHANNEL_COLORS[stage.channelNumber]} text-[10px] shrink-0`}>
                      Ch {stage.channelNumber}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4 text-sm">
                  {/* Purpose */}
                  <div>
                    <span className="font-semibold text-foreground">Purpose:</span>{' '}
                    <span className="text-muted-foreground">{stage.purpose}</span>
                  </div>

                  {/* Hard Opinion */}
                  {stage.hardOpinion && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-xs italic text-foreground">
                      {stage.hardOpinion}
                    </div>
                  )}

                  {/* MVP Setup */}
                  <div>
                    <span className="font-semibold text-foreground">MVP Setup:</span>{' '}
                    <span className="text-muted-foreground">{stage.mvpSetup}</span>
                  </div>

                  {/* Artefacts */}
                  {stage.artefacts && (
                    <div>
                      <span className="font-semibold text-foreground">Artefacts:</span>{' '}
                      <span className="text-muted-foreground">{stage.artefacts}</span>
                    </div>
                  )}

                  {/* Sub-domains */}
                  {stage.subDomains && stage.subDomains.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      {stage.subDomains.map((sub, i) => (
                        <div key={i}>
                          <span className="font-semibold text-foreground">{sub.label}:</span>{' '}
                          <span className="text-muted-foreground">{sub.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <Badge variant="secondary" className="text-[10px]">{stage.livesIn}</Badge>
                    <Badge variant="outline" className="text-[10px]">{stage.tools}</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 6 Pillars mapping note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">How this maps to the 10 Pillars:</span>{' '}
            The Pillars are the operating priorities ("why / what good looks like") and the 15-stage TOM is the implementation
            checklist ("how it runs day-to-day"). The pillar write-up calls these out explicitly as "MVP control levers (TOM hooks)".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
