export interface Pillar {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface List {
  id: string;
  name: string;
  cols: number;
  rows: number;
  headers: string[];
  data: string[][];
  created: string;
  lastEdited: string;
}

export interface SheetData {
  lists: List[];
}

export interface DashboardData {
  pillars: Pillar[];
  data: Record<string, SheetData>;
}
