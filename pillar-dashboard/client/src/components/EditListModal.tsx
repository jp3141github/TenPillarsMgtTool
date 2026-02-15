import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EditListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listName: string;
  onEdit: (name: string, addCols: number, addRows: number) => void;
}

export default function EditListModal({ open, onOpenChange, listName, onEdit }: EditListModalProps) {
  const [editName, setEditName] = useState(listName);
  const [addCols, setAddCols] = useState(0);
  const [addRows, setAddRows] = useState(0);

  useEffect(() => {
    setEditName(listName);
    setAddCols(0);
    setAddRows(0);
  }, [listName, open]);

  const handleSubmit = () => {
    onEdit(editName, addCols, addRows);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">List Name</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
