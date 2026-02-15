import { DashboardData, Pillar, SheetData } from './types';

const STORAGE_KEY = 'pillar-dashboard-data';

export const DEFAULT_PILLARS: Pillar[] = [
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

export function saveData(data: DashboardData): { success: boolean; error?: string } {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    return { success: true };
  } catch (error) {
    const isQuotaError =
      error instanceof DOMException &&
      (error.code === 22 || error.code === 1014 || error.name === 'QuotaExceededError');
    if (isQuotaError) {
      return { success: false, error: 'Storage quota exceeded. Consider exporting and deleting some lists.' };
    }
    return { success: false, error: 'Failed to save data to browser storage.' };
  }
}

export function getStorageUsage(): { usedKB: number; estimatedMaxKB: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const usedBytes = data ? new Blob([data]).size : 0;
    return { usedKB: Math.round(usedBytes / 1024), estimatedMaxKB: 5120 }; // ~5MB typical limit
  } catch {
    return { usedKB: 0, estimatedMaxKB: 5120 };
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
}
