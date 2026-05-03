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

export type LeadStatus =
	| "new_lead"
	| "meeting_arranged"
	| "proposal_sent"
	| "closed_won"
	| "closed_lost"
	| "follow_up_needed";

export type LeadSource =
	| "referral"
	| "instagram"
	| "facebook"
	| "linkedin"
	| "website"
	| "cold_call"
	| "email"
	| "other";

export interface LeadRow {
	id: string;
	clientName: string;
	contactPerson: string;
	email: string;
	phone: string;
	leadSource: LeadSource | "";
	status: LeadStatus | "";
	meetingDate: string;
	dealValue: string;
	notes: string;
}

export interface WeeklySalesData {
	salesPersonName: string;
	department: string;
	weekStart: string;
	weekEnd: string;
	leads: LeadRow[];
	weekSummary: string;
	challenges: string;
	nextWeekGoals: string;
	additionalNotes: string;
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

// ── Cloud / Auth types ────────────────────────────────────────────────────────

/** Minimal user shape synced from Supabase auth */
export interface UserProfile {
  id: string
  email: string
  /** app_role from the profiles table — fetched separately after sign-in */
  app_role?: "admin" | "member" | "client"
}

/**
 * The effective role the current user has on the currently-loaded document.
 * - "owner"  : user.id === document.owner_id
 * - "editor" : has a document_access row with role='editor'
 * - "viewer" : has a document_access row with role='viewer'
 * - null     : no document loaded, or anonymous
 */
export type DocumentRole = "owner" | "editor" | "viewer"

/** Lightweight document listing (no heavy content blob) */
export interface SavedDocumentMeta {
  id: string
  owner_id: string
  title: string
  doc_type: string
  created_at: string
  updated_at: string
  /** Populated in the "shared with me" section of MyDocumentsPanel */
  shared_role?: "editor" | "viewer"
}

// ─────────────────────────────────────────────────────────────────────────────

export interface DocumentData {
	type: DocType;
	title: string; // The "Document Title" (e.g., "SOW", "Proposal")
	projectTitle: string; // The specific project name
	clientName: string;
	additionalInstructions: string;
	instructionImages: string[]; // base64 data URLs for vision input
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
	keyInsights: { id: string; insight: string; impact: "positive" | "negative" | "neutral" }[];
	topPerformingContent: { id: string; title: string; metric: string; value: string; note: string }[];
	audienceInsights: { id: string; label: string; value: string; detail: string }[];
	salesMetrics: SalesMetricRow[];
	dealBreakdown: DealRow[];
	influencers: InfluencerRow[];
	customSections: CustomSection[];
	sectionOrder?: string[];

	// Weekly sales report structured data
	weeklySales: WeeklySalesData;
}
