import { create } from "zustand";
import { DocumentData, UserProfile, SavedDocumentMeta, DocumentRole } from "./types";
import { initialDocumentState, generateId } from "./initialState";

interface AppState {
	language: "en" | "ar" | "tr";
	setLanguage: (lang: "en" | "ar" | "tr") => void;
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
	// ── Cloud / Auth ──────────────────────────────────────────────
	user: UserProfile | null;
	setUser: (user: UserProfile | null) => void;
	currentDocumentId: string | null;
	setCurrentDocumentId: (id: string | null) => void;
	savedDocuments: SavedDocumentMeta[];
	setSavedDocuments: (docs: SavedDocumentMeta[]) => void;
	isSaving: boolean;
	setIsSaving: (v: boolean) => void;
	isLoadingDocs: boolean;
	setIsLoadingDocs: (v: boolean) => void;
	/** Reset to blank document and clear cloud context */
	newDocument: () => void;
	/** Hydrate the store from a loaded document's content */
	loadDocument: (params: {
		id: string;
		document: DocumentData;
		language: "en" | "ar" | "tr";
		hiddenFields: string[];
	}) => void;
	/**
	 * The effective role the current user has on the currently-loaded document.
	 * null when no document is loaded or the user is anonymous.
	 */
	currentDocumentRole: DocumentRole | null;
	setCurrentDocumentRole: (role: DocumentRole | null) => void;
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

	// ── Cloud / Auth ──────────────────────────────────────────────
	user: null,
	setUser: (user) => set({ user }),

	currentDocumentId: null,
	setCurrentDocumentId: (id) => set({ currentDocumentId: id }),

	savedDocuments: [],
	setSavedDocuments: (docs) => set({ savedDocuments: docs }),

	isSaving: false,
	setIsSaving: (v) => set({ isSaving: v }),

	isLoadingDocs: false,
	setIsLoadingDocs: (v) => set({ isLoadingDocs: v }),

	newDocument: () =>
		set({
			document: initialDocumentState,
			hiddenFields: [],
			currentDocumentId: null,
			currentDocumentRole: null,
		}),

	loadDocument: ({ id, document, language, hiddenFields }) =>
		set({
			document,
			language,
			hiddenFields,
			currentDocumentId: id,
		}),

	currentDocumentRole: null,
	setCurrentDocumentRole: (role) => set({ currentDocumentRole: role }),
}));
