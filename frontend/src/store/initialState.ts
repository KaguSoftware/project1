import { DocumentData } from "./types";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialDocumentState: DocumentData = {
	type: "proposal",
	title: "",
	projectTitle: "", // Added this
	clientName: "",
	aiIntro: "",
	scopeOfWork: "",
	pricingPackage: "standard",
	timeline: "",
	defaultCurrency: "USD",
	totalPrice: "",
	validUntil: "",
	additionalNotes: "",
	agreementOverview: "",
	body: "",
	campaignOverview: "",
	campaignKPIs: "",

	// Added the new KPI structure
	influencerKPIs: {
		views: "",
		engagement: "",
		clicks: "",
		conversions: "",
		roi: "",
	},

	termsAndConditions: [{ id: generateId(), text: "" }],
	deliverables: [
		{ id: generateId(), deliverable: "", timeline: "", status: "" },
	],
	lineItems: [
		{ id: generateId(), description: "", qty: 1, rate: 0, amount: 0 },
	],
	performanceMetrics: [
		{ id: generateId(), metric: "", number: "", delta: "" },
	],
	topPosts: [
		{ id: generateId(), post: "", likes: "", comments: "", shares: "" },
	],
	salesMetrics: [{ id: generateId(), title: "", money: "", delta: "" }],
	dealBreakdown: [{ id: generateId(), client: "", dealValue: "", stage: "" }],
	influencers: [
		{
			id: generateId(),
			name: "",
			platform: "",
			followers: "",
			rate: "",
			status: "",
		},
	],
};
