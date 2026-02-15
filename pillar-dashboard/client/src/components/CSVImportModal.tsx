import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { List } from '@/lib/types';

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lists: List[];
  onImportNew: (file: File, name: string, useHeaders: boolean) => void;
  onImportExisting: (file: File, listIndex: number) => void;
}

export default function CSVImportModal({ open, onOpenChange, lists, onImportNew, onImportExisting }: CSVImportModalProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvName, setCsvName] = useState('');
  const [useHeaders, setUseHeaders] = useState(true);
  const [selectedList, setSelectedList] = useState<number | null>(null);

  const handleImport = () => {
    if (!csvFile) return;
    if (mode === 'new') {
      onImportNew(csvFile, csvName, useHeaders);
    } else if (selectedList !== null) {
      onImportExisting(csvFile, selectedList);
    }
    setCsvFile(null);
    setCsvName('');
    setSelectedList(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Upload Mode</label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={mode === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('new')}
                className="flex-1"
              >
                New List
              </Button>
              <Button
                variant={mode === 'existing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('existing')}
                className="flex-1"
              >
                Existing List
              </Button>
            </div>
          </div>

          {mode === 'new' && (
            <>
              <div>
                <label className="text-sm font-medium">List Name</label>
                <Input
                  value={csvName}
                  onChange={(e) => setCsvName(e.target.value)}
                  placeholder="e.g., Imported Data"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useHeaders"
                  checked={useHeaders}
                  onChange={(e) => setUseHeaders(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="useHeaders" className="text-sm">Use first row as headers</label>
              </div>
            </>
          )}

          {mode === 'existing' && (
            <div>
              <label className="text-sm font-medium">Select List</label>
              <select
                value={selectedList ?? ''}
                onChange={(e) => setSelectedList(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-background"
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
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!csvFile || (mode === 'existing' && selectedList === null)}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
