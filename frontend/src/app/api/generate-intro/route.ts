// src/app/api/generate-intro/route.ts
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

function buildProposalPrompt(doc: any, providedData: string) {
    const lang = doc.language ?? "en";
    const languageInstruction =
        lang === "ar"
            ? "CRITICAL: You MUST write ALL text values in Arabic (العربية). Every word in every field must be in Arabic. This is non-negotiable."
            : lang === "tr"
            ? "CRITICAL: You MUST write ALL text values in Turkish (Türkçe). Every word in every field must be in Turkish. This is non-negotiable."
            : "Write all text in English.";

    return `
You are a senior proposal writer.

LANGUAGE INSTRUCTION (highest priority — overrides everything):
${languageInstruction}

Your job is to generate a BUSINESS PROPOSAL based strictly on the project data below.
Style: compact, clear, professional, direct. No fluff, no buzzwords, no generic AI wording.

PROJECT DATA:
${providedData}

STRICT RULES:
1. Write like a real agency proposal, not a marketing article.
2. Keep every section concise. No hype, no filler, no vague statements.
3. The intro must be 2-4 sentences maximum.
4. Deliverables must be concrete and specific to this project.
5. If the user already filled a field, keep it exactly as-is.
6. Only return valid JSON. No markdown. No extra fields.
7. scopeOfWork must always include at minimum these 3 sections: Marketing, Branding, and Software. You may add more sections if the project context warrants it.
8. Use the 3 sections as a structural reference — write items that are specific and relevant to this project and client. Do NOT copy-paste the reference items verbatim. Adapt them to the actual context.
9. The style of items should match the reference (concise, bullet-ready, agency-professional) but the content must be tailored to this project.

PRICING RULES (strict — never invent a price):
- NEVER make up, estimate, or guess any price, rate, or cost.
- If no price was given by the user, omit all price-related fields entirely.
- If additionalInstructions describe explicit tiers (e.g. "package 1 2000 6 posts"), parse them EXACTLY. Use only the user's numbers.
- If only 1 package is requested, return exactly 1 tier.
- If pricingTiers are already filled and no new price is mentioned, omit pricingTiers from the response.
${doc.additionalInstructions ? `\nADDITIONAL INSTRUCTIONS (highest priority):\n${doc.additionalInstructions}` : ""}

RETURN ONLY THIS JSON STRUCTURE:

{
  "aiIntro": "2-4 sentences max. Direct and factual. In the required language.",
  "scopeOfWork": [
    { "section": "Marketing", "items": ["Tailored item for this project", "..."] },
    { "section": "Branding", "items": ["Tailored item for this project", "..."] },
    { "section": "Software", "items": ["Tailored item for this project", "..."] }
  ],
  "pricingTiers": [
    { "name": "Package name", "price": "Only user-provided price", "description": "Feature 1, Feature 2", "isPopular": false }
  ],
  "defaultCurrency": "Use user-provided currency or omit",
  "deliverables": [
    { "deliverable": "Specific deliverable name", "timeline": "Phase / Month / Week" }
  ],
  "contractPeriod": "Short contract period text",
  "investmentOverview": { "totalInvestment": "Only if user explicitly provided a total" },
  "additionalNotes": ["Short operational note"]
}
`;
}

function buildPrompt(doc: any, providedData: string) {
    const lang = doc.language ?? "en";
    const languageInstruction =
        lang === "ar"
            ? "CRITICAL: You MUST write ALL text values in Arabic (العربية). Every single word in every field must be in Arabic. This is non-negotiable."
            : lang === "tr"
            ? "CRITICAL: You MUST write ALL text values in Turkish (Türkçe). Every single word in every field must be in Turkish. This is non-negotiable."
            : "Write all text in English.";

    const baseRules = `
        Act as a senior business consultant and document specialist.

        LANGUAGE INSTRUCTION (highest priority — overrides everything else):
        ${languageInstruction}

        Generate professional content for a ${
            doc.type?.replace(/_/g, " ") || "document"
        } for project "${doc.projectTitle || "the project"}"
        for client "${doc.clientName || "the client"}".

        Here is the current data already filled by the user:
        ${providedData}

        GLOBAL STYLE RULES (apply to all output):
        - Be concise. No filler, no buzzwords, no exaggerated language.
        - Keep every section short enough for a clean PDF layout.
        - Write like a professional agency, not a marketing article.
        - Do not use phrases like "we are excited", "unlock your potential", or similar fluff.

        RULES:
        1. Use all provided fields as context — do not ignore any filled field.
        2. Only generate values for fields that are empty or missing.
        3. If a field already has a non-empty user value, preserve it exactly.
        4. Reference provided fields (projectTitle, clientName, etc) naturally and briefly.
        5. Return ONLY valid JSON — no markdown, no code fences, no explanation.
        ${
            doc.additionalInstructions
                ? `6. ADDITIONAL INSTRUCTIONS (highest priority — follow these exactly)\n        ${doc.additionalInstructions}`
                : ""
        }
    `;

    switch (doc.type) {
        case "proposal":
            return buildProposalPrompt(doc, providedData);

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

        const providedData = JSON.stringify(doc, null, 2);
        const prompt = buildPrompt(doc, providedData);

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });
        const text = completion.choices[0].message.content ?? "{}";
        const data = JSON.parse(text);

        // Normalize proposal-specific fields so the existing store/preview stays intact
        if (doc.type === "proposal") {
            // scopeOfWork: [{section, items}] → formatted string
            if (Array.isArray(data.scopeOfWork)) {
                data.scopeOfWork = data.scopeOfWork
                    .map((s: { section: string; items: string[] }) =>
                        `${s.section}:\n${s.items.map((i) => `• ${i}`).join("\n")}`
                    )
                    .join("\n\n");
            }
            // additionalNotes: string[] → joined string
            if (Array.isArray(data.additionalNotes)) {
                data.additionalNotes = data.additionalNotes.join("\n");
            }
            // investmentOverview.totalInvestment → totalPrice (only if user provided a price)
            const userMentionedPrice = doc.totalPrice || doc.additionalInstructions?.match(/\d/);
            if (data.investmentOverview?.totalInvestment && userMentionedPrice && !data.totalPrice) {
                data.totalPrice = data.investmentOverview.totalInvestment;
            }
            delete data.investmentOverview;
            // Strip fabricated pricingTier prices if the user never provided any price
            if (!userMentionedPrice && Array.isArray(data.pricingTiers)) {
                delete data.pricingTiers;
            }
            // contractPeriod → timeline if not already set
            if (data.contractPeriod && !data.timeline) {
                data.timeline = data.contractPeriod;
            }
            delete data.contractPeriod;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "AI Failed to generate valid data" },
            { status: 500 }
        );
    }
}
