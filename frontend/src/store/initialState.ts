import { DocumentData, PricingTier } from "./types";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialDocumentState: DocumentData = {
	type: "proposal",
	title: "",
	projectTitle: "", // Added this
	clientName: "",
	aiIntro: "",
	scopeOfWork: "",
	pricingPackage: "standard",
	pricingTiers: [
		{ id: "tier-basic", name: "basic", price: "", description: "", isPopular: false },
		{ id: "tier-standard", name: "standard", price: "", description: "", isPopular: true },
		{ id: "tier-premium", name: "premium", price: "", description: "", isPopular: false },
	] as PricingTier[],
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
	topPosts: [
		{ id: generateId(), post: "", likes: "", comments: "", shares: "" },
	],
	performanceMetrics: [
		{ id: generateId(), metric: "", number: "", delta: "" },
	],
	salesMetrics: [{ id: generateId(), title: "", money: "", delta: "" }],
	dealBreakdown: [{ id: generateId(), client: "", dealValue: "", stage: "" }],
	customSections: [],
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
