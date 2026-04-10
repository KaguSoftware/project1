// src/app/api/generate-intro/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildPrompt(doc: any, providedData: string) {
    const languageInstruction =
        doc.language === "tr"
            ? "IMPORTANT: Generate ALL text content in Turkish (Türkçe). Every paragraph, sentence, and field value must be written in Turkish."
            : doc.language === "ar"
            ? "IMPORTANT: Generate ALL text content in Arabic (العربية). Every paragraph, sentence, and field value must be written in Arabic."
            : "Generate all text content in English.";

    const baseRules = `
        Act as a senior business consultant and document specialist.

        ${languageInstruction}

        Generate professional content for a ${
            doc.type?.replace(/_/g, " ") || "document"
        } for project "${doc.projectTitle || "the project"}"
        for client "${doc.clientName || "the client"}".

        Here is the current data already filled by the user:
        ${providedData}

        RULES:
        1. Use all provided fields as context — do not ignore any filled field.
        2. Only generate values for fields that are empty or missing.
        3. If a field already has a non-empty user value, preserve it exactly.
        4. The written paragraphs must explicitly reference provided fields (projectTitle, clientName, etc).
        5. Return ONLY valid JSON — no markdown, no code fences, no explanation.
        ${
            doc.additionalInstructions
                ? `6. ADDITIONAL INSTRUCTIONS (highest priority — follow these exactly)\n        ${doc.additionalInstructions}`
                : ""
        }
    `;

    switch (doc.type) {
        case "proposal":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2 paragraphs of executive summary referencing project title, client, package, price, timeline",
          "scopeOfWork": "Detailed project scope based on the provided data",
          "pricingPackage": "Name of the recommended pricing tier (match one of the tier names if provided)",
          "pricingTiers": [
            { "name": "Package name", "price": "Price string e.g. 999", "description": "Feature 1, Feature 2, Feature 3", "isPopular": false }
          ],
          "defaultCurrency": "Use the user's provided currency or infer from context",
          "totalPrice": "Professional price string",
          "timeline": "Project timeline string",
          "validUntil": "Validity date string",
          "deliverables": [
            { "deliverable": "Task name", "timeline": "e.g. Week 1-2" }
          ]
        }

        PRICING TIERS RULES:
        - If the user's additionalInstructions describe explicit pricing tiers with package names, prices, and features (e.g. "package 1 2000 6 posts, package 2 3000 12 posts"), parse those EXACTLY into pricingTiers. Each package becomes one tier with the name, price, and features as its description. Do not invent or modify the user's packages.
        - If the user's input or additional instructions mention a specific price (e.g. "$500", "1000 USD", "budget of 2000") but no explicit tier breakdown, populate pricingTiers with that price reflected in the appropriate tier(s). You may create 1-3 tiers that make sense given the context.
        - If the user explicitly requests only 1 package (e.g. "one package", "single tier", "just one plan"), return exactly 1 tier and discard the rest.
        - If no price is mentioned anywhere and no specific package count is requested, do NOT return pricingTiers at all (omit the key entirely) so existing tiers are preserved.
        - If the user already has pricingTiers filled and no price or package count is mentioned, omit pricingTiers from the response entirely.
        `;

        case "contract":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "1-2 short professional introductory paragraphs referencing the project and parties",
          "agreementOverview": "A concise overview describing the nature and purpose of this contract",
          "scopeOfWork": "Clear scope of services to be provided",
          "deliverables": [
            { "deliverable": "Task name", "timeline": "e.g. Phase 1" }
          ]
        }
        `;

        case "invoice":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "lineItems": [
            { "description": "Service or product name", "qty": 1, "rate": 0, "amount": 0 }
          ],
          "termsAndConditions": [
            { "text": "Payment term clause" }
          ]
        }

        Generate realistic line items based on the project context. Include 3-5 standard payment term clauses.
        `;

        case "letter":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "body": "A professional letter body (2-3 paragraphs). Reference the project title and client name naturally. The tone should be formal but warm."
        }
        `;

        case "social_media_report":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2-paragraph executive summary of the social media campaign performance",
          "performanceMetrics": [
            { "metric": "Metric name e.g. Engagement Rate", "number": "e.g. 4.7%", "delta": "+0.3%" }
          ],
          "topPosts": [
            { "post": "Post description or caption snippet", "likes": "1.2K", "comments": "234", "shares": "89" }
          ]
        }

        Generate 5-7 realistic performance metrics and 3-5 top posts based on the project context.
        Use realistic social media numbers. Deltas can be positive or negative.
        `;

        case "weekly_sales_report":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2-paragraph weekly sales executive summary referencing key wins and metrics",
          "salesMetrics": [
            { "title": "Metric name e.g. Total Revenue", "money": "e.g. $48,200", "delta": "+12%" }
          ],
          "dealBreakdown": [
            { "client": "Client name", "dealValue": "$10,000", "stage": "Closed Won" }
          ]
        }

        Generate 5-6 realistic sales metrics and 4-6 deals in various pipeline stages (Prospecting, Proposal Sent, Negotiation, Closed Won, Closed Lost).
        `;

        case "influencer_campaign":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2-paragraph campaign overview highlighting the strategy and expected impact",
          "campaignOverview": "A detailed paragraph describing the campaign strategy, target audience, and goals",
          "influencerKPIs": {
            "views": "e.g. 500K",
            "engagement": "e.g. 4.2%",
            "clicks": "e.g. 12K",
            "conversions": "e.g. 890",
            "roi": "e.g. 3.2x"
          },
          "influencers": [
            { "name": "Influencer Name", "platform": "Instagram", "followers": "120K", "rate": "$800", "status": "Confirmed" }
          ]
        }

        Generate 3-5 realistic influencers with varied platforms (Instagram, TikTok, YouTube, Twitter/X).
        Statuses can be: Confirmed, Pending, Negotiating.
        `;

        default:
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "Professional summary based on the provided data"
        }
        `;
    }
}

export async function POST(req: Request) {
    try {
        const doc = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" },
        });

        const providedData = JSON.stringify(doc, null, 2);
        const prompt = buildPrompt(doc, providedData);

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json(JSON.parse(text));
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "AI Failed to generate valid data" },
            { status: 500 }
        );
    }
}
