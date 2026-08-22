import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  name: string;
  ambientIntensity: number;
}

const AvailableThemes: Theme[] = [
  {
    type: 'day',
    name: 'Day Sunset',
    ambientIntensity: 0.95,
  },
  {
    type: 'night',
    name: 'Starry Night',
    ambientIntensity: 0.45,
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
      name: "portfolio-daynight-theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
