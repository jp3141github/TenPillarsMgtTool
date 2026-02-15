import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Download, Settings, RefreshCw, ChevronLeft, Upload, Moon, Sun } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ListTable from '@/components/ListTable';
import { DashboardData, Pillar, List as DataList } from '@/lib/types';
import { initializeData, saveData, loadData } from '@/lib/storage';
import { useTheme } from '@/contexts/ThemeContext';

const DEFAULT_PILLARS: Pillar[] = [
  { id: 'pillar1', name: 'BAU (deadlines)', color: '#0078d4', icon: '📋' },
  { id: 'pillar2', name: 'C.I. (Dev)', color: '#107c10', icon: '💻' },
  { id: 'pillar3', name: 'Comms (Internal)', color: '#ffc107', icon: '💬' },
  { id: 'pillar4', name: 'Data', color: '#d13438', icon: '📊' },
  { id: 'pillar5', name: 'Doc / Gov / Ctrls', color: '#ff8c00', icon: '📋' },
  { id: 'pillar6', name: 'KPIs', color: '#8764b8', icon: '📈' },
  { id: 'pillar7', name: 'People (Funds)', color: '#0078d4', icon: '👥' },
  { id: 'pillar8', name: 'Risk Mgt', color: '#00b7c3', icon: '⚠️' },
  { id: 'pillar9', name: 'Stakeholders', color: '#107c10', icon: '🤝' },
  { id: 'pillar10', name: 'Tech', color: '#6b69d6', icon: '🔧' },
];

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentPillar, setCurrentPillar] = useState<string | null>(null);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingListIndex, setEditingListIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvUploadMode, setCSVUploadMode] = useState<'new' | 'existing'>('new');
  const [useCSVHeaders, setUseCSVHeaders] = useState(true);
  const [selectedListForUpload, setSelectedListForUpload] = useState<number | null>(null);
  
  // Add List Modal State
  const [listName, setListName] = useState('');
  const [colCount, setColCount] = useState(4);
  const [rowCount, setRowCount] = useState(10);
  const [colHeaders, setColHeaders] = useState('');
  
  // Edit List Modal State
  const [editListName, setEditListName] = useState('');
  const [addCols, setAddCols] = useState(0);
  const [addRows, setAddRows] = useState(0);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvNewListName, setCSVNewListName] = useState('');
  const [showBulkCSVModal, setShowBulkCSVModal] = useState(false);
  const [bulkCSVFiles, setBulkCSVFiles] = useState<File[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const initialData = loadData();
    setData(initialData);
    if (initialData.pillars.length > 0) {
      setCurrentPillar(initialData.pillars[0].id);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (data) {
      saveData(data);
    }
  }, [data]);

  if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const currentPillarData = currentPillar ? data.data[currentPillar] : null;
  const lists = currentPillarData?.lists || [];
  const pillar = data.pillars.find(p => p.id === currentPillar);

  const handleAddList = () => {
    if (!listName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    if (!currentPillar) {
      toast.error('Please select a pillar first');
      return;
    }

    let headers = colHeaders
      .split(',')
      .map(h => h.trim())
      .filter(h => h)
      .slice(0, colCount);

    while (headers.length < colCount) {
      headers.push(`Column ${headers.length + 1}`);
    }

    const newList: DataList = {
      id: Date.now().toString(),
      name: listName,
      cols: colCount,
      rows: rowCount,
      headers,
      data: Array(rowCount).fill(null).map(() => Array(colCount).fill('')),
      created: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
    };

    setData(prev => {
      if (!prev || !currentPillar) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists: [...prev.data[currentPillar].lists, newList],
          },
        },
      };
    });

    toast.success(`List "${listName}" created`);
    setShowAddListModal(false);
    setListName('');
    setColHeaders('');
    setColCount(4);
    setRowCount(10);
  };

  const handleEditList = () => {
    if (editingListIndex === null || !currentPillar) return;

    setData(prev => {
      if (!prev || !currentPillar) return prev;
      const lists = [...prev.data[currentPillar].lists];
      const list = lists[editingListIndex];

      if (editListName.trim()) {
        list.name = editListName;
      }

      if (addCols > 0) {
        for (let i = 0; i < addCols; i++) {
          list.headers.push(`Column ${list.headers.length + 1}`);
          list.data.forEach(row => row.push(''));
        }
        list.cols += addCols;
      }

      if (addRows > 0) {
        for (let i = 0; i < addRows; i++) {
          list.data.push(Array(list.cols).fill(''));
        }
        list.rows += addRows;
      }

      list.lastEdited = new Date().toISOString();

      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists,
          },
        },
      };
    });

    toast.success('List updated');
    setShowEditListModal(false);
    setEditingListIndex(null);
    setEditListName('');
    setAddCols(0);
    setAddRows(0);
  };

  const handleDeleteList = (index: number) => {
    if (!currentPillar) return;
    
    const list = lists[index];
    if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
      setData(prev => {
        if (!prev || !currentPillar) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            [currentPillar]: {
              ...prev.data[currentPillar],
              lists: prev.data[currentPillar].lists.filter((_, i) => i !== index),
            },
          },
        };
      });
      toast.success('List deleted');
    }
  };

  const handleUpdateCell = (listIndex: number, rowIndex: number, colIndex: number, value: string) => {
    if (!currentPillar) return;

    setData(prev => {
      if (!prev || !currentPillar) return prev;
      const lists = [...prev.data[currentPillar].lists];
      lists[listIndex].data[rowIndex][colIndex] = value;
      lists[listIndex].lastEdited = new Date().toISOString();

      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists,
          },
        },
      };
    });
  };

  const handleUpdateHeader = (listIndex: number, colIndex: number, value: string) => {
    if (!currentPillar) return;

    setData(prev => {
      if (!prev || !currentPillar) return prev;
      const lists = [...prev.data[currentPillar].lists];
      lists[listIndex].headers[colIndex] = value;
      lists[listIndex].lastEdited = new Date().toISOString();

      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists,
          },
        },
      };
    });
  };

  const handleAddRow = (listIndex: number) => {
    if (!currentPillar) return;

    setData(prev => {
      if (!prev || !currentPillar) return prev;
      const lists = [...prev.data[currentPillar].lists];
      const list = lists[listIndex];
      list.data.push(Array(list.cols).fill(''));
      list.rows++;
      list.lastEdited = new Date().toISOString();

      return {
        ...prev,
        data: {
          ...prev.data,
          [currentPillar]: {
            ...prev.data[currentPillar],
            lists,
          },
        },
      };
    });
    toast.success('Row added');
  };

  const handleExportCSV = (listIndex: number) => {
    const list = lists[listIndex];
    let csv = list.headers.join(',') + '\n';
    list.data.forEach(row => {
      csv += row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`"${list.name}" exported to CSV`);
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
          headers: headers,
          data: rows.map(row => {
            const rowData = [...row];
            while (rowData.length < headers.length) rowData.push('');
            return rowData.slice(0, headers.length);
          }),
          created: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
        };

        setData(prev => {
          if (!prev || !currentPillar) return prev;
          const lists = [...prev.data[currentPillar].lists, newList];
          return {
            ...prev,
            data: {
              ...prev.data,
              [currentPillar]: { lists },
            },
          };
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Imported ${successCount} list(s) successfully`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} file(s)`);
    }

    setShowBulkCSVModal(false);
    setBulkCSVFiles([]);
  };

  const handleResetToDefaults = () => {
    if (confirm('This will delete all your data and reset to default pillars. Are you sure?')) {
      const newData: DashboardData = {
        pillars: DEFAULT_PILLARS,
        data: {},
      };
      DEFAULT_PILLARS.forEach(pillar => {
        newData.data[pillar.id] = { lists: [] };
      });
      setData(newData);
      setCurrentPillar(DEFAULT_PILLARS[0].id);
      toast.success('Dashboard reset to defaults');
    }
  };

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim())
    );
    return { headers, rows };
  };

  const handleCSVUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { headers, rows } = parseCSV(text);

        if (csvUploadMode === 'new') {
          // Create new list from CSV
          const finalHeaders = useCSVHeaders ? headers : Array.from({ length: headers.length }, (_, i) => `Column ${i + 1}`);
          const finalRows = useCSVHeaders ? rows : [headers, ...rows];

          const newList: DataList = {
            id: Date.now().toString(),
            name: csvNewListName || 'Imported List',
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

          setData(prev => {
            if (!prev || !currentPillar) return prev;
            const lists = [...prev.data[currentPillar].lists, newList];
            return {
              ...prev,
              data: {
                ...prev.data,
                [currentPillar]: { lists },
              },
            };
          });
          toast.success(`List "${newList.name}" created from CSV`);
        } else if (csvUploadMode === 'existing' && selectedListForUpload !== null) {
          // Upload to existing list
          setData(prev => {
            if (!prev || !currentPillar) return prev;
            const lists = [...prev.data[currentPillar].lists];
            const list = lists[selectedListForUpload];
            
            // Pad or trim rows to match list dimensions
            const newData = rows.map(row => {
              const rowData = [...row];
              while (rowData.length < list.cols) rowData.push('');
              return rowData.slice(0, list.cols);
            });

            list.data = newData;
            list.rows = newData.length;
            list.lastEdited = new Date().toISOString();

            return {
              ...prev,
              data: {
                ...prev.data,
                [currentPillar]: { lists },
              },
            };
          });
          toast.success('Data uploaded to existing list');
        }

        setShowCSVModal(false);
        setCSVFile(null);
        setCSVNewListName('');
        setSelectedListForUpload(null);
      } catch (error) {
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
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
              {pillar && `${pillar.icon} ${pillar.name}`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddListModal(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCSVModal(true)}
              className="gap-2"
              title="Upload single CSV file"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkCSVModal(true)}
              className="gap-2"
              title="Upload multiple CSV files at once"
            >
              <Upload className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefaults}
              className="gap-2"
              title="Reset to default pillars and clear all data"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {lists.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">No lists yet. Create your first list to get started.</p>
                <Button onClick={() => setShowAddListModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create List
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {lists.map((list, idx) => (
                <Card key={list.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {list.cols} columns × {list.rows} rows • Updated {formatDate(list.lastEdited)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportCSV(idx)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          CSV
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingListIndex(idx);
                            setEditListName(list.name);
                            setShowEditListModal(true);
                          }}
                          className="gap-2"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteList(idx)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
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
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add List Modal */}
      <Dialog open={showAddListModal} onOpenChange={setShowAddListModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">List Name</label>
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g., Q1 Objectives"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Columns</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setColCount(Math.max(1, colCount - 1))}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    value={colCount}
                    onChange={(e) => setColCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setColCount(Math.min(20, colCount + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rows</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRowCount(Math.max(1, rowCount - 1))}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    value={rowCount}
                    onChange={(e) => setRowCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRowCount(Math.min(100, rowCount + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Column Headers (comma-separated, optional)</label>
              <Input
                value={colHeaders}
                onChange={(e) => setColHeaders(e.target.value)}
                placeholder="e.g., Task, Owner, Status"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddListModal(false)}>Cancel</Button>
            <Button onClick={handleAddList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit List Modal */}
      <Dialog open={showEditListModal} onOpenChange={setShowEditListModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">List Name</label>
              <Input
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Add Columns</label>
                <Input
                  type="number"
                  value={addCols}
                  onChange={(e) => setAddCols(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Add Rows</label>
                <Input
                  type="number"
                  value={addRows}
                  onChange={(e) => setAddRows(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditListModal(false)}>Cancel</Button>
            <Button onClick={handleEditList}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Modal */}
      <Dialog open={showCSVModal} onOpenChange={setShowCSVModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import CSV Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Upload Mode</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={csvUploadMode === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCSVUploadMode('new')}
                  className="flex-1"
                >
                  New List
                </Button>
                <Button
                  variant={csvUploadMode === 'existing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCSVUploadMode('existing')}
                  className="flex-1"
                >
                  Existing List
                </Button>
              </div>
            </div>

            {csvUploadMode === 'new' && (
              <>
                <div>
                  <label className="text-sm font-medium">List Name</label>
                  <Input
                    value={csvNewListName}
                    onChange={(e) => setCSVNewListName(e.target.value)}
                    placeholder="e.g., Imported Data"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useHeaders"
                    checked={useCSVHeaders}
                    onChange={(e) => setUseCSVHeaders(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="useHeaders" className="text-sm">Use first row as headers</label>
                </div>
              </>
            )}

            {csvUploadMode === 'existing' && (
              <div>
                <label className="text-sm font-medium">Select List</label>
                <select
                  value={selectedListForUpload ?? ''}
                  onChange={(e) => setSelectedListForUpload(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
                >
                  <option value="">Choose a list...</option>
                  {lists.map((list, idx) => (
                    <option key={idx} value={idx}>
                      {list.name} ({list.cols} cols x {list.rows} rows)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCSVFile(e.target.files?.[0] || null)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCSVModal(false)}>Cancel</Button>
            <Button
              onClick={() => csvFile && handleCSVUpload(csvFile)}
              disabled={!csvFile || (csvUploadMode === 'existing' && selectedListForUpload === null)}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk CSV Import Modal */}
      <Dialog open={showBulkCSVModal} onOpenChange={setShowBulkCSVModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Import CSV Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload multiple CSV files at once. Each file will be imported as a separate list in the current pillar.
            </p>
            <div>
              <label className="text-sm font-medium">CSV Files</label>
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={(e) => setBulkCSVFiles(Array.from(e.target.files || []))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
              />
              {bulkCSVFiles.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {bulkCSVFiles.length} file(s) selected
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkCSVModal(false)}>Cancel</Button>
            <Button
              onClick={() => bulkCSVFiles.length > 0 && handleBulkCSVUpload(bulkCSVFiles)}
              disabled={bulkCSVFiles.length === 0}
            >
              Import {bulkCSVFiles.length > 0 ? `(${bulkCSVFiles.length})` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
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
