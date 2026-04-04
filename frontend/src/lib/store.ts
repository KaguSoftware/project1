import { create } from "zustand";

interface ProposalData {
	title: string;
	clientName: string;
	deliverables: string;
	aiIntro: string;
}

interface AppState {
	language: "en" | "ar";
	setLanguage: (lang: "en" | "ar") => void;
	proposal: ProposalData;
	updateProposal: (data: Partial<ProposalData>) => void;
}

export const useAppStore = create<AppState>((set) => ({
	language: "en",
	setLanguage: (lang) => set({ language: lang }),
	proposal: {
		title: "",
		clientName: "",
		deliverables: "",
		aiIntro: "",
	},
	updateProposal: (data) =>
		set((state) => ({ proposal: { ...state.proposal, ...data } })),
}));
