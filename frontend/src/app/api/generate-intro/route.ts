// src/app/api/generate-intro/route.ts
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildProposalPrompt(doc: any, providedData: string, packageCount: number) {
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
4. Deliverables must be final tangible outputs (e.g. "Brand Identity Kit", "Website", "Campaign Report") — NOT process steps or tasks (never use words like "designing", "developing", "creating", "setting up").
5. If the user already filled a field, keep it exactly as-is.
6. Only return valid JSON. No markdown. No extra fields.
7. Each pricing package must include its own independent "scopeOfWork" array with at minimum 3 sections: Marketing, Branding, and Software. Items must be tailored to that specific package tier and this project.
8. Scope items must be specific to this project and client — do NOT use generic placeholder text.
9. The style of scope items should be concise and agency-professional.

PACKAGE COUNT: Always return exactly ${packageCount} pricing package(s) in the pricingTiers array. No more, no less. Even if no pricing info was provided, still return ${packageCount} package object(s) with empty price fields.

PRICING RULES (strict — never invent a price):
- NEVER make up, estimate, or guess any price, rate, or cost.
- If no price was given by the user, leave the price field as an empty string "".
- If additionalInstructions describe explicit tiers (e.g. "package 1 2000 6 posts"), parse them EXACTLY. Use only the user's numbers.
- Always include pricingTiers in the response with exactly ${packageCount} item(s).
${
    doc.additionalInstructions
        ? `\nADDITIONAL INSTRUCTIONS (highest priority):\n${doc.additionalInstructions}`
        : ""
}

RETURN ONLY THIS JSON STRUCTURE:

{
  "aiIntro": "2-4 sentences max. Direct and factual. In the required language.",
  "pricingTiers": [
    {
      "name": "Package name",
      "price": "Only user-provided price",
      "description": "Feature 1, Feature 2",
      "isPopular": false,
      "scopeOfWork": [
        { "section": "Marketing", "items": ["Tailored item", "..."] },
        { "section": "Branding", "items": ["Tailored item", "..."] },
        { "section": "Software", "items": ["Tailored item", "..."] }
      ]
    }
  ],
  "defaultCurrency": "Use user-provided currency or omit",
  "deliverables": [
    { "deliverable": "Final tangible output name", "timeline": "Phase / Month / Week" }
  ],
  "contractPeriod": "Short contract period text",
  "investmentOverview": { "totalInvestment": "Only if user explicitly provided a total" },
  "additionalNotes": ["Short operational note"]
}
`;
}

function buildPrompt(doc: any, providedData: string, packageCount: number) {
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
            return buildProposalPrompt(doc, providedData, packageCount);

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

        ${
            doc.instructionImages?.length > 0
                ? `SCREENSHOTS PROVIDED. STRICT EXTRACTION RULES — NO EXCEPTIONS:
        1. ONLY include metrics that are explicitly visible as numbers in the screenshots. Do NOT estimate, infer, calculate, or invent any number.
        2. If a metric is not clearly readable in the screenshots, OMIT it entirely — do not guess or approximate.
        3. For performanceMetrics: only use numbers you can directly read (e.g. "1,204 likes", "4.7% engagement rate"). Leave "delta" as "" if no comparison period is shown.
        4. For topPosts: only include posts visible in the screenshots. Use the exact caption text shown. Only fill likes/comments/shares if those exact numbers appear on that post in the screenshot.
        5. The aiIntro must be based solely on what the screenshots show — do not add context, claims, or praise that isn't supported by the visible data.
        6. NEVER fabricate a number. If you are uncertain about a value, leave that field as an empty string "".
        7. For keyInsights: derive ONLY insights logically supported by visible metrics. Each insight must reference a specific visible number. impact = "positive" if it indicates growth/success, "negative" if decline/issue, "neutral" otherwise.
        8. For topPerformingContent: ONLY list content whose performance numbers are visible in screenshots. title = caption/title visible, metric = the metric name (e.g. "Likes"), value = the exact number, note = one sentence on why it performed well based on visible data.
        9. For audienceInsights: ONLY include audience data explicitly shown (e.g. age breakdown, gender split, top location). If no audience data is visible, return an empty array.`
                : `Generate 5-7 realistic performance metrics, 3-5 top posts, 4-6 key insights, 3-5 top performing content items, and 3-5 audience insights based on the project context. Use realistic social media numbers. All insights must logically follow from the metrics you generate. Deltas can be positive or negative.`
        }

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2-paragraph executive summary based on visible screenshot data or project context",
          "performanceMetrics": [
            { "metric": "Metric name", "number": "Exact number", "delta": "" }
          ],
          "topPosts": [
            { "post": "Caption text", "likes": "", "comments": "", "shares": "" }
          ],
          "keyInsights": [
            { "insight": "One specific, data-backed insight sentence referencing a real metric", "impact": "positive|negative|neutral" }
          ],
          "topPerformingContent": [
            { "title": "Content title or caption", "metric": "Primary metric name", "value": "Number", "note": "One sentence why it performed well" }
          ],
          "audienceInsights": [
            { "label": "e.g. Top Age Group", "value": "e.g. 25-34", "detail": "One sentence elaboration" }
          ]
        }
        `;

        case "weekly_sales_report":
            return `
        ${baseRules}

        Return ONLY a JSON object with this exact structure:

        {
          "aiIntro": "2-paragraph weekly sales executive summary referencing key wins and pipeline highlights",
          "weeklySales": {
            "weekSummary": "2-3 sentence summary of the week's sales performance",
            "challenges": "1-2 sentence description of key challenges or blockers faced this week",
            "nextWeekGoals": "1-2 sentence description of priorities and targets for next week",
            "leads": [
              {
                "clientName": "Company or client name",
                "contactPerson": "Contact full name",
                "email": "contact@example.com",
                "phone": "+1 555 000 0000",
                "leadSource": "one of: referral | instagram | facebook | linkedin | website | cold_call | email | other",
                "status": "one of: new_lead | meeting_arranged | proposal_sent | closed_won | closed_lost | follow_up_needed",
                "meetingDate": "ISO date string or empty string",
                "dealValue": "e.g. $12,000 or empty string",
                "notes": "Short note about this lead or empty string"
              }
            ]
          }
        }

        Generate 4-7 realistic leads across a mix of statuses. Use varied lead sources. Only include meetingDate if status is meeting_arranged or later. Leave dealValue empty for new_lead status.
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
            { "name": "Influencer Name", "platform": "Instagram", "followers": "120K", "rate": "$800" }
          ]
        }

        Generate 3-5 realistic influencers with varied platforms (Instagram, TikTok, YouTube, Twitter/X).
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

function buildOnlyFieldsDirective(onlyFields: string[]): string {
    if (!onlyFields || onlyFields.length === 0) return "";
    const list = onlyFields.map((f) => `"${f}"`).join(", ");
    return `\n\nFIELD SCOPE (strict): Only populate these fields in your JSON response: ${list}. Do NOT include any other fields in the JSON output. Leave them out entirely.`;
}

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const doc = await req.json();
        const onlyFields: string[] | undefined = Array.isArray(doc.onlyFields) ? doc.onlyFields : undefined;

        // Strip images from the text context — they're passed separately to Gemini
        const { instructionImages: _imgs, ...docWithoutImages } = doc;
        const providedData = JSON.stringify(docWithoutImages, null, 2);
        const packageCount = Number(doc.packageCount) || 1;
        const basePrompt = buildPrompt(doc, providedData, packageCount);
        const prompt = onlyFields ? basePrompt + buildOnlyFieldsDirective(onlyFields) : basePrompt;

        const images: string[] = Array.isArray(doc.instructionImages) ? doc.instructionImages : [];
        const useVision = doc.type === "social_media_report" || images.length > 0;

        let text: string;

        if (useVision) {
            const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
            const imageParts = images.map((dataUrl: string) => {
                const [meta, base64] = dataUrl.split(",");
                const mimeType = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
                return { inlineData: { data: base64, mimeType } };
            });
            const result = await model.generateContent([prompt, ...imageParts]);
            text = result.response.text().replace(/```json|```/g, "").trim();
        } else {
            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });
            text = completion.choices[0].message.content ?? "{}";
        }
        const data = JSON.parse(text);

        // Normalize proposal-specific fields so the existing store/preview stays intact
        if (doc.type === "proposal") {
            // per-tier scopeOfWork: flatten items into tier.description
            if (Array.isArray(data.pricingTiers)) {
                data.pricingTiers = data.pricingTiers.map(
                    (tier: { scopeOfWork?: unknown; description?: string; [key: string]: unknown }) => {
                        if (Array.isArray(tier.scopeOfWork)) {
                            const sections = tier.scopeOfWork as { section: string; items: string[] }[];
                            const formatted = sections
                                .flatMap((s) => s.items)
                                .join(", ");
                            tier.description = formatted;
                        }
                        delete tier.scopeOfWork;
                        return tier;
                    }
                );
            }
            // additionalNotes: string[] → joined string
            if (Array.isArray(data.additionalNotes)) {
                data.additionalNotes = data.additionalNotes.join("\n");
            }
            // investmentOverview.totalInvestment → totalPrice (only if user provided a price)
            const userMentionedPrice =
                doc.totalPrice || doc.additionalInstructions?.match(/\d/);
            if (
                data.investmentOverview?.totalInvestment &&
                userMentionedPrice &&
                !data.totalPrice
            ) {
                data.totalPrice = data.investmentOverview.totalInvestment;
            }
            delete data.investmentOverview;
            // Strip fabricated prices from tiers if user never provided any price, but keep the tiers themselves
            if (!userMentionedPrice && Array.isArray(data.pricingTiers)) {
                data.pricingTiers = data.pricingTiers.map((tier: any) => ({
                    ...tier,
                    price: "",
                }));
            }
            // contractPeriod → timeline if not already set
            if (data.contractPeriod && !data.timeline) {
                data.timeline = data.contractPeriod;
            }
            delete data.contractPeriod;
        }

        // Normalize social_media_report: add ids to new array fields
        if (doc.type === "social_media_report") {
            if (Array.isArray(data.keyInsights) && data.keyInsights.length > 0)
                data.keyInsights = data.keyInsights.map((k: any, i: number) => ({
                    id: `ai-ki-${i}-${Date.now()}`,
                    insight: k.insight ?? "",
                    impact: ["positive", "negative", "neutral"].includes(k.impact) ? k.impact : "neutral",
                }));
            if (Array.isArray(data.topPerformingContent) && data.topPerformingContent.length > 0)
                data.topPerformingContent = data.topPerformingContent.map((c: any, i: number) => ({
                    id: `ai-tpc-${i}-${Date.now()}`,
                    title: c.title ?? "",
                    metric: c.metric ?? "",
                    value: c.value ?? "",
                    note: c.note ?? "",
                }));
            if (Array.isArray(data.audienceInsights) && data.audienceInsights.length > 0)
                data.audienceInsights = data.audienceInsights.map((a: any, i: number) => ({
                    id: `ai-ai-${i}-${Date.now()}`,
                    label: a.label ?? "",
                    value: a.value ?? "",
                    detail: a.detail ?? "",
                }));
        }

        // Normalize weekly_sales_report: add ids to leads
        if (doc.type === "weekly_sales_report" && Array.isArray(data.weeklySales?.leads)) {
            data.weeklySales.leads = data.weeklySales.leads.map((lead: any, i: number) => ({
                ...lead,
                id: lead.id || `ai-lead-${i}-${Date.now()}`,
            }));
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("AI Generation Error:", error?.message ?? error, error?.status, error?.error);
        return NextResponse.json(
            { error: "AI Failed to generate valid data", detail: error?.message },
            { status: 500 }
        );
    }
}
