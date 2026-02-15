// RFC 4180 compliant CSV parser: handles quoted fields, embedded commas,
// escaped quotes (""), and mixed line endings (CRLF, LF, CR)

function parseCSVRow(input: string, start: number): { fields: string[]; nextIndex: number } | null {
  const fields: string[] = [];
  let i = start;
  if (i >= input.length) return null;

  while (i < input.length) {
    if (input[i] === '"') {
      // Quoted field
      let value = '';
      i++; // skip opening quote
      while (i < input.length) {
        if (input[i] === '"') {
          if (i + 1 < input.length && input[i + 1] === '"') {
            value += '"';
            i += 2; // skip escaped quote
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          value += input[i];
          i++;
        }
      }
      fields.push(value);
      if (i < input.length && input[i] === ',') {
        i++;
      } else {
        if (i < input.length && input[i] === '\r') i++;
        if (i < input.length && input[i] === '\n') i++;
        return { fields, nextIndex: i };
      }
    } else if (input[i] === '\r' || input[i] === '\n') {
      fields.push('');
      if (input[i] === '\r') i++;
      if (i < input.length && input[i] === '\n') i++;
      return { fields, nextIndex: i };
    } else {
      // Unquoted field
      let value = '';
      while (i < input.length && input[i] !== ',' && input[i] !== '\r' && input[i] !== '\n') {
        value += input[i];
        i++;
      }
      fields.push(value.trim());
      if (i < input.length && input[i] === ',') {
        i++;
      } else {
        if (i < input.length && input[i] === '\r') i++;
        if (i < input.length && input[i] === '\n') i++;
        return { fields, nextIndex: i };
      }
    }
  }
  fields.push('');
  return { fields, nextIndex: i };
}

export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const trimmed = text.trim();
  const allRows: string[][] = [];
  let pos = 0;
  while (pos < trimmed.length) {
    const result = parseCSVRow(trimmed, pos);
    if (!result) break;
    allRows.push(result.fields);
    pos = result.nextIndex;
  }

  const headers = allRows[0] || [];
  const rows = allRows.slice(1).filter(row => row.some(cell => cell !== ''));
  return { headers, rows };
}

export function escapeCSVField(field: string): string {
  return `"${(field || '').replace(/"/g, '""')}"`;
}

export function exportToCSV(headers: string[], data: string[][]): string {
  let csv = headers.map(escapeCSVField).join(',') + '\n';
  data.forEach(row => {
    csv += row.map(escapeCSVField).join(',') + '\n';
  });
  return csv;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
