import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  color: string;
  name: string;
  skyColor: string;
  sunColor: string;
}

const AvailableThemes: Theme[] = [
  {
    type: 'sunset',
    name: 'Minecraft Sunset',
    color: '#e65c00',
    skyColor: '#f9d423',
    sunColor: '#ff4e50'
  },
  {
    type: 'night',
    name: 'Minecraft Starry Night',
    color: '#0b1021',
    skyColor: '#050814',
    sunColor: '#818cf8'
  }
];

interface ThemeStore {
  themes: Theme[];
  theme: Theme;
  nextTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: [...AvailableThemes],
      theme: AvailableThemes[0],
      nextTheme: () => {
        const themes = get().themes;
        const activeThemeIndex = themes.findIndex(t => t.type === get().theme.type);
        const nextThemeIndex = (activeThemeIndex + 1) % themes.length;
        set(() => ({ theme: themes[nextThemeIndex] }));
      },
    }),
    {
      name: "portfolio-minecraft-theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
