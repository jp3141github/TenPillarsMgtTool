import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface AddListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, cols: number, rows: number, headers: string[]) => void;
}

export default function AddListModal({ open, onOpenChange, onAdd }: AddListModalProps) {
  const [listName, setListName] = useState('');
  const [colCount, setColCount] = useState(4);
  const [rowCount, setRowCount] = useState(10);
  const [colHeaders, setColHeaders] = useState('');

  const handleSubmit = () => {
    let headers = colHeaders
      .split(',')
      .map(h => h.trim())
      .filter(h => h)
      .slice(0, colCount);
    while (headers.length < colCount) {
      headers.push(`Column ${headers.length + 1}`);
    }
    onAdd(listName, colCount, rowCount, headers);
    setListName('');
    setColHeaders('');
    setColCount(4);
    setRowCount(10);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Button variant="outline" size="sm" onClick={() => setColCount(Math.max(1, colCount - 1))}>
                  -
                </Button>
                <Input
                  type="number"
                  value={colCount}
                  onChange={(e) => setColCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="text-center"
                />
                <Button variant="outline" size="sm" onClick={() => setColCount(Math.min(20, colCount + 1))}>
                  +
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rows</label>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="sm" onClick={() => setRowCount(Math.max(1, rowCount - 1))}>
                  -
                </Button>
                <Input
                  type="number"
                  value={rowCount}
                  onChange={(e) => setRowCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="text-center"
                />
                <Button variant="outline" size="sm" onClick={() => setRowCount(Math.min(100, rowCount + 1))}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!listName.trim()}>Create List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
