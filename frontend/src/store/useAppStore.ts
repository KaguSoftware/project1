import { create } from "zustand";
import { DocumentData, DocType } from "./types";
import { initialDocumentState, generateId } from "./initialState";

interface AppState {
	language: "en" | "ar";
	setLanguage: (lang: "en" | "ar") => void;
	document: DocumentData;
	updateDocument: (data: Partial<DocumentData>) => void;
	// Dynamic Array Actions
	updateArrayItem: <K extends keyof DocumentData>(
		field: K,
		id: string,
		data: any,
	) => void;
	addArrayItem: <K extends keyof DocumentData>(
		field: K,
		newItem?: any,
	) => void;
	removeArrayItem: <K extends keyof DocumentData>(
		field: K,
		id: string,
	) => void;
	resetDocument: () => void;
}

export const useAppStore = create<AppState>((set) => ({
	language: "en",
	setLanguage: (lang) => set({ language: lang }),
	document: initialDocumentState,

	updateDocument: (data) =>
		set((state) => ({ document: { ...state.document, ...data } })),

	updateArrayItem: (field, id, data) =>
		set((state) => ({
			document: {
				...state.document,
				[field]: (state.document[field] as any[]).map((item) =>
					item.id === id ? { ...item, ...data } : item,
				),
			},
		})),

	addArrayItem: (field, newItem = {}) =>
		set((state) => ({
			document: {
				...state.document,
				[field]: [
					...(state.document[field] as any[]),
					{ id: generateId(), ...newItem },
				],
			},
		})),

	removeArrayItem: (field, id) =>
		set((state) => ({
			document: {
				...state.document,
				[field]: (state.document[field] as any[]).filter(
					(item) => item.id !== id,
				),
			},
		})),

	resetDocument: () => set({ document: initialDocumentState }),
}));
