import { create } from "zustand";
import { RecordItem, DatasetUploadResponse } from "../lib/api";

export type PageId =
  | "overview"
  | "live-monitor"
  | "analyzer"
  | "investigations"
  | "intelligence"
  | "analytics"
  | "history"
  | "project-work"
  | "dataset-explorer"
  | "model-lab"
  | "methodology"
  | "settings"
  | "about";

interface SentinelState {
  activePage: PageId;
  isConsoleOpen: boolean;
  sidebarCollapsed: boolean;
  activeSessionId: string | null;
  dataMode: "demo" | "user";
  activeUpload: DatasetUploadResponse | null;
  activeRecordForDrawer: RecordItem | null;
  isDrawerOpen: boolean;
  isCommandCenterOpen: boolean;
  severityThresholds: {
    critical: number;
    high: number;
    medium: number;
  };
  showIntro: boolean;

  setActivePage: (page: PageId) => void;
  setConsoleOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setActiveSessionId: (id: string | null) => void;
  setDataMode: (mode: "demo" | "user") => void;
  setActiveUpload: (upload: DatasetUploadResponse | null) => void;
  openDrawerWithRecord: (record: RecordItem) => void;
  closeDrawer: () => void;
  setCommandCenterOpen: (open: boolean) => void;
  toggleCommandCenter: () => void;
  setSeverityThresholds: (thresholds: { critical: number; high: number; medium: number }) => void;
  setShowIntro: (show: boolean) => void;
  replayIntro: () => void;
}

export const useSentinelStore = create<SentinelState>((set) => ({
  activePage: "overview",
  isConsoleOpen: true,
  sidebarCollapsed: false,
  activeSessionId: null,
  dataMode: "demo",
  activeUpload: null,
  activeRecordForDrawer: null,
  isDrawerOpen: false,
  isCommandCenterOpen: false,
  severityThresholds: {
    critical: 0.82,
    high: 0.70,
    medium: 0.55,
  },
  showIntro: (() => {
    try {
      return sessionStorage.getItem("sentinel_intro_seen") !== "true";
    } catch (e) {
      return true;
    }
  })(),

  setActivePage: (activePage) => set({ activePage }),
  setConsoleOpen: (isConsoleOpen) => set({ isConsoleOpen }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  setDataMode: (dataMode) => set({ dataMode }),
  setActiveUpload: (activeUpload) => set({ activeUpload }),
  openDrawerWithRecord: (record) => set({ activeRecordForDrawer: record, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, activeRecordForDrawer: null }),
  setCommandCenterOpen: (isCommandCenterOpen) => set({ isCommandCenterOpen }),
  toggleCommandCenter: () => set((state) => ({ isCommandCenterOpen: !state.isCommandCenterOpen })),
  setSeverityThresholds: (severityThresholds) => set({ severityThresholds }),
  setShowIntro: (showIntro) => set({ showIntro }),
  replayIntro: () => {
    try {
      sessionStorage.removeItem("sentinel_intro_seen");
    } catch (e) {}
    set({ showIntro: true });
  },
}));
