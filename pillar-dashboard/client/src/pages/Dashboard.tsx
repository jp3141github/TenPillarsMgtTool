import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Download, Settings, RefreshCw, ChevronLeft, Upload, Moon, Sun, Search, X, Undo2, Redo2, Briefcase, Menu, Monitor, Smartphone, MoreVertical } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ListTable from '@/components/ListTable';
import AddListModal from '@/components/AddListModal';
import EditListModal from '@/components/EditListModal';
import CSVImportModal from '@/components/CSVImportModal';
import BulkCSVImportModal from '@/components/BulkCSVImportModal';
import TOMSection from '@/components/TOMSection';
import CorporateMode from '@/components/CorporateMode';
import TeamsChannelChat from '@/components/TeamsChannelChat';
import PillarContent, { OperatingRuleBanner, GlobalFooter } from '@/components/PillarContent';
import { DashboardData, List as DataList, ChannelMessage, ChannelInfo } from '@/lib/types';
import { DEFAULT_PILLARS, saveData, loadData, getStorageUsage } from '@/lib/storage';
import { parseCSV, exportToCSV, downloadCSV } from '@/lib/csv';
import { useTheme } from '@/contexts/ThemeContext';
import { useLayout } from '@/contexts/LayoutContext';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CHANNELS: ChannelInfo[] = [
  { number: 'I', name: 'Noticeboard (ABCD)', description: 'Exec-facing broadcast layer, the published truth with links out.' },
  { number: 'II', name: 'ICP', description: 'The only front door. If it isn\'t logged, it isn\'t real work.' },
  { number: 'III', name: 'Delivery', description: 'Production floor (Planner/tasks, blockers, WIP discipline).' },
  { number: 'IV', name: 'QACE', description: 'Controls and evidence. No "trust me bro".' },
  { number: 'V', name: 'ORM', description: 'Runbooks, recovery playbooks, "how to not die at close".' },
];

const CHANNEL_MESSAGES_KEY = 'pillar-dashboard-channel-messages';

