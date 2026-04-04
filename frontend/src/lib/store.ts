import { create } from "zustand";

interface AppState {
	language: "en" | "ar";
	setLanguage: (lang: "en" | "ar") => void;
}

export const useAppStore = create<AppState>((set) => ({
	language: "en",
	setLanguage: (lang) => set({ language: lang }),
}));
