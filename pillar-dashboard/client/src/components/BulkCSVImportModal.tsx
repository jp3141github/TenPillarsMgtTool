import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface BulkCSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (files: File[]) => void;
}

export default function BulkCSVImportModal({ open, onOpenChange, onImport }: BulkCSVImportModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleImport = () => {
    if (files.length > 0) {
      onImport(files);
      setFiles([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
            />
            {files.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                {files.length} file(s) selected
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={files.length === 0}
          >
            Import {files.length > 0 ? `(${files.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
