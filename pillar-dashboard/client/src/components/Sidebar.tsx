import { Pillar, DashboardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import PillarChart from './PillarChart';

interface SidebarProps {
  pillars: Pillar[];
  currentPillar: string | null;
  onSelectPillar: (id: string) => void;
  totalPillars: number;
  totalLists: number;
  totalRows: number;
  dashboardData?: DashboardData;
  activeView?: 'pillars' | 'tom';
  onSelectView?: (view: 'pillars' | 'tom') => void;
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
}: SidebarProps) {
  return (
    <div className="w-72 bg-card border-r border-border flex flex-col flex-shrink-0">
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
