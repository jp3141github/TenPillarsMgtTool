import { DashboardData, Pillar, SheetData } from './types';

const STORAGE_KEY = 'pillar-dashboard-data';

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

export function initializeData(): DashboardData {
  const data: Record<string, SheetData> = {};
  DEFAULT_PILLARS.forEach(pillar => {
    data[pillar.id] = { lists: [] };
  });

  return {
    pillars: DEFAULT_PILLARS,
    data,
  };
}

export function loadData(): DashboardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }

  return initializeData();
}

export function saveData(data: DashboardData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
}
