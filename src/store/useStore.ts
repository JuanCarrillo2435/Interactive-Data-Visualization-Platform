import { create } from 'zustand'

export interface WidgetLayout {
  i: string;
  w: number;
  h: number;
  x?: number; /* simple ordering or actual grid pos */
  y?: number;
  type: 'time-series' | 'heatmap' | 'table' | 'metric';
}

interface DashboardState {
  widgets: WidgetLayout[];
  isOffline: boolean;
  language: 'en' | 'es';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleOffline: () => void;
  toggleLanguage: () => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  addWidget: (widget: WidgetLayout) => void;
  removeWidget: (id: string) => void;
}

const initialWidgets: WidgetLayout[] = [
  { i: 'w1', w: 2, h: 2, type: 'time-series' },
  { i: 'w2', w: 1, h: 1, type: 'metric' },
  { i: 'w3', w: 1, h: 1, type: 'metric' },
  { i: 'w4', w: 2, h: 2, type: 'heatmap' },
  { i: 'w5', w: 4, h: 3, type: 'table' },
];

export const useStore = create<DashboardState>((set) => ({
  widgets: initialWidgets,
  isOffline: false,
  language: 'en',
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'es' : 'en' })),
  reorderWidgets: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.widgets);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { widgets: result };
  }),
  addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
  removeWidget: (id) => set((state) => ({ widgets: state.widgets.filter((w) => w.i !== id) })),
}))
