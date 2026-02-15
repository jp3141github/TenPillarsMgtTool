import { useState, useMemo } from 'react';
import { List } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface ListTableProps {
  list: List;
  listIndex: number;
  onUpdateCell: (listIndex: number, rowIndex: number, colIndex: number, value: string) => void;
  onUpdateHeader: (listIndex: number, colIndex: number, value: string) => void;
  onAddRow: () => void;
  searchQuery?: string;
}

export default function ListTable({
  list,
  listIndex,
  onUpdateCell,
  onUpdateHeader,
  onAddRow,
  searchQuery,
}: ListTableProps) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const isMatch = (value: string) =>
    searchQuery && value.toLowerCase().includes(searchQuery.toLowerCase());

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortCol(colIndex);
      setSortDir('asc');
    }
  };

  // Build sorted row indices so edits map back to real indices
  const sortedRowIndices = useMemo(() => {
    const indices = list.data.map((_, i) => i);
    if (sortCol === null || sortDir === null) return indices;
    return indices.sort((a, b) => {
      const valA = (list.data[a][sortCol] || '').toLowerCase();
      const valB = (list.data[b][sortCol] || '').toLowerCase();
      // Try numeric comparison first
      const numA = Number(valA);
      const numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === 'asc' ? numA - numB : numB - numA;
      }
      const cmp = valA.localeCompare(valB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [list.data, sortCol, sortDir]);

  const SortIcon = ({ colIndex }: { colIndex: number }) => {
    if (sortCol !== colIndex) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    if (sortDir === 'asc') return <ArrowUp className="w-3 h-3" />;
    return <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="px-4 py-2 text-left font-semibold text-muted-foreground w-12">#</th>
              {list.headers.map((header, colIndex) => (
                <th key={colIndex} className="px-4 py-2 text-left font-semibold">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => onUpdateHeader(listIndex, colIndex, e.target.value)}
                      className={`flex-1 bg-transparent border border-border rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary ${
                        isMatch(header) ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''
                      }`}
                      placeholder={`Column ${colIndex + 1}`}
                    />
                    <button
                      onClick={() => handleSort(colIndex)}
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      title={`Sort by ${header || `Column ${colIndex + 1}`}`}
                    >
                      <SortIcon colIndex={colIndex} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRowIndices.map((realRowIndex, displayIndex) => {
              const row = list.data[realRowIndex];
              return (
                <tr key={realRowIndex} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2 text-muted-foreground font-medium text-center">{displayIndex + 1}</td>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => onUpdateCell(listIndex, realRowIndex, colIndex, e.target.value)}
                        className={`w-full bg-transparent border border-transparent rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-border ${
                          isMatch(cell) ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700' : ''
                        }`}
                        placeholder="Enter data..."
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
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
