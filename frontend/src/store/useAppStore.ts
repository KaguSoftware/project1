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
	// Hidden fields (fields removed from the form UI)
	hiddenFields: string[];
	hideField: (key: string) => void;
	showAllFields: () => void;
}

export const useAppStore = create<AppState>((set) => ({
	language: "en",
	setLanguage: (lang) => set({ language: lang }),
	document: initialDocumentState,

	updateDocument: (data) =>
		set((state) => ({
			document: { ...state.document, ...data },
			// Reset hidden fields whenever the doc type changes
			...(data.type !== undefined ? { hiddenFields: [] } : {}),
		})),

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

	resetDocument: () => set({ document: initialDocumentState, hiddenFields: [] }),

	hiddenFields: [],
	hideField: (key) =>
		set((state) => {
			const doc = state.document as any;
			// If the field is a string, clear its value so it disappears from the live preview
			const cleared = typeof doc[key] === "string" ? { [key]: "" } : {};
			return {
				hiddenFields: [...state.hiddenFields, key],
				document: { ...state.document, ...cleared },
			};
		}),
	showAllFields: () => set({ hiddenFields: [] }),
}));
