import { Pillar, DashboardData, ChannelInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Hash, Rocket, BookOpen } from 'lucide-react';
import PillarChart from './PillarChart';
import { renderWithAbcd } from './AbcdTooltip';

const SIDEBAR_CHANNELS: ChannelInfo[] = [
  { number: 'I', name: 'Noticeboard (ABCD)', description: 'Exec-facing broadcast layer' },
  { number: 'II', name: 'ICP', description: 'The only front door' },
  { number: 'III', name: 'Delivery', description: 'Production floor' },
  { number: 'IV', name: 'QACE', description: 'Controls and evidence' },
  { number: 'V', name: 'ORM', description: 'Runbooks and recovery' },
];

const SIDEBAR_CHANNEL_COLORS: Record<string, string> = {
  'I': 'text-violet-600 dark:text-violet-400',
  'II': 'text-blue-600 dark:text-blue-400',
  'III': 'text-emerald-600 dark:text-emerald-400',
  'IV': 'text-amber-600 dark:text-amber-400',
  'V': 'text-rose-600 dark:text-rose-400',
};

const SIDEBAR_CHANNEL_ACTIVE: Record<string, string> = {
  'I': 'bg-violet-500/10 border-violet-500',
  'II': 'bg-blue-500/10 border-blue-500',
  'III': 'bg-emerald-500/10 border-emerald-500',
  'IV': 'bg-amber-500/10 border-amber-500',
  'V': 'bg-rose-500/10 border-rose-500',
};

interface SidebarProps {
  pillars: Pillar[];
  currentPillar: string | null;
  onSelectPillar: (id: string) => void;
  totalPillars: number;
  totalLists: number;
  totalRows: number;
  dashboardData?: DashboardData;
  activeView?: 'pillars' | 'tom' | 'corporate';
  onSelectView?: (view: 'pillars' | 'tom' | 'corporate') => void;
  openChannelNumber?: string | null;
  onOpenChannel?: (channelNumber: string) => void;
  onShowStages?: () => void;
  showSetupGuide?: boolean;
  onShowSetupGuide?: () => void;
  showAllGuides?: boolean;
  onShowAllGuides?: () => void;
}

export default function Sidebar({
  pillars,
  currentPillar,
  onSelectPillar,
  totalPillars,
  totalLists,
  totalRows,
  dashboardData,
  activeView = 'pillars',
  onSelectView,
  openChannelNumber,
  onOpenChannel,
  onShowStages,
  showSetupGuide,
  onShowSetupGuide,
  showAllGuides,
  onShowAllGuides,
}: SidebarProps) {
  return (
    <div className="w-72 h-full bg-card border-r border-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            📊
          </div>
          <h1 className="font-semibold text-foreground">Pillar Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-muted p-2 rounded">
            <div className="font-bold text-primary">{totalPillars}</div>
            <div className="text-muted-foreground">Pillars</div>
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="font-bold text-primary">{totalLists}</div>
            <div className="text-muted-foreground">Lists</div>
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="font-bold text-primary">{totalRows}</div>
            <div className="text-muted-foreground">Rows</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 tracking-wider">
            Pillars
          </div>
          <nav className="space-y-1">
            {pillars.map(pillar => (
              <button
                key={pillar.id}
                onClick={() => { onSelectPillar(pillar.id); onSelectView?.('pillars'); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeView === 'pillars' && currentPillar === pillar.id
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span className="text-lg">{pillar.icon}</span>
                <span className="flex-1 text-left truncate">{pillar.name}</span>
              </button>
            ))}
          </nav>

          {/* TOM Section */}
          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 mt-4 tracking-wider border-t border-border pt-3">
            Operating Model
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView?.('tom')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                activeView === 'tom'
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <span className="text-lg">🏗️</span>
              <span className="flex-1 text-left truncate">TOM (15 Stages)</span>
            </button>
            <button
              onClick={() => onShowStages?.()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-foreground hover:bg-muted"
            >
              <span className="text-lg">📋</span>
              <span className="flex-1 text-left truncate">15 Stages Quick View</span>
            </button>
          </nav>

          {/* Corporate Mode */}
          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 mt-4 tracking-wider border-t border-border pt-3">
            Corporate
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView?.('corporate')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                activeView === 'corporate'
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <span className="text-lg">🏢</span>
              <span className="flex-1 text-left truncate">Corporate Mode</span>
            </button>
          </nav>

          {/* Teams Channels */}
          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 mt-4 tracking-wider border-t border-border pt-3">
            Teams Channels
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onShowSetupGuide?.()}
              className={cn(
                'w-full flex items-start gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors mb-1',
                showSetupGuide
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Rocket className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
              <div className="flex-1 text-left min-w-0">
                <span className="block truncate text-xs">Getting Started</span>
                <span className="block truncate text-[10px] text-muted-foreground font-normal">Week-1 setup + cadence</span>
              </div>
            </button>
            <button
              onClick={() => onShowAllGuides?.()}
              className={cn(
                'w-full flex items-start gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors mb-1',
                showAllGuides
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
              <div className="flex-1 text-left min-w-0">
                <span className="block truncate text-xs">Channel Guides</span>
                <span className="block truncate text-[10px] text-muted-foreground font-normal">All guides in one view</span>
              </div>
            </button>
            {SIDEBAR_CHANNELS.map(ch => (
              <button
                key={ch.number}
                onClick={() => onOpenChannel?.(ch.number)}
                title={ch.description}
                className={cn(
                  'w-full flex items-start gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  openChannelNumber === ch.number
                    ? `${SIDEBAR_CHANNEL_ACTIVE[ch.number]} border-l-2`
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Hash className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', SIDEBAR_CHANNEL_COLORS[ch.number])} />
                <div className="flex-1 text-left min-w-0">
                  <span className="block truncate text-xs">{ch.number} - {renderWithAbcd(ch.name)}</span>
                  <span className="block truncate text-[10px] text-muted-foreground font-normal">{ch.description}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Chart */}
      {dashboardData && <PillarChart data={dashboardData} />}

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>💾 Auto-saved to browser storage</p>
      </div>
    </div>
  );
}
