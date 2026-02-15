import { List } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ListTableProps {
  list: List;
  listIndex: number;
  onUpdateCell: (listIndex: number, rowIndex: number, colIndex: number, value: string) => void;
  onUpdateHeader: (listIndex: number, colIndex: number, value: string) => void;
  onAddRow: () => void;
}

export default function ListTable({
  list,
  listIndex,
  onUpdateCell,
  onUpdateHeader,
  onAddRow,
}: ListTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="px-4 py-2 text-left font-semibold text-muted-foreground w-12">#</th>
              {list.headers.map((header, colIndex) => (
                <th key={colIndex} className="px-4 py-2 text-left font-semibold">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => onUpdateHeader(listIndex, colIndex, e.target.value)}
                    className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Column ${colIndex + 1}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-2 text-muted-foreground font-medium text-center">{rowIndex + 1}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => onUpdateCell(listIndex, rowIndex, colIndex, e.target.value)}
                      className="w-full bg-transparent border border-transparent rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-border"
                      placeholder="Enter data..."
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        variant="outline"
        onClick={onAddRow}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Row
      </Button>
    </div>
  );
}
