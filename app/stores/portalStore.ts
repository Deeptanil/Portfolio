import { create } from "zustand";

interface PortalStore {
  activePortalId: string | null;
  setActivePortal: (portalId: string | null) => void;
}

export const usePortalStore = create<PortalStore>((set) => ({
  activePortalId: null,
  setActivePortal: (portalId) => set(() => ({ activePortalId: portalId })),
}));
