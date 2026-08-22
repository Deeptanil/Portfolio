import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  color: string;
  accent: string;
  name: string;
}

const AvailableThemes: Theme[] = [
  {
    type: 'monolith',
    name: 'Monolithic Obsidian',
    color: '#0a0a0c',
    accent: '#ffffff'
  },
  {
    type: 'aether',
    name: 'Aether Dusk',
    color: '#120c24',
    accent: '#a78bfa'
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
      name: "portfolio-theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
