import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  skipToEndToken: number;
  requestSkipToEnd: () => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) =>
    set((state) => {
      // Avoid triggering React state re-renders if progress has not meaningfully changed
      if (Math.abs(state.scrollProgress - progress) < 0.0001) return state;
      return { scrollProgress: progress };
    }),
  skipToEndToken: 0,
  requestSkipToEnd: () => set((state) => ({ skipToEndToken: state.skipToEndToken + 1 })),
}));
