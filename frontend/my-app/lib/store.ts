// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface AppState {
  // 1. Theme State & Actions
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (mode: ColorMode) => void;
  
  // 2. Auth State & Actions
  isAuthenticated: boolean;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme Initial Values
      theme: 'light',
      colorMode: 'blue',
      
      // Theme Functions
      setTheme: (theme) => set({ theme }),
      setColorMode: (colorMode) => set({ colorMode }),
      
      // Auth Initial Values
      isAuthenticated: false,
      
      // Auth Functions
      loginAsGuest: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    { 
      // Renamed the storage key to force a clean cache reset
      name: 'dexter-full-storage' 
    }
  )
);