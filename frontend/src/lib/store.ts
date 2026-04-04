import { create } from "zustand";

export type DocType = "proposal" | "contract" | "invoice" | "brief";

interface DocumentData {
	type: DocType;
	title: string;
	clientName: string;
	deliverables: string;
	aiIntro: string;
}

interface AppState {
	language: "en" | "ar";
	setLanguage: (lang: "en" | "ar") => void;
	document: DocumentData;
	updateDocument: (data: Partial<DocumentData>) => void;
}

export const useAppStore = create<AppState>((set) => ({
	language: "en",
	setLanguage: (lang) => set({ language: lang }),
	document: {
		type: "proposal",
		title: "",
		clientName: "",
		deliverables: "",
		aiIntro: "",
	},
	updateDocument: (data) =>
		set((state) => ({ document: { ...state.document, ...data } })),
}));