function loadChannelMessages(): Record<string, ChannelMessage[]> {
  try {
    const stored = localStorage.getItem(CHANNEL_MESSAGES_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {};
}

function saveChannelMessages(messages: Record<string, ChannelMessage[]>): void {
  try {
    localStorage.setItem(CHANNEL_MESSAGES_KEY, JSON.stringify(messages));
  } catch { /* ignore quota errors */ }
}

function formatDate(isoString: string): string {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { layout, toggleLayout } = useLayout();
  const isMobile = layout === 'mobile';
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentPillar, setCurrentPillar] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'pillars' | 'tom' | 'corporate'>('pillars');

  // Modal state
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingListIndex, setEditingListIndex] = useState<number | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showBulkCSVModal, setShowBulkCSVModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Channel chat state
  const [openChannelNumber, setOpenChannelNumber] = useState<string | null>(null);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMessage[]>>(() => loadChannelMessages());

  const openChannel = CHANNELS.find(ch => ch.number === openChannelNumber) || null;

  const handleOpenChannel = useCallback((channelNumber: string) => {
    setOpenChannelNumber(prev => prev === channelNumber ? null : channelNumber);
  }, []);

  const handleSendMessage = useCallback((channelNumber: string, text: string) => {
    const msg: ChannelMessage = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text,
      timestamp: new Date().toISOString(),
      author: 'You',
    };
    setChannelMessages(prev => {
      const updated = { ...prev, [channelNumber]: [...(prev[channelNumber] || []), msg] };
      saveChannelMessages(updated);
      return updated;
    });
  }, []);

  const handleCloseChannel = useCallback(() => {
    setOpenChannelNumber(null);
  }, []);

  // Undo/redo history
  const MAX_HISTORY = 50;
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const isUndoRedoAction = useRef(false);

  const pushUndo = useCallback((currentData: DashboardData) => {
    if (isUndoRedoAction.current) return;
    undoStack.current.push(JSON.stringify(currentData));
    if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
    redoStack.current = [];
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0 || !data) return;
    isUndoRedoAction.current = true;
    redoStack.current.push(JSON.stringify(data));
    const prev = JSON.parse(undoStack.current.pop()!);
    setData(prev);
    isUndoRedoAction.current = false;
    toast.success('Undo');
  }, [data]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length === 0 || !data) return;
    isUndoRedoAction.current = true;
    undoStack.current.push(JSON.stringify(data));
    const next = JSON.parse(redoStack.current.pop()!);
    setData(next);
    isUndoRedoAction.current = false;
    toast.success('Redo');
  }, [data]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (ctrl && e.key === 'n') {
        e.preventDefault();
        setShowAddListModal(true);
      } else if (ctrl && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    const initialData = loadData();
    setData(initialData);
    if (initialData.pillars.length > 0) {
      setCurrentPillar(initialData.pillars[0].id);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const result = saveData(data);
      if (!result.success) {
        toast.error(result.error || 'Failed to save data');
      } else {
        const usage = getStorageUsage();
        if (usage.usedKB > usage.estimatedMaxKB * 0.8) {
          toast.warning(`Storage is ${Math.round((usage.usedKB / usage.estimatedMaxKB) * 100)}% full. Consider exporting and removing some lists.`);
        }
      }
    }
  }, [data]);

  const updatePillarLists = useCallback((updater: (lists: DataList[]) => DataList[]) => {
    setData(prev => {
      if (!prev || !currentPillar) return prev;
      pushUndo(prev);
      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists: updater(prev.data[currentPillar].lists),
          },
        },
      };
    });
  }, [currentPillar, pushUndo]);

  if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const currentPillarData = currentPillar ? data.data[currentPillar] : null;
  const allLists = currentPillarData?.lists || [];
  const pillar = data.pillars.find(p => p.id === currentPillar);

  const searchLower = searchQuery.toLowerCase();
  const filteredIndices = searchQuery
    ? allLists.reduce<number[]>((acc, list, idx) => {
        if (
          list.name.toLowerCase().includes(searchLower) ||
          list.headers.some(h => h.toLowerCase().includes(searchLower)) ||
          list.data.some(row => row.some(cell => cell.toLowerCase().includes(searchLower)))
        ) {
          acc.push(idx);
        }
        return acc;
      }, [])
    : allLists.map((_, i) => i);
  const lists = allLists;

  const handleAddList = (name: string, cols: number, rows: number, headers: string[]) => {
    if (!name.trim()) {
      toast.error('Please enter a list name');
      return;
    }
    if (!currentPillar) {
      toast.error('Please select a pillar first');
      return;
    }

    const newList: DataList = {
      id: Date.now().toString(),
      name,
      cols,
      rows,
      headers,
      data: Array(rows).fill(null).map(() => Array(cols).fill('')),
      created: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
    };

    updatePillarLists(prev => [...prev, newList]);
    toast.success(`List "${name}" created`);
    setShowAddListModal(false);
  };

  const handleEditList = (name: string, addCols: number, addRows: number) => {
    if (editingListIndex === null || !currentPillar) return;

    updatePillarLists(prev => {
      const lists = [...prev];
      const list = { ...lists[editingListIndex] };

      if (name.trim()) list.name = name;

      if (addCols > 0) {
        list.headers = [...list.headers];
        list.data = list.data.map(row => [...row]);
        for (let i = 0; i < addCols; i++) {
          list.headers.push(`Column ${list.headers.length + 1}`);
          list.data.forEach(row => row.push(''));
        }
        list.cols += addCols;
      }

      if (addRows > 0) {
        list.data = [...list.data];
        for (let i = 0; i < addRows; i++) {
          list.data.push(Array(list.cols).fill(''));
        }
        list.rows += addRows;
      }

      list.lastEdited = new Date().toISOString();
      lists[editingListIndex] = list;
      return lists;
    });

    toast.success('List updated');
    setShowEditListModal(false);
    setEditingListIndex(null);
  };

  const handleDeleteList = (index: number) => {
    if (!currentPillar) return;
    const list = lists[index];
    if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
      updatePillarLists(prev => prev.filter((_, i) => i !== index));
      toast.success('List deleted');
    }
  };

  const handleUpdateCell = (listIndex: number, rowIndex: number, colIndex: number, value: string) => {
    if (!currentPillar) return;
    updatePillarLists(prev => {
      const lists = [...prev];
      const list = { ...lists[listIndex], data: lists[listIndex].data.map(r => [...r]) };
      list.data[rowIndex][colIndex] = value;
      list.lastEdited = new Date().toISOString();
      lists[listIndex] = list;
      return lists;
    });
  };

  const handleUpdateHeader = (listIndex: number, colIndex: number, value: string) => {
    if (!currentPillar) return;
    updatePillarLists(prev => {
      const lists = [...prev];
      const list = { ...lists[listIndex], headers: [...lists[listIndex].headers] };
      list.headers[colIndex] = value;
      list.lastEdited = new Date().toISOString();
      lists[listIndex] = list;
      return lists;
    });
  };

  const handleAddRow = (listIndex: number) => {
    if (!currentPillar) return;
    updatePillarLists(prev => {
      const lists = [...prev];
      const list = { ...lists[listIndex], data: [...lists[listIndex].data] };
      list.data.push(Array(list.cols).fill(''));
      list.rows++;
      list.lastEdited = new Date().toISOString();
      lists[listIndex] = list;
      return lists;
    });
    toast.success('Row added');
  };

  const handleExportCSV = (listIndex: number) => {
    const list = lists[listIndex];
    const csv = exportToCSV(list.headers, list.data);
    downloadCSV(`${list.name}.csv`, csv);
    toast.success(`"${list.name}" exported to CSV`);
  };

  const handleCSVImportNew = (file: File, name: string, useHeaders: boolean) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { headers, rows } = parseCSV(text);
        const finalHeaders = useHeaders ? headers : Array.from({ length: headers.length }, (_, i) => `Column ${i + 1}`);
        const finalRows = useHeaders ? rows : [headers, ...rows];

        const newList: DataList = {
          id: Date.now().toString(),
          name: name || 'Imported List',
          cols: finalHeaders.length,
          rows: finalRows.length,
          headers: finalHeaders,
          data: finalRows.map(row => {
            const rowData = [...row];
            while (rowData.length < finalHeaders.length) rowData.push('');
            return rowData.slice(0, finalHeaders.length);
          }),
          created: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
        };

        updatePillarLists(prev => [...prev, newList]);
        toast.success(`List "${newList.name}" created from CSV`);
      } catch {
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
    setShowCSVModal(false);
  };

  const handleCSVImportExisting = (file: File, listIndex: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { rows } = parseCSV(text);

        updatePillarLists(prev => {
          const lists = [...prev];
          const list = { ...lists[listIndex] };
          list.data = rows.map(row => {
            const rowData = [...row];
            while (rowData.length < list.cols) rowData.push('');
            return rowData.slice(0, list.cols);
          });
          list.rows = list.data.length;
          list.lastEdited = new Date().toISOString();
          lists[listIndex] = list;
          return lists;
        });
        toast.success('Data uploaded to existing list');
      } catch {
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
    setShowCSVModal(false);
  };

  const handleBulkCSVUpload = async (files: File[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const text = await file.text();
        const { headers, rows } = parseCSV(text);
        const fileName = file.name.replace('.csv', '');

        const newList: DataList = {
          id: Date.now().toString() + Math.random(),
          name: fileName,
          cols: headers.length,
          rows: rows.length,
          headers,
          data: rows.map(row => {
            const rowData = [...row];
            while (rowData.length < headers.length) rowData.push('');
            return rowData.slice(0, headers.length);
          }),
          created: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
        };

        updatePillarLists(prev => [...prev, newList]);
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) toast.success(`Imported ${successCount} list(s) successfully`);
    if (errorCount > 0) toast.error(`Failed to import ${errorCount} file(s)`);
    setShowBulkCSVModal(false);
  };

  const handleResetToDefaults = () => {
    if (confirm('This will delete all your data and reset to default pillars. Are you sure?')) {
      if (data) pushUndo(data);
      const newData: DashboardData = { pillars: DEFAULT_PILLARS, data: {} };
      DEFAULT_PILLARS.forEach(p => { newData.data[p.id] = { lists: [] }; });
      setData(newData);
      setCurrentPillar(DEFAULT_PILLARS[0].id);
      toast.success('Dashboard reset to defaults');
    }
  };

  const totalLists = Object.values(data.data).reduce((acc, sheet) => acc + sheet.lists.length, 0);
  const totalRows = Object.values(data.data).reduce((acc, sheet) => {
    return acc + sheet.lists.reduce((rowAcc, list) => rowAcc + (list.data ? list.data.length : 0), 0);
  }, 0);

  // Shared sidebar props (used in both desktop and mobile)
  const sidebarProps = {
    pillars: data.pillars,
    currentPillar,
    onSelectPillar: isMobile
      ? (id: string) => { setCurrentPillar(id); setMobileSidebarOpen(false); }
      : setCurrentPillar,
    totalPillars: data.pillars.length,
    totalLists,
    totalRows,
    dashboardData: data,
    activeView,
    onSelectView: isMobile
      ? ((view: 'pillars' | 'tom' | 'corporate') => { setActiveView(view); setMobileSidebarOpen(false); }) as (view: 'pillars' | 'tom' | 'corporate') => void
      : setActiveView,
    openChannelNumber,
    onOpenChannel: isMobile
      ? (channelNumber: string) => { handleOpenChannel(channelNumber); setMobileSidebarOpen(false); }
      : handleOpenChannel,
  };

  // Content area (shared between desktop and mobile)
  const contentArea = (
    <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-6'}`}>
      {activeView === 'corporate' ? (
        <CorporateMode />
      ) : activeView === 'tom' ? (
        <TOMSection onOpenChannel={handleOpenChannel} />
      ) : (
        <>
          {/* Operating rule banner + pillar governance content */}
          <OperatingRuleBanner isMobile={isMobile} />
          {pillar && (
            <PillarContent
              pillarId={pillar.id}
              pillarName={pillar.name}
              pillarIcon={pillar.icon}
              pillarColor={pillar.color}
              isMobile={isMobile}
            />
          )}

          {/* Lists section */}
          {allLists.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">No lists yet. Create your first list to get started.</p>
                <Button onClick={() => setShowAddListModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Create List
                </Button>
              </CardContent>
            </Card>
          ) : filteredIndices.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">No lists match "{searchQuery}"</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
              {filteredIndices.map(idx => {
                const list = lists[idx];
                return (
                  <Card key={list.id}>
                    <CardHeader className={isMobile ? 'pb-2 px-3 pt-3' : 'pb-3'}>
                      <div className={isMobile ? 'space-y-2' : 'flex items-center justify-between'}>
                        <div className={isMobile ? '' : undefined}>
                          <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>{list.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {list.cols} columns x {list.rows} rows - Updated {formatDate(list.lastEdited)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleExportCSV(idx)} className="gap-2">
                            <Download className="w-4 h-4" />{!isMobile && ' CSV'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingListIndex(idx); setShowEditListModal(true); }} className="gap-2">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteList(idx)} className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className={isMobile ? 'px-3 pb-3' : undefined}>
                      <ListTable
                        list={list}
                        listIndex={idx}
                        onUpdateCell={handleUpdateCell}
                        onUpdateHeader={handleUpdateHeader}
                        onAddRow={() => handleAddRow(idx)}
                        searchQuery={searchQuery}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Global footer */}
          <GlobalFooter isMobile={isMobile} />
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* ===== DESKTOP LAYOUT (unchanged) ===== */}
      {!isMobile && (
        <>
          {sidebarOpen && <Sidebar {...sidebarProps} />}

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Command Bar */}
            <div className="h-12 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="gap-2"
                  title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                  <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {activeView === 'tom'
                    ? '🏗️ Target Operating Model'
                    : activeView === 'corporate'
                    ? '🏢 Corporate Mode'
                    : pillar && `${pillar.icon} ${pillar.name}`}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    data-search-input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search (Ctrl+F)..."
                    className="h-8 w-48 pl-8 pr-8 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddListModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> New List
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCSVModal(true)} className="gap-2" title="Upload single CSV file">
                  <Upload className="w-4 h-4" /> Import CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowBulkCSVModal(true)} className="gap-2" title="Upload multiple CSV files at once">
                  <Upload className="w-4 h-4" /> Bulk Import
                </Button>
                <div className="flex gap-1 border-l border-border pl-2 ml-1">
                  <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoStack.current.length === 0} title="Undo (Ctrl+Z)">
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.current.length === 0} title="Redo (Ctrl+Y)">
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant={activeView === 'corporate' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView(activeView === 'corporate' ? 'pillars' : 'corporate')}
                  className="gap-2"
                  title={activeView === 'corporate' ? 'Exit Corporate Mode' : 'Switch to Corporate Mode'}
                >
                  <Briefcase className="w-4 h-4" />
                  {activeView === 'corporate' ? 'Exit Corporate' : 'Corporate'}
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetToDefaults} className="gap-2" title="Reset to default pillars and clear all data">
                  <RefreshCw className="w-4 h-4" /> Reset
                </Button>
              </div>
            </div>

            {/* Content Area */}
            {contentArea}
          </div>
        </>
      )}

      {/* ===== MOBILE LAYOUT ===== */}
      {isMobile && (
        <>
          {/* Mobile sidebar as a Sheet overlay */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0 [&>button:last-child]:hidden">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Sidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Mobile Command Bar — pt-10 to clear the fixed AppToggle pill */}
            <div className="bg-card border-b border-border flex-shrink-0 pt-10">
              {/* Top row: hamburger, title, key toggles */}
              <div className="h-12 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileSidebarOpen(true)}
                    title="Open navigation"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                  <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                    {activeView === 'tom'
                      ? '🏗️ TOM'
                      : activeView === 'corporate'
                      ? '🏢 Corporate'
                      : pillar && `${pillar.icon} ${pillar.name}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoStack.current.length === 0} title="Undo">
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.current.length === 0} title="Redo">
                    <Redo2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleTheme} title={`${theme === 'light' ? 'Dark' : 'Light'} mode`}>
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </Button>
                  {/* Overflow menu for less-used actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" title="More actions">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowAddListModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> New List
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCSVModal(true)}>
                        <Upload className="w-4 h-4 mr-2" /> Import CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowBulkCSVModal(true)}>
                        <Upload className="w-4 h-4 mr-2" /> Bulk Import
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setActiveView(activeView === 'corporate' ? 'pillars' : 'corporate')}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        {activeView === 'corporate' ? 'Exit Corporate' : 'Corporate Mode'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleResetToDefaults} className="text-destructive">
                        <RefreshCw className="w-4 h-4 mr-2" /> Reset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Search row */}
              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    data-search-input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="h-9 w-full pl-8 pr-8 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            {contentArea}
          </div>
        </>
      )}

      {/* Fixed bottom-left layout toggle */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLayout}
          className="gap-2 shadow-md bg-card hover:bg-accent"
          title={isMobile ? 'Switch to Desktop layout' : 'Switch to Mobile layout'}
        >
          {isMobile ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          <span className="text-xs">{isMobile ? 'Desktop' : 'Mobile'}</span>
        </Button>
      </div>

      {/* Channel Chat Panel */}
      {openChannel && (
        <TeamsChannelChat
          channel={openChannel}
          messages={channelMessages[openChannel.number] || []}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChannel}
        />
      )}

      <AddListModal
        open={showAddListModal}
        onOpenChange={setShowAddListModal}
        onAdd={handleAddList}
      />

      <EditListModal
        open={showEditListModal}
        onOpenChange={setShowEditListModal}
        listName={editingListIndex !== null && lists[editingListIndex] ? lists[editingListIndex].name : ''}
        onEdit={handleEditList}
      />

      <CSVImportModal
        open={showCSVModal}
        onOpenChange={setShowCSVModal}
        lists={lists}
        onImportNew={handleCSVImportNew}
        onImportExisting={handleCSVImportExisting}
      />

      <BulkCSVImportModal
        open={showBulkCSVModal}
        onOpenChange={setShowBulkCSVModal}
        onImport={handleBulkCSVUpload}
      />
    </div>
  );
}
