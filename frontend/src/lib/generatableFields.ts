import type { DocType, DocumentData } from "@/src/store/types";

export interface GeneratableField {
  key: string;
  label: string;
  isEmpty: (doc: DocumentData) => boolean;
}

const isEmptyString = (v: string | undefined) => !v || v.trim() === "";
const isEmptyArray = (arr: any[]) =>
  arr.length === 0 ||
  arr.every((row) =>
    Object.entries(row)
      .filter(([k]) => k !== "id")
      .every(([, v]) => !v || v === 0 || v === ""),
  );

const sharedFields: GeneratableField[] = [
  { key: "aiIntro", label: "AI Introduction", isEmpty: (d) => isEmptyString(d.aiIntro) },
];

const FIELDS_BY_TYPE: Record<DocType, GeneratableField[]> = {
  proposal: [
    ...sharedFields,
    { key: "pricingTiers", label: "Pricing Tiers", isEmpty: (d) => isEmptyArray(d.pricingTiers) },
    { key: "deliverables", label: "Deliverables", isEmpty: (d) => isEmptyArray(d.deliverables) },
    { key: "timeline", label: "Timeline", isEmpty: (d) => isEmptyString(d.timeline) },
    { key: "validUntil", label: "Valid Until", isEmpty: (d) => isEmptyString(d.validUntil) },
  ],
  contract: [
    ...sharedFields,
    { key: "agreementOverview", label: "Agreement Overview", isEmpty: (d) => isEmptyString(d.agreementOverview) },
    { key: "scopeOfWork", label: "Scope of Work", isEmpty: (d) => isEmptyString(d.scopeOfWork) },
    { key: "deliverables", label: "Deliverables", isEmpty: (d) => isEmptyArray(d.deliverables) },
  ],
  invoice: [
    { key: "lineItems", label: "Line Items", isEmpty: (d) => isEmptyArray(d.lineItems) },
    { key: "termsAndConditions", label: "Terms & Conditions", isEmpty: (d) => isEmptyArray(d.termsAndConditions) },
  ],
  letter: [
    { key: "body", label: "Letter Body", isEmpty: (d) => isEmptyString(d.body) },
  ],
  social_media_report: [
    ...sharedFields,
    { key: "performanceMetrics", label: "Performance Metrics", isEmpty: (d) => isEmptyArray(d.performanceMetrics) },
    { key: "topPosts", label: "Top Posts", isEmpty: (d) => isEmptyArray(d.topPosts) },
  ],
  weekly_sales_report: [
    ...sharedFields,
    { key: "weeklySales.weekSummary", label: "Week Summary", isEmpty: (d) => isEmptyString(d.weeklySales.weekSummary) },
    { key: "weeklySales.challenges", label: "Challenges", isEmpty: (d) => isEmptyString(d.weeklySales.challenges) },
    { key: "weeklySales.nextWeekGoals", label: "Next Week Goals", isEmpty: (d) => isEmptyString(d.weeklySales.nextWeekGoals) },
    { key: "salesMetrics", label: "Sales Metrics", isEmpty: (d) => isEmptyArray(d.salesMetrics) },
    { key: "dealBreakdown", label: "Deal Breakdown", isEmpty: (d) => isEmptyArray(d.dealBreakdown) },
  ],
  influencer_campaign: [
    ...sharedFields,
    { key: "campaignOverview", label: "Campaign Overview", isEmpty: (d) => isEmptyString(d.campaignOverview) },
    { key: "influencerKPIs.views", label: "KPI: Views", isEmpty: (d) => isEmptyString(d.influencerKPIs.views) },
    { key: "influencerKPIs.engagement", label: "KPI: Engagement", isEmpty: (d) => isEmptyString(d.influencerKPIs.engagement) },
    { key: "influencerKPIs.clicks", label: "KPI: Clicks", isEmpty: (d) => isEmptyString(d.influencerKPIs.clicks) },
    { key: "influencerKPIs.conversions", label: "KPI: Conversions", isEmpty: (d) => isEmptyString(d.influencerKPIs.conversions) },
    { key: "influencerKPIs.roi", label: "KPI: ROI", isEmpty: (d) => isEmptyString(d.influencerKPIs.roi) },
    { key: "influencers", label: "Influencer List", isEmpty: (d) => isEmptyArray(d.influencers) },
  ],
};

export const getGeneratableFields = (docType: DocType): GeneratableField[] =>
  FIELDS_BY_TYPE[docType] ?? [];

/** Fields ignored when deciding "does the doc have any user input?" */
export const IGNORED_KEYS = new Set([
  "additionalInstructions",
  "type",
  "title",
  "defaultCurrency",
]);

export const docHasInput = (doc: DocumentData): boolean => {
  const fields = getGeneratableFields(doc.type);
  return fields.some((f) => !f.isEmpty(doc));
};
