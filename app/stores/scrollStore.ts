import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  // Incremented each time the "Skip to Experience" button is pressed — ScrollWrapper watches
  // this and triggers a smooth auto-scroll to the bottom. A counter (rather than a boolean)
  // so repeated presses keep firing even if the previous scroll already completed.
  skipToEndToken: number;
  requestSkipToEnd: () => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set(() => ({ scrollProgress: progress })),
  skipToEndToken: 0,
  requestSkipToEnd: () => set((state) => ({ skipToEndToken: state.skipToEndToken + 1 })),
}));
