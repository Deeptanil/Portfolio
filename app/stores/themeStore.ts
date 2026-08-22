import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  name: string;
  gradient: string;
  ambientIntensity: number;
}

const AvailableThemes: Theme[] = [
  {
    type: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(180deg, #fce1d4 0%, #f39c80 30%, #d64679 60%, #581c4e 85%, #2e0c38 100%)',
    ambientIntensity: 0.95,
  },
  {
    type: 'night',
    name: 'Starry Night',
    gradient: 'linear-gradient(180deg, #0b1021 0%, #050814 100%)',
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
      name: "portfolio-sunset-theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
