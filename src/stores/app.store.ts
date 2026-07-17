/**
 * @fileoverview Zustand store for global application state.
 * Manages stadium selection, language preference, and accessibility mode.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Language } from "@/types";
import { STADIUMS_DATA } from "@/lib/constants";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AppState {
  /** Currently selected stadium ID */
  selectedStadiumId: string;
  /** User's preferred language for the assistant */
  language: Language;
  /** Whether accessibility/wheelchair mode is active */
  isAccessibilityMode: boolean;
  /** Whether dark mode is active */
  isDarkMode: boolean;

  // Actions
  selectStadium: (id: string) => void;
  setLanguage: (language: Language) => void;
  toggleAccessibilityMode: () => void;
  toggleDarkMode: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedStadiumId: STADIUMS_DATA[0].id,
      language: "English",
      isAccessibilityMode: false,
      isDarkMode: true,

      selectStadium: (id: string) => set({ selectedStadiumId: id }),
      setLanguage: (language: Language) => set({ language }),
      toggleAccessibilityMode: () =>
        set((state) => ({ isAccessibilityMode: !state.isAccessibilityMode })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "fanflow-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedStadiumId: state.selectedStadiumId,
        language: state.language,
        isAccessibilityMode: state.isAccessibilityMode,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

/**
 * Returns the currently selected stadium data object.
 */
export function useSelectedStadium() {
  const id = useAppStore((s) => s.selectedStadiumId);
  return STADIUMS_DATA.find((s) => s.id === id) ?? STADIUMS_DATA[0];
}
