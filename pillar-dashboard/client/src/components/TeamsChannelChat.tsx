import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Hash, ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ChannelMessage, ChannelInfo } from '@/lib/types';

const CHANNEL_COLORS: Record<string, string> = {
  'I': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  'II': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'III': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'IV': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'V': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

const CHANNEL_ACCENT: Record<string, string> = {
  'I': 'border-violet-400 dark:border-violet-600',
  'II': 'border-blue-400 dark:border-blue-600',
  'III': 'border-emerald-400 dark:border-emerald-600',
  'IV': 'border-amber-400 dark:border-amber-600',
  'V': 'border-rose-400 dark:border-rose-600',
};

interface ChannelGuide {
  purpose: string;
  whatGoesHere: string[];
  whatDoesNotGoHere: string[];
  keyArtefacts: string[];
  tomStages: string[];
  tip: string;
}

const CHANNEL_GUIDES: Record<string, ChannelGuide> = {
  'I': {
    purpose: 'The exec-facing broadcast layer. This is the published truth - the single place leadership looks to understand what is Approved, Blocked, Changed, or Delivered (ABCD). Everything here links out to evidence; nothing lives only in this channel.',
    whatGoesHere: [
      'ABCD status posts: tag every update as Approved, Blocked, Changed, or Delivered.',
      'Weekly exec summary and exceptions tracker.',
      'RCC (Review & Control Cycle) minutes and action summaries.',
      'KPI snapshots from the Performance Radar (PR).',
      'CIP (Continuous Improvement Pipeline) visibility updates.',
      'Committee pack links and change posts with approval evidence.',
    ],
    whatDoesNotGoHere: [
      'Detailed technical discussion - use Channel III (Delivery).',
      'Work requests or intake - use Channel II (ICP).',
      'Raw evidence files - store in SharePoint, link from here.',
      'Debugging or blocker resolution threads.',
    ],
    keyArtefacts: [
      'Committee pack template',
      'Weekly exec summary',
      'Exceptions tracker',
      'Change posts linked to Approval Framework',
    ],
    tomStages: ['RCC (Review & Control Cycle)', 'PR (Performance Radar)', 'CIP (CI Pipeline)'],
    tip: 'ABCD = Approved / Blocked / Changed / Delivered. Every post should be tagged with one of these statuses. If leadership needs to know it, it goes here. If they don\'t, it doesn\'t.',
  },
  'II': {
    purpose: 'The only front door for work requests. If it isn\'t logged here, it isn\'t real work. This channel stops drive-bys and forces prioritisation decisions into daylight. Every request gets triaged, assigned, and tracked.',
    whatGoesHere: [
      'All new work requests (via Forms or direct post).',
      'Triage decisions: urgency, owner, due date, status.',
      'Request routing tags: Incident, Change, Ad-hoc.',
      'Intake status updates (accepted, deferred, rejected with reason).',
    ],
    whatDoesNotGoHere: [
      'Delivery updates or task progress - use Channel III.',
      'Evidence and controls - use Channel IV (QACE).',
      'Exec-facing summaries - use Channel I (Noticeboard).',
      'Informal requests via DM (redirect them here).',
    ],
    keyArtefacts: [
      'Requests Register (Lists)',
      'Triage fields: urgency, decision, owner, due, status',
      'Routing tags (Incident / Change / Ad-hoc)',
    ],
    tomStages: ['ICP (Intake Control Point)'],
    tip: 'If ICP is porous, your operating model is fan-fiction. Every piece of work enters through this door - no exceptions. This is how you kill drive-bys and invisible work.',
  },
  'III': {
    purpose: 'The production floor. This is where work gets done - tasks are tracked, blockers are surfaced, WIP discipline is enforced. Planner boards, delivery updates, and day-to-day operational coordination all live here.',
    whatGoesHere: [
      'Delivery board updates (Planner): owners, due dates, blockers, WIP.',
      'Service Delivery Portfolio (SDP): what the team does, for whom, when.',
      'RACI + Approval Pathway: who owns what, who signs off.',
      'I/O Register (IOR): data inputs/outputs, versions, lineage.',
      'Automation updates and run logs.',
      'Tooling Upgrade Path (TUP) progress.',
      'Analytics Layer (AL) outputs and commentary.',
      'Cross-Team Integration (CTI) handoff coordination.',
    ],
    whatDoesNotGoHere: [
      'Exec-facing summaries - promote to Channel I when ready.',
      'New work requests - redirect to Channel II (ICP).',
      'Evidence packs and control results - use Channel IV (QACE).',
      'Runbooks and playbooks - use Channel V (ORM).',
    ],
    keyArtefacts: [
      'Delivery board (Planner)',
      'Service catalogue',
      'RACI matrix + sign-off log',
      'I/O Register',
      'Run log + submission manifest',
    ],
    tomStages: ['SDP (Service Delivery Portfolio)', 'RACI AP (RACI + Approval Pathway)', 'IOR (I/O Register)', 'Automation', 'TUP (Tooling Upgrade Path)', 'AL (Analytics Layer)', 'CTI (Cross-Team Integration)'],
    tip: 'This is the busiest channel. WIP discipline is key - finish before starting more. If a task is blocked, surface it here immediately so it can be resolved.',
  },
  'IV': {
    purpose: 'Controls and evidence. No "trust me bro." This channel is where you prove that work was done correctly - controls were run, evidence was stored, quality gates were passed. Audit-ready by default, not by scramble.',
    whatGoesHere: [
      'QACE (QA Controls Evidence): control register results, pass/warn/fail.',
      'DoD (Definition of Done) checklist completions with evidence links.',
      'Reconciliations and movement explanations.',
      'Control checklist results and remediation notes.',
      'Decision/change log entries: what changed, why, who approved.',
      'Evidence pack links (stored in SharePoint).',
    ],
    whatDoesNotGoHere: [
      'Task delivery updates - use Channel III.',
      'New requests - use Channel II (ICP).',
      'Exec summaries - use Channel I (Noticeboard).',
      'Process documentation - use Channel V (ORM).',
    ],
    keyArtefacts: [
      'Controls register (Lists)',
      'DoD checklists per deliverable',
      'Evidence packs (SharePoint)',
      'Reconciliation results',
      'Decision/change log',
    ],
    tomStages: ['DoD (Definition of Done)', 'QACE (QA Controls Evidence)'],
    tip: '"Done" means DoD met, controls run, evidence stored, and approval recorded. If any of those are missing, it isn\'t done. Sign-off via chat alone is a failure mode.',
  },
  'V': {
    purpose: 'Runbooks, recovery playbooks, and operational knowledge. This is "how to not die at close" - the documentation that makes delivery repeatable, trainable, and resilient. Reduces key-person risk by getting knowledge out of heads and into structured pages.',
    whatGoesHere: [
      'ORM (Operational Run Manual): runbook pages per process.',
      'WPM (Workflow Process Maps): end-to-end process maps and swimlanes.',
      'Knowledge management: known issues, interpretation guides, "known weirdness."',
      'Incident playbooks: severity model, escalation paths, recovery actions.',
      'Failure modes and escalation procedures.',
      'Onboarding materials and training references.',
    ],
    whatDoesNotGoHere: [
      'Live delivery updates - use Channel III.',
      'Control results and evidence - use Channel IV (QACE).',
      'Work requests - use Channel II (ICP).',
      'Status broadcasts - use Channel I (Noticeboard).',
    ],
    keyArtefacts: [
      'Runbook pages (SharePoint)',
      'Process maps (Visio/PowerPoint)',
      'Incident playbook + severity model',
      'Knowledge spine (ORM + IOR + QACE patterns)',
    ],
    tomStages: ['ORM (Operational Run Manual)', 'WPM (Workflow Process Maps)'],
    tip: 'If only one person knows how to do something, that\'s a risk, not a strength. Every critical process should have a runbook here that someone else can follow.',
  },
};

interface TeamsChannelChatProps {
  channel: ChannelInfo;
  messages: ChannelMessage[];
  onSendMessage: (channelNumber: string, text: string) => void;
  onClose: () => void;
  isMobile?: boolean;
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function TeamsChannelChat({ channel, messages, onSendMessage, onClose, isMobile }: TeamsChannelChatProps) {
  const [draft, setDraft] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    // Focus input on open
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(channel.number, text);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background ${isMobile ? 'w-full' : 'border-l border-border'}`} style={isMobile ? undefined : { width: 420 }}>
      {/* Channel Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 ${CHANNEL_ACCENT[channel.number] || 'border-border'} bg-card`}>
        <div className="flex items-center gap-2 min-w-0">
          {isMobile ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 -ml-2 mr-1 gap-1">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Button>
          ) : null}
          <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
          <Badge className={`${CHANNEL_COLORS[channel.number]} shrink-0`}>{channel.number}</Badge>
          <span className="font-semibold text-sm text-foreground truncate">{channel.name}</span>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 ml-2">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Channel description + help guide toggle */}
      <div className="bg-muted/30 border-b border-border">
        <div className="px-4 py-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground flex-1">{channel.description}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="shrink-0 gap-1 h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showGuide ? 'Hide' : 'Guide'}
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
        </div>

        {/* Expandable help guide */}
        {showGuide && CHANNEL_GUIDES[channel.number] && (
          <div className="px-4 pb-3 space-y-3 text-xs border-t border-border/50 pt-3">
            {/* Purpose */}
            <div>
              <p className="font-semibold text-foreground mb-1">Purpose</p>
              <p className="text-muted-foreground leading-relaxed">{CHANNEL_GUIDES[channel.number].purpose}</p>
            </div>

            {/* Tip / key concept */}
            <div className="rounded-md bg-primary/5 border border-primary/20 p-2.5">
              <p className="text-foreground/80 italic leading-relaxed">{CHANNEL_GUIDES[channel.number].tip}</p>
            </div>

            {/* What goes here */}
            <div>
              <p className="font-semibold text-foreground mb-1">What goes here</p>
              <ul className="space-y-1">
                {CHANNEL_GUIDES[channel.number].whatGoesHere.map((item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-1 shrink-0">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What does NOT go here */}
            <div>
              <p className="font-semibold text-foreground mb-1">What does NOT go here</p>
              <ul className="space-y-1">
                {CHANNEL_GUIDES[channel.number].whatDoesNotGoHere.map((item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-1.5">
                    <span className="text-red-400 mt-1 shrink-0">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key artefacts */}
            <div>
              <p className="font-semibold text-foreground mb-1">Key artefacts</p>
              <div className="flex flex-wrap gap-1">
                {CHANNEL_GUIDES[channel.number].keyArtefacts.map((item, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* TOM stages */}
            <div>
              <p className="font-semibold text-foreground mb-1">TOM stages in this channel</p>
              <div className="flex flex-wrap gap-1">
                {CHANNEL_GUIDES[channel.number].tomStages.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Hash className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start the conversation in #{channel.name}
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="group flex gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {msg.author.charAt(0).toUpperCase()}
                </div>
                {/* Message body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">{msg.author}</span>
                    <span className="text-[10px] text-muted-foreground">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel.name}...`}
            className="flex-1 text-sm"
          />
          <Button size="sm" onClick={handleSend} disabled={!draft.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
