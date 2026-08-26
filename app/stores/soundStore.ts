import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundStore {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  toggleSound: () => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      isPlaying: true,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      toggleSound: () => set((state) => ({ isPlaying: !state.isPlaying })),
    }),
    {
      name: "sound-storage",
      partialize: (state) => ({ isPlaying: state.isPlaying }),
    }
  )
);
