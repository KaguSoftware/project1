import { DocumentData, PricingTier } from "./types";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialDocumentState: DocumentData = {
    type: "proposal",
    title: "",
    projectTitle: "",
    clientName: "",
    additionalInstructions: "",
    aiIntro: "",
    scopeOfWork: "",
    pricingPackage: "",
    pricingTiers: [
        {
            id: "tier-standard",
            name: "Standard",
            price: "999$",
            description: "Social media management, monthly report",
            isPopular: false,
        },
        {
            id: "tier-professional",
            name: "Professional",
            price: "1999$",
            description:
                "Everything in Standard, content creation, ad management",
            isPopular: true,
        },
        {
            id: "tier-enterprise",
            name: "Enterprise",
            price: "4999$",
            description:
                "Everything in Professional, dedicated manager, custom strategy",
            isPopular: false,
        },
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

    influencerKPIs: {
        views: "",
        engagement: "",
        clicks: "",
        conversions: "",
        roi: "",
    },

    termsAndConditions: [
        {
            id: generateId(),
            text: "Payment is due within 30 days of invoice date.",
        },
        {
            id: generateId(),
            text: "This proposal is valid for 30 days from the date of issue.",
        },
    ],
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
