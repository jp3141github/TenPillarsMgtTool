import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Download, Settings, RefreshCw, ChevronLeft, Upload, Moon, Sun, Search, X, Undo2, Redo2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ListTable from '@/components/ListTable';
import AddListModal from '@/components/AddListModal';
import EditListModal from '@/components/EditListModal';
import CSVImportModal from '@/components/CSVImportModal';
import BulkCSVImportModal from '@/components/BulkCSVImportModal';
import TOMSection from '@/components/TOMSection';
import { DashboardData, List as DataList } from '@/lib/types';
import { DEFAULT_PILLARS, saveData, loadData, getStorageUsage } from '@/lib/storage';
import { parseCSV, exportToCSV, downloadCSV } from '@/lib/csv';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentPillar, setCurrentPillar] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'pillars' | 'tom'>('pillars');

  // Modal state
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingListIndex, setEditingListIndex] = useState<number | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showBulkCSVModal, setShowBulkCSVModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <Sidebar
          pillars={data.pillars}
          currentPillar={currentPillar}
          onSelectPillar={setCurrentPillar}
          totalPillars={data.pillars.length}
          totalLists={totalLists}
          totalRows={totalRows}
          dashboardData={data}
          activeView={activeView}
          onSelectView={setActiveView}
        />
      )}

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
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetToDefaults} className="gap-2" title="Reset to default pillars and clear all data">
              <RefreshCw className="w-4 h-4" /> Reset
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'tom' ? (
            <TOMSection />
          ) : allLists.length === 0 ? (
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
            <div className="space-y-6">
              {filteredIndices.map(idx => {
                const list = lists[idx];
                return (
                  <Card key={list.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{list.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {list.cols} columns x {list.rows} rows - Updated {formatDate(list.lastEdited)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleExportCSV(idx)} className="gap-2">
                            <Download className="w-4 h-4" /> CSV
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
                    <CardContent>
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
        </div>
      </div>

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
