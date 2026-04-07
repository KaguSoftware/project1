export type DocType =
	| "proposal"
	| "contract"
	| "invoice"
	| "letter"
	| "social_media_report"
	| "weekly_sales_report"
	| "influencer_campaign";

// Table Row Definitions
export interface DeliverableRow {
	id: string;
	deliverable: string;
	timeline: string;
	status: string;
}
export interface InvoiceLineItem {
	id: string;
	description: string;
	qty: number;
	rate: number;
	amount: number;
}
export interface PerformanceRow {
	id: string;
	metric: string;
	number: string;
	delta: string;
}
export interface TopPostRow {
	id: string;
	post: string;
	likes: string;
	comments: string;
	shares: string;
}
export interface SalesMetricRow {
	id: string;
	title: string;
	money: string;
	delta: string;
}
export interface DealRow {
	id: string;
	client: string;
	dealValue: string;
	stage: string;
}
export interface InfluencerRow {
	id: string;
	name: string;
	platform: string;
	followers: string;
	rate: string;
	status: string;
}

export type CustomSectionType = "text" | "terms" | "deliverables";

export interface CustomSection {
	id: string;
	type: CustomSectionType;
	header: string;
	content: string;
	termsRows?: { id: string; text: string }[];
	deliverablesRows?: DeliverableRow[];
}

export interface PricingTier {
	id: string;
	name: string;
	price: string;
	description: string;
	isPopular: boolean;
}

export interface DocumentData {
	type: DocType;
	title: string; // The "Document Title" (e.g., "SOW", "Proposal")
	projectTitle: string; // The specific project name
	clientName: string;
	additionalInstructions: string;
	aiIntro: string;
	scopeOfWork: string;
	pricingPackage: string;
	pricingTiers: PricingTier[];
	timeline: string;
	defaultCurrency: string;
	totalPrice: string;
	validUntil: string;
	additionalNotes: string;
	agreementOverview: string;
	body: string;
	campaignOverview: string;
	campaignKPIs: string;

	// Influencer specific KPIs
	influencerKPIs: {
		views: string;
		engagement: string;
		clicks: string;
		conversions: string;
		roi: string;
	};

	// Tables/Lists
	termsAndConditions: { id: string; text: string }[];
	deliverables: DeliverableRow[];
	lineItems: InvoiceLineItem[];
	performanceMetrics: PerformanceRow[];
	topPosts: TopPostRow[];
	salesMetrics: SalesMetricRow[];
	dealBreakdown: DealRow[];
	influencers: InfluencerRow[];
	customSections: CustomSection[];
	sectionOrder?: string[];
}
