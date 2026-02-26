import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Stage {
  id: number;
  code: string;
  name: string;
  description: string;
  output: string;
}

const STAGES: Stage[] = [
  { id: 1, code: 'ICP', name: 'Intake Control Point', description: 'Single front door for work; triage, prioritise, log, route', output: 'Intake log + priority queue' },
  { id: 2, code: 'SDP', name: 'Service Delivery Portfolio', description: 'Defines what the team delivers, when, and to what standard', output: 'Service catalogue + cadence' },
  { id: 3, code: 'DoD', name: 'Definition of Done', description: 'Sets the completion contract (checks, reviews, evidence)', output: 'DoD checklist per deliverable' },
  { id: 4, code: 'RACI AP', name: 'RACI + Approval Pathway', description: 'Clarifies ownership + who signs what, in what order', output: 'Approval map + escalation path' },
  { id: 5, code: 'QACE', name: 'QA Controls Evidence', description: 'Controls framework + evidence bundle for audit', output: 'Control pack + evidence links' },
  { id: 6, code: 'ORM', name: 'Operational Run Manual', description: 'Step-by-step runbook: dependencies, timing, failure modes', output: 'Runbook + exception playbooks' },
  { id: 7, code: 'IOR', name: 'I/O Register', description: 'Data lineage ledger: inputs - transforms - outputs', output: 'Traceability register (data lineage)' },
  { id: 8, code: 'WPM', name: 'Workflow Process Maps', description: 'End-to-end flow diagrams: stages, handoffs, queues', output: 'Process maps + handoff definitions' },
  { id: 9, code: 'RCC', name: 'Review & Control Cycle', description: 'Governance cadence: plan - review - controls - sign-off - retro', output: 'Calendar + gate checklist' },
  { id: 10, code: 'PR', name: 'Performance Radar', description: 'High-signal KPIs: timeliness, quality, rework, throughput', output: 'KPI dashboard + thresholds' },
  { id: 11, code: 'Automation', name: 'Automation', description: 'Removes repeatable manual work; adds monitoring/logging', output: 'Automated steps + run logs' },
  { id: 12, code: 'TUP', name: 'Tooling Upgrade Path', description: 'Roadmap for toolchain upgrades; manages tech debt', output: 'Sequenced upgrade roadmap' },
  { id: 13, code: 'AL', name: 'Analytics Layer', description: 'Standard metrics + variance/driver views for decisions', output: 'Curated dataset + insights views' },
  { id: 14, code: 'CTI', name: 'Cross-Team Integration', description: 'Contracts with other teams: definitions, calendars, handoffs', output: 'Interface agreements + dependency map' },
  { id: 15, code: 'CIP', name: 'CI Pipeline', description: 'Structured continuous improvement: capture - prioritise - ship - measure', output: 'Change backlog + release cycle' },
];

interface StagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StagesModal({ open, onOpenChange }: StagesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">The 15 Stages</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1 -mx-1 px-1">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b-2 border-border">
                <th className="text-right pr-3 py-2 text-muted-foreground font-semibold w-8">#</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-semibold whitespace-nowrap">Artifact</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-semibold">What it does (in plain English)</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-semibold whitespace-nowrap">Primary output</th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map((stage) => (
                <tr
                  key={stage.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="text-right pr-3 py-2.5 text-muted-foreground font-mono tabular-nums">
                    {stage.id}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                    {stage.code} - {stage.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {stage.description}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                    {stage.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
