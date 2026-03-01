import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ArrowLeft, Rocket, Clock, CheckCircle2 } from 'lucide-react';

interface TeamsSetupGuideProps {
  onClose: () => void;
  isMobile?: boolean;
}

const WEEK1_STEPS = [
  'Moderate Noticeboard (owners post only). Keep it signal, not chat.',
  'Pin one "How to use this channel" post in each channel + the relevant template from the Guide panel.',
  'Adopt the single ID convention (ICP-0001\u2026) from day one.',
  'One thread per ICP item in Delivery (no orphan conversations).',
  'When a decision / blocker / change / delivery happens, post exactly one ABCD update in Noticeboard with links.',
];

const CADENCE = [
  {
    label: 'Daily (5 mins)',
    detail: 'ICP triage \u2192 update Delivery threads \u2192 post Noticeboard only if A/B/C/D-worthy.',
  },
  {
    label: 'Weekly (15 mins)',
    detail: 'Prune stale ICP items, confirm owners, update ORM for anything that broke twice.',
  },
];

export default function TeamsSetupGuide({ onClose, isMobile }: TeamsSetupGuideProps) {
  return (
    <div
      className={`flex flex-col h-full bg-background ${isMobile ? 'w-full' : 'border-l border-border'}`}
      style={isMobile ? undefined : { width: 420 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary/40 bg-card">
        <div className="flex items-center gap-2 min-w-0">
          {isMobile ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 -ml-2 mr-1 gap-1">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Button>
          ) : null}
          <Rocket className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-sm text-foreground">Getting Started</span>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 ml-2">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 text-sm">
          {/* Week-1 setup */}
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Week-1 setup steps
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Simple but effective — do these in your first week to set the channels up properly.</p>
            <ol className="space-y-2.5 list-none">
              {WEEK1_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-foreground/90 leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Cadence */}
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              Cadence (so it actually runs)
            </h3>
            <div className="space-y-3">
              {CADENCE.map((item, i) => (
                <div key={i} className="rounded-md border border-border bg-muted/30 p-3">
                  <p className="font-semibold text-foreground text-xs mb-1">{item.label}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
            <p className="text-foreground/80 text-xs italic leading-relaxed">
              This gives you a controlled comms stack: <strong>ICP</strong> = intake, <strong>Delivery</strong> = execution, <strong>QACE</strong> = proof, <strong>ORM</strong> = resilience, <strong>Noticeboard</strong> = narrative.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
