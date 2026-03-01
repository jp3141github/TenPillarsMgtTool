import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ArrowLeft, Hash, BookOpen, ChevronDown, ChevronUp, FileText, ListChecks, Clock } from 'lucide-react';
import { ChannelInfo } from '@/lib/types';
import { CHANNEL_GUIDES, CHANNEL_COLORS } from './TeamsChannelChat';

const CHANNELS: ChannelInfo[] = [
  { number: 'I', name: 'Noticeboard (ABCD)', description: 'Exec-facing broadcast layer' },
  { number: 'II', name: 'ICP', description: 'The only front door' },
  { number: 'III', name: 'Delivery', description: 'Production floor' },
  { number: 'IV', name: 'QACE', description: 'Controls and evidence' },
  { number: 'V', name: 'ORM', description: 'Runbooks and recovery' },
];

const CHANNEL_BORDER_COLORS: Record<string, string> = {
  'I': 'border-l-violet-500',
  'II': 'border-l-blue-500',
  'III': 'border-l-emerald-500',
  'IV': 'border-l-amber-500',
  'V': 'border-l-rose-500',
};

interface TeamsAllGuidesProps {
  onClose: () => void;
  isMobile?: boolean;
  onOpenChannel?: (channelNumber: string) => void;
}

export default function TeamsAllGuides({ onClose, isMobile, onOpenChannel }: TeamsAllGuidesProps) {
  const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({ 'I': true });

  const toggleChannel = (number: string) => {
    setExpandedChannels(prev => ({ ...prev, [number]: !prev[number] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    CHANNELS.forEach(ch => { all[ch.number] = true; });
    setExpandedChannels(all);
  };

  const collapseAll = () => {
    setExpandedChannels({});
  };

  return (
    <div className={`flex flex-col h-full bg-background ${isMobile ? 'w-full' : 'border-l border-border'}`} style={isMobile ? undefined : { width: 480 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-card">
        <div className="flex items-center gap-2 min-w-0">
          {isMobile ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 -ml-2 mr-1 gap-1">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Button>
          ) : null}
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-sm text-foreground">Channel Guides</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={expandAll} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
            Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
            Collapse all
          </Button>
          {!isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 ml-1">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable guides content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {CHANNELS.map(ch => {
            const guide = CHANNEL_GUIDES[ch.number];
            if (!guide) return null;
            const isExpanded = expandedChannels[ch.number] || false;

            return (
              <div key={ch.number} className={`rounded-lg border border-border bg-card overflow-hidden border-l-4 ${CHANNEL_BORDER_COLORS[ch.number]}`}>
                {/* Channel header - clickable to expand/collapse */}
                <button
                  onClick={() => toggleChannel(ch.number)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <Badge className={`${CHANNEL_COLORS[ch.number]} shrink-0 text-[10px]`}>{ch.number}</Badge>
                    <span className="text-sm font-semibold text-foreground truncate">{ch.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenChannel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); onOpenChannel(ch.number); }}
                      >
                        Open channel
                      </Button>
                    )}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded guide content */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 text-xs border-t border-border/50 pt-3">
                    {/* Purpose */}
                    <div>
                      <p className="font-semibold text-foreground mb-1">Purpose</p>
                      <p className="text-muted-foreground leading-relaxed">{guide.purpose}</p>
                    </div>

                    {/* Tip */}
                    <div className="rounded-md bg-primary/5 border border-primary/20 p-2.5">
                      <p className="text-foreground/80 italic leading-relaxed">{guide.tip}</p>
                    </div>

                    {/* What goes here */}
                    <div>
                      <p className="font-semibold text-foreground mb-1">What goes here</p>
                      <ul className="space-y-1">
                        {guide.whatGoesHere.map((item, i) => (
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
                        {guide.whatDoesNotGoHere.map((item, i) => (
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
                        {guide.keyArtefacts.map((item, i) => (
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
                        {guide.tomStages.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* How to use divider */}
                    <div className="border-t border-border/50 pt-3">
                      <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        How to use this channel
                      </p>
                    </div>

                    {/* Post template */}
                    <div>
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        Post template
                      </p>
                      <div className="rounded-md bg-muted/50 border border-border p-2.5 space-y-0.5 font-mono">
                        {guide.postTemplate.map((line, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>

                    {/* Setup steps */}
                    <div>
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <ListChecks className="w-3 h-3 text-muted-foreground" />
                        Setup steps
                      </p>
                      <ol className="space-y-1 list-none">
                        {guide.setupSteps.map((step, i) => (
                          <li key={i} className="text-muted-foreground flex items-start gap-1.5">
                            <span className="text-blue-500 font-semibold shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Cadence */}
                    <div>
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        Cadence
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{guide.cadence}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
