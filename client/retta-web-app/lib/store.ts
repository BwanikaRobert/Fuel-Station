import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  selectedBranchId: string | null;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedBranchId: (branchId: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      selectedBranchId: null,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
