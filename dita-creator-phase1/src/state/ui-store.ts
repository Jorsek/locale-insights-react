import { create } from 'zustand';

export type EditorMode = 'visual' | 'source';

interface OpenTab {
  uuid: string;
  title: string;
  dirty: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  activeTabUuid: string | null;
  editorMode: EditorMode;
  openTabs: OpenTab[];
  toggleSidebar: () => void;
  setActiveTab: (uuid: string) => void;
  setEditorMode: (mode: EditorMode) => void;
  openTab: (uuid: string, title: string) => void;
  closeTab: (uuid: string) => void;
  setTabDirty: (uuid: string, dirty: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTabUuid: null,
  editorMode: 'visual',
  openTabs: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setActiveTab: (uuid) => set({ activeTabUuid: uuid }),

  setEditorMode: (mode) => set({ editorMode: mode }),

  openTab: (uuid, title) =>
    set((s) => {
      const exists = s.openTabs.some((t) => t.uuid === uuid);
      if (exists) return { activeTabUuid: uuid };
      return {
        openTabs: [...s.openTabs, { uuid, title, dirty: false }],
        activeTabUuid: uuid,
      };
    }),

  closeTab: (uuid) =>
    set((s) => {
      const tabs = s.openTabs.filter((t) => t.uuid !== uuid);
      const activeTabUuid =
        s.activeTabUuid === uuid
          ? tabs[tabs.length - 1]?.uuid ?? null
          : s.activeTabUuid;
      return { openTabs: tabs, activeTabUuid };
    }),

  setTabDirty: (uuid, dirty) =>
    set((s) => ({
      openTabs: s.openTabs.map((t) =>
        t.uuid === uuid ? { ...t, dirty } : t,
      ),
    })),
}));
